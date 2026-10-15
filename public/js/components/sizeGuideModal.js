// Size & Fit Guide Modal Component with Metric/Imperial Toggle
export function initSizeGuideModal() {
  let modalEl = document.getElementById("sizeGuideModal");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.id = "sizeGuideModal";
    modalEl.className = "modal fade";
    modalEl.tabIndex = -1;
    modalEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(modalEl);
  }

  let unit = "cm"; // 'cm' or 'in'

  const SIZING_DATA = {
    cm: [
      { size: "XS", chest: "88 - 92", waist: "72 - 76", hip: "88 - 92", length: "70" },
      { size: "S", chest: "93 - 97", waist: "77 - 81", hip: "93 - 97", length: "72" },
      { size: "M", chest: "98 - 103", waist: "82 - 87", hip: "98 - 103", length: "74" },
      { size: "L", chest: "104 - 109", waist: "88 - 93", hip: "104 - 109", length: "76" },
      { size: "XL", chest: "110 - 116", waist: "94 - 100", hip: "110 - 116", length: "78" }
    ],
    in: [
      { size: "XS", chest: "34.6 - 36.2", waist: "28.3 - 29.9", hip: "34.6 - 36.2", length: "27.5" },
      { size: "S", chest: "36.6 - 38.2", waist: "30.3 - 31.9", hip: "36.6 - 38.2", length: "28.3" },
      { size: "M", chest: "38.6 - 40.5", waist: "32.3 - 34.2", hip: "38.6 - 40.5", length: "29.1" },
      { size: "L", chest: "40.9 - 42.9", waist: "34.6 - 36.6", hip: "40.9 - 42.9", length: "29.9" },
      { size: "XL", chest: "43.3 - 45.7", waist: "37.0 - 39.4", hip: "43.3 - 45.7", length: "30.7" }
    ]
  };

  const renderContent = () => {
    modalEl.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content modal-content-atelier">
          <div class="modal-header border-0 pb-0">
            <div>
              <h4 class="font-editorial text-light mb-1">Tailored Size & Fit Guide</h4>
              <p class="text-secondary small m-0">Precise garment dimensions measured flat</p>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body p-4 p-lg-5">
            <!-- Unit Switcher -->
            <div class="d-flex justify-content-end mb-3">
              <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn ${unit === "cm" ? "btn-warning text-dark fw-bold" : "btn-outline-secondary"}" id="unit-btn-cm">
                  Metric (CM)
                </button>
                <button type="button" class="btn ${unit === "in" ? "btn-warning text-dark fw-bold" : "btn-outline-secondary"}" id="unit-btn-in">
                  Imperial (IN)
                </button>
              </div>
            </div>

            <!-- Sizing Table -->
            <div class="table-responsive">
              <table class="table table-sizing align-middle text-center">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (${unit.toUpperCase()})</th>
                    <th>Waist (${unit.toUpperCase()})</th>
                    <th>Hip (${unit.toUpperCase()})</th>
                    <th>Garment Length (${unit.toUpperCase()})</th>
                  </tr>
                </thead>
                <tbody>
                  ${SIZING_DATA[unit].map(row => `
                    <tr>
                      <td class="fw-bold text-light">${row.size}</td>
                      <td>${row.chest}</td>
                      <td>${row.waist}</td>
                      <td>${row.hip}</td>
                      <td>${row.length}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>

            <!-- How To Measure Guide -->
            <div class="p-3 rounded-3 mt-4" style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle);">
              <h6 class="text-warning font-editorial mb-2"><i class="bi bi-info-circle me-1"></i> Measuring Tips</h6>
              <div class="row g-3 small text-secondary">
                <div class="col-md-6">
                  <strong>1. Chest:</strong> Wrap the tape around the fullest part of your chest, keeping tape horizontal.
                </div>
                <div class="col-md-6">
                  <strong>2. Waist:</strong> Measure around your natural waistline, where your trousers typically sit.
                </div>
                <div class="col-md-6">
                  <strong>3. Hips:</strong> Stand with feet together and measure around the widest point of your hips.
                </div>
                <div class="col-md-6">
                  <strong>Model Reference:</strong> Model in lookbook is 6'1" (185cm), 165 lbs (75kg), wearing size <strong>Medium</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modalEl.querySelector("#unit-btn-cm")?.addEventListener("click", () => {
      unit = "cm";
      renderContent();
    });
    modalEl.querySelector("#unit-btn-in")?.addEventListener("click", () => {
      unit = "in";
      renderContent();
    });
  };

  renderContent();
}
