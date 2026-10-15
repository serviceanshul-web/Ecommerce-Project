// Multi-Step Simulated Checkout Pipeline Component
import { store } from "../store.js";
import { api } from "../api.js";

export function initCheckoutModal() {
  let modalEl = document.getElementById("checkoutModal");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.id = "checkoutModal";
    modalEl.className = "modal fade";
    modalEl.tabIndex = -1;
    modalEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(modalEl);
  }

  let currentStep = 1; // 1: Shipping, 2: Delivery, 3: Payment, 4: Confirmed
  let orderResult = null;

  const checkoutState = {
    customer: {
      fullName: "Maya Lin",
      email: "maya.lin@atelier-sample.com",
      phone: "+1 (555) 382-9901",
      address: "740 Mercer Street, Apt 4B",
      city: "New York",
      postalCode: "10012",
      country: "United States"
    },
    deliveryOption: "standard", // 'standard' or 'priority'
    payment: {
      cardNumber: "4532 •••• •••• 8821",
      exp: "08/28",
      cvv: "329",
      method: "card"
    }
  };

  const renderModal = () => {
    const summary = store.getCartSummary();
    const isPriorityDelivery = checkoutState.deliveryOption === "priority";
    const shippingFee = isPriorityDelivery ? 25 : (summary.isFreeShipping ? 0 : 15);
    const calculatedTotal = summary.subtotal - summary.discountAmount + shippingFee + summary.tax;

    modalEl.innerHTML = `
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content modal-content-atelier">
          <!-- Header -->
          <div class="modal-header border-0 pb-0">
            <div>
              <span class="brand-mark fs-5">ATELIER</span>
              <span class="text-muted small ms-2">| Encrypted 256-Bit Checkout</span>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body p-4 p-lg-5">
            ${
              currentStep === 4 && orderResult
                ? renderConfirmationHtml(orderResult)
                : `
                  <!-- Stepper Indicator -->
                  <div class="checkout-stepper-header mb-4">
                    <div class="step-indicator-node ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}">
                      <div class="step-circle">${currentStep > 1 ? '<i class="bi bi-check"></i>' : "1"}</div>
                      <div class="step-label">Shipping</div>
                    </div>
                    <div class="step-indicator-node ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}">
                      <div class="step-circle">${currentStep > 2 ? '<i class="bi bi-check"></i>' : "2"}</div>
                      <div class="step-label">Delivery</div>
                    </div>
                    <div class="step-indicator-node ${currentStep >= 3 ? "active" : ""}">
                      <div class="step-circle">3</div>
                      <div class="step-label">Payment</div>
                    </div>
                  </div>

                  <div class="row g-4 g-lg-5">
                    <!-- Left: Step Forms -->
                    <div class="col-12 col-lg-7">
                      ${
                        currentStep === 1
                          ? renderStep1Shipping(checkoutState.customer)
                          : currentStep === 2
                          ? renderStep2Delivery(checkoutState.deliveryOption, summary.isFreeShipping)
                          : renderStep3Payment(checkoutState.payment)
                      }
                    </div>

                    <!-- Right: Order Mini-Summary -->
                    <div class="col-12 col-lg-5">
                      <div class="p-4 rounded-3" style="background: var(--bg-card); border: 1px solid var(--border-subtle);">
                        <h6 class="font-editorial text-light mb-3">Order Overview (${summary.count} pieces)</h6>
                        
                        <div class="overflow-y-auto mb-3" style="max-height: 220px;">
                          ${summary.items.map(item => `
                            <div class="d-flex align-items-center gap-3 py-2 border-bottom border-secondary border-opacity-25">
                              <img src="${item.image}" alt="${item.name}" class="rounded-1" style="width: 44px; height: 56px; object-fit: cover;" />
                              <div class="flex-grow-1 small">
                                <div class="text-light fw-semibold text-truncate" style="max-width: 170px;">${item.name}</div>
                                <div class="text-muted" style="font-size: 0.72rem;">Qty: ${item.quantity} • ${item.selectedSize} / ${item.selectedColor}</div>
                              </div>
                              <div class="text-light fw-bold small">$${item.price * item.quantity}</div>
                            </div>
                          `).join("")}
                        </div>

                        <div class="small">
                          <div class="d-flex justify-content-between text-secondary mb-1">
                            <span>Subtotal</span>
                            <span class="text-light">$${summary.subtotal}</span>
                          </div>
                          ${
                            summary.discountAmount > 0
                              ? `
                                <div class="d-flex justify-content-between text-success mb-1">
                                  <span>Coupon (${summary.appliedCoupon?.code})</span>
                                  <span>-$${summary.discountAmount}</span>
                                </div>
                              `
                              : ""
                          }
                          <div class="d-flex justify-content-between text-secondary mb-1">
                            <span>Courier</span>
                            <span class="${shippingFee === 0 ? "text-success fw-bold" : "text-light"}">
                              ${shippingFee === 0 ? "FREE" : `$${shippingFee}`}
                            </span>
                          </div>
                          <div class="d-flex justify-content-between text-secondary mb-2">
                            <span>Sales Tax</span>
                            <span class="text-light">$${summary.tax}</span>
                          </div>
                          <div class="d-flex justify-content-between fs-5 fw-bold text-light pt-2 border-top border-secondary border-opacity-25">
                            <span class="font-editorial">Due Total</span>
                            <span class="text-warning">$${calculatedTotal}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `
            }
          </div>
        </div>
      </div>
    `;

    setupStepEvents(modalEl, calculatedTotal);
  };

  const renderStep1Shipping = (cust) => `
    <h5 class="font-editorial text-light mb-3">1. Contact & Shipping Address</h5>
    <form id="form-step-1" class="row g-3">
      <div class="col-md-6">
        <label class="form-label small text-secondary">Full Name</label>
        <input type="text" class="form-control bg-dark text-light border-secondary" id="cust-name" value="${cust.fullName}" required>
      </div>
      <div class="col-md-6">
        <label class="form-label small text-secondary">Email Address</label>
        <input type="email" class="form-control bg-dark text-light border-secondary" id="cust-email" value="${cust.email}" required>
      </div>
      <div class="col-12">
        <label class="form-label small text-secondary">Delivery Address</label>
        <input type="text" class="form-control bg-dark text-light border-secondary" id="cust-address" value="${cust.address}" required>
      </div>
      <div class="col-md-5">
        <label class="form-label small text-secondary">City</label>
        <input type="text" class="form-control bg-dark text-light border-secondary" id="cust-city" value="${cust.city}" required>
      </div>
      <div class="col-md-3">
        <label class="form-label small text-secondary">Postal Code</label>
        <input type="text" class="form-control bg-dark text-light border-secondary" id="cust-zip" value="${cust.postalCode}" required>
      </div>
      <div class="col-md-4">
        <label class="form-label small text-secondary">Country</label>
        <select class="form-select bg-dark text-light border-secondary" id="cust-country">
          <option selected>United States</option>
          <option>United Kingdom</option>
          <option>France</option>
          <option>Canada</option>
          <option>Japan</option>
        </select>
      </div>
      <div class="col-12 mt-4 d-flex justify-content-end">
        <button type="submit" class="btn-gold-luxury">
          Continue to Delivery <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </form>
  `;

  const renderStep2Delivery = (selected, isFree) => `
    <h5 class="font-editorial text-light mb-3">2. Select Courier Method</h5>
    <div class="d-flex flex-column gap-3 mb-4">
      <label class="p-3 rounded-3 d-flex align-items-center justify-content-between cursor-pointer" style="background: var(--bg-card); border: 2px solid ${selected === "standard" ? "var(--accent-gold)" : "var(--border-subtle)"};">
        <div class="d-flex align-items-center gap-3">
          <input type="radio" name="deliveryMethod" value="standard" class="form-check-input" ${selected === "standard" ? "checked" : ""}>
          <div>
            <div class="text-light fw-bold">Complimentary Standard Carbon-Neutral</div>
            <div class="text-muted small">Estimated 3-5 business days • Signature upon arrival</div>
          </div>
        </div>
        <div class="fw-bold ${isFree ? "text-success" : "text-light"}">${isFree ? "FREE" : "$15"}</div>
      </label>

      <label class="p-3 rounded-3 d-flex align-items-center justify-content-between cursor-pointer" style="background: var(--bg-card); border: 2px solid ${selected === "priority" ? "var(--accent-gold)" : "var(--border-subtle)"};">
        <div class="d-flex align-items-center gap-3">
          <input type="radio" name="deliveryMethod" value="priority" class="form-check-input" ${selected === "priority" ? "checked" : ""}>
          <div>
            <div class="text-light fw-bold">Priority White-Glove Courier</div>
            <div class="text-muted small">Next-day air delivery • Garment bag included</div>
          </div>
        </div>
        <div class="fw-bold text-light">$25</div>
      </label>
    </div>

    <div class="d-flex justify-content-between">
      <button type="button" class="btn btn-outline-secondary rounded-pill px-4" id="btn-back-step-1">
        <i class="bi bi-arrow-left"></i> Back
      </button>
      <button type="button" class="btn-gold-luxury" id="btn-to-step-3">
        Continue to Payment <i class="bi bi-arrow-right"></i>
      </button>
    </div>
  `;

  const renderStep3Payment = (payment) => `
    <h5 class="font-editorial text-light mb-3">3. Secure Payment Method</h5>
    
    <!-- 1-Click Fast Checkout Buttons -->
    <div class="row g-2 mb-3">
      <div class="col-6">
        <button type="button" class="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2" id="btn-apple-pay">
          <i class="bi bi-apple fs-5"></i> <strong>Apple Pay</strong>
        </button>
      </div>
      <div class="col-6">
        <button type="button" class="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2" id="btn-google-pay">
          <i class="bi bi-google fs-6"></i> <strong>Pay</strong>
        </button>
      </div>
    </div>

    <div class="text-center text-muted small my-2">── or pay with credit card ──</div>

    <form id="form-step-3" class="row g-3">
      <div class="col-12">
        <label class="form-label small text-secondary">Cardholder Name</label>
        <input type="text" class="form-control bg-dark text-light border-secondary" value="${checkoutState.customer.fullName}" required>
      </div>
      <div class="col-12">
        <label class="form-label small text-secondary">Card Number</label>
        <div class="input-group">
          <span class="input-group-text bg-dark text-secondary border-secondary"><i class="bi bi-credit-card"></i></span>
          <input type="text" class="form-control bg-dark text-light border-secondary" value="${payment.cardNumber}" required>
        </div>
      </div>
      <div class="col-6">
        <label class="form-label small text-secondary">Expiration Date</label>
        <input type="text" class="form-control bg-dark text-light border-secondary" placeholder="MM/YY" value="${payment.exp}" required>
      </div>
      <div class="col-6">
        <label class="form-label small text-secondary">Security Code (CVV)</label>
        <input type="password" maxlength="4" class="form-control bg-dark text-light border-secondary" value="${payment.cvv}" required>
      </div>

      <div class="col-12 mt-4 d-flex justify-content-between">
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" id="btn-back-step-2">
          <i class="bi bi-arrow-left"></i> Back
        </button>
        <button type="submit" class="btn-gold-luxury py-3 px-4" id="btn-submit-order">
          <i class="bi bi-lock-fill"></i> Complete Purchase
        </button>
      </div>
    </form>
  `;

  const renderConfirmationHtml = (res) => `
    <div class="text-center py-4">
      <div class="display-3 text-warning mb-3">
        <i class="bi bi-check2-circle"></i>
      </div>
      <span class="badge bg-success-subtle text-success px-3 py-2 rounded-pill mb-2">Order Confirmed</span>
      <h2 class="font-editorial text-light mb-2">Thank you, ${res.customer.fullName}.</h2>
      <p class="text-secondary max-w-md mx-auto mb-4">
        Your bespoke order has been accepted. A confirmation email with white-glove dispatch tracking has been sent to <strong>${res.customer.email}</strong>.
      </p>

      <div class="order-receipt-card text-start mx-auto p-4 mb-4" style="max-width: 580px;">
        <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
          <div>
            <span class="text-muted small">Order Number:</span>
            <div class="fw-bold text-light">${res.orderId}</div>
          </div>
          <div class="text-end">
            <span class="text-muted small">Tracking Code:</span>
            <div class="fw-bold text-warning">${res.trackingNumber}</div>
          </div>
        </div>

        <div class="mb-3">
          <span class="text-muted small">Estimated Delivery:</span>
          <div class="text-light fw-semibold">${res.estimatedDelivery}</div>
        </div>

        <div class="mb-3">
          <span class="text-muted small">Destination:</span>
          <div class="text-light">${res.customer.address}, ${res.customer.city}, ${res.customer.country}</div>
        </div>

        <div class="pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
          <span class="font-editorial text-light">Total Charged:</span>
          <span class="fs-4 fw-bold text-warning">$${res.pricing.total}</span>
        </div>
      </div>

      <button type="button" class="btn-gold-luxury px-5 py-3" id="btn-finish-checkout" data-bs-dismiss="modal">
        Continue Browsing The Atelier
      </button>
    </div>
  `;

  const setupStepEvents = (modalEl, total) => {
    // Step 1 Submit
    modalEl.querySelector("#form-step-1")?.addEventListener("submit", (e) => {
      e.preventDefault();
      checkoutState.customer.fullName = modalEl.querySelector("#cust-name")?.value;
      checkoutState.customer.email = modalEl.querySelector("#cust-email")?.value;
      checkoutState.customer.address = modalEl.querySelector("#cust-address")?.value;
      checkoutState.customer.city = modalEl.querySelector("#cust-city")?.value;
      checkoutState.customer.postalCode = modalEl.querySelector("#cust-zip")?.value;
      currentStep = 2;
      renderModal();
    });

    // Step 2 Back & Next
    modalEl.querySelector("#btn-back-step-1")?.addEventListener("click", () => {
      currentStep = 1;
      renderModal();
    });

    modalEl.querySelectorAll("input[name='deliveryMethod']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        checkoutState.deliveryOption = e.target.value;
        renderModal();
      });
    });

    modalEl.querySelector("#btn-to-step-3")?.addEventListener("click", () => {
      currentStep = 3;
      renderModal();
    });

    // Step 3 Back & Submit
    modalEl.querySelector("#btn-back-step-2")?.addEventListener("click", () => {
      currentStep = 2;
      renderModal();
    });

    const triggerOrder = async (method = "card") => {
      const submitBtn = modalEl.querySelector("#btn-submit-order");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Processing Payment...`;
      }

      const summary = store.getCartSummary();
      const payload = {
        customer: checkoutState.customer,
        deliveryOption: checkoutState.deliveryOption,
        paymentMethod: method,
        items: summary.items,
        pricing: {
          subtotal: summary.subtotal,
          discount: summary.discountAmount,
          tax: summary.tax,
          total
        }
      };

      const result = await api.submitOrder(payload);
      if (result.success) {
        orderResult = result.order;
        store.addOrder(result.order);
        currentStep = 4;
        store.clearCart();
        renderModal();
      }
    };

    modalEl.querySelector("#form-step-3")?.addEventListener("submit", (e) => {
      e.preventDefault();
      triggerOrder("card");
    });

    modalEl.querySelector("#btn-apple-pay")?.addEventListener("click", () => {
      triggerOrder("apple-pay");
    });

    modalEl.querySelector("#btn-google-pay")?.addEventListener("click", () => {
      triggerOrder("google-pay");
    });

    modalEl.querySelector("#btn-finish-checkout")?.addEventListener("click", () => {
      currentStep = 1;
      orderResult = null;
    });
  };

  renderModal();
}
