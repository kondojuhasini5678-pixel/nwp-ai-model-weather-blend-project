/**
 * WeatherBlend AI - Core Meteorological Data & Blending Engine Simulation
 * Contains realistic data for hybrid NWP, Ensemble, and AI/ML model outputs.
 */

const WEATHER_DATA = {
  // Available locations
  locations: [
    { id: "hyderabad", name: "Hyderabad, India", lat: 17.3850, lng: 78.4867, elevation: "542m" },
    { id: "tokyo", name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, elevation: "40m" },
    { id: "london", name: "London, United Kingdom", lat: 51.5074, lng: -0.1278, elevation: "35m" },
    { id: "newyork", name: "New York, United States", lat: 40.7128, lng: -74.0060, elevation: "10m" },
    { id: "frankfurt", name: "Frankfurt, Germany", lat: 50.1109, lng: 8.6821, elevation: "112m" }
  ],

  // Active date
  currentDate: "2026-09-24",

  // Lead times supported
  leadTimes: ["6h", "12h", "24h", "48h", "72h", "120h"],

  // Datasets keyed by location
  forecasts: {
    hyderabad: {
      locationName: "Hyderabad, India",
      date: "24 September 2026",
      conditionEmoji: "🌧️",
      conditionLabel: "Rain Showers",

      // Current 48h lead-time default
      summary: {
        rainfall: {
          value: "42 mm",
          numValue: 42,
          emoji: "🌧️",
          subtext: "Expected rainfall",
          probability: "78%",
          confidence: "87%"
        },
        temperature: {
          value: "32°C",
          numValue: 32,
          min: "24°C",
          emoji: "⛅",
          subtext: "Expected maximum",
          confidence: "91%"
        },
        wind: {
          value: "28 km/h",
          numValue: 28,
          direction: "SW",
          subtext: "Expected maximum",
          confidence: "84%"
        },
        extremeWeather: {
          risk: "Moderate Risk",
          riskClass: "moderate",
          description: "Heavy rainfall possibility",
          confidence: "76%"
        }
      },

      confidenceScore: 87,
      confidenceTooltip: "Forecast confidence represents the agreement and historical reliability of the contributing models under similar conditions.",

      uncertainty: {
        level: "Moderate",
        reasons: [
          "Moderate lead time (48h)",
          "Localized convective model divergence",
          "Rapid monsoon trough atmospheric changes"
        ]
      },

      modelContributions: {
        current: {
          ai: 45,
          nwp: 35,
          ensemble: 20
        },
        previous: {
          ai: 35,
          nwp: 40,
          ensemble: 25
        },
        whyTheseWeights: "AI/ML receives a higher weight because it has demonstrated stronger historical performance for rainfall in this region and forecast lead time.",
        weightChangeExplanation: "The AI/ML contribution increased because its recent forecast performance was stronger under the current weather conditions."
      },

      explainabilityFactors: [
        "Strong historical AI/ML performance in this region",
        "NWP predicts a similar rainfall pattern",
        "Ensemble forecasts show reasonable agreement",
        "Current atmospheric conditions support rainfall",
        "Forecast lead time has moderate uncertainty"
      ],

      technicalDetails: {
        rmse: "2.14 mm",
        mae: "1.62 mm",
        bias: "+0.18 mm",
        correlation: "0.92",
        historicalModelSkill: "0.88 Brier Score",
        modelWeights: "AI: 0.45 | NWP: 0.35 | EPS: 0.20",
        ensembleSpread: "3.4 mm",
        forecastUncertainty: "13%"
      },

      // Timeline datasets across 6h -> 120h
      timeline: {
        labels: ["6h", "12h", "24h", "48h", "72h", "120h"],
        hours: [6, 12, 24, 48, 72, 120],
        rainfall: {
          blended: [8, 18, 30, 42, 22, 9],
          ai: [9, 19, 32, 44, 21, 8],
          nwp: [7, 16, 27, 39, 25, 12],
          ensemble: [8, 17, 29, 41, 23, 10],
          unit: "mm"
        },
        temperature: {
          blended: [26, 29, 31, 32, 30, 28],
          ai: [26, 29, 31, 32.5, 30.2, 28.1],
          nwp: [25.5, 28.5, 30.5, 31.2, 29.5, 27.5],
          ensemble: [26, 29, 31, 32, 30, 28],
          unit: "°C"
        },
        wind: {
          blended: [16, 20, 24, 28, 22, 15],
          ai: [17, 21, 25, 29, 21, 14],
          nwp: [15, 19, 23, 27, 23, 17],
          ensemble: [16, 20, 24, 28, 22, 15],
          unit: "km/h"
        },
        probability: {
          blended: [45, 62, 74, 78, 55, 32],
          ai: [48, 65, 78, 82, 53, 30],
          nwp: [40, 58, 69, 72, 58, 36],
          ensemble: [45, 62, 74, 78, 55, 32],
          unit: "%"
        }
      },

      // Model Performance statistics (Forecast -> Performance)
      performance: {
        leadTimes: ["0h", "24h", "48h", "72h", "120h"],
        metrics: {
          rmse: {
            nwp: [2.1, 3.8, 5.2, 6.7, 8.4],
            ai: [1.8, 3.1, 4.8, 5.9, 7.8],
            ensemble: [2.0, 3.5, 5.0, 6.3, 8.1],
            blended: [1.6, 2.7, 4.2, 5.3, 7.0]
          },
          mae: {
            nwp: [1.6, 2.9, 4.1, 5.3, 6.7],
            ai: [1.4, 2.4, 3.7, 4.6, 6.1],
            ensemble: [1.5, 2.7, 3.9, 5.0, 6.4],
            blended: [1.2, 2.1, 3.2, 4.1, 5.5]
          },
          bias: {
            nwp: [0.12, 0.35, 0.48, 0.62, 0.81],
            ai: [0.05, 0.14, 0.22, 0.31, 0.45],
            ensemble: [0.08, 0.22, 0.34, 0.44, 0.59],
            blended: [0.03, 0.09, 0.15, 0.21, 0.32]
          },
          correlation: {
            nwp: [0.94, 0.88, 0.81, 0.73, 0.62],
            ai: [0.96, 0.91, 0.86, 0.79, 0.69],
            ensemble: [0.95, 0.89, 0.83, 0.76, 0.66],
            blended: [0.98, 0.94, 0.90, 0.84, 0.75]
          }
        },
        blendedImprovement: {
          nwpError: 5.2,
          aiError: 4.8,
          ensembleError: 5.0,
          blendedError: 4.2,
          improvementPct: "19.2%",
          explanation: "The blending algorithm reduces systematic phase and intensity errors by penalizing models with high recent divergence and prioritizing AI representation of localized convection, yielding a 19.2% error reduction over raw NWP."
        }
      }
    },

    // Tokyo sample dataset
    tokyo: {
      locationName: "Tokyo, Japan",
      date: "24 September 2026",
      conditionEmoji: "☁️",
      conditionLabel: "Overcast",
      summary: {
        rainfall: { value: "14 mm", numValue: 14, emoji: "🌧️", subtext: "Expected rainfall", probability: "52%", confidence: "89%" },
        temperature: { value: "24°C", numValue: 24, min: "19°C", emoji: "☁️", subtext: "Expected maximum", confidence: "94%" },
        wind: { value: "19 km/h", numValue: 19, direction: "ENE", subtext: "Expected maximum", confidence: "90%" },
        extremeWeather: { risk: "Low Risk", riskClass: "low", description: "Normal maritime conditions", confidence: "92%" }
      },
      confidenceScore: 89,
      confidenceTooltip: "Forecast confidence represents the agreement and historical reliability of the contributing models under similar conditions.",
      uncertainty: { level: "Low", reasons: ["High synoptic agreement", "Stable maritime ridge pattern"] },
      modelContributions: {
        current: { ai: 40, nwp: 40, ensemble: 20 },
        previous: { ai: 38, nwp: 42, ensemble: 20 },
        whyTheseWeights: "High NWP skill on synoptic frontal systems balanced equally with local AI marine boundary calculations.",
        weightChangeExplanation: "Slight AI weight increase due to accurate coastal wind resolution over Sagami Bay."
      },
      explainabilityFactors: [
        "Strong frontal boundary consensus between JMA and ECMWF NWP models",
        "AI/ML accurately calibrates marine boundary layer humidity",
        "Minimal spread across ensemble members",
        "Stable pressure field reduces lead-time uncertainty"
      ],
      technicalDetails: {
        rmse: "1.45 mm", mae: "1.08 mm", bias: "+0.06 mm", correlation: "0.95",
        historicalModelSkill: "0.93 Brier Score", modelWeights: "AI: 0.40 | NWP: 0.40 | EPS: 0.20",
        ensembleSpread: "1.8 mm", forecastUncertainty: "8%"
      },
      timeline: {
        labels: ["6h", "12h", "24h", "48h", "72h", "120h"],
        hours: [6, 12, 24, 48, 72, 120],
        rainfall: { blended: [2, 5, 10, 14, 8, 3], ai: [2, 5, 11, 15, 7, 2], nwp: [1, 4, 9, 13, 9, 4], ensemble: [2, 5, 10, 14, 8, 3], unit: "mm" },
        temperature: { blended: [20, 22, 23, 24, 23, 21], ai: [20, 22, 23, 24, 23, 21], nwp: [19, 21, 23, 23.5, 22.5, 20.5], ensemble: [20, 22, 23, 24, 23, 21], unit: "°C" },
        wind: { blended: [12, 15, 17, 19, 16, 11], ai: [13, 16, 18, 20, 15, 10], nwp: [11, 14, 16, 18, 17, 12], ensemble: [12, 15, 17, 19, 16, 11], unit: "km/h" },
        probability: { blended: [20, 35, 45, 52, 38, 15], ai: [22, 38, 48, 55, 36, 12], nwp: [18, 32, 42, 49, 40, 18], ensemble: [20, 35, 45, 52, 38, 15], unit: "%" }
      },
      performance: {
        leadTimes: ["0h", "24h", "48h", "72h", "120h"],
        metrics: {
          rmse: { nwp: [1.8, 3.2, 4.4, 5.6, 7.2], ai: [1.5, 2.7, 3.9, 5.1, 6.7], ensemble: [1.7, 3.0, 4.2, 5.4, 7.0], blended: [1.3, 2.3, 3.4, 4.5, 5.9] },
          mae: { nwp: [1.3, 2.3, 3.4, 4.4, 5.6], ai: [1.1, 1.9, 2.9, 3.9, 5.0], ensemble: [1.2, 2.1, 3.2, 4.1, 5.3], blended: [0.9, 1.6, 2.4, 3.3, 4.4] },
          bias: { nwp: [0.08, 0.22, 0.35, 0.46, 0.62], ai: [0.03, 0.10, 0.17, 0.24, 0.36], ensemble: [0.05, 0.15, 0.25, 0.33, 0.45], blended: [0.02, 0.06, 0.11, 0.16, 0.24] },
          correlation: { nwp: [0.96, 0.91, 0.85, 0.78, 0.68], ai: [0.97, 0.93, 0.88, 0.82, 0.73], ensemble: [0.96, 0.92, 0.87, 0.80, 0.70], blended: [0.99, 0.96, 0.92, 0.87, 0.79] }
        },
        blendedImprovement: { nwpError: 4.4, aiError: 3.9, ensembleError: 4.2, blendedError: 3.4, improvementPct: "22.7%", explanation: "Blending filters out localized coastal topography errors by dynamically adjusting the weight of high-resolution AI boundary adjustments." }
      }
    }
  },

  // Interactive Weather Map regional points
  mapStations: [
    { id: "hyd", name: "Hyderabad", lat: 17.3850, lng: 78.4867, rain: "42 mm", temp: "32°C", wind: "28 km/h", conf: "87%", dominant: "AI/ML (45%)", risk: "Moderate Risk", riskClass: "moderate", emoji: "🌧️" },
    { id: "blr", name: "Bengaluru", lat: 12.9716, lng: 77.5946, rain: "18 mm", temp: "27°C", wind: "22 km/h", conf: "89%", dominant: "AI/ML (48%)", risk: "Low Risk", riskClass: "low", emoji: "⛅" },
    { id: "che", name: "Chennai", lat: 13.0827, lng: 80.2707, rain: "64 mm", temp: "34°C", wind: "42 km/h", conf: "85%", dominant: "NWP (42%)", risk: "High Risk", riskClass: "high", emoji: "⛈️" },
    { id: "mum", name: "Mumbai", lat: 19.0760, lng: 72.8777, rain: "55 mm", temp: "30°C", wind: "36 km/h", conf: "86%", dominant: "Ensemble (38%)", risk: "High Risk", riskClass: "high", emoji: "🌧️" },
    { id: "del", name: "New Delhi", lat: 28.6139, lng: 77.2090, rain: "4 mm", temp: "35°C", wind: "14 km/h", conf: "92%", dominant: "AI/ML (50%)", risk: "Low Risk", riskClass: "low", emoji: "☀️" },
    { id: "kol", name: "Kolkata", lat: 22.5726, lng: 88.3639, rain: "38 mm", temp: "31°C", wind: "26 km/h", conf: "83%", dominant: "AI/ML (44%)", risk: "Moderate Risk", riskClass: "moderate", emoji: "🌧️" },
    { id: "vzg", name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, rain: "72 mm", temp: "31°C", wind: "48 km/h", conf: "88%", dominant: "NWP (45%)", risk: "High Risk", riskClass: "high", emoji: "⛈️" }
  ],

  // Extreme Weather Alerts
  alerts: [
    {
      id: "alert-1",
      category: "Heavy Rainfall",
      riskLevel: "HIGH RISK",
      riskClass: "high",
      conditionEmoji: "🌧️",
      intensity: "85 mm / 24h",
      probability: "82%",
      confidence: "91%",
      expectedWindow: "24 Sep, 18:00 – 25 Sep, 12:00",
      region: "Hyderabad Metropolitan & Godavari Basin",
      factors: [
        "Multiple models predict significant precipitation exceeding 80mm",
        "Ensemble forecasts show elevated 85th percentile cluster probability",
        "Current atmospheric soundings indicate precipitable water > 62mm",
        "Historical analog patterns indicate severe convective cell formation",
        "AI/ML model identifies increased flash rainfall probability based on radar extrapolation"
      ]
    },
    {
      id: "alert-2",
      category: "High Wind",
      riskLevel: "HIGH RISK",
      riskClass: "high",
      conditionEmoji: "💨",
      intensity: "68 km/h gusts",
      probability: "88%",
      confidence: "89%",
      expectedWindow: "25 Sep, 02:00 – 25 Sep, 16:00",
      region: "Northern Coastal Andhra & Krishna Delta",
      factors: [
        "Steep coastal pressure gradient detected between offshore low and mainland high",
        "Physical NWP predicts sustained gale force winds at 850 hPa level",
        "AI downscaling indicates localized channel acceleration along river mouths",
        "High model consensus across ECMWF, GFS, and AI/ML ensembles"
      ]
    },
    {
      id: "alert-3",
      category: "Heat Wave",
      riskLevel: "MODERATE RISK",
      riskClass: "moderate",
      conditionEmoji: "☀️",
      intensity: "41.5°C maximum",
      probability: "70%",
      confidence: "85%",
      expectedWindow: "26 Sep, 11:00 – 28 Sep, 17:00",
      region: "North Deccan Plateau",
      factors: [
        "Upper-level anticyclone promoting severe subsidence heating",
        "Low soil moisture feedback accelerating dry bulb temperature spikes",
        "Ensemble members agree on anomalous 4–5°C above seasonal norm",
        "Historical model calibration indicates 85% probability of threshold breach"
      ]
    },
    {
      id: "alert-4",
      category: "Extreme Temperature",
      riskLevel: "MODERATE RISK",
      riskClass: "moderate",
      conditionEmoji: "☀️",
      intensity: "39.0°C sustained",
      probability: "65%",
      confidence: "80%",
      expectedWindow: "27 Sep, 12:00 – 29 Sep, 18:00",
      region: "Central Inland Basin",
      factors: [
        "Weak monsoon hiatus causing prolonged clear-sky insolation",
        "AI model weights calibrated higher due to reliable dry-spell skill",
        "NWP indicates low low-level moisture advection",
        "Moderate lead-time spread remains between ECMWF and GFS"
      ]
    }
  ],

  // AI Assistant Knowledge Base (Strictly zero decorative emojis in messages)
  assistantKnowledgeBase: {
    "why is rainfall probability high": {
      answer: "Rainfall probability is high (78%) because multiple contributing forecast models indicate deep atmospheric moisture combined with active surface low-pressure trough convergence. The ensemble spread shows 38 of 50 members generating precipitation above 25 mm, while the AI/ML model predicts strong convective cell formation based on regional radar and satellite moisture history.",
      stats: { "AI/ML Prob": "82%", "NWP Prob": "72%", "Ensemble Agreement": "76%" }
    },
    "which model is contributing most": {
      answer: "The AI/ML weather model is currently contributing the highest weight at 45%, followed by physical NWP at 35% and the Ensemble at 20%. The blending algorithm assigned AI/ML the dominant weight because its 30-day verified RMSE in this geographic quadrant and 48-hour lead time is 4.8 mm, compared to 5.2 mm for NWP.",
      stats: { "AI/ML Weight": "45%", "NWP Weight": "35%", "Ensemble Weight": "20%" }
    },
    "why did the forecast change": {
      answer: "The blended rainfall estimate increased from 34 mm to 42 mm following the 12:00 UTC cycle. This revision occurred because new Doppler radar assimilation and satellite moisture sounding data revealed accelerated low-level monsoon wind shear. The AI model adapted its short-range weights to capture this moisture surge earlier than conventional NWP.",
      stats: { "Delta Rain": "+8 mm", "Confidence Delta": "+4%", "Weight Shift": "AI +10%" }
    },
    "show the next 72-hour forecast": {
      answer: "For the next 72 hours, the blended forecast projects rainfall peaking at 42 mm between hours 36 and 48, tapering to 22 mm at hour 72. Daytime maximum temperatures will range from 29°C to 32°C with sustained southwest winds of 22 to 28 km/h.",
      stats: { "Peak Rain": "42 mm (48h)", "Max Temp": "32°C", "Peak Wind": "28 km/h" }
    },
    "is there a heavy rainfall risk": {
      answer: "Yes, there is currently a Moderate to High Risk of heavy rainfall. The blending system has issued an active advisory for 85 mm/24h accumulated rainfall valid from 24 Sep 18:00 to 25 Sep 12:00 UTC with an 82% occurrence probability and 91% confidence score.",
      stats: { "Risk Level": "High Risk", "Probability": "82%", "Confidence": "91%" }
    },
    "why is forecast confidence low": {
      answer: "Forecast confidence drops from 87% at 48 hours to 68% at 120 hours primarily due to ensemble dispersion and convective trigger divergence between ECMWF and GFS. When physical models disagree on the track of the monsoon trough, the blending system automatically flags higher uncertainty.",
      stats: { "48h Conf": "87%", "120h Conf": "68%", "Ensemble Spread": "3.4 mm -> 9.1 mm" }
    },
    "what factors influenced today's forecast": {
      answer: "Today's blended forecast was primarily influenced by: 1) Strong historical AI/ML accuracy in the Deccan peninsula, 2) NWP physical consistency in boundary wind fields, 3) Sounding observations showing precipitable water above 60 mm, and 4) Dynamic weight dampening applied to outlier ensemble tracks.",
      stats: { "Dominant Driver": "Topographic AI", "Brier Skill": "0.88", "Error Reduction": "19.2%" }
    },
    "why is the nwp model weighted only 30%": {
      answer: "The NWP model currently has a lower contribution because its historical error for this location and forecast lead time has been higher than the other available models. The AI/ML model has performed better under similar conditions, so the blending system has assigned it a greater weight.",
      stats: { "NWP Weight": "35%", "NWP RMSE": "5.2 mm", "AI/ML RMSE": "4.8 mm" }
    }
  }
};
