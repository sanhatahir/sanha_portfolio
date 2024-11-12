

library(plotly)



job_exp_data <- read.csv("../../assets/tables/job_exp.csv")
job_exp_data$size <- 4.5 * (job_exp_data$duration_months + (12*job_exp_data$duration_years))
job_exp_data$year_standard <- (job_exp_data$start_year - 2020)

custom_colors <- c("#FFB3BA", "#FFDFBA", "#BAFFC9", "#BAE1FF", "#B8A0D3", "#F6A8A1") 

fig <- plot_ly(job_exp_data, 
               x = ~x, 
               y = ~year_standard, 
               text = ~title, 
               type = 'scatter', 
               mode = 'markers',
               marker = list(size = ~size, 
                             opacity = 0.9,
                             color = custom_colors,
                             line = list(width = 0)))

fig <- fig %>% layout(
  title = 'My Journey In The Workforce',
  subtitle = "Hover over the bubbles to learn more!",
  xaxis = list(
    showgrid = FALSE,
    zeroline = FALSE,
    showticklabels = FALSE,
    title = "",
    range = c(min(job_exp_data$x) - 1, max(job_exp_data$x) + 1),  # Compress x-axis range
    scaleanchor = "y"  # Link x-axis scale to y-axis for equal scaling
  ),
  yaxis = list(
    showgrid = FALSE,
    zeroline = FALSE,
    showticklabels = FALSE,
    title = "",
    range = c(min(job_exp_data$year_standard) - 1, max(job_exp_data$year_standard) + 1)  # Compress y-axis range
  )
)

fig



############################################## Trying to use ggplot instead?


library(ggplot2)
library(plotly)


# Custom color palette
# custom_colors <- c("#FFB3BA", "#FFDFBA", "#BAFFC9", "#BAE1FF", "#B8A0D3", "#F6A8A1") 

# Create the ggplot2 scatter plot
p <- ggplot(job_exp_data, 
            aes(x = x, 
                y = year_standard, 
                size = size, 
                # color = factor(subskills)
                )) +
  geom_point(alpha = 0.7) +  # Bubbles
  scale_color_manual(values = custom_colors) +  # Custom color palette
  theme_minimal() +
  theme(
    axis.text = element_blank(),  # Remove axis text
    axis.title = element_blank(), # Remove axis titles
    panel.grid = element_blank()  # Remove gridlines
  ) +
  labs(title = 'My Journey In The Workforce', subtitle = "Hover over the bubbles to learn more!") +
  guides(color = FALSE, size = FALSE)  # Remove legend for color

p

# Convert the ggplot2 plot to an interactive plotly plot
interactive_plot <- ggplotly(p)

# Show the interactive plot
interactive_plot


################# 

job_exp_data$colors <- sample(custom_colors, nrow(job_exp_data), replace = TRUE)

# Create the ggplot2 scatter plot with a squished x-axis
p <- ggplot(job_exp_data, 
            aes(x = x, 
                y = year_standard, 
                size = 3*size,
                color = factor(colors))) +
  geom_point(alpha = 0.7) +  # Bubbles
  scale_color_manual(values = custom_colors) +  # Custom color palette
  scale_size_continuous(range = c(5, 20)) +  # Adjust the range of bubble sizes
  theme_minimal() +
  theme(
    axis.text = element_blank(),  # Remove axis text
    axis.title = element_blank(), # Remove axis titles
    panel.grid = element_blank(),  # Remove gridlines
    aspect.ratio = 0.45  # Adjust aspect ratio to compress x-axis
  ) +
  labs(title = 'My Journey In The Workforce', subtitle = "Hover over the bubbles to learn more!") +
  guides(color = FALSE, size = FALSE)  # Remove legend for color

# Compress x-axis range (make it narrower)
p <- p + scale_x_continuous(limits = c(min(job_exp_data$x) - 1, max(job_exp_data$x) + 1))

p
