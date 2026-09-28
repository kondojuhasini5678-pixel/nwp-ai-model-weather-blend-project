/**
 * WeatherBlend AI - Interactive Meteorological Map Controller (Leaflet.js)
 * Clean light basemap, simplified weather layers (Blended, Rain, Temp, Wind, Alerts)
 * Strictly no emojis, no "Explain Forecast" buttons.
 */

class WeatherMapManager {
  constructor() {
    this.map = null;
    this.activeLayer = "blended";
    this.markersLayerGroup = null;
    this.overlaysLayerGroup = null;
  }

  // Initialize the map
  initMap(containerId = "weatherMap") {
    if (this.map) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    // Centered around southern-central India (Hyderabad focus)
    this.map = L.map(containerId, {
      center: [18.2, 79.5],
      zoom: 6,
      zoomControl: true,
      attributionControl: false
    });

    // CartoDB Positron clean light basemap
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
      subdomains: "abcd"
    }).addTo(this.map);

    this.markersLayerGroup = L.layerGroup().addTo(this.map);
    this.overlaysLayerGroup = L.layerGroup().addTo(this.map);

    this.renderStations();
    this.renderWeatherOverlays();
  }

  // Switch Active Map Layer
  setLayer(layerKey) {
    this.activeLayer = layerKey;
    this.renderStations();
    this.renderWeatherOverlays();
    this.updateLegend(layerKey);
  }

  // Render station pins and interactive popups
  renderStations() {
    if (!this.map || !this.markersLayerGroup) return;
    this.markersLayerGroup.clearLayers();

    WEATHER_DATA.mapStations.forEach(station => {
      // Clean pin label based on layer
      let badgeContent = "";
      if (this.activeLayer === "rainfall" || this.activeLayer === "blended") {
        badgeContent = `<span>${station.rain}</span>`;
      } else if (this.activeLayer === "temperature") {
        badgeContent = `<span>${station.temp}</span>`;
      } else if (this.activeLayer === "wind") {
        badgeContent = `<span>${station.wind}</span>`;
      } else if (this.activeLayer === "extreme") {
        badgeContent = `<span class="badge-risk ${station.riskClass}">${station.risk}</span>`;
      }

      const customIcon = L.divIcon({
        className: "custom-weather-pin-container",
        html: `
          <div class="custom-weather-pin">
            <div class="pin-bubble">${badgeContent}</div>
            <div class="pin-pointer"></div>
          </div>
        `,
        iconSize: [70, 32],
        iconAnchor: [35, 32],
        popupAnchor: [0, -34]
      });

      const marker = L.marker([station.lat, station.lng], { icon: customIcon });

      // Clean Location Popup without "Explain Forecast"
      const popupHtml = `
        <div class="map-popup-card">
          <div class="map-popup-header">
            <div class="map-popup-city">${station.name}</div>
            <span class="badge-risk ${station.riskClass}">${station.risk}</span>
          </div>
          <div class="map-popup-grid">
            <div class="popup-metric">
              <div class="popup-metric-label">Rainfall</div>
              <div class="popup-metric-val">${station.rain}</div>
            </div>
            <div class="popup-metric">
              <div class="popup-metric-label">Temperature</div>
              <div class="popup-metric-val">${station.temp}</div>
            </div>
            <div class="popup-metric">
              <div class="popup-metric-label">Wind</div>
              <div class="popup-metric-val">${station.wind}</div>
            </div>
            <div class="popup-metric">
              <div class="popup-metric-label">Confidence</div>
              <div class="popup-metric-val">${station.conf}</div>
            </div>
          </div>
          <div class="map-popup-model">
            Blended forecast generated from multiple models
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      this.markersLayerGroup.addLayer(marker);
    });
  }

  // Render spatial weather overlays
  renderWeatherOverlays() {
    if (!this.map || !this.overlaysLayerGroup) return;
    this.overlaysLayerGroup.clearLayers();

    const zones = [
      {
        center: [17.5, 82.0],
        radius: 140000,
        color: "#C62828",
        fillColor: "#C62828",
        fillOpacity: 0.14,
        weight: 1.5
      },
      {
        center: [17.4, 78.5],
        radius: 160000,
        color: "#1F5D42",
        fillColor: "#1F5D42",
        fillOpacity: 0.12,
        weight: 1.5
      },
      {
        center: [14.5, 81.2],
        radius: 180000,
        color: "#12345B",
        fillColor: "#12345B",
        fillOpacity: 0.10,
        weight: 1
      }
    ];

    zones.forEach(zone => {
      const circle = L.circle(zone.center, {
        radius: zone.radius,
        color: zone.color,
        fillColor: zone.fillColor,
        fillOpacity: zone.fillOpacity,
        weight: zone.weight,
        dashArray: "4, 4"
      });
      this.overlaysLayerGroup.addLayer(circle);
    });
  }

  // Update Legend
  updateLegend(layerKey) {
    const legendTitle = document.getElementById("mapLegendTitle");
    const legendBar = document.getElementById("mapLegendBar");
    const labelMin = document.getElementById("legendLabelMin");
    const labelMid = document.getElementById("legendLabelMid");
    const labelMax = document.getElementById("legendLabelMax");

    if (!legendTitle || !legendBar || !labelMin || !labelMid || !labelMax) return;

    if (layerKey === "temperature") {
      legendTitle.textContent = "Temperature Distribution (°C)";
      legendBar.style.background = "linear-gradient(to right, #BCD5C7, #4CAF50, #FDD835, #FB8C00, #C62828)";
      labelMin.textContent = "18°C (Mild)";
      labelMid.textContent = "28°C";
      labelMax.textContent = "42°C (High)";
    } else if (layerKey === "wind") {
      legendTitle.textContent = "Sustained Wind Speed (km/h)";
      legendBar.style.background = "linear-gradient(to right, #E0F2FE, #38BDF8, #0284C7, #0369A1, #082F49)";
      labelMin.textContent = "0 km/h";
      labelMid.textContent = "30 km/h";
      labelMax.textContent = "60+ km/h";
    } else if (layerKey === "extreme") {
      legendTitle.textContent = "Weather Risk Level";
      legendBar.style.background = "linear-gradient(to right, #BCD5C7, #4CAF50, #FDD835, #C62828)";
      labelMin.textContent = "Normal";
      labelMid.textContent = "Advisory";
      labelMax.textContent = "High Risk";
    } else {
      legendTitle.textContent = "Blended Rainfall Intensity (mm)";
      legendBar.style.background = "linear-gradient(to right, #BCD5C7, #4CAF50, #FDD835, #FB8C00, #C62828)";
      labelMin.textContent = "0 mm (Light)";
      labelMid.textContent = "30 mm";
      labelMax.textContent = "80+ mm (Heavy)";
    }
  }

  // Invalidate size when map tab becomes active
  invalidateSize() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 150);
    }
  }
}

// Map instance singleton
const weatherMap = new WeatherMapManager();
