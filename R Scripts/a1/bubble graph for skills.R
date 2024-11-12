

################################### 


library(plotly)

# Example Data
skills_data <- read.csv("../../assets/tables/skills.csv")

# Add jitter to x and y values
set.seed(123)  # For reproducibility
skills_data$x_jitter <- (skills_data$x/1) + runif(nrow(skills_data), -0.2, 0.2)  # Adjust range as needed
skills_data$y_jitter <- (skills_data$y/10) + runif(nrow(skills_data), -0.2, 0.2)  # Adjust range as needed
skills_data$text_combined <- paste("Language:", skills_data$parent, "<br>", "Subskill:", skills_data$subskills)


# Create the plot with a dropdown menu for tags
fig <- plot_ly(
  skills_data, 
  x = ~x_jitter, 
  y = ~y_jitter, 
  text = ~text_combined, 
  type = 'scatter', 
  mode = 'markers',
  marker = list(
    size = ~expertise_score, 
    opacity = 0.9,
    # color = ~color,  # Map color from 'color' column
    line = list(width = 0)
  )
)

# Generate dropdown buttons for each unique tag
unique_tags <- unique(skills_data$tags)
buttons <- lapply(unique_tags, function(tag) {
  list(
    method = "restyle",
    args = list("transforms[0].value", tag),  # Filter based on tag
    label = tag
  )
})

# Add an "All" button to show all tags
#  <- c(list(list(method = "restyle", args = list("transforms[0].value", NULL), label = "All")), buttons)

# Add dropdown menu with buttons to filter by tag
fig <- fig %>%
  layout(
    title = 'Skills Visualization',
    xaxis = list(
      showgrid = FALSE,
      zeroline = FALSE,
      showticklabels = FALSE,
      title = "",
      range = c(min(skills_data$x) - 1, max(skills_data$x) + 1),  # Compress x-axis range
      scaleanchor = "y"  # Link x-axis scale to y-axis for equal scaling
    ),
    yaxis = list(
      showgrid = FALSE,
      zeroline = FALSE,
      showticklabels = FALSE,
      title = "",
      range = c(min(skills_data$y) - 1, max(skills_data$y) + 1)  # Compress y-axis range
    ),
    updatemenus = list(
      list(
        y = 0.3,  # Position dropdown
        x = 1,
        buttons = buttons
      )
    )
  ) %>%
  # Add a transform to allow filtering
  add_trace(
    transforms = list(
      list(
        type = "filter",
        target = ~tags,
        operation = "=",
        value = unique_tags[1]  # Default to first tag
      )
    )
  )

fig


######################### 

data <- data.frame(
  label = "Skill: Enthusiasm <br> Subskill: Ready to learn and take on new challenges",
  x = 1,
  y = 1,
  size = 300  # Adjust size to control bubble size
)

# Create the bubble chart
fig <- plot_ly(
  data,
  x = ~x,
  y = ~y,
  text = ~label,
  type = 'scatter',
  mode = 'markers+text',
  marker = list(
    size = ~size,
    opacity = 0.7,
    color = 'orange'  # Set color for the bubble
  )
)

# Customize layout if needed
fig <- fig %>% layout(
  title = "My Biggest Asset",
  xaxis = list(showgrid = FALSE, zeroline = FALSE, showticklabels = FALSE, 
               title = "",
               range = c(min(data$y) - 1, max(data$y) + 1)),
  yaxis = list(showgrid = FALSE, zeroline = FALSE, showticklabels = FALSE, title = "",
               range = c(min(data$y) - 1, max(data$y) + 1))
)

fig
