"use strict";

document.body.classList.add("js-enabled");

const header = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const carCards = [...document.querySelectorAll(".car-card")];
const filterCount = document.querySelector("#filter-count");
const emptyState = document.querySelector("#empty-state");
const searchForm = document.querySelector("#search-form");
const searchFeedback = document.querySelector("#search-feedback");
const contactForm = document.querySelector("#contact-form");
const contactFeedback = document.querySelector("#contact-feedback");
const phoneInput = contactForm.elements.phone;
const carModal = document.querySelector("#car-modal");
const scrollTopButton = document.querySelector("#scroll-top");

function isValidPhone(value) {
  return /^[0-9+(). -]{7,20}$/.test(value) && /\d/.test(value);
}

const carDetails = {
  "range-rover": {
    make: "LAND ROVER · PREMIUM SUV",
    name: "Range Rover Sport",
    price: "$145",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=84",
    alt: "Dark luxury SUV ready for a road trip",
    specs: ["Automatic", "Hybrid", "5 seats", "All-wheel drive"],
    description: "A confident, comfortable companion for city streets and the long way around. Plenty of room for your people, your bags, and a little extra spontaneity."
  },
  "bmw-5": {
    make: "BMW · EXECUTIVE SEDAN",
    name: "5 Series",
    price: "$118",
    category: "Sedan",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=84",
    alt: "Modern BMW sedan in a city setting",
    specs: ["Automatic", "Gasoline", "5 seats", "Rear-wheel drive"],
    description: "Thoughtful comfort meets an engaging drive. The 5 Series makes every arrival feel considered, whether you are heading across town or out of it."
  },
  "porsche-911": {
    make: "PORSCHE · SPORTS COUPE",
    name: "911 Carrera",
    price: "$225",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=84",
    alt: "Dark Porsche 911 driving on an open road",
    specs: ["Automatic", "Gasoline", "2 seats", "Rear-wheel drive"],
    description: "An unmistakable sports car with a rewarding feel on every stretch of road. Take the scenic route and make a day of it."
  },
  "mercedes-s": {
    make: "MERCEDES-BENZ · LUXURY SEDAN",
    name: "S-Class",
    price: "$210",
    category: "Luxury",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=84",
    alt: "Mercedes-Benz performance car in a studio",
    specs: ["Automatic", "Hybrid", "5 seats", "All-wheel drive"],
    description: "A serene, beautifully appointed cabin turns even the busiest itinerary into a moment to settle in and enjoy the ride."
  },
  "audi-q7": {
    make: "AUDI · LUXURY SUV",
    name: "Q7 Quattro",
    price: "$132",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=84",
    alt: "Premium dark SUV on a scenic road",
    specs: ["Automatic", "Gasoline", "7 seats", "All-wheel drive"],
    description: "Space for everyone, composed handling, and room for the whole plan. The Q7 is ready for family weekends and everything in between."
  },
  mustang: {
    make: "FORD · SPORTS COUPE",
    name: "Mustang GT",
    price: "$165",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=84",
    alt: "Red Ford Mustang sports car",
    specs: ["Automatic", "Gasoline", "4 seats", "Rear-wheel drive"],
    description: "A little more soundtrack for the road ahead. The Mustang GT brings an iconic shape and a spirited feel to a coast-bound afternoon."
  }
};

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setFeedback(element, message, kind) {
  element.textContent = message;
  element.classList.toggle("is-error", kind === "error");
  element.classList.toggle("is-success", kind === "success");
}

