// Toast Notification Component
// Listens to 'store:toast' events and renders sleek floating alerts

export function initToast() {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container-atelier";
    document.body.appendChild(container);
  }

  window.addEventListener("store:toast", (e) => {
    const { message, type = "info" } = e.detail;
    showToast(message, type, container);
  });
}

function showToast(message, type, container) {
  const toast = document.createElement("div");
  toast.className = `toast-item-atelier toast-${type}`;

  let icon = "bi-info-circle-fill";
  if (type === "success") icon = "bi-check-circle-fill text-warning";
  if (type === "warning") icon = "bi-exclamation-triangle-fill text-warning";

  toast.innerHTML = `
    <i class="bi ${icon} fs-5"></i>
    <div class="flex-grow-1">${message}</div>
    <button type="button" class="btn-close btn-close-white ms-2" style="font-size: 0.75rem;" aria-label="Close"></button>
  `;

  const closeBtn = toast.querySelector(".btn-close");
  closeBtn.addEventListener("click", () => {
    toast.remove();
  });

  container.appendChild(toast);

  // Auto remove after 3.8s
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(15px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }
  }, 3800);
}
