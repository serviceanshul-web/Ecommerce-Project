// User Profile Page Component
// Renders VIP Account Dashboard, Order History, Addresses, Payments, and Fit Preferences
import { store } from "../store.js";

export function renderProfilePage(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let activeTab = "orders"; // 'orders' | 'profile' | 'addresses' | 'payments'

  const render = () => {
    const profile = store.getProfile();
    const orders = store.getOrders();
    const wishlistCount = store.getWishlistCount();

    container.innerHTML = `
      <div class="container px-3 px-lg-5 py-4 py-lg-5">
        <!-- Breadcrumb / Back to catalog -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0 small">
              <li class="breadcrumb-item"><a href="#" id="profile-back-to-catalog" class="text-secondary hover-gold"><i class="bi bi-arrow-left me-1"></i> Return to Catalog</a></li>
              <li class="breadcrumb-item active text-light" aria-current="page">Client Profile</li>
            </ol>
          </nav>

          <span class="badge bg-warning text-dark px-3 py-2 rounded-pill font-editorial fw-bold small">
            <i class="bi bi-gem me-1"></i> ${profile.tier}
          </span>
        </div>

        <!-- VIP Identity Card Header -->
        <div class="profile-hero-card mb-4 p-4 p-lg-5 rounded-4 position-relative overflow-hidden" style="background: linear-gradient(135deg, rgba(20, 24, 34, 0.9), rgba(10, 11, 14, 0.95)); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-elevated);">
          <div class="row align-items-center g-4">
            <!-- Avatar & Details -->
            <div class="col-12 col-md-auto text-center text-md-start">
              <div class="position-relative d-inline-block">
                <img 
                  src="${profile.avatar}" 
                  alt="${profile.fullName}" 
                  class="rounded-circle object-fit-cover shadow-lg border border-2 border-warning"
                  style="width: 100px; height: 100px;"
                />
                <span class="position-absolute bottom-0 end-0 bg-success p-2 rounded-circle border border-2 border-dark" title="Active VIP Status"></span>
              </div>
            </div>

            <div class="col-12 col-md text-center text-md-start">
              <div class="d-flex flex-column flex-md-row align-items-center align-items-md-baseline gap-2 mb-1">
                <h2 class="font-editorial text-light m-0">${profile.fullName}</h2>
                <span class="text-warning small fw-semibold">• Private Archive Member</span>
              </div>
              <p class="text-secondary small mb-2">${profile.email} • ${profile.phone}</p>
              <div class="d-flex flex-wrap justify-content-center justify-content-md-start gap-2 text-muted" style="font-size: 0.76rem;">
                <span><i class="bi bi-calendar3 me-1"></i> Patron since ${profile.memberSince}</span>
                <span>•</span>
                <span><i class="bi bi-shield-check text-success me-1"></i> 256-Bit Identity Verified</span>
              </div>
            </div>

            <!-- Privilege Stats Counter -->
            <div class="col-12 col-lg-auto">
              <div class="d-flex justify-content-center gap-3">
                <div class="p-3 rounded-3 text-center" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); min-width: 95px;">
                  <div class="fs-4 fw-bold text-light">${orders.length}</div>
                  <div class="text-muted text-uppercase" style="font-size: 0.68rem; letter-spacing: 0.08em;">Orders</div>
                </div>

                <div class="p-3 rounded-3 text-center" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); min-width: 95px;">
                  <div class="fs-4 fw-bold text-warning">${wishlistCount}</div>
                  <div class="text-muted text-uppercase" style="font-size: 0.68rem; letter-spacing: 0.08em;">Saved</div>
                </div>

                <div class="p-3 rounded-3 text-center" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); min-width: 95px;">
                  <div class="fs-4 fw-bold text-success"><i class="bi bi-truck"></i></div>
                  <div class="text-muted text-uppercase" style="font-size: 0.68rem; letter-spacing: 0.08em;">Express</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <ul class="nav nav-pills profile-nav-pills mb-4 p-1 rounded-pill" style="background: var(--bg-card); border: 1px solid var(--border-subtle); width: fit-content; max-width: 100%; overflow-x: auto;">
          <li class="nav-item">
            <button class="nav-link rounded-pill ${activeTab === "orders" ? "active" : ""}" data-tab="orders">
              <i class="bi bi-bag-check me-1"></i> Purchases & Dispatches (${orders.length})
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link rounded-pill ${activeTab === "profile" ? "active" : ""}" data-tab="profile">
              <i class="bi bi-person-gear me-1"></i> Fit & Account Profile
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link rounded-pill ${activeTab === "addresses" ? "active" : ""}" data-tab="addresses">
              <i class="bi bi-geo-alt me-1"></i> Delivery Addresses (${profile.addresses.length})
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link rounded-pill ${activeTab === "payments" ? "active" : ""}" data-tab="payments">
              <i class="bi bi-credit-card me-1"></i> Payment Wallet (${profile.paymentMethods.length})
            </button>
          </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content">
          ${
            activeTab === "orders"
              ? renderOrdersTab(orders)
              : activeTab === "profile"
              ? renderPersonalProfileTab(profile)
              : activeTab === "addresses"
              ? renderAddressesTab(profile.addresses)
              : renderPaymentsTab(profile.paymentMethods)
          }
        </div>
      </div>
    `;

    setupEvents(container, profile, orders);
  };

  const renderOrdersTab = (orders) => {
    if (orders.length === 0) {
      return `
        <div class="text-center py-5 p-4 rounded-4" style="background: var(--bg-card); border: 1px solid var(--border-subtle);">
          <div class="text-muted display-4 mb-3"><i class="bi bi-box-seam"></i></div>
          <h4 class="font-editorial text-light">No Orders Found</h4>
          <p class="text-secondary small max-w-sm mx-auto mb-4">You have not placed any orders yet. Browse our curated architectural collection and place your first drop.</p>
          <button type="button" class="btn-gold-luxury px-4 py-2" id="tab-orders-shop-btn">
            Explore Collection
          </button>
        </div>
      `;
    }

    return `
      <div class="d-flex flex-column gap-4">
        ${orders.map(order => `
          <div class="order-card p-4 rounded-4" style="background: var(--bg-card); border: 1px solid var(--border-subtle);">
            <!-- Order Header -->
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 border-bottom border-secondary border-opacity-25">
              <div>
                <span class="text-muted small text-uppercase letter-spacing-1">Order Identifier</span>
                <h5 class="font-editorial text-light mb-0">${order.orderId}</h5>
              </div>

              <div>
                <span class="text-muted small text-uppercase letter-spacing-1">Order Date</span>
                <div class="text-light small">${new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              </div>

              <div>
                <span class="text-muted small text-uppercase letter-spacing-1">Total Investment</span>
                <div class="text-warning fw-bold">$${order.pricing?.total || 0}</div>
              </div>

              <div>
                <span class="badge ${getStatusBadge(order.status)} px-3 py-2 rounded-pill small">
                  <i class="bi ${getStatusIcon(order.status)} me-1"></i> ${order.status || "Confirmed"}
                </span>
              </div>
            </div>

            <!-- Order Tracking Alert Bar -->
            <div class="d-flex flex-wrap align-items-center justify-content-between p-3 my-3 rounded-3" style="background: rgba(255, 255, 255, 0.02); border: 1px dashed var(--border-subtle);">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-send text-warning fs-5"></i>
                <div>
                  <span class="text-muted small">Tracking Number:</span>
                  <strong class="text-light ms-1">${order.trackingNumber || "Pending Carrier Assignment"}</strong>
                </div>
              </div>
              <div class="text-secondary small">
                ${order.estimatedDelivery || "Dispatched via White-Glove Courier"}
              </div>
            </div>

            <!-- Items List -->
            <div class="row g-3 py-2">
              ${order.items.map(item => `
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="d-flex gap-3 align-items-center p-2 rounded-2" style="background: rgba(0,0,0,0.2);">
                    <img src="${item.image}" alt="${item.name}" class="rounded-2 object-fit-cover" style="width: 58px; height: 75px;" />
                    <div class="overflow-hidden small">
                      <div class="text-light fw-bold text-truncate">${item.name}</div>
                      <div class="text-muted" style="font-size: 0.74rem;">Size: ${item.selectedSize} • Color: ${item.selectedColor}</div>
                      <div class="text-secondary mt-1">Qty: ${item.quantity} × <strong class="text-light">$${item.price}</strong></div>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>

            <!-- Order Footer Meta -->
            <div class="d-flex flex-wrap justify-content-between align-items-center pt-3 mt-2 border-top border-secondary border-opacity-25 small text-muted">
              <div>
                <i class="bi bi-geo-alt me-1"></i> Shipped to: <span class="text-light">${order.customer?.address || order.customer?.city || "Primary Residence"}</span>
              </div>
              <div>
                <button type="button" class="btn btn-outline-warning btn-sm rounded-pill px-3" data-action="print-receipt" data-order-id="${order.orderId}">
                  <i class="bi bi-receipt me-1"></i> View Receipt
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  };

  const renderPersonalProfileTab = (profile) => `
    <div class="p-4 p-lg-5 rounded-4" style="background: var(--bg-card); border: 1px solid var(--border-subtle);">
      <h4 class="font-editorial text-light mb-4">Atelier Account & Tailored Fit Profile</h4>
      
      <form id="form-edit-profile" class="row g-4">
        <!-- Personal Info -->
        <div class="col-12 col-md-6">
          <label class="form-label small text-secondary">Full Legal Name</label>
          <input type="text" class="form-control bg-dark text-light border-secondary" id="prof-name" value="${profile.fullName}" required>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label small text-secondary">Email Address (Archival Notices)</label>
          <input type="email" class="form-control bg-dark text-light border-secondary" id="prof-email" value="${profile.email}" required>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label small text-secondary">Phone Number (Courier Dispatch SMS)</label>
          <input type="tel" class="form-control bg-dark text-light border-secondary" id="prof-phone" value="${profile.phone}" required>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label small text-secondary">VIP Patron Status</label>
          <input type="text" class="form-control bg-dark text-warning border-secondary fw-bold" value="${profile.tier}" disabled>
        </div>

        <div class="col-12"><hr class="border-secondary opacity-25 my-1"></div>

        <!-- Sizing & Fit Preferences -->
        <div class="col-12">
          <h5 class="font-editorial text-light mb-2"><i class="bi bi-rulers text-warning me-2"></i> Tailored Sizing Preferences</h5>
          <p class="text-secondary small mb-3">Pre-set your sizing so product recommendation filters automatically adapt to your silhouette.</p>
        </div>

        <div class="col-6 col-md-4">
          <label class="form-label small text-secondary">Tops & Outerwear Size</label>
          <select class="form-select bg-dark text-light border-secondary" id="pref-top-size">
            <option ${profile.preferences.topSize === "XS" ? "selected" : ""}>XS</option>
            <option ${profile.preferences.topSize === "S" ? "selected" : ""}>S</option>
            <option ${profile.preferences.topSize === "M" ? "selected" : ""}>M</option>
            <option ${profile.preferences.topSize === "L" ? "selected" : ""}>L</option>
            <option ${profile.preferences.topSize === "XL" ? "selected" : ""}>XL</option>
          </select>
        </div>

        <div class="col-6 col-md-4">
          <label class="form-label small text-secondary">Trousers & Bottoms Size</label>
          <select class="form-select bg-dark text-light border-secondary" id="pref-bottom-size">
            <option ${profile.preferences.bottomSize === "XS" ? "selected" : ""}>XS</option>
            <option ${profile.preferences.bottomSize === "S" ? "selected" : ""}>S</option>
            <option ${profile.preferences.bottomSize === "M" ? "selected" : ""}>M</option>
            <option ${profile.preferences.bottomSize === "L" ? "selected" : ""}>L</option>
            <option ${profile.preferences.bottomSize === "XL" ? "selected" : ""}>XL</option>
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label class="form-label small text-secondary">Shoe / Footwear Dimension</label>
          <input type="text" class="form-control bg-dark text-light border-secondary" id="pref-shoe-size" value="${profile.preferences.shoeSize || "43 EU / 10 US"}">
        </div>

        <div class="col-12"><hr class="border-secondary opacity-25 my-1"></div>

        <!-- Notification Preferences -->
        <div class="col-12">
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" id="pref-drops" ${profile.preferences.privateDrops ? "checked" : ""}>
            <label class="form-check-label text-light small" for="pref-drops">
              Notify me 24 hours prior to limited batch editorial releases
            </label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="pref-newsletter" ${profile.preferences.newsletter ? "checked" : ""}>
            <label class="form-check-label text-light small" for="pref-newsletter">
              Receive The Private Archive quarterly fashion lookbook
            </label>
          </div>
        </div>

        <div class="col-12 mt-4 text-end">
          <button type="submit" class="btn-gold-luxury px-5 py-3">
            <i class="bi bi-check2-circle"></i> Save Profile Details
          </button>
        </div>
      </form>
    </div>
  `;

  const renderAddressesTab = (addresses) => `
    <div class="p-4 p-lg-5 rounded-4" style="background: var(--bg-card); border: 1px solid var(--border-subtle);">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 class="font-editorial text-light mb-1">Saved Delivery Destinations</h4>
          <p class="text-secondary small m-0">Manage addresses for fast 1-click checkout</p>
        </div>
        <button type="button" class="btn-gold-luxury btn-sm" id="btn-show-add-address">
          <i class="bi bi-plus-lg"></i> Add New Address
        </button>
      </div>

      <!-- Add Address Inline Form (Hidden by default) -->
      <div id="add-address-form-box" class="d-none mb-4 p-4 rounded-3" style="background: rgba(0,0,0,0.3); border: 1px dashed var(--accent-gold);">
        <h5 class="font-editorial text-warning mb-3">Add New Delivery Destination</h5>
        <form id="form-new-address" class="row g-3">
          <div class="col-md-6">
            <label class="form-label small text-secondary">Address Label (e.g. Tribeca Studio, Summer House)</label>
            <input type="text" class="form-control bg-dark text-light border-secondary" id="new-addr-label" placeholder="Residence" required>
          </div>
          <div class="col-md-6">
            <label class="form-label small text-secondary">Recipient Full Name</label>
            <input type="text" class="form-control bg-dark text-light border-secondary" id="new-addr-name" placeholder="Full Name" required>
          </div>
          <div class="col-12">
            <label class="form-label small text-secondary">Street Address & Unit</label>
            <input type="text" class="form-control bg-dark text-light border-secondary" id="new-addr-street" placeholder="Street Address" required>
          </div>
          <div class="col-md-5">
            <label class="form-label small text-secondary">City</label>
            <input type="text" class="form-control bg-dark text-light border-secondary" id="new-addr-city" placeholder="City" required>
          </div>
          <div class="col-md-3">
            <label class="form-label small text-secondary">Postal Code</label>
            <input type="text" class="form-control bg-dark text-light border-secondary" id="new-addr-zip" placeholder="Zip" required>
          </div>
          <div class="col-md-4">
            <label class="form-label small text-secondary">Country</label>
            <select class="form-select bg-dark text-light border-secondary" id="new-addr-country">
              <option selected>United States</option>
              <option>United Kingdom</option>
              <option>France</option>
              <option>Canada</option>
              <option>Japan</option>
            </select>
          </div>
          <div class="col-12 d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3" id="btn-cancel-address">Cancel</button>
            <button type="submit" class="btn-gold-luxury btn-sm">Save Address</button>
          </div>
        </form>
      </div>

      <!-- Address Cards Grid -->
      <div class="row g-4">
        ${addresses.map(addr => `
          <div class="col-12 col-md-6">
            <div class="p-4 rounded-3 h-100 d-flex flex-column position-relative" style="background: rgba(255,255,255,0.02); border: 1.5px solid ${addr.isDefault ? "var(--accent-gold)" : "var(--border-subtle)"};">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="font-editorial text-light m-0">${addr.label}</h6>
                ${
                  addr.isDefault
                    ? `<span class="badge bg-warning text-dark rounded-pill px-2 py-1 small">Default Destination</span>`
                    : `<button type="button" class="btn btn-link btn-sm text-secondary p-0 text-decoration-none hover-gold" data-action="set-default-addr" data-addr-id="${addr.id}">Make Default</button>`
                }
              </div>

              <div class="text-light fw-bold small mb-1">${addr.fullName}</div>
              <p class="text-secondary small mb-3 flex-grow-1">
                ${addr.address}<br>
                ${addr.city}, ${addr.postalCode}<br>
                ${addr.country}
              </p>

              <div class="d-flex justify-content-end gap-2 pt-2 border-top border-secondary border-opacity-25">
                <button type="button" class="btn btn-outline-danger btn-sm rounded-pill px-3" data-action="delete-addr" data-addr-id="${addr.id}">
                  <i class="bi bi-trash3"></i> Remove
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  const renderPaymentsTab = (paymentMethods) => `
    <div class="p-4 p-lg-5 rounded-4" style="background: var(--bg-card); border: 1px solid var(--border-subtle);">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 class="font-editorial text-light mb-1">Encrypted Payment Wallet</h4>
          <p class="text-secondary small m-0">Tokenized card storage for secure instant checkout</p>
        </div>
        <button type="button" class="btn-gold-luxury btn-sm" id="btn-show-add-card">
          <i class="bi bi-plus-lg"></i> Add Payment Card
        </button>
      </div>

      <!-- Add Card Form Box (Hidden by default) -->
      <div id="add-card-form-box" class="d-none mb-4 p-4 rounded-3" style="background: rgba(0,0,0,0.3); border: 1px dashed var(--accent-gold);">
        <h5 class="font-editorial text-warning mb-3">Add Encrypted Payment Method</h5>
        <form id="form-new-card" class="row g-3">
          <div class="col-md-6">
            <label class="form-label small text-secondary">Cardholder Name</label>
            <input type="text" class="form-control bg-dark text-light border-secondary" id="new-card-name" placeholder="Julian Vance" required>
          </div>
          <div class="col-md-6">
            <label class="form-label small text-secondary">Card Type</label>
            <select class="form-select bg-dark text-light border-secondary" id="new-card-type">
              <option selected>Visa</option>
              <option>Mastercard</option>
              <option>American Express</option>
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small text-secondary">Card Number</label>
            <input type="text" class="form-control bg-dark text-light border-secondary" id="new-card-num" placeholder="•••• •••• •••• 1234" maxlength="19" required>
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label small text-secondary">Expiration</label>
            <input type="text" class="form-control bg-dark text-light border-secondary" id="new-card-exp" placeholder="MM/YY" required>
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label small text-secondary">CVV</label>
            <input type="password" class="form-control bg-dark text-light border-secondary" maxlength="4" placeholder="•••" required>
          </div>
          <div class="col-12 d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3" id="btn-cancel-card">Cancel</button>
            <button type="submit" class="btn-gold-luxury btn-sm">Save Card</button>
          </div>
        </form>
      </div>

      <!-- Cards Grid -->
      <div class="row g-4">
        ${paymentMethods.map(pm => `
          <div class="col-12 col-md-6">
            <!-- Luxury Credit Card Graphic View -->
            <div class="p-4 rounded-4 position-relative overflow-hidden mb-2" style="background: linear-gradient(135deg, #1c1f28, #0e1015); border: 1.5px solid ${pm.isDefault ? "var(--accent-gold)" : "var(--border-subtle)"}; box-shadow: var(--shadow-subtle);">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <i class="bi bi-cpu fs-3 text-warning"></i>
                <span class="font-editorial fw-bold fs-5 text-light">${pm.cardType}</span>
              </div>

              <div class="fs-4 text-light font-monospace letter-spacing-2 mb-3">
                •••• •••• •••• ${pm.last4}
              </div>

              <div class="d-flex justify-content-between align-items-end">
                <div>
                  <div class="text-muted text-uppercase" style="font-size: 0.65rem;">Cardholder</div>
                  <div class="text-light small fw-bold">${pm.holder}</div>
                </div>
                <div>
                  <div class="text-muted text-uppercase" style="font-size: 0.65rem;">Expires</div>
                  <div class="text-light small fw-bold">${pm.exp}</div>
                </div>
              </div>
            </div>

            <!-- Card Controls -->
            <div class="d-flex justify-content-between align-items-center px-2 small">
              ${
                pm.isDefault
                  ? `<span class="badge bg-success-subtle text-success">Default Payment Method</span>`
                  : `<button type="button" class="btn btn-link btn-sm text-secondary p-0 text-decoration-none hover-gold" data-action="set-default-card" data-card-id="${pm.id}">Make Default</button>`
              }
              <button type="button" class="btn btn-link btn-sm text-danger p-0 text-decoration-none" data-action="delete-card" data-card-id="${pm.id}">
                Remove
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  const setupEvents = (container, profile, orders) => {
    // Back to catalog
    container.querySelector("#profile-back-to-catalog")?.addEventListener("click", (e) => {
      e.preventDefault();
      store.setView("catalog");
    });

    container.querySelector("#tab-orders-shop-btn")?.addEventListener("click", () => {
      store.setView("catalog");
    });

    // Tab buttons
    container.querySelectorAll(".profile-nav-pills .nav-link").forEach(btn => {
      btn.addEventListener("click", () => {
        activeTab = btn.getAttribute("data-tab");
        render();
      });
    });

    // Form edit profile submit
    container.querySelector("#form-edit-profile")?.addEventListener("submit", (e) => {
      e.preventDefault();
      store.updateProfile({
        fullName: container.querySelector("#prof-name")?.value,
        email: container.querySelector("#prof-email")?.value,
        phone: container.querySelector("#prof-phone")?.value,
        preferences: {
          topSize: container.querySelector("#pref-top-size")?.value,
          bottomSize: container.querySelector("#pref-bottom-size")?.value,
          shoeSize: container.querySelector("#pref-shoe-size")?.value,
          privateDrops: container.querySelector("#pref-drops")?.checked,
          newsletter: container.querySelector("#pref-newsletter")?.checked
        }
      });
      render();
    });

    // Address toggles and forms
    const addrFormBox = container.querySelector("#add-address-form-box");
    container.querySelector("#btn-show-add-address")?.addEventListener("click", () => {
      addrFormBox?.classList.remove("d-none");
    });
    container.querySelector("#btn-cancel-address")?.addEventListener("click", () => {
      addrFormBox?.classList.add("d-none");
    });
    container.querySelector("#form-new-address")?.addEventListener("submit", (e) => {
      e.preventDefault();
      store.addAddress({
        label: container.querySelector("#new-addr-label")?.value,
        fullName: container.querySelector("#new-addr-name")?.value,
        address: container.querySelector("#new-addr-street")?.value,
        city: container.querySelector("#new-addr-city")?.value,
        postalCode: container.querySelector("#new-addr-zip")?.value,
        country: container.querySelector("#new-addr-country")?.value
      });
      render();
    });

    // Set Default / Delete Address
    container.querySelectorAll("[data-action='set-default-addr']").forEach(btn => {
      btn.addEventListener("click", () => {
        store.setDefaultAddress(btn.getAttribute("data-addr-id"));
        render();
      });
    });
    container.querySelectorAll("[data-action='delete-addr']").forEach(btn => {
      btn.addEventListener("click", () => {
        store.deleteAddress(btn.getAttribute("data-addr-id"));
        render();
      });
    });

    // Payment Cards toggles and forms
    const cardFormBox = container.querySelector("#add-card-form-box");
    container.querySelector("#btn-show-add-card")?.addEventListener("click", () => {
      cardFormBox?.classList.remove("d-none");
    });
    container.querySelector("#btn-cancel-card")?.addEventListener("click", () => {
      cardFormBox?.classList.add("d-none");
    });
    container.querySelector("#form-new-card")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawNum = container.querySelector("#new-card-num")?.value || "";
      const last4 = rawNum.slice(-4) || "8888";
      store.addPaymentMethod({
        holder: container.querySelector("#new-card-name")?.value,
        cardType: container.querySelector("#new-card-type")?.value,
        last4,
        exp: container.querySelector("#new-card-exp")?.value
      });
      render();
    });

    // Set Default / Delete Payment Method
    container.querySelectorAll("[data-action='set-default-card']").forEach(btn => {
      btn.addEventListener("click", () => {
        store.setDefaultPaymentMethod(btn.getAttribute("data-card-id"));
        render();
      });
    });
    container.querySelectorAll("[data-action='delete-card']").forEach(btn => {
      btn.addEventListener("click", () => {
        store.deletePaymentMethod(btn.getAttribute("data-card-id"));
        render();
      });
    });

    // Print Receipt Alert
    container.querySelectorAll("[data-action='print-receipt']").forEach(btn => {
      btn.addEventListener("click", () => {
        const orderId = btn.getAttribute("data-order-id");
        store.emit("store:toast", {
          message: `Official Tax Invoice & Receipt generated for ${orderId}.`,
          type: "info"
        });
      });
    });
  };

  render();
  window.addEventListener("store:profile-updated", render);
  window.addEventListener("store:orders-updated", render);
}

function getStatusBadge(status) {
  switch (status?.toLowerCase()) {
    case "delivered": return "bg-success text-white";
    case "dispatched":
    case "in transit": return "bg-info text-dark";
    case "confirmed":
    case "processing": return "bg-warning text-dark";
    default: return "bg-secondary text-white";
  }
}

function getStatusIcon(status) {
  switch (status?.toLowerCase()) {
    case "delivered": return "bi-check2-all";
    case "dispatched":
    case "in transit": return "bi-truck";
    default: return "bi-hourglass-split";
  }
}
