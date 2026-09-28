/**
 * WeatherBlend AI - Interactive Chart Controller (Chart.js)
 * Clean, accessible charts adhering to Navy Blue + Forest Green theme tokens.
 */

class WeatherCharts {
  constructor() {
    this.blendedTimelineChart = null;
    this.forecastOverviewChart = null;
  }

  getDefaultChartOptions(metricKey, yAxisUnit) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: { family: "-apple-system, Segoe UI, sans-serif", size: 12, weight: "500" },
            color: "#52635B",
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: "#0B1F3A",
          titleFont: { size: 13, weight: "600" },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 6,
          boxPadding: 4,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.parsed.y} ${yAxisUnit}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: "#F0F4F2", drawBorder: false },
          ticks: { color: "#52635B", font: { size: 12 } }
        },
        y: {
          grid: { color: "#E9EFEA", drawBorder: false },
          ticks: {
            color: "#52635B",
            font: { size: 12 },
            callback: function(val) { return `${val} ${yAxisUnit}`; }
          }
        }
      }
    };
  }

  // Render or update the Main Blended Timeline Chart
  renderTimelineChart(canvasId, forecastData, metricKey) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const metricData = forecastData.timeline[metricKey] || forecastData.timeline["rainfall"];
    const labels = forecastData.timeline.labels;
    const unit = metricData.unit;

    // Track instance separately per canvas ID
    if (canvasId === "blendedTimelineChart" && this.blendedTimelineChart) {
      this.blendedTimelineChart.destroy();
    } else if (canvasId === "forecastOverviewChart" && this.forecastOverviewChart) {
      this.forecastOverviewChart.destroy();
    }

    const datasets = [
      {
        label: "Blended Forecast",
        data: metricData.blended,
        borderColor: "#0B1F3A",
        backgroundColor: "rgba(31, 93, 66, 0.08)",
        borderWidth: 2.8,
        pointBackgroundColor: "#0B1F3A",
        pointBorderColor: "#FFFFFF",
        pointRadius: 4.5,
        fill: true,
        tension: 0.35,
        order: 1
      },
      {
        label: "AI Weather Model",
        data: metricData.ai,
        borderColor: "#12345B",
        backgroundColor: "transparent",
        borderWidth: 1.8,
        borderDash: [5, 4],
        pointBackgroundColor: "#12345B",
        pointRadius: 3,
        tension: 0.35,
        order: 2
      },
      {
        label: "Physical NWP Model",
        data: metricData.nwp,
        borderColor: "#1F5D42",
        backgroundColor: "transparent",
        borderWidth: 1.8,
        borderDash: [3, 3],
        pointBackgroundColor: "#1F5D42",
        pointRadius: 3,
        tension: 0.35,
        order: 3
      },
      {
        label: "Ensemble Forecast",
        data: metricData.ensemble,
        borderColor: "#5C527F",
        backgroundColor: "transparent",
        borderWidth: 1.8,
        borderDash: [2, 2],
        pointBackgroundColor: "#5C527F",
        pointRadius: 3,
        tension: 0.35,
        order: 4
      }
    ];

    const options = this.getDefaultChartOptions(metricKey, unit);

    const chartInstance = new Chart(ctx, {
      type: "line",
      data: { labels, datasets },
      options
    });

    if (canvasId === "blendedTimelineChart") {
      this.blendedTimelineChart = chartInstance;
    } else if (canvasId === "forecastOverviewChart") {
      this.forecastOverviewChart = chartInstance;
    }
  }
}

// Chart instance singleton
const weatherCharts = new WeatherCharts();
