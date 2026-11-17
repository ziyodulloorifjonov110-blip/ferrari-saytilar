
// ===============================
// HEADER AND MOBILE MENU
// ===============================

const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);

  document.getElementById("topBtn").style.display =
    window.scrollY > 400 ? "block" : "none";
});

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");

  menuBtn.innerHTML = nav.classList.contains("open")
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

// ===============================
// BACK TO TOP
// ===============================

document.getElementById("topBtn").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// ===============================
// CAROUSEL
// ===============================

const track = document.getElementById("carouselTrack");
const cards = [...document.querySelectorAll(".car-card")];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("carouselDots");

let currentIndex = 0;
let startX = 0;
let moveX = 0;

function getVisibleCards() {
  if (window.innerWidth <= 700) return 1;
  if (window.innerWidth <= 1000) return 2;
  return 3;
}

function getMaxIndex() {
  return Math.max(0, cards.length - getVisibleCards());
}

function createDots() {
  dotsContainer.innerHTML = "";

  for (let i = 0; i <= getMaxIndex(); i++) {
    const dot = document.createElement("button");

    dot.className = "dot";
    dot.setAttribute("aria-label", `${i + 1}-slayd`);

    dot.addEventListener("click", () => {
      currentIndex = i;
      updateCarousel();
    });

    dotsContainer.appendChild(dot);
  }
}

function updateCarousel() {
  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;

  currentIndex = Math.max(0, Math.min(currentIndex, getMaxIndex()));

  track.style.transform =
    `translateX(-${currentIndex * (cardWidth + gap)}px)`;

  [...dotsContainer.children].forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === getMaxIndex();

  prevBtn.style.opacity = prevBtn.disabled ? ".35" : "1";
  nextBtn.style.opacity = nextBtn.disabled ? ".35" : "1";
}

prevBtn.addEventListener("click", () => {
  currentIndex--;
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  currentIndex++;
  updateCarousel();
});

window.addEventListener("resize", () => {
  createDots();
  updateCarousel();
});

track.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener("touchend", e => {
  moveX = e.changedTouches[0].clientX;
  const difference = startX - moveX;

  if (Math.abs(difference) > 50) {
    if (difference > 0) {
      currentIndex = Math.min(currentIndex + 1, getMaxIndex());
    } else {
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    updateCarousel();
  }
}, { passive: true });

createDots();
updateCarousel();

// ===============================
// MODEL DETAILS MODAL
// ===============================

const modal = document.getElementById("modelModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");

const modelDescriptions = {
  "296 GTB": "Ferrari 296 GTB — zamonaviy V6 gibrid sport avtomobili. Innovatsion texnologiya va italiyalik dizayn uyg'unligi.",
  "SF90": "Ferrari SF90 — gibrid texnologiyalar, yuqori unumdorlik va ilg'or muhandislikni birlashtirgan superkar.",
  "Roma": "Ferrari Roma — zamonaviy italyan nafisligi va sport xarakterini o'zida mujassam etgan avtomobil.",
  "Purosangue": "Ferrari Purosangue — Ferrari avtomobilsozlik merosining yangi talqini."
};

document.querySelectorAll(".details-btn").forEach(button => {
  button.addEventListener("click", () => {
    const model = button.dataset.model;

    modalTitle.textContent = model;
    modalDescription.textContent =
      modelDescriptions[model] || "Ushbu model haqida ma'lumot tayyorlanmoqda.";

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  });
});

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOk").addEventListener("click", closeModal);

modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// ===============================
// GALLERY LIGHTBOX
// ===============================

const galleryImages = [
  ...document.querySelectorAll(".gallery-grid img")
];

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

let galleryIndex = 0;

function showGalleryImage(index) {
  galleryIndex = (index + galleryImages.length) % galleryImages.length;
  lightboxImage.src = galleryImages[galleryIndex].src;
  lightboxImage.alt = galleryImages[galleryIndex].alt;
}

galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => {
    showGalleryImage(index);
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
}

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);

document.getElementById("lightboxPrev").addEventListener("click", () => {
  showGalleryImage(galleryIndex - 1);
});

document.getElementById("lightboxNext").addEventListener("click", () => {
  showGalleryImage(galleryIndex + 1);
});

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

// ===============================
// KEYBOARD CONTROLS
// ===============================

document.addEventListener("keydown", e => {
  if (lightbox.classList.contains("show")) {
    if (e.key === "ArrowRight") showGalleryImage(galleryIndex + 1);
    if (e.key === "ArrowLeft") showGalleryImage(galleryIndex - 1);
    if (e.key === "Escape") closeLightbox();
  }

  if (modal.classList.contains("show") && e.key === "Escape") {
    closeModal();
  }
});

// ===============================
// CONTACT FORM
// ===============================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    formMessage.textContent = "Iltimos, barcha maydonlarni to'ldiring.";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formMessage.textContent = "Elektron pochta manzili noto'g'ri.";
    return;
  }

  formMessage.textContent =
    "Xabaringiz qabul qilindi! Bu demo shakl bo'lib, xabar serverga yuborilmadi.";

  contactForm.reset();
});

// ===============================
// SCROLL REVEAL ANIMATIONS
// ===============================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}
