// High-Fashion Editorial Hero & Merchandising Strip
export function renderHero(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <!-- Main Hero Banner -->
    <header class="hero-editorial">
      <div class="container px-3 px-lg-5 py-5">
        <div class="row align-items-center">
          <div class="col-lg-8 col-xl-7">
            <span class="hero-badge-tag">
              <i class="bi bi-stars"></i> Limited Run • Fall/Winter Edition
            </span>
            <h1 class="hero-headline">
              SARTORIAL PURITY IN MOTION.
            </h1>
            <p class="hero-description">
              Engineered with sculptural silhouettes, double-faced virgin wools, and Mongolian cashmere. Designed to outlast seasonal trends and elevate everyday presence.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <a href="#catalog-section" class="btn-gold-luxury" id="btn-hero-explore">
                Explore The Drop <i class="bi bi-arrow-down-right"></i>
              </a>
              <button class="btn-outline-luxury" id="btn-hero-lookbook" data-bs-toggle="modal" data-bs-target="#lookbookModal">
                View Lookbook
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Brand Value Propositions Strip -->
    <section class="features-strip" aria-label="Brand Guarantees">
      <div class="container px-3 px-lg-5">
        <div class="row g-4 justify-content-between">
          <div class="col-6 col-md-3">
            <div class="feature-pill">
              <div class="feature-pill-icon"><i class="bi bi-truck"></i></div>
              <div>
                <h6 class="feature-pill-title">Complimentary Express</h6>
                <p class="feature-pill-desc">Free global delivery over $250</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="feature-pill">
              <div class="feature-pill-icon"><i class="bi bi-patch-check"></i></div>
              <div>
                <h6 class="feature-pill-title">Artisan Fabrics</h6>
                <p class="feature-pill-desc">100% GOTS & Virgin Certified</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="feature-pill">
              <div class="feature-pill-icon"><i class="bi bi-arrow-repeat"></i></div>
              <div>
                <h6 class="feature-pill-title">Bespoke Returns</h6>
                <p class="feature-pill-desc">Prepaid doorstep exchange in 30 days</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="feature-pill">
              <div class="feature-pill-icon"><i class="bi bi-shield-lock"></i></div>
              <div>
                <h6 class="feature-pill-title">Encrypted Checkout</h6>
                <p class="feature-pill-desc">Biometric & card tokenization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById("btn-hero-explore")?.addEventListener("click", (e) => {
    e.preventDefault();
    const catalogEl = document.getElementById("catalog-section");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  });
}
