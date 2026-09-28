const workshops = [
  {
    name: "Pintura",
    description:
      "A pintura abre espaço para que cada participante encontre sua própria expressão em cores, linhas e formas. O trabalho não parte de um modelo a ser reproduzido: acolhe o que cada um traz, sem exigir que toda criação seja traduzida em palavras.",
  },
  {
    name: "Música e canto",
    description:
      "A música permeia as oficinas da Ponte. O encontro com os sons, o ritmo e o canto convida a experimentar outras formas de presença e de relação com o corpo, com o tempo e com os outros.",
  },
  {
    name: "Dança",
    description:
      "A dança não se orienta por uma coreografia a ser cumprida. A proposta é que cada participante possa se deixar tocar pela música e experimentar movimentos próprios, respeitando suas possibilidades.",
  },
  {
    name: "Teatro",
    description:
      "Os personagens e as cenas são construídos sem um roteiro prévio. O teatro oferece um espaço para experimentar outras posições, se fazer ver e escutar, e trazer algo de si pela voz de um personagem.",
  },
  {
    name: "Culinária",
    description:
      "Preparar o lanche abre espaço para conversas, escolhas e colaboração. Entre ingredientes, gostos e diferentes tempos, a cozinha se torna mais um lugar de encontro e de trabalho coletivo.",
  },
];
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
matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);
const track = document.querySelector(".workshop-track");
const slideButtons = document.querySelectorAll("[data-slide]");
function updateCarousel() {
  if (!track) return;
  slideButtons.forEach((button) => {
    button.disabled =
      Number(button.dataset.slide) < 0
        ? track.scrollLeft < 4
        : track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  });
}
slideButtons.forEach((button) =>
  button.addEventListener("click", () => {
    const card = track.querySelector(".workshop-card");
    track.scrollBy({
      left:
        (card.getBoundingClientRect().width + 24) *
        Number(button.dataset.slide),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }),
);
track?.addEventListener("scroll", updateCarousel, { passive: true });
window.addEventListener("resize", updateCarousel);
updateCarousel();
const dialog = document.querySelector("#workshop-dialog");
document.querySelectorAll("[data-workshop]").forEach((button) =>
  button.addEventListener("click", () => {
    const item = workshops[Number(button.dataset.workshop)];
    document.querySelector("#dialog-title").textContent = item.name;
    document.querySelector("#dialog-description").textContent =
      item.description;
    dialog.showModal();
  }),
);
document
  .querySelector(".dialog-close")
  ?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
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
