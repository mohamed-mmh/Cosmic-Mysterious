// عناصر نموذج الاسم والزر الذي يفتح لوحة الرحلات.
const loginForm = document.querySelector("#login-form");
const guestNameInput = document.querySelector("#guest-name");
const formMessage = document.querySelector(".form-message");
const launchButton = loginForm.querySelector(".launch-button");

// عناصر نافذة تفاصيل الكوكب ومعرض الصور.
const modal = document.querySelector("#planet-modal");
const gallery = document.querySelector("#planet-gallery");
const fullscreenButton = document.querySelector("#fullscreen-button");
const modalCloseButton = document.querySelector(".modal-close");
let lastFocusedElement = null;
let activeImageIndex = 0;
let activePlanetImages = [];

// بيانات الكواكب المستخدمة لملء النافذة عند اختيار أي كوكب.
const planetData = {
  Mercury: {
    type: "01 / INNER ORBIT",
    summary: "Quicksilver horizons",
    price: "$4.8M",
    description:
      "The smallest planet and the closest to the Sun. Mercury is a world of extreme temperatures, ancient craters, and a sky-black horizon.",
    facts: ["Diameter 4,879 km", "Day 59 Earth days", "No natural moons"],
    images: ["PIA15162", "PIA19411", "PIA19216", "PIA16853"],
  },
  Venus: {
    type: "02 / INNER ORBIT",
    summary: "The golden cloud world",
    price: "$3.9M",
    description:
      "A bright, cloud-wrapped planet with a surface shaped by volcanoes and powerful winds. Venus is Earth's mysterious, brilliant twin.",
    facts: ["Diameter 12,104 km", "Day 243 Earth days", "No natural moons"],
    images: ["PIA00271", "PIA00104", "PIA00270", "PIA00315"],
  },
  Mars: {
    type: "03 / INNER ORBIT",
    summary: "Red dust, wide-open skies",
    price: "$2.4M",
    description:
      "A cold desert world with iron-rich red soil, towering volcanoes, and deep valleys. Mars is the next great chapter in human exploration.",
    facts: ["Diameter 6,779 km", "Day 24.6 hours", "2 natural moons"],
    images: ["PIA00407", "PIA07997", "PIA04591", "PIA21664"],
  },
  Jupiter: {
    type: "04 / OUTER ORBIT",
    summary: "Storms on a colossal scale",
    price: "$8.6M",
    description:
      "A giant made of swirling gas and light. Jupiter's famous Great Red Spot is a storm larger than Earth that has lasted for centuries.",
    facts: ["Diameter 139,820 km", "Day 9.9 hours", "95 natural moons"],
    images: ["PIA02820", "PIA22946", "PIA07782", "PIA01324"],
  },
  Saturn: {
    type: "05 / OUTER ORBIT",
    summary: "Ring-side, all to yourself",
    price: "$9.2M",
    description:
      "The jewel of the Solar System. Saturn's luminous rings are made from ice and rock, casting long shadows across a golden atmosphere.",
    facts: ["Diameter 116,460 km", "Day 10.7 hours", "146 natural moons"],
    images: ["PIA01364", "PIA17172", "PIA21046", "PIA11667"],
  },
  Uranus: {
    type: "06 / OUTER ORBIT",
    summary: "A blue world turned sideways",
    price: "$11.7M",
    description:
      "An ice giant with a delicate ring system and a strange sideways spin. Its calm blue atmosphere hides a world of wild seasonal changes.",
    facts: ["Diameter 50,724 km", "Day 17.2 hours", "28 natural moons"],
    images: ["PIA18182", "PIA00032", "PIA18183", "PIA18184"],
  },
  Neptune: {
    type: "07 / OUTER ORBIT",
    summary: "Blue silence at the edge",
    price: "$13.5M",
    description:
      "The farthest major planet, colored by methane clouds and swept by the fastest winds ever measured on a planetary world.",
    facts: ["Diameter 49,244 km", "Day 16.1 hours", "16 natural moons"],
    images: ["PIA01492", "PIA02217", "PIA00046", "PIA01142"],
  },
};

// يبني رابط صورة ناسا من رقم الصورة بدل تكرار الرابط كاملًا.
const nasaImage = (imageId) =>
  `https://images-assets.nasa.gov/image/${imageId}/${imageId}~orig.jpg`;

// يحدّث الرسالة أسفل النموذج.
const setMessage = (message) => {
  formMessage.textContent = message;
};

// يفتح زر ENTER بمجرد كتابة اسم، ويغلقه إذا تم مسح الاسم.
guestNameInput.addEventListener("input", () => {
  const hasName = guestNameInput.value.trim().length > 0;
  launchButton.disabled = !hasName;
  setMessage(hasName ? `Ready for you, ${guestNameInput.value.trim()}.` : "");
});

