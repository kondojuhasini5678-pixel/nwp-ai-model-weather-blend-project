/**
 * WeatherBlend AI - Weather Assistant Chatbot Controller
 * Provides clear, friendly, and accessible weather explanations.
 * Strictly no decorative emojis, no technical jargon by default.
 */

class WeatherAssistant {
  constructor() {
    this.messagesContainer = null;
    this.inputField = null;
    this.sendBtn = null;
  }

  init() {
    this.messagesContainer = document.getElementById("chatMessagesArea");
    this.inputField = document.getElementById("chatInput");
    this.sendBtn = document.getElementById("chatSendBtn");

    if (this.sendBtn && this.inputField) {
      this.sendBtn.addEventListener("click", () => this.handleSendMessage());
      this.inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    // Bind suggested questions chips
    const chips = document.querySelectorAll(".question-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const text = chip.textContent.trim().replace(/^“|”$/g, "");
        this.askQuestion(text);
      });
    });
  }

  askQuestion(text) {
    if (!text) return;
    this.appendUserMessage(text);
    
    // Simulate natural response delay
    setTimeout(() => {
      this.generateAIResponse(text);
    }, 350);
  }

  handleSendMessage() {
    if (!this.inputField) return;
    const text = this.inputField.value.trim();
    if (!text) return;
    this.inputField.value = "";
    this.askQuestion(text);
  }

  appendUserMessage(text) {
    if (!this.messagesContainer) return;
    const row = document.createElement("div");
    row.className = "message-row user-msg";
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    row.innerHTML = `
      <div>
        <div class="message-bubble">${this.escapeHTML(text)}</div>
        <div class="message-time">${time}</div>
      </div>
    `;
    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
  }

  generateAIResponse(userPrompt) {
    if (!this.messagesContainer) return;

    const lower = userPrompt.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    const forecast = appState.getCurrentForecast();
    const summary = forecast.summary;
    let answer = "";

    // 1. Will it rain?
    if (lower.includes("rain") || lower.includes("will it rain") || lower.includes("precipitation")) {
      answer = `Yes, rainfall is likely today with a ${summary.rainfall.probability} probability. The blended forecast estimates approximately ${summary.rainfall.value} of rainfall, peaking over the next 24 to 48 hours.`;
    }
    // 2. What will the temperature be?
    else if (lower.includes("temp") || lower.includes("temperature") || lower.includes("hot") || lower.includes("warm") || lower.includes("cold")) {
      answer = `Today's temperature is expected to reach a maximum of ${summary.temperature.value}, with nighttime lows around ${summary.temperature.min}. Temperatures remain steady across the next two days.`;
    }
    // 3. Is there any weather alert?
    else if (lower.includes("alert") || lower.includes("warning") || lower.includes("severe") || lower.includes("extreme") || lower.includes("risk")) {
      if (summary.extremeWeather.riskClass === "high" || summary.extremeWeather.riskClass === "moderate") {
        answer = `There is currently a ${summary.extremeWeather.risk} for the region. Details: ${summary.extremeWeather.description}. Please monitor local updates if planning outdoor travel.`;
      } else {
        answer = `There are no severe weather alerts in effect for this area. Conditions are within normal seasonal ranges.`;
      }
    }
    // 4. What is the forecast for the next 3 days?
    else if (lower.includes("3 days") || lower.includes("next 3 days") || lower.includes("three days") || lower.includes("72")) {
      answer = `Over the next 3 days, expected rainfall will peak around ${summary.rainfall.value} before tapering off. Maximum temperatures will hover near ${summary.temperature.value} with moderate winds around ${summary.wind.value}.`;
    }
    // 5. Wind question
    else if (lower.includes("wind") || lower.includes("breeze") || lower.includes("gust")) {
      answer = `Wind speeds are projected at ${summary.wind.value} coming from the ${summary.wind.direction}. Breezy conditions are expected during peak daylight hours.`;
    }
    // Check existing knowledge base if available
    else {
      let matchedKb = null;
      for (const key in WEATHER_DATA.assistantKnowledgeBase) {
        if (lower.includes(key) || key.includes(lower)) {
          matchedKb = WEATHER_DATA.assistantKnowledgeBase[key];
          break;
        }
      }

      if (matchedKb) {
        answer = matchedKb.answer;
      } else {
        answer = `The blended forecast combines AI algorithms, physical weather models, and 50 ensemble forecasts to provide the most reliable prediction for ${forecast.locationName}. Expected rainfall is ${summary.rainfall.value} with a high temperature of ${summary.temperature.value}.`;
      }
    }

    const row = document.createElement("div");
    row.className = "message-row ai-msg";
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    row.innerHTML = `
      <div class="assistant-avatar" style="width: 32px; height: 32px; flex-shrink: 0;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
          <circle cx="12" cy="14" r="6"></circle>
        </svg>
      </div>
      <div style="flex: 1;">
        <div class="message-bubble">
          <div>${this.escapeHTML(answer)}</div>
        </div>
        <div class="message-time">${time}</div>
      </div>
    `;

    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

// Singleton instance
const weatherAssistant = new WeatherAssistant();