function setFilter(category) {
  let visibleCount = 0;
  carCards.forEach((card) => {
    const matches = category === "all" || card.dataset.category === category;
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === category;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  filterCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "vehicle" : "vehicles"}`;
  emptyState.hidden = visibleCount !== 0;
}

function closeNavigation() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

function openCarDetails(carId) {
  const car = carDetails[carId];
  if (!car) return;

  document.querySelector("#modal-image").src = car.image;
  document.querySelector("#modal-image").alt = car.alt;
  document.querySelector("#modal-make").textContent = car.make;
  document.querySelector("#modal-title").textContent = car.name;
  document.querySelector("#modal-description").textContent = car.description;
  document.querySelector("#modal-price").textContent = car.price;

  const specs = document.querySelector("#modal-specs");
  specs.replaceChildren(...car.specs.map((spec) => {
    const item = document.createElement("span");
    item.textContent = spec;
    return item;
  }));
  carModal.dataset.category = car.category;
  carModal.showModal();
}

function updateHeaderAndScrollButton() {
  const hasScrolled = window.scrollY > 24;
  header.classList.toggle("is-scrolled", hasScrolled);
  scrollTopButton.classList.toggle("is-visible", window.scrollY > 500);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

document.querySelector("#car-grid").addEventListener("click", (event) => {
  const detailsButton = event.target.closest(".car-card__details");
  if (detailsButton) {
    openCarDetails(detailsButton.dataset.carId);
    return;
  }

  const favoriteButton = event.target.closest(".car-card__favorite");
  if (favoriteButton) {
    const isSaved = favoriteButton.getAttribute("aria-pressed") !== "true";
    favoriteButton.setAttribute("aria-pressed", String(isSaved));
    favoriteButton.textContent = isSaved ? "♥" : "♡";
  }
});

document.querySelector(".car-modal__close").addEventListener("click", () => carModal.close());
carModal.addEventListener("click", (event) => {
  if (event.target === carModal) carModal.close();
});
document.querySelector("#modal-book").addEventListener("click", () => {
  const category = carModal.dataset.category;
  const typeSelect = searchForm.elements.type;
  typeSelect.value = category;
  setFilter(category);
  carModal.close();
  document.querySelector("#search").scrollIntoView({ behavior: "smooth" });
  typeSelect.focus({ preventScroll: true });
  setFeedback(searchFeedback, `${category} selected. Choose your dates and location to continue.`, "success");
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNavigation();
});

document.addEventListener("click", (event) => {
  if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

const pickupInput = searchForm.elements.pickup;
const returnInput = searchForm.elements.return;
const today = new Date();
pickupInput.min = localDateString(today);
returnInput.min = localDateString(today);

pickupInput.addEventListener("change", () => {
  const pickupDate = pickupInput.value ? new Date(`${pickupInput.value}T00:00:00`) : today;
  pickupDate.setDate(pickupDate.getDate() + 1);
  returnInput.min = localDateString(pickupDate);
  setFeedback(searchFeedback, "", "");
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setFeedback(searchFeedback, "", "");

  if (pickupInput.value && returnInput.value && returnInput.value <= pickupInput.value) {
    returnInput.setCustomValidity("Return date must be after pickup date.");
    returnInput.reportValidity();
    returnInput.setCustomValidity("");
    setFeedback(searchFeedback, "Your return date must be after your pickup date.", "error");
    return;
  }

  if (!searchForm.checkValidity()) {
    searchForm.reportValidity();
    setFeedback(searchFeedback, "Please choose a location, valid dates, and a car type.", "error");
    return;
  }

  const category = searchForm.elements.type.value;
  const city = searchForm.elements.location.value;
  setFilter(category === "all" ? "all" : category);
  setFeedback(searchFeedback, `Showing ${category === "all" ? "all cars" : `${category} cars`} for pickup in ${city}. This demo does not reserve a vehicle.`, "success");
  document.querySelector("#fleet").scrollIntoView({ behavior: "smooth" });
});

phoneInput.addEventListener("input", () => {
  const value = phoneInput.value.trim();
  phoneInput.setCustomValidity(value && !isValidPhone(value) ? "Enter a phone number using 7 to 20 digits, spaces, or + ( ) . -" : "");
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setFeedback(contactFeedback, "", "");

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    setFeedback(contactFeedback, "Please check each field and enter a valid email and phone number.", "error");
    return;
  }

  setFeedback(contactFeedback, "Thanks for your note. This demo does not send messages to a server.", "success");
  contactForm.reset();
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", updateHeaderAndScrollButton, { passive: true });
updateHeaderAndScrollButton();
document.querySelector("#current-year").textContent = String(new Date().getFullYear());

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const sectionLinks = [...document.querySelectorAll("[data-nav-link]")];
  const visibleSections = new Map();
  const navigationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleSections.set(entry.target, entry.intersectionRatio);
      else visibleSections.delete(entry.target);
    });

    const currentSection = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0];
    if (!currentSection) return;
    const currentNav = currentSection[0].dataset.nav;
    sectionLinks.forEach((link) => {
      const isActive = link.dataset.navLink === currentNav;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-18% 0px -58% 0px", threshold: [0, 0.15, 0.35, 0.6] });
  document.querySelectorAll("[data-nav]").forEach((section) => navigationObserver.observe(section));
}
