document.documentElement.classList.add("js");

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  siteNav?.classList.toggle("open", !open);
});

document.querySelectorAll(".site-nav a").forEach((link) => link.addEventListener("click", () => {
  navToggle?.setAttribute("aria-expanded", "false");
  siteNav?.classList.remove("open");
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -40px" });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll("[data-package]").forEach((link) => {
  link.addEventListener("click", () => {
    const input = document.querySelector('input[name="preferred_package"]');
    if (input) input.value = link.dataset.package || "";
  });
});

document.querySelectorAll("[data-async-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector(".form-status");
    if (!button || !status) return;
    button.disabled = true;
    const original = button.innerHTML;
    button.textContent = "Sending your product…";
    status.className = "form-status";
    status.textContent = "";
    try {
      const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      const data = await response.json();
      status.textContent = data.message || (response.ok ? "Request received." : "Please check the form.");
      status.classList.add(response.ok ? "success" : "error");
      if (response.ok) {
        form.reset();
        button.textContent = "Review requested ✓";
        window.turnstile?.reset?.();
      } else {
        button.innerHTML = original;
      }
    } catch {
      status.textContent = "The request could not be sent. Check your connection and try again.";
      status.classList.add("error");
      button.innerHTML = original;
    } finally {
      button.disabled = false;
    }
  });
});

window.onTurnstileSuccess = (token) => {
  document.querySelectorAll('input[name="turnstile_token"]').forEach((input) => { input.value = token; });
};

const modal = document.querySelector("#review-modal");
let modalShown = false;
function showReviewModal() {
  if (!modal || modalShown || sessionStorage.getItem("review-modal-seen") || document.querySelector(".admin-body")) return;
  modalShown = true;
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add("open"));
  modal.querySelector(".modal-close")?.focus();
}
function closeReviewModal() {
  if (!modal) return;
  modal.classList.remove("open");
  sessionStorage.setItem("review-modal-seen", "1");
  setTimeout(() => { modal.hidden = true; }, 220);
}
modal?.querySelectorAll("[data-close-modal]").forEach((element) => element.addEventListener("click", closeReviewModal));
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal?.classList.contains("open")) closeReviewModal(); });
setTimeout(showReviewModal, 18000);
function checkReviewScroll() {
  if (window.scrollY > document.documentElement.scrollHeight * 0.45) {
    showReviewModal();
    window.removeEventListener("scroll", checkReviewScroll);
  }
}
window.addEventListener("scroll", checkReviewScroll, { passive: true });

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copy);
    if (!target) return;
    await navigator.clipboard.writeText(target.textContent || "");
    const original = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => { button.textContent = original; }, 1600);
  });
});

const slugForm = document.querySelector("[data-slug-form]");
if (slugForm) {
  const nameInput = slugForm.querySelector('input[name="name"]');
  const slugInput = slugForm.querySelector('input[name="slug"]');
  let slugEdited = false;
  slugInput?.addEventListener("input", () => { slugEdited = true; });
  nameInput?.addEventListener("input", () => {
    if (slugEdited || !slugInput) return;
    slugInput.value = nameInput.value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  });
}
