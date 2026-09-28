/**
 * WeatherBlend AI - Forecast Explainability Controller
 * Side drawer displaying model contributions, meteorological factors,
 * and collapsible technical statistics. Strictly no decorative emojis.
 */

class ExplainabilityManager {
  constructor() {
    this.drawerEl = null;
    this.backdropEl = null;
  }

  init() {
    this.drawerEl = document.getElementById("explainabilityDrawer");
    this.backdropEl = document.getElementById("drawerBackdrop");
    
    // Bind close events
    const closeBtn = document.getElementById("closeDrawerBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }
    if (this.backdropEl) {
      this.backdropEl.addEventListener("click", () => this.close());
    }

    // Bind Technical Accordion toggle
    const techHeader = document.getElementById("techAccordionHeader");
    const techBox = document.getElementById("techAccordionBox");
    if (techHeader && techBox) {
      techHeader.addEventListener("click", () => {
        techBox.classList.toggle("open");
      });
    }

    // Subscribe to state changes
    appState.subscribe((event, data) => {
      if (event === "drawer_open") {
        this.open(data);
      } else if (event === "drawer_close") {
        this.close();
      }
    });
  }

  open(forecastData) {
    const data = forecastData || appState.getCurrentForecast();
    this.populateData(data);

    if (this.drawerEl) this.drawerEl.classList.add("open");
    if (this.backdropEl) this.backdropEl.classList.add("active");
  }

  close() {
    if (this.drawerEl) this.drawerEl.classList.remove("open");
    if (this.backdropEl) this.backdropEl.classList.remove("active");
  }

  populateData(data) {
    // 1. Forecast Header Details
    const headerTitle = document.getElementById("drawerForecastTitle");
    const headerSub = document.getElementById("drawerForecastSub");
    if (headerTitle) {
      headerTitle.textContent = `Rainfall: ${data.summary.rainfall.value}`;
    }
    if (headerSub) {
      headerSub.textContent = `Confidence: ${data.confidenceScore}% | Lead Time: ${appState.selectedLeadTime}`;
    }

    // 2. Model Contributions
    const aiBar = document.getElementById("contribAiBar");
    const nwpBar = document.getElementById("contribNwpBar");
    const ensBar = document.getElementById("contribEnsBar");
    const aiVal = document.getElementById("contribAiVal");
    const nwpVal = document.getElementById("contribNwpVal");
    const ensVal = document.getElementById("contribEnsVal");

    const weights = data.modelContributions.current;
    if (aiBar && aiVal) {
      aiBar.style.width = `${weights.ai}%`;
      aiVal.textContent = `${weights.ai}%`;
    }
    if (nwpBar && nwpVal) {
      nwpBar.style.width = `${weights.nwp}%`;
      nwpVal.textContent = `${weights.nwp}%`;
    }
    if (ensBar && ensVal) {
      ensBar.style.width = `${weights.ensemble}%`;
      ensVal.textContent = `${weights.ensemble}%`;
    }

    // 3. Explainability Factors (checkmarks only, no emojis)
    const factorsList = document.getElementById("drawerFactorsList");
    if (factorsList) {
      factorsList.innerHTML = "";
      data.explainabilityFactors.forEach(factor => {
        const li = document.createElement("li");
        li.className = "factor-item";
        li.innerHTML = `
          <svg class="factor-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${factor}</span>
        `;
        factorsList.appendChild(li);
      });
    }

    // 4. Technical Details Grid (collapsible, collapsed by default)
    const tech = data.technicalDetails;
    document.getElementById("techRmse").textContent = tech.rmse;
    document.getElementById("techMae").textContent = tech.mae;
    document.getElementById("techBias").textContent = tech.bias;
    document.getElementById("techCorr").textContent = tech.correlation;
    document.getElementById("techSkill").textContent = tech.historicalModelSkill;
    document.getElementById("techWeights").textContent = tech.modelWeights;
    document.getElementById("techSpread").textContent = tech.ensembleSpread;
    document.getElementById("techUncertainty").textContent = tech.forecastUncertainty;

    // Reset accordion to closed by default
    const techBox = document.getElementById("techAccordionBox");
    if (techBox) techBox.classList.remove("open");
  }
}

// Explainability instance singleton
const explainabilityManager = new ExplainabilityManager();

// Global handler callable from map popup
window.triggerExplainForecastFromStation = function(cityName) {
  const forecast = appState.getCurrentForecast();
  appState.openExplainabilityDrawer(forecast);
};
