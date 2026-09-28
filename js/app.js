/**
 * WeatherBlend AI - Main Application Controller
 * Clean, simplified controller managing state updates, rendering, and interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Managers
  navigationManager.init();
  alertsManager.init();
  weatherAssistant.init();
  weatherMap.initMap("weatherMap");

  // 2. Setup Location Selector
  const locSelect = document.getElementById("locationSelect");
  if (locSelect) {
    locSelect.innerHTML = "";
    WEATHER_DATA.locations.forEach(loc => {
      const opt = document.createElement("option");
      opt.value = loc.id;
      opt.textContent = loc.name;
      if (loc.id === appState.activeLocationId) opt.selected = true;
      locSelect.appendChild(opt);
    });

    locSelect.addEventListener("change", (e) => {
      showLoadingFeedback("Updating Forecast...", "Blending AI, NWP and ensemble predictions.", () => {
        appState.setLocation(e.target.value);
      });
    });
  }

  // 3. Setup Lead Time Selectors (Header + Timeline Bar)
  const leadTimeSelect = document.getElementById("leadTimeSelect");
  if (leadTimeSelect) {
    leadTimeSelect.addEventListener("change", (e) => {
      appState.setLeadTime(e.target.value);
      // Sync timeline buttons
      const steps = document.querySelectorAll(".timeline-step");
      steps.forEach(s => {
        if (s.getAttribute("data-leadtime") === e.target.value) {
          steps.forEach(other => other.classList.remove("active"));
          s.classList.add("active");
        }
      });
    });
  }

  // Simple Timeline Step buttons (Today / +24h / +48h / +72h)
  const timelineSteps = document.querySelectorAll(".timeline-step");
  timelineSteps.forEach(step => {
    step.addEventListener("click", () => {
      timelineSteps.forEach(s => s.classList.remove("active"));
      step.classList.add("active");
      const lt = step.getAttribute("data-leadtime");
      if (leadTimeSelect) leadTimeSelect.value = lt;
      appState.setLeadTime(lt);
    });
  });

  // 4. Metric Switcher Segmented Control (Rainfall, Temperature, Wind)
  const metricBtns = document.querySelectorAll(".metric-seg-btn");
  metricBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const metric = btn.getAttribute("data-metric");
      // Sync all metric buttons on both views
      metricBtns.forEach(b => {
        if (b.getAttribute("data-metric") === metric) {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });
      appState.setMetric(metric);
    });
  });

  // 5. Global State Subscription for View Updates
  appState.subscribe((event, data) => {
    const forecast = appState.getCurrentForecast();

    if (event === "location_change" || event === "lead_time_change" || event === "metric_change") {
      updateHomeDashboard(forecast);
      updateForecastPage(forecast);
    } else if (event === "map_layer_change") {
      weatherMap.setLayer(data);
    }
  });

  // 6. About Modal Binding
  const aboutLink = document.getElementById("footerAboutLink");
  const aboutModal = document.getElementById("aboutModal");
  const closeAboutBtn = document.getElementById("closeAboutModalBtn");
  const aboutBackdrop = document.getElementById("aboutModalBackdrop");

  if (aboutLink && aboutModal) {
    aboutLink.addEventListener("click", (e) => {
      e.preventDefault();
      aboutModal.style.display = "flex";
    });
  }
  if (closeAboutBtn && aboutModal) {
    closeAboutBtn.addEventListener("click", () => {
      aboutModal.style.display = "none";
    });
  }
  if (aboutBackdrop && aboutModal) {
    aboutBackdrop.addEventListener("click", () => {
      aboutModal.style.display = "none";
    });
  }

  // 7. Initial Render
  const initialForecast = appState.getCurrentForecast();
  updateHomeDashboard(initialForecast);
  updateForecastPage(initialForecast);
  updateLiveTimestamps();
});

// Update Simplified Homepage
function updateHomeDashboard(forecast) {
  const summary = forecast.summary;
  const metric = appState.selectedMetric;

  // Primary Hero Value & Label
  const heroVal = document.getElementById("heroPrimaryVal");
  const heroLabel = document.getElementById("heroPrimaryLabel");
  const heroRainProb = document.getElementById("heroRainProb");
  const heroConfidenceTag = document.getElementById("heroConfidenceTag");

  if (heroVal && heroLabel) {
    if (metric === "temperature") {
      heroVal.textContent = summary.temperature.value;
      heroLabel.textContent = "Expected maximum temperature";
    } else if (metric === "wind") {
      heroVal.textContent = summary.wind.value;
      heroLabel.textContent = `Wind from ${summary.wind.direction}`;
    } else {
      heroVal.textContent = summary.rainfall.value;
      heroLabel.textContent = "Expected rainfall";
    }
  }

  if (heroRainProb) {
    heroRainProb.textContent = summary.rainfall.probability;
  }

  if (heroConfidenceTag) {
    heroConfidenceTag.textContent = `High (${forecast.confidenceScore}%)`;
  }

  // Three Compact Weather Summaries
  const sumTemp = document.getElementById("summaryTempVal");
  const sumTempSub = document.getElementById("summaryTempSub");
  const sumWind = document.getElementById("summaryWindVal");
  const sumWindSub = document.getElementById("summaryWindSub");
  const sumRain = document.getElementById("summaryRainVal");
  const sumRainSub = document.getElementById("summaryRainSub");

  if (sumTemp) sumTemp.textContent = summary.temperature.value;
  if (sumTempSub) sumTempSub.textContent = `Min: ${summary.temperature.min}`;

  if (sumWind) sumWind.textContent = summary.wind.value;
  if (sumWindSub) sumWindSub.textContent = `Direction: ${summary.wind.direction}`;

  if (sumRain) sumRain.textContent = summary.rainfall.value;
  if (sumRainSub) sumRainSub.textContent = `${summary.rainfall.probability} probability`;

  // Compact Alert Banner (Red only when active)
  const alertBanner = document.getElementById("homeAlertBanner");
  const alertTitle = document.getElementById("homeAlertTitle");
  const alertDesc = document.getElementById("homeAlertDesc");

  if (alertBanner && alertTitle && alertDesc) {
    const ext = summary.extremeWeather;
    if (ext.riskClass === "high" || ext.riskClass === "moderate") {
      alertBanner.style.display = "flex";
      alertBanner.className = ext.riskClass === "high" ? "compact-alert-banner" : "compact-alert-banner normal-status";
      alertTitle.textContent = `${ext.risk}: Weather Advisory`;
      alertDesc.textContent = ext.description;
    } else {
      alertBanner.className = "compact-alert-banner normal-status";
      alertTitle.textContent = "No Severe Weather Alerts";
      alertDesc.textContent = "Current atmospheric conditions are within normal ranges.";
    }
  }

  // How the forecast is combined
  const weights = forecast.modelContributions.current;
  const homeAiWeight = document.getElementById("homeAiWeight");
  const homeAiBar = document.getElementById("homeAiBar");
  const homeNwpWeight = document.getElementById("homeNwpWeight");
  const homeNwpBar = document.getElementById("homeNwpBar");
  const homeEnsWeight = document.getElementById("homeEnsWeight");
  const homeEnsBar = document.getElementById("homeEnsBar");

  if (homeAiWeight) homeAiWeight.textContent = `${weights.ai}%`;
  if (homeAiBar) homeAiBar.style.width = `${weights.ai}%`;

  if (homeNwpWeight) homeNwpWeight.textContent = `${weights.nwp}%`;
  if (homeNwpBar) homeNwpBar.style.width = `${weights.nwp}%`;

  if (homeEnsWeight) homeEnsWeight.textContent = `${weights.ensemble}%`;
  if (homeEnsBar) homeEnsBar.style.width = `${weights.ensemble}%`;

  // Render main blended timeline chart
  weatherCharts.renderTimelineChart("blendedTimelineChart", forecast, appState.selectedMetric);
}

// Update Simplified Forecast Page
function updateForecastPage(forecast) {
  const summary = forecast.summary;
  const weights = forecast.modelContributions.current;

  // 1. Chart
  weatherCharts.renderTimelineChart("forecastOverviewChart", forecast, appState.selectedMetric);

  // 2. Summary Strip
  const sumRain = document.getElementById("forecastSumRain");
  const sumTemp = document.getElementById("forecastSumTemp");
  const sumWind = document.getElementById("forecastSumWind");
  const sumConf = document.getElementById("forecastSumConf");
  const sumExtreme = document.getElementById("forecastSumExtreme");

  if (sumRain) sumRain.textContent = summary.rainfall.value;
  if (sumTemp) sumTemp.textContent = summary.temperature.value;
  if (sumWind) sumWind.textContent = summary.wind.value;
  if (sumConf) sumConf.textContent = `High (${forecast.confidenceScore}%)`;
  if (sumExtreme) sumExtreme.textContent = summary.extremeWeather.risk;

  // 3. Model Blend
  const fBlendAi = document.getElementById("forecastBlendAi");
  const fBlendAiBar = document.getElementById("forecastBlendAiBar");
  const fBlendNwp = document.getElementById("forecastBlendNwp");
  const fBlendNwpBar = document.getElementById("forecastBlendNwpBar");
  const fBlendEns = document.getElementById("forecastBlendEns");
  const fBlendEnsBar = document.getElementById("forecastBlendEnsBar");
  const fBlendDesc = document.getElementById("forecastBlendDesc");

  if (fBlendAi) fBlendAi.textContent = `${weights.ai}%`;
  if (fBlendAiBar) fBlendAiBar.style.width = `${weights.ai}%`;

  if (fBlendNwp) fBlendNwp.textContent = `${weights.nwp}%`;
  if (fBlendNwpBar) fBlendNwpBar.style.width = `${weights.nwp}%`;

  if (fBlendEns) fBlendEns.textContent = `${weights.ensemble}%`;
  if (fBlendEnsBar) fBlendEnsBar.style.width = `${weights.ensemble}%`;

  if (fBlendDesc) {
    fBlendDesc.textContent = forecast.modelContributions.whyTheseWeights ||
      "Today's forecast combines AI, physical weather models and ensemble forecasts based on their recent performance.";
  }
}

// Global Loading Feedback
function showLoadingFeedback(title, desc, callback) {
  const loadingOverlay = document.getElementById("globalLoadingOverlay");
  const titleEl = document.getElementById("globalLoadingTitle");
  const descEl = document.getElementById("globalLoadingDesc");

  if (loadingOverlay && titleEl && descEl) {
    titleEl.textContent = title;
    descEl.textContent = desc;
    loadingOverlay.style.display = "flex";

    setTimeout(() => {
      callback();
      loadingOverlay.style.display = "none";
    }, 280);
  } else {
    callback();
  }
}

// Live update timestamp in header & footer
function updateLiveTimestamps() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const footerUpdate = document.getElementById("footerLastUpdate");
  const headerTimeEl = document.getElementById("headerLiveTime");

  if (footerUpdate) footerUpdate.textContent = `Updated: ${timeStr} Local`;
  if (headerTimeEl) headerTimeEl.textContent = `Updated: ${timeStr}`;
}
