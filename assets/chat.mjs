export async function api(path, options = {}, fetcher = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetcher(path, { credentials: 'same-origin', ...options, signal: controller.signal });
    if (response.status === 204) return null;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(typeof data.detail === 'string' ? data.detail : 'Something went wrong. Please try again.');
      error.status = response.status;
      throw error;
    }
    return data;
  } finally { clearTimeout(timer); }
}

export function validateAnswer(data) {
  if (!data || typeof data.reply !== 'string' || typeof data.conversation_id !== 'string' || !Array.isArray(data.suggested_questions) || !data.suggested_questions.every(q => typeof q === 'string')) {
    throw new Error('The response could not be read. Please try again.');
  }
  return data;
}

export function createPortfolioApi(baseUrl, fetcher = fetch, tokenFactory = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}) {
  // Keep the anonymous session secret in page memory, not a URL or localStorage.
  const token = tokenFactory();
  if (!/^[a-f0-9]{64}$/.test(token)) throw new Error('Could not create a private chat session.');
  return (path, options = {}) => {
    const headers = new Headers(options.headers);
    headers.set('Authorization', 'Bearer ' + token);
    return api(baseUrl.replace(/\/$/, '') + path, {...options, headers, credentials: 'omit'}, fetcher);
  };
}

export function createWarmup(callApi) {
  let pending;
  return () => {
    if (!pending) {
      pending = callApi('/health', {method: 'GET', cache: 'no-store'})
        .then(data => Boolean(data && data.status === 'ok'))
        .catch(() => false);
    }
    return pending;
  };
}

if (typeof document !== 'undefined') {
  const baseUrl = document.documentElement.dataset.chatApi;
  const callApi = baseUrl ? createPortfolioApi(baseUrl) : api;
  const messages = document.getElementById('messages');
  const suggestions = document.getElementById('suggestions');
  const input = document.getElementById('question');
  const send = document.getElementById('send');
  const reset = document.getElementById('new-chat');
  const status = document.getElementById('status');
  let conversationId = null;
  let busy = false;
  let ready = false;
  const warmup = createWarmup(callApi);
  const starters = ['What makes Sanha a great data engineer?', 'Tell me about her projects.', 'What is Sanha like outside work?'];

  function addMessage(role, text) {
    const article = document.createElement('div');
    article.className = 'message ' + role;
    const label = document.createElement('div');
    label.className = 'message-label';
    label.textContent = role === 'user' ? 'YOU' : "SANHA'S ASSISTANT";
    const body = document.createElement('div');
    body.className = 'message-body';
    // Model output is always text, never interpreted as HTML.
    body.textContent = text;
    article.append(label, body);
    messages.append(article);
    messages.scrollTop = messages.scrollHeight;
    return article;
  }
  function setSuggestions(questions) {
    suggestions.replaceChildren();
    for (const question of questions.slice(0, 3)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = question;
      button.disabled = busy;
      button.addEventListener('click', () => ask(question, 'suggested'));
      suggestions.append(button);
    }
  }
  function setBusy(value) {
    busy = value;
    send.disabled = value;
    reset.disabled = value;
    input.disabled = value;
    suggestions.querySelectorAll('button').forEach(button => { button.disabled = value; });
    messages.setAttribute('aria-busy', String(value));
  }
  function welcome() {
    messages.replaceChildren();
    addMessage('assistant', "Hi! I'm Sanha's portfolio assistant. I'd love to help you explore her engineering work, her approach to solving problems, or a little about her life outside work. What are you curious about?");
    setSuggestions(starters);
  }
  async function ask(question, inputSource = 'typed') {
    question = question.trim();
    if (busy || !question) return;
    if (question.length > 4000) { status.textContent = 'Please keep your question under 4,000 characters.'; return; }
    setBusy(true);
    input.value = '';
    let userMessage = addMessage('user', question);
    status.textContent = ready ? 'Thinking…' : 'Getting the assistant ready… Your question is queued.';
    const wakeTimer = setTimeout(() => { status.textContent = 'Still working on it. The service may take a little longer to wake up.'; }, 8000);
    try {
      ready = await warmup();
      status.textContent = 'Thinking…';
      const payload = { message: question, input_source: inputSource };
      if (conversationId) payload.conversation_id = conversationId;
      let data;
      try {
        data = await callApi('/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
      } catch (error) {
        if ((error.status === 410 || error.status === 404) && conversationId) {
          conversationId = null;
          messages.replaceChildren();
          addMessage('assistant', 'Your previous conversation ended. Starting a fresh chat with your question.');
          userMessage = addMessage('user', question);
          data = await callApi('/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:question, input_source:inputSource})});
        } else { throw error; }
      }
      data = validateAnswer(data);
      ready = true;
      conversationId = data.conversation_id;
      addMessage('assistant', data.reply);
      setSuggestions(data.suggested_questions);
      status.textContent = '';
    } catch (error) {
      userMessage.remove();
      input.value = question;
      status.textContent = error.name === 'AbortError' ? 'The service took too long. Please try again in a moment.' : error.message;
    } finally {
      clearTimeout(wakeTimer);
      setBusy(false);
      input.focus();
    }
  }
  document.getElementById('chat-form').addEventListener('submit', event => { event.preventDefault(); ask(input.value); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); ask(input.value); }
  });
  reset.addEventListener('click', async () => {
    if (busy) return;
    setBusy(true);
    status.textContent = 'Starting a new chat…';
    try {
      if (conversationId) {
        try { await callApi('/conversations/' + encodeURIComponent(conversationId), {method:'DELETE'}); }
        catch (error) { if (error.status !== 404 && error.status !== 410) throw error; }
      }
      conversationId = null;
      input.value = '';
      welcome();
      status.textContent = '';
    } catch (error) { status.textContent = 'Could not delete the previous chat. Please try again.'; }
    finally { setBusy(false); input.focus(); }
  });
  welcome();
  status.textContent = 'Getting the assistant ready… You can type your question while it wakes up.';
  warmup().then(isReady => {
    ready = isReady;
    if (!busy) status.textContent = isReady ? 'Ready when you are.' : 'The assistant is taking a little longer to wake up. You can still send a question.';
  });
}
