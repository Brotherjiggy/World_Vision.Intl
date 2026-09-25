/* =========================================================
   WORLDWIDE CHARITY PLATFORM
   STAGE 3 — SMART INTERACTIONS
   ========================================================= */

const donationModal = document.getElementById("donationModal");
const donationCause = document.getElementById("donationCause");
const customAmount = document.getElementById("customAmount");

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

let selectedAmount = 50;


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");

    const isOpen = nav.classList.contains("open");

    menuBtn.setAttribute("aria-expanded", isOpen);
  });

  // Close menu after clicking a navigation link
  const navLinks = nav.querySelectorAll("a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}


/* =========================================================
   DONATION MODAL
   ========================================================= */

function openDonation(cause) {
  if (!donationModal) return;

  if (cause && donationCause) {
    donationCause.value = cause;
  }

  donationModal.showModal();

  setTimeout(() => {
    if (customAmount) {
      customAmount.focus();
    }
  }, 100);
}


function closeDonation() {
  if (!donationModal) return;

  donationModal.close();
}


/* =========================================================
   DONATION AMOUNTS
   ========================================================= */

function selectAmount(amount) {
  selectedAmount = Number(amount);

  if (customAmount) {
    customAmount.value = "";
  }

  // Remove active state from every amount button
  const amountButtons =
    document.querySelectorAll("[data-amount]");

  amountButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // Highlight selected amount
  const selectedButton =
    document.querySelector(
      `[data-amount="${amount}"]`
    );

  if (selectedButton) {
    selectedButton.classList.add("active");
  }
}


/* =========================================================
   GET DONATION AMOUNT
   ========================================================= */

function getDonationAmount() {
  const custom =
    customAmount
      ? Number(customAmount.value)
      : 0;

  if (custom && custom > 0) {
    return custom;
  }

  return selectedAmount;
}


/* =========================================================
   VALIDATE DONATION
   ========================================================= */

function validateDonation() {
  const amount = getDonationAmount();

  if (!amount || amount < 1) {
    showToast(
      "Please enter a donation amount of at least $1.",
      "error"
    );

    return false;
  }

  if (amount > 1000000) {
    showToast(
      "For large donations, please contact our support team.",
      "error"
    );

    return false;
  }

  return true;
}


/* =========================================================
   CARD PAYMENT
   ========================================================= */

function payWithCard() {
  if (!validateDonation()) {
    return;
  }

  const amount =
    getDonationAmount();

  const cause =
    donationCause
      ? donationCause.value
      : "General Fund";

  /*
    IMPORTANT:

    This is currently a demonstration.

    Later we will connect this button
    to a secure Stripe Checkout backend.

    NEVER place a Stripe secret key here.
  */

  showToast(
    `Card donation selected: $${amount.toLocaleString()} for ${cause}.`,
    "success"
  );

  console.log("Card donation:", {
    amount,
    cause
  });
}


/* =========================================================
   BITCOIN PAYMENT
   ========================================================= */

function payWithBitcoin() {
  if (!validateDonation()) {
    return;
  }

  const amount =
    getDonationAmount();

  const cause =
    donationCause
      ? donationCause.value
      : "General Fund";

  /*
    IMPORTANT:

    This is currently a demonstration.

    Later we will connect this button
    to a secure BTCPay Server invoice.

    NEVER expose private Bitcoin/API
    credentials inside this frontend.
  */

  showToast(
    `Bitcoin donation selected: $${amount.toLocaleString()} for ${cause}.`,
    "success"
  );

  console.log("Bitcoin donation:", {
    amount,
    cause
  });
}


/* =========================================================
   MODERN TOAST NOTIFICATIONS
   ========================================================= */

function showToast(message, type = "success") {
  let toast =
    document.getElementById("siteToast");

  if (!toast) {
    toast =
      document.createElement("div");

    toast.id = "siteToast";

    toast.setAttribute(
      "role",
      "status"
    );

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.className =
    `site-toast ${type}`;

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
  document.querySelectorAll(
    ".section, .cause-card, .about-card, .trust-card, .hero-content, .hero-impact-card"
  );

const revealObserver =
  new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "revealed"
          );

          observer.unobserve(
            entry.target
          );
        }

      });

    },
    {
      threshold: 0.12
    }
  );


revealElements.forEach((element) => {

  element.classList.add(
    "reveal-on-scroll"
  );

  revealObserver.observe(element);

});


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const sections =
  document.querySelectorAll(
    "section[id]"
  );

const navigationLinks =
  document.querySelectorAll(
    "#nav a"
  );


const sectionObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          const currentId =
            entry.target.getAttribute("id");

          navigationLinks.forEach((link) => {

            link.classList.remove(
              "active"
            );

            const linkTarget =
              link.getAttribute("href");

            if (
              linkTarget ===
              `#${currentId}`
            ) {
              link.classList.add(
                "active"
              );
            }

          });

        }

      });

    },
    {
      rootMargin:
        "-35% 0px -55% 0px"
    }
  );


sections.forEach((section) => {
  sectionObserver.observe(section);
});


/* =========================================================
   ANIMATED NUMBERS
   ========================================================= */

function animateNumber(
  element,
  target,
  duration = 1800
) {

  let start = 0;

  const startTime =
    performance.now();


  function update(currentTime) {

    const elapsed =
      currentTime - startTime;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );

    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );

    const current =
      Math.floor(
        start +
        (target - start) *
        eased
      );

    element.textContent =
      current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(
        update
      );
    }

  }

  requestAnimationFrame(update);
}


/* =========================================================
   IMPACT COUNTER OBSERVER
   ========================================================= */

const counters =
  document.querySelectorAll(
    "[data-counter]"
  );


const counterObserver =
  new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (
          entry.isIntersecting
        ) {

          const element =
            entry.target;

          const target =
            Number(
              element.dataset.counter
            );

          if (!isNaN(target)) {

            animateNumber(
              element,
              target
            );

          }

          observer.unobserve(
            element
          );

        }

      });

    },
    {
      threshold: 0.5
    }
  );


counters.forEach((counter) => {
  counterObserver.observe(counter);
});


/* =========================================================
   CUSTOM DONATION AMOUNT
   ========================================================= */

if (customAmount) {

  customAmount.addEventListener(
    "input",
    () => {

      const amountButtons =
        document.querySelectorAll(
          "[data-amount]"
        );

      amountButtons.forEach(
        (button) => {
          button.classList.remove(
            "active"
          );
        }
      );

      const value =
        Number(
          customAmount.value
        );

      if (value > 0) {
        selectedAmount = value;
      }

    }
  );

}


/* =========================================================
   MODAL CLICK OUTSIDE
   ========================================================= */

if (donationModal) {

  donationModal.addEventListener(
    "click",
    (event) => {

      const rect =
        donationModal.getBoundingClientRect();

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        closeDonation();
      }

    }
  );

}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute(
            "href"
          );

        const target =
          document.querySelector(
            targetId
          );

        if (target) {

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  });


/* =========================================================
   INITIALIZE DEFAULT DONATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const defaultButton =
      document.querySelector(
        '[data-amount="50"]'
      );

    if (defaultButton) {
      defaultButton.classList.add(
        "active"
      );
    }

  }
);
