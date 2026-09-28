/**
 * WeatherBlend AI - Reactive State Manager
 * Centralizes UI states and dispatches change events to all subscribers.
 */

class WeatherState {
  constructor() {
    this.currentView = "home";
    this.activeLocationId = "hyderabad";
    this.selectedLeadTime = "48h";
    this.selectedDate = "2026-09-24";
    this.selectedMetric = "rainfall";
    
    // Forecast page internal sub-tabs
    this.activeForecastSubTab = "overview";
    this.performanceMetric = "rmse";
    
    // Map view states
    this.selectedMapLayer = "blended";
    
    // Alerts view states
    this.alertsFilter = "all";
    
    // Explainability Drawer state
    this.drawerOpen = false;
    this.explainabilityContext = null;
    
    // Listeners array
    this.listeners = [];
  }

  // Subscribe to state updates
  subscribe(fn) {
    this.listeners.push(fn);
  }

  // Notify subscribers
  notify(event, payload) {
    this.listeners.forEach(fn => fn(event, payload, this));
  }

  // Get current active forecast object
  getCurrentForecast() {
    return WEATHER_DATA.forecasts[this.activeLocationId] || WEATHER_DATA.forecasts["hyderabad"];
  }

  // Update View
  setView(viewId) {
    if (this.currentView === viewId) return;
    this.currentView = viewId;
    this.notify("view_change", viewId);
  }

  // Update Location
  setLocation(locId) {
    if (this.activeLocationId === locId) return;
    this.activeLocationId = locId;
    this.notify("location_change", locId);
  }

  // Update Lead Time
  setLeadTime(leadTime) {
    if (this.selectedLeadTime === leadTime) return;
    this.selectedLeadTime = leadTime;
    this.notify("lead_time_change", leadTime);
  }

  // Update Metric
  setMetric(metric) {
    if (this.selectedMetric === metric) return;
    this.selectedMetric = metric;
    this.notify("metric_change", metric);
  }

  // Update Forecast SubTab
  setForecastSubTab(tabId) {
    if (this.activeForecastSubTab === tabId) return;
    this.activeForecastSubTab = tabId;
    this.notify("forecast_subtab_change", tabId);
  }

  // Update Performance Metric
  setPerformanceMetric(metric) {
    if (this.performanceMetric === metric) return;
    this.performanceMetric = metric;
    this.notify("performance_metric_change", metric);
  }

  // Update Map Layer
  setMapLayer(layerId) {
    if (this.selectedMapLayer === layerId) return;
    this.selectedMapLayer = layerId;
    this.notify("map_layer_change", layerId);
  }

  // Update Alerts Filter
  setAlertsFilter(filter) {
    if (this.alertsFilter === filter) return;
    this.alertsFilter = filter;
    this.notify("alerts_filter_change", filter);
  }

  // Open/Close Explainability Drawer
  openExplainabilityDrawer(contextData) {
    this.drawerOpen = true;
    this.explainabilityContext = contextData || this.getCurrentForecast();
    this.notify("drawer_open", this.explainabilityContext);
  }

  closeExplainabilityDrawer() {
    this.drawerOpen = false;
    this.notify("drawer_close", null);
  }
}

// Global state singleton
const appState = new WeatherState();
