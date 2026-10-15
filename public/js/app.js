// Main Application Bootstrap & Decoupled Architecture Controller
import { store } from "./store.js";
import { initToast } from "./components/toast.js";
import { renderNavbar } from "./components/navbar.js";
import { renderHero } from "./components/hero.js";
import { renderFilters, renderSidebarFilters } from "./components/filters.js";
import { renderProductGrid } from "./components/productGrid.js";
import { initProductModal } from "./components/productModal.js";
import { initSizeGuideModal } from "./components/sizeGuideModal.js";
import { initCartDrawer } from "./components/cartDrawer.js";
import { initWishlistModal } from "./components/wishlistModal.js";
import { initCheckoutModal } from "./components/checkoutModal.js";
import { initLookbookModal } from "./components/lookbookModal.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Global UI Services
  initToast();

  // 2. Render Layout Components
  renderNavbar("navbar-root");
  renderHero("hero-root");
  renderFilters("filters-root");
  renderSidebarFilters("sidebar-filters-root");
  renderSidebarFilters("mobile-sidebar-filters-root");

  // 3. Render Catalog Grid
  renderProductGrid("product-grid-root");

  // 4. Initialize Modals & Drawers
  initProductModal();
  initSizeGuideModal();
  initCartDrawer();
  initWishlistModal();
  initCheckoutModal();
  initLookbookModal();

  // 5. Wire Store Reactive Events
  window.addEventListener("store:filter-updated", () => {
    renderProductGrid("product-grid-root");
  });

  // Welcome Toast
  setTimeout(() => {
    store.emit("store:toast", {
      message: "Welcome to ATELIER. Use code WELCOME10 for 10% off your curated drop.",
      type: "info"
    });
  }, 1200);
});
