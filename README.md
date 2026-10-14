# Sanha Tahir — portfolio

A static HTML, CSS, and JavaScript portfolio. No framework, dependencies, or build step is required.

## Preview

Open `index.html` in a browser, or serve this directory:

```sh
python -m http.server 8000
```

Then visit http://localhost:8000. Run the command from the repository directory.

## Editing

- `index.html`: homepage and professional experience.
- `customer-usage.html`, `gcp-test-environment.html`, `event-processing.html`: detailed case studies.
- `assets/style.css`: palette, layout, responsive styles, and reduced-motion-aware leaf animation.
- `assets/site.js`: section navigation highlighting, mobile menu behavior, and certification search/topic filters. Navigation, certificate links, and tags remain available without JavaScript.
- `portfolio-content-draft.md`: editorial reference; edits do not automatically update the HTML.
- `R Scripts/`: original R Markdown sources, retained for reference.

The pages use relative asset URLs and can be hosted at a domain root or repository subpath.

A fixed vertical menu provides access to every homepage section on desktop. Smaller screens use a floating **Navigate** menu that expands into the same vertical list. The current homepage section is highlighted as visitors scroll; case-study pages link back to those homepage sections.

## CI/CD and deployment

The site deploys through GitHub Pages using GitHub's generated `pages-build-deployment` workflow. No custom workflow files are stored in `.github/workflows/`.

Pushing to `main` triggers the deployment process:

1. GitHub checks out the repository.
2. The generated workflow builds the site with Jekyll.
3. It uploads the generated site as an artifact.
4. It deploys the artifact to GitHub Pages and reports the result.

Although GitHub uses Jekyll in its deployment workflow, the portfolio source is plain HTML, CSS, and JavaScript. Local development requires no dependency installation or build command.

Monitor builds and deployments in the repository's [Actions tab](https://github.com/sanhatahir/sanha_portfolio/actions). Hosting configuration is managed under **Settings → Pages**. The generated workflow indicates branch-based publishing; the configured source folder has not been verified directly.

### Validation

There is currently no custom CI workflow for JavaScript syntax, local links, or browser tests. GitHub's deployment workflow builds and publishes the site; the checks below are performed locally before pushing:

- Check JavaScript syntax with `node --check assets/site.js` (requires Node.js).
- Verify local page links, section anchors, and asset paths.
- Preview the pages in a browser and check responsive layout and interactions.

Changes to the editorial Markdown files do not automatically update the website. Edit the corresponding HTML files to change published content.

## Portfolio assistant

The homepage hero contains an inline chat panel at `#assistant`, replacing the former pipeline-card illustration. The chat replaces the pipeline cards, with decorative leaves floating behind it. Reduced-motion preferences remain respected. It calls the separate Render backend over HTTPS. Visitor session tokens are generated with browser cryptographic randomness, held only in page memory, and sent in the Authorization header; no API keys are present in frontend code. Conversation memory and follow-ups work without third-party cookies. Reloading the page starts a fresh session. New chat deletes the current server conversation. Responses are rendered as text.

The backend allows requests from the exact GitHub Pages origin. Local live-chat previews also require that local origin in the backend's ALLOWED_ORIGINS; regular portfolio content can be previewed without that configuration. The free backend can take about a minute to wake after inactivity.