// بعد الضغط على ENTER نعرض لوحة الرحلات بعد ثلاث ثوانٍ.
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const guestName = guestNameInput.value.trim();
  if (!guestName) return;

  launchButton.disabled = true;
  launchButton.querySelector("span").textContent = "OPENING...";
  setMessage(`Welcome, ${guestName}. Preparing your flight deck...`);
  window.setTimeout(() => {
    document.body.classList.add("explorer-visible");
    document
      .querySelector(".future-line")
      .scrollIntoView({ behavior: "smooth" });
    launchButton.disabled = false;
    launchButton.querySelector("span").textContent = "ENTER";
  }, 3000);
});

// يغلق نافذة تفاصيل الكوكب ويفرغ الصور القديمة.
const closeModal = () => {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  gallery.replaceChildren();
  lastFocusedElement?.focus();
  lastFocusedElement = null;
};

// يحدّث الصورة النشطة داخل وضع fullscreen مع إبقاء الصور الأربع في العرض العادي.
const updateActiveImage = () => {
  gallery.querySelectorAll("img").forEach((image, index) => {
    image.classList.toggle("active-image", index === activeImageIndex);
  });
  const counter = gallery.querySelector(".gallery-counter");
  if (counter)
    counter.textContent = `${activeImageIndex + 1} / ${activePlanetImages.length}`;
};

// ينقل المستخدم للصورة التالية أو السابقة مع دوران تلقائي عند الوصول للنهاية.
const moveGallery = (direction) => {
  if (!activePlanetImages.length) return;
  activeImageIndex =
    (activeImageIndex + direction + activePlanetImages.length) %
    activePlanetImages.length;
  updateActiveImage();
};

// يملأ النافذة باسم الكوكب ومعلوماته وصوره الأربع.
const openPlanetModal = (planetName) => {
  const planet = planetData[planetName];
  if (!planet) return;

  document.querySelector("#modal-planet-type").textContent = planet.type;
  document.querySelector("#modal-planet-name").textContent = planetName;
  document.querySelector("#modal-planet-summary").textContent = planet.summary;
  document.querySelector("#modal-planet-description").textContent =
    planet.description;
  document.querySelector("#modal-planet-price").innerHTML =
    `${planet.price} <small>/ traveler</small>`;
  document.querySelector("#modal-planet-facts").innerHTML = planet.facts
    .map((fact) => `<span>${fact}</span>`)
    .join("");
  activePlanetImages = planet.images;
  activeImageIndex = 0;
  lastFocusedElement = document.activeElement;
  gallery.innerHTML =
    planet.images
      .map(
        (imageId, index) =>
          `<img src="${nasaImage(imageId)}" alt="${planetName} view ${index + 1}" loading="lazy">`,
      )
      .join("") +
    `<button class="gallery-arrow gallery-arrow-prev" type="button" aria-label="Previous image">&#8592;</button>
     <button class="gallery-arrow gallery-arrow-next" type="button" aria-label="Next image">&#8594;</button>
     <span class="gallery-counter" aria-live="polite">1 / ${planet.images.length}</span>`;
  updateActiveImage();
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modalCloseButton.focus();
};

// يضيف فتح الكوكب بالماوس أو لوحة المفاتيح.
document.querySelectorAll(".planet-card").forEach((card) => {
  card.addEventListener("click", () => openPlanetModal(card.dataset.planet));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPlanetModal(card.dataset.planet);
    }
  });
});

// يغلق النافذة عند الضغط على الخلفية أو زر الإغلاق أو Escape.
document
  .querySelectorAll("[data-close-modal]")
  .forEach((element) => element.addEventListener("click", closeModal));

// يربط السهمين بالمعرض بعد فتحه، ويجعل التنقل يعمل بالماوس واللمس.
gallery.addEventListener("click", (event) => {
  if (event.target.closest(".gallery-arrow-prev")) moveGallery(-1);
  if (event.target.closest(".gallery-arrow-next")) moveGallery(1);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
  if (!modal.hidden && document.fullscreenElement === gallery) {
    if (event.key === "ArrowLeft") moveGallery(-1);
    if (event.key === "ArrowRight") moveGallery(1);
  }
});

// يعرض معرض صور الكوكب بكامل الشاشة.
fullscreenButton.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.fullscreenEnabled && gallery.requestFullscreen)
      await gallery.requestFullscreen();
  } catch {
    fullscreenButton.textContent = "Fullscreen unavailable";
  }
});

fullscreenButton.hidden =
  !document.fullscreenEnabled ||
  typeof gallery.requestFullscreen !== "function";
