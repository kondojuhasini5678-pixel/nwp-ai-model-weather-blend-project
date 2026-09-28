/**
 * WeatherBlend AI - Navigation & View Router
 * Handles sidebar navigation, mobile drawer toggles, and view switching.
 */

class NavigationManager {
  constructor() {
    this.sidebarEl = null;
    this.overlayEl = null;
  }

  init() {
    this.sidebarEl = document.getElementById("appSidebar");
    this.overlayEl = document.getElementById("sidebarOverlay");

    // 1. Sidebar Primary Links (Strictly 5 items)
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = link.getAttribute("data-view");
        if (targetView) {
          appState.setView(targetView);
          this.closeMobileMenu();
        }
      });
    });

    // 2. Mobile Menu Toggles
    const mobileBtn = document.getElementById("mobileMenuBtn");
    if (mobileBtn) {
      mobileBtn.addEventListener("click", () => this.toggleMobileMenu());
    }
    if (this.overlayEl) {
      this.overlayEl.addEventListener("click", () => this.closeMobileMenu());
    }

    // 3. Map Layer Selector Buttons (Blended, Rainfall, Temperature, Wind, Alerts)
    const layerBtns = document.querySelectorAll(".map-layer-selector .layer-btn:not(.alert-filter-btn)");
    layerBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        layerBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const layer = btn.getAttribute("data-layer");
        if (layer) appState.setMapLayer(layer);
      });
    });

    // 4. Auth Mode Tabs on Get Started (Sign Up / Sign In)
    const authTabs = document.querySelectorAll(".auth-tab-btn");
    authTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const mode = tab.getAttribute("data-auth");
        this.switchAuthForm(mode);
      });
    });

    // Subscribe to state updates
    appState.subscribe((event, data) => {
      if (event === "view_change") {
        this.updateActiveView(data);
      }
    });
  }

  switchAuthForm(mode) {
    const authTabs = document.querySelectorAll(".auth-tab-btn");
    authTabs.forEach(t => {
      if (t.getAttribute("data-auth") === mode) {
        t.classList.add("active");
      } else {
        t.classList.remove("active");
      }
    });

    const signUpForm = document.getElementById("signUpForm");
    const signInForm = document.getElementById("signInForm");
    if (mode === "signin") {
      if (signUpForm) signUpForm.style.display = "none";
      if (signInForm) signInForm.style.display = "block";
    } else {
      if (signUpForm) signUpForm.style.display = "block";
      if (signInForm) signInForm.style.display = "none";
    }
  }

  updateActiveView(viewId) {
    // Update sidebar navigation links
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    navLinks.forEach(link => {
      if (link.getAttribute("data-view") === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Hide all pages, show target page
    const pages = document.querySelectorAll(".page-view");
    pages.forEach(page => {
      if (page.id === `view-${viewId}`) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });

    // Trigger map resize if switching to map view
    if (viewId === "map") {
      weatherMap.invalidateSize();
    }
  }

  toggleMobileMenu() {
    if (this.sidebarEl) {
      this.sidebarEl.classList.toggle("open");
      if (this.overlayEl) this.overlayEl.classList.toggle("active");
    }
  }

  closeMobileMenu() {
    if (this.sidebarEl) this.sidebarEl.classList.remove("open");
    if (this.overlayEl) this.overlayEl.classList.remove("active");
  }
}

// Singleton instance
const navigationManager = new NavigationManager();
