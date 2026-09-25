/* =========================
   PRELOADER
========================= */

window.addEventListener("load", () => {

    const preloader =
        document.getElementById("preloader");

    setTimeout(() => {
        preloader.classList.add("loaded");
    }, 500);

});


/* =========================
   MOBILE MENU
========================= */

const menuToggle =
    document.getElementById("menu-toggle");

const navLinks =
    document.getElementById("nav-links");


menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("open");

    const icon =
        menuToggle.querySelector("i");

    if (navLinks.classList.contains("open")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


document.querySelectorAll("#nav-links a")
.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

        const icon =
            menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* =========================
   HERO SLIDER
========================= */

const slides =
    document.querySelectorAll(".hero-slide");

const dotsContainer =
    document.getElementById("slideDots");

let currentSlide = 0;


slides.forEach((_, index) => {

    const dot =
        document.createElement("button");

    dot.className = "slide-dot";

    if (index === 0) {
        dot.classList.add("active");
    }

    dot.addEventListener("click", () => {

        currentSlide = index;

        updateSlider();

    });

    dotsContainer.appendChild(dot);

});


const dots =
    document.querySelectorAll(".slide-dot");


function updateSlider() {

    slides.forEach((slide, index) => {

        slide.classList.toggle(
            "active",
            index === currentSlide
        );

    });


    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentSlide
        );

    });

}


document
    .getElementById("nextSlide")
    .addEventListener("click", () => {

        currentSlide =
            (currentSlide + 1) % slides.length;

        updateSlider();

    });


document
    .getElementById("prevSlide")
    .addEventListener("click", () => {

        currentSlide =
            (currentSlide - 1 + slides.length)
            % slides.length;

        updateSlider();

    });


setInterval(() => {

    currentSlide =
        (currentSlide + 1) % slides.length;

    updateSlider();

}, 6000);


/* =========================
   COUNTERS
========================= */

const counters =
    document.querySelectorAll("[data-count]");


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const element =
                    entry.target;

                const target =
                    Number(element.dataset.count);

                let value = 0;

                const increment =
                    Math.max(1, Math.ceil(target / 80));

                const timer =
                    setInterval(() => {

                        value += increment;

                        if (value >= target) {

                            value = target;

                            clearInterval(timer);

                        }

                        element.textContent =
                            value.toLocaleString();

                    }, 20);

                observer.unobserve(element);

            });

        },
        {
            threshold: .5
        }
    );


counters.forEach(counter =>
    observer.observe(counter)
);


/* =========================
   DONATION AMOUNTS
========================= */

const amountButtons =
    document.querySelectorAll(
        ".amounts button"
    );

const amountInput =
    document.getElementById("amount");


amountButtons.forEach(button => {

    button.addEventListener("click", () => {

        amountButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        amountInput.value =
            button.dataset.amount;

    });

});


amountInput.addEventListener("input", () => {

    amountButtons.forEach(btn =>
        btn.classList.remove("active")
    );

});


/* =========================
   FREQUENCY
========================= */

const frequencyButtons =
    document.querySelectorAll(
        ".frequency-btn"
    );


let selectedFrequency = "once";


frequencyButtons.forEach(button => {

    button.addEventListener("click", () => {

        frequencyButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedFrequency =
            button.dataset.frequency;

    });

});


/* =========================
   PAYMENT METHOD
========================= */

const tabs =
    document.querySelectorAll(".donation-tab");

const cardPayment =
    document.getElementById("cardPayment");

const btcPayment =
    document.getElementById("btcPayment");


tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(item =>
            item.classList.remove("active")
        );

        tab.classList.add("active");

        const method =
            tab.dataset.method;

        if (method === "btc") {

            cardPayment.classList.add("hidden");
            btcPayment.classList.remove("hidden");

        } else {

            btcPayment.classList.add("hidden");
            cardPayment.classList.remove("hidden");

        }

    });

});


/* =========================
   CAUSE BUTTONS
========================= */

const causeSelect =
    document.getElementById("causeSelect");


document
    .querySelectorAll(".cause-donate")
    .forEach(button => {

        button.addEventListener("click", () => {

            causeSelect.value =
                button.dataset.cause;

            document
                .getElementById("donate")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });

    });


/* =========================
   MODAL
========================= */

const modal =
    document.getElementById("donationModal");

const closeModal =
    document.getElementById("closeModal");

const modalMessage =
    document.getElementById("modalMessage");


function openModal(message) {

    modalMessage.textContent =
        message;

    modal.classList.add("show");

}


function closeDonationModal() {

    modal.classList.remove("show");

}


closeModal.addEventListener(
    "click",
    closeDonationModal
);


modal.addEventListener("click", event => {

    if (event.target === modal) {

        closeDonationModal();

    }

});


/* =========================
   CARD DONATION
========================= */

const donationForm =
    document.getElementById("donationForm");


donationForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const amount =
            Number(amountInput.value);

        const cause =
            causeSelect.value;


        if (!amount || amount < 1) {

            alert(
                "Please enter a valid donation amount."
            );

            return;

        }


        /*
         * IMPORTANT:
         *
         * This is intentionally a backend
         * integration point.
         *
         * Never put Stripe secret keys,
         * Paystack secret keys or BTC
         * private keys inside this file.
         */

        openModal(
            `Donation setup ready for $${amount.toFixed(2)} ` +
            `(${selectedFrequency}) to ${cause}.`
        );


        /*
         * Production example:
         *
         * const response = await fetch(
         *     "/api/donations/create-checkout",
         *     {
         *         method: "POST",
         *         headers: {
         *             "Content-Type":
         *                 "application/json"
         *         },
         *         body: JSON.stringify({
         *             amount,
         *             cause,
         *             frequency:
         *                 selectedFrequency
         *         })
         *     }
         * );
         *
         * const data = await response.json();
         *
         * window.location.href =
         *     data.checkoutUrl;
         */

    }
);


/* =========================
   BITCOIN COPY
========================= */

document
    .getElementById("copyBtc")
    .addEventListener("click", async () => {

        const address =
            document.querySelector(
                ".btc-address"
            ).textContent.trim();

        try {

            await navigator.clipboard.writeText(
                address
            );

            document.getElementById(
                "copyBtc"
            ).textContent =
                "Copied!";

            setTimeout(() => {

                document.getElementById(
                    "copyBtc"
                ).textContent =
                    "Copy wallet address";

            }, 1800);

        } catch {

            alert(
                "Please copy the wallet address manually."
            );

        }

    });
