/**
 * WeatherBlend AI - Extreme Weather Alerts Controller
 * Clean, accessible alerts presentation using clear icons, color, and severity tags.
 * Strictly no decorative emojis, no "Why this alert?" buttons.
 */

class AlertsManager {
  constructor() {
    this.containerEl = null;
  }

  init() {
    this.containerEl = document.getElementById("alertsGrid");

    // Filter Buttons
    const filterBtns = document.querySelectorAll(".alert-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const category = btn.getAttribute("data-category");
        appState.setAlertsFilter(category);
      });
    });

    // Subscribe to state updates
    appState.subscribe((event) => {
      if (event === "alerts_filter_change" || event === "location_change") {
        this.renderAlerts();
      }
    });

    this.renderAlerts();
  }

  renderAlerts() {
    if (!this.containerEl) return;
    this.containerEl.innerHTML = "";

    const activeFilter = appState.alertsFilter;
    const filtered = WEATHER_DATA.alerts.filter(a => {
      if (activeFilter === "all") return true;
      if (activeFilter === "Heat Wave") {
        return a.category === "Heat Wave" || a.category === "Extreme Temperature";
      }
      return a.category.toLowerCase() === activeFilter.toLowerCase();
    });

    if (filtered.length === 0) {
      this.containerEl.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px; color: var(--text-secondary);">
          <div style="font-weight: 600; color: var(--color-forest-green); font-size: var(--font-size-md); margin-bottom: 4px;">
            No Active Alerts
          </div>
          <p style="font-size: var(--font-size-xs);">No severe weather warnings are currently active under this category.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(alert => {
      const card = document.createElement("div");
      const isHigh = alert.riskClass === "high";
      card.className = `card alert-card ${alert.riskClass}-risk`;

      // Clean SVG icon based on category
      let iconSvg = "";
      if (alert.category.includes("Rain")) {
        iconSvg = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isHigh ? 'var(--color-alert-red)' : 'var(--color-navy)'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="16" y1="13" x2="16" y2="21"></line>
            <line x1="8" y1="13" x2="8" y2="21"></line>
            <line x1="12" y1="15" x2="12" y2="23"></line>
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
          </svg>
        `;
      } else if (alert.category.includes("Wind")) {
        iconSvg = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isHigh ? 'var(--color-alert-red)' : 'var(--color-navy)'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path>
            <path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path>
            <path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>
          </svg>
        `;
      } else {
        iconSvg = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-amber)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
          </svg>
        `;
      }

      card.innerHTML = `
        <div class="alert-header">
          <div class="alert-type-title">
            ${iconSvg}
            <span>${alert.category} Warning</span>
          </div>
          <span class="badge-risk ${alert.riskClass}">${alert.riskLevel}</span>
        </div>

        <div style="font-size: var(--font-size-sm); color: var(--text-primary); margin-bottom: 6px;">
          Location: <strong>${alert.region}</strong>
        </div>

        <div class="alert-meta-grid">
          <div class="popup-metric">
            <div class="popup-metric-label">Expected Intensity</div>
            <div class="popup-metric-val">${alert.intensity}</div>
          </div>
          <div class="popup-metric">
            <div class="popup-metric-label">Probability</div>
            <div class="popup-metric-val">${alert.probability}</div>
          </div>
          <div class="popup-metric">
            <div class="popup-metric-label">Confidence</div>
            <div class="popup-metric-val">${alert.confidence}</div>
          </div>
          <div class="popup-metric">
            <div class="popup-metric-label">Expected Time</div>
            <div class="popup-metric-val" style="font-size: 12px;">${alert.expectedWindow}</div>
          </div>
        </div>
      `;

      this.containerEl.appendChild(card);
    });
  }
}

// Singleton instance
const alertsManager = new AlertsManager();
