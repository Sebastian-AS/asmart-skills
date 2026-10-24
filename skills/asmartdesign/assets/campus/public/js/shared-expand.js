(function () {
  const cards = [...document.querySelectorAll("[data-share]")];

  function setOpen(card, open) {
    card.classList.toggle("is-open", open);
    const hit = card.querySelector(".share__hit");
    if (hit) hit.setAttribute("aria-expanded", open ? "true" : "false");
  }

  cards.forEach((card) => {
    const hit = card.querySelector(".share__hit");
    if (!hit) return;
    hit.addEventListener("click", () => {
      const open = !card.classList.contains("is-open");
      cards.forEach((other) => setOpen(other, other === card && open));
    });
    const close = document.createElement("button");
    close.type = "button";
    close.className = "share__close";
    close.setAttribute("aria-label", "Cerrar");
    close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>';
    close.addEventListener("click", () => setOpen(card, false));
    card.appendChild(close);
  });
})();
