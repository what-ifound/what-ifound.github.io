const imageCards = document.querySelectorAll(".image-card");
const yoGlyphs = document.querySelectorAll(".yo-glyph");
const ghostCursor = document.querySelector(".ghost-cursor");
const themes = ["theme-beige", "theme-yellow", "theme-green"];
let currentThemeIndex = 0;

const applyTheme = () => {
  document.body.classList.remove("theme-yellow", "theme-green");

  if (themes[currentThemeIndex] !== "theme-beige") {
    document.body.classList.add(themes[currentThemeIndex]);
  }
};

document.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  applyTheme();
});

imageCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.stopPropagation();

    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme();

    const isExpanded = card.classList.contains("is-expanded");

    imageCards.forEach((item) => {
      item.classList.remove("is-expanded");
      item.setAttribute("aria-pressed", "false");
      item.style.width = "";

      const itemImage = item.querySelector("img");
      if (itemImage) {
        itemImage.style.width = "";
      }
    });

    if (!isExpanded) {
      const image = card.querySelector("img");

      card.classList.add("is-expanded");
      card.setAttribute("aria-pressed", "true");

      if (image && image.complete) {
        const expandedWidth = Math.min(image.naturalWidth, window.innerWidth - 48);
        card.style.width = `${expandedWidth}px`;
        image.style.width = `${expandedWidth}px`;
      }
    }
  });
});

yoGlyphs.forEach((glyph) => {
  glyph.addEventListener("mouseenter", () => {
    ghostCursor.classList.add("is-visible");
  });

  glyph.addEventListener("mouseleave", () => {
    ghostCursor.classList.remove("is-visible");
  });

  glyph.addEventListener("mousemove", (event) => {
    ghostCursor.style.transform = `translate3d(${event.clientX + 14}px, ${event.clientY - 8}px, 0) scale(1)`;
  });
});
