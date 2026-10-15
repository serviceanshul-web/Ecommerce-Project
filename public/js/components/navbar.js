// Luxury Sticky Header & Navigation Component
import { store } from "../store.js";

export function renderNavbar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <nav class="navbar navbar-expand-lg atelier-navbar py-2 py-lg-3" aria-label="Main Navigation">
      <div class="container-fluid px-3 px-lg-5">
        <!-- Brand / Logo -->
        <a class="navbar-brand d-flex flex-column" href="#" id="brand-home-link">
          <span class="brand-mark">ATELIER</span>
          <span class="brand-subtitle">Haute Prêt-à-Porter</span>
        </a>

        <!-- Mobile Toggles Container -->
        <div class="d-flex align-items-center gap-2 d-lg-none ms-auto me-2">
          <!-- Wishlist Mobile -->
          <button class="btn-icon-action" id="btn-wishlist-mobile" aria-label="Wishlist">
            <i class="bi bi-heart"></i>
            <span class="badge-counter d-none" id="wishlist-badge-mobile">0</span>
          </button>

          <!-- Cart Mobile -->
          <button class="btn-icon-action" id="btn-cart-mobile" aria-label="Shopping Bag">
            <i class="bi bi-bag"></i>
            <span class="badge-counter" id="cart-badge-mobile">0</span>
          </button>
        </div>

        <button class="navbar-toggler border-0 p-1" type="button" data-bs-toggle="collapse" data-bs-target="#atelierNavMenu" aria-controls="atelierNavMenu" aria-expanded="false" aria-label="Toggle navigation">
          <i class="bi bi-list fs-2 text-light"></i>
        </button>

        <!-- Collapsible Navigation -->
        <div class="collapse navbar-collapse" id="atelierNavMenu">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li class="nav-item">
              <a class="nav-link-custom active" href="#" data-category="All">All Pieces</a>
            </li>
            <li class="nav-item">
              <a class="nav-link-custom" href="#" data-category="Outerwear">Outerwear</a>
            </li>
            <li class="nav-item">
              <a class="nav-link-custom" href="#" data-category="Knitwear">Knitwear</a>
            </li>
            <li class="nav-item">
              <a class="nav-link-custom" href="#" data-category="Tops">Tops</a>
            </li>
            <li class="nav-item">
              <a class="nav-link-custom" href="#" data-category="Bottoms">Bottoms</a>
            </li>
            <li class="nav-item">
              <a class="nav-link-custom" href="#" data-category="Accessories">Accessories</a>
            </li>
          </ul>

          <!-- Right Action Center -->
          <div class="d-flex align-items-center gap-2 gap-lg-3 mt-3 mt-lg-0">
            <!-- Search Input -->
            <div class="search-wrapper">
              <i class="bi bi-search search-icon-pos"></i>
              <input 
                type="text" 
                class="search-input-field" 
                id="global-search-input" 
                placeholder="Search cashmere, silk, coat..." 
                aria-label="Search Catalog"
              />
            </div>

            <!-- Theme Toggle -->
            <button class="btn-icon-action" id="btn-theme-toggle" title="Toggle Theme" aria-label="Toggle Dark/Light Mode">
              <i class="bi bi-moon-stars" id="theme-icon"></i>
            </button>

            <!-- Wishlist Button (Desktop) -->
            <button class="btn-icon-action d-none d-lg-inline-flex" id="btn-wishlist-desktop" title="Wishlist" aria-label="Wishlist">
              <i class="bi bi-heart"></i>
              <span class="badge-counter d-none" id="wishlist-badge-desktop">0</span>
            </button>

            <!-- Shopping Bag Button (Desktop) -->
            <button class="btn-icon-action d-none d-lg-inline-flex" id="btn-cart-desktop" title="Shopping Bag" aria-label="Shopping Bag">
              <i class="bi bi-bag"></i>
              <span class="badge-counter" id="cart-badge-desktop">0</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;

  setupNavbarListeners();
  updateBadges();
}

function setupNavbarListeners() {
  // Category links click
  const navLinks = document.querySelectorAll(".nav-link-custom");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const category = link.getAttribute("data-category");
      store.setFilter("category", category);

      // Scroll to catalog grid smoothly
      const catalogEl = document.getElementById("catalog-section");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Debounced Search listener
  const searchInput = document.getElementById("global-search-input");
  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        store.setFilter("searchQuery", e.target.value);
      }, 250);
    });
  }

  // Cart button triggers
  const openCart = () => {
    const drawerEl = document.getElementById("cartDrawer");
    if (drawerEl && window.bootstrap) {
      const bsDrawer = bootstrap.Offcanvas.getOrCreateInstance(drawerEl);
      bsDrawer.show();
    }
  };

  document.getElementById("btn-cart-desktop")?.addEventListener("click", openCart);
  document.getElementById("btn-cart-mobile")?.addEventListener("click", openCart);

  // Wishlist button triggers
  const openWishlist = () => {
    const modalEl = document.getElementById("wishlistModal");
    if (modalEl && window.bootstrap) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  };

  document.getElementById("btn-wishlist-desktop")?.addEventListener("click", openWishlist);
  document.getElementById("btn-wishlist-mobile")?.addEventListener("click", openWishlist);

  // Theme switch
  const themeBtn = document.getElementById("btn-theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const syncThemeIcon = (theme) => {
    if (!themeIcon) return;
    if (theme === "light") {
      themeIcon.className = "bi bi-sun-fill text-warning";
    } else {
      themeIcon.className = "bi bi-moon-stars";
    }
  };

  syncThemeIcon(store.theme);

  themeBtn?.addEventListener("click", () => {
    store.toggleTheme();
    syncThemeIcon(store.theme);
  });

  // Store update listeners
  window.addEventListener("store:cart-updated", updateBadges);
  window.addEventListener("store:wishlist-updated", updateBadges);
}

function updateBadges() {
  const cartSummary = store.getCartSummary();
  const cartCount = cartSummary.count;
  const wishlistCount = store.getWishlistCount();

  const cartD = document.getElementById("cart-badge-desktop");
  const cartM = document.getElementById("cart-badge-mobile");
  if (cartD) cartD.textContent = cartCount;
  if (cartM) cartM.textContent = cartCount;

  const wishD = document.getElementById("wishlist-badge-desktop");
  const wishM = document.getElementById("wishlist-badge-mobile");

  if (wishD) {
    wishD.textContent = wishlistCount;
    wishD.classList.toggle("d-none", wishlistCount === 0);
  }
  if (wishM) {
    wishM.textContent = wishlistCount;
    wishM.classList.toggle("d-none", wishlistCount === 0);
  }
}
