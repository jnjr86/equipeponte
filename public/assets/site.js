const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("is-open");
}
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
matchMedia("(min-width: 1201px)").addEventListener("change", closeMenu);
document.querySelectorAll("[data-copy]").forEach((button) =>
  button.addEventListener("click", async () => {
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      status.textContent = `Cor ${button.dataset.copy} copiada.`;
    } catch {
      status.textContent = `Selecione e copie o código ${button.dataset.copy}.`;
    }
  }),
);

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const endpoint = window.PONTE_CONFIG?.contactEndpoint || "";
  const submit = document.querySelector("#contact-submit");
  const status = document.querySelector("#form-status");
  if (endpoint) {
    submit.querySelector("span").textContent = "Enviar mensagem";
    document.querySelector("#delivery-note").textContent =
      "Sua mensagem será encaminhada à Equipe Ponte. Seus dados de contato serão usados para responder à sua solicitação.";
  }
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = Object.fromEntries(new FormData(contactForm));
    status.textContent = "";
    status.removeAttribute("data-state");
    if (data.company) return;
    if (!endpoint) {
      const body = `Nome: ${data.name}\nE-mail: ${data.email}\n\n${data.message}`;
      window.location.href = `mailto:equipeponte@gmail.com?subject=${encodeURIComponent("Contato pelo site — " + data.name)}&body=${encodeURIComponent(body)}`;
      status.textContent =
        "Conclua o envio no seu aplicativo de e-mail. Se ele não abrir, escreva diretamente para equipeponte@gmail.com.";
      return;
    }
    submit.disabled = true;
    contactForm.setAttribute("aria-busy", "true");
    submit.querySelector("span").textContent = "Enviando…";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("Delivery unavailable");
      status.textContent =
        "Mensagem enviada. Obrigado por entrar em contato com a Equipe Ponte.";
      status.dataset.state = "success";
      contactForm.reset();
    } catch {
      status.textContent =
        "Não foi possível enviar agora. Sua mensagem continua preenchida. Tente novamente ou escreva para equipeponte@gmail.com.";
      status.dataset.state = "error";
    } finally {
      submit.disabled = false;
      contactForm.removeAttribute("aria-busy");
      submit.querySelector("span").textContent = "Enviar mensagem";
    }
  });
}
