/* =========================================================
   GLOBAL VISION AID
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PRELOADER
    ===================================================== */

    const preloader = document.getElementById("preloader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add("loaded");
            }
        }, 500);
    });


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            navLinks.classList.toggle("open");

            const isOpen = navLinks.classList.contains("open");

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            menuToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';

        });


        /* Close menu after clicking a navigation link */

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

                menuToggle.innerHTML =
                    '<i class="fa-solid fa-bars"></i>';

            });

        });

    }


    /* =====================================================
       HERO SLIDESHOW
    ===================================================== */

    const slides = document.querySelectorAll(".hero-slide");
    const slideDots = document.getElementById("slideDots");
    const prevSlide = document.getElementById("prevSlide");
    const nextSlide = document.getElementById("nextSlide");

    let currentSlide = 0;
    let slideTimer;


    function showSlide(index) {

        if (!slides.length) return;

        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        slides.forEach((slide, i) => {
            slide.classList.toggle(
                "active",
                i === currentSlide
            );
        });

        updateDots();
    }


    function createDots() {

        if (!slideDots || !slides.length) return;

        slideDots.innerHTML = "";

        slides.forEach((_, index) => {

            const dot = document.createElement("button");

            dot.type = "button";

            dot.className = "slide-dot";

            if (index === currentSlide) {
                dot.classList.add("active");
            }

            dot.setAttribute(
                "aria-label",
                `Go to slide ${index + 1}`
            );

            dot.addEventListener("click", () => {

                showSlide(index);

                restartSlider();

            });

            slideDots.appendChild(dot);

        });

    }


    function updateDots() {

        if (!slideDots) return;

        const dots =
            slideDots.querySelectorAll(".slide-dot");

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentSlide
            );

        });

    }


    function startSlider() {

        if (slides.length <= 1) return;

        slideTimer = setInterval(() => {

            showSlide(currentSlide + 1);

        }, 7000);

    }


    function restartSlider() {

        clearInterval(slideTimer);

        startSlider();

    }


    if (slides.length) {

        createDots();

        showSlide(0);

        startSlider();

    }


    if (nextSlide) {

        nextSlide.addEventListener("click", () => {

            showSlide(currentSlide + 1);

            restartSlider();

        });

    }


    if (prevSlide) {

        prevSlide.addEventListener("click", () => {

            showSlide(currentSlide - 1);

            restartSlider();

        });

    }


    /* =====================================================
       IMPACT COUNTERS
    ===================================================== */

    const counters =
        document.querySelectorAll("[data-count]");

    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const counter = entry.target;

                    const target =
                        Number(counter.dataset.count);

                    let current = 0;

                    const duration = 1600;

                    const increment =
                        target / (duration / 16);


                    function updateCounter() {

                        current += increment;

                        if (current < target) {

                            counter.textContent =
                                Math.floor(current).toLocaleString();

                            requestAnimationFrame(
                                updateCounter
                            );

                        } else {

                            counter.textContent =
                                target.toLocaleString();

                        }

                    }

                    updateCounter();

                    counterObserver.unobserve(counter);

                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(counter => {

        counterObserver.observe(counter);

    });


    /* =====================================================
       DONATION TABS
    ===================================================== */

    const donationTabs =
        document.querySelectorAll(".donation-tab");

    const cardPayment =
        document.getElementById("cardPayment");

    const btcPayment =
        document.getElementById("btcPayment");


    donationTabs.forEach(tab => {

        tab.addEventListener("click", () => {

            donationTabs.forEach(item => {
                item.classList.remove("active");
            });

            tab.classList.add("active");

            const method =
                tab.dataset.method;

            if (method === "btc") {

                if (cardPayment) {
                    cardPayment.classList.add("hidden");
                }

                if (btcPayment) {
                    btcPayment.classList.remove("hidden");
                }

            } else {

                if (btcPayment) {
                    btcPayment.classList.add("hidden");
                }

                if (cardPayment) {
                    cardPayment.classList.remove("hidden");
                }

            }

        });

    });


    /* =====================================================
       DONATION FREQUENCY
    ===================================================== */

    const frequencyButtons =
        document.querySelectorAll(".frequency-btn");


    frequencyButtons.forEach(button => {

        button.addEventListener("click", () => {

            frequencyButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

        });

    });


    /* =====================================================
       DONATION AMOUNTS
    ===================================================== */

    const amountButtons =
        document.querySelectorAll(".amounts button");

    const amountInput =
        document.getElementById("amount");


    amountButtons.forEach(button => {

        button.addEventListener("click", () => {

            amountButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            if (amountInput) {

                amountInput.value =
                    button.dataset.amount;

            }

        });

    });


    if (amountInput) {

        amountInput.addEventListener("input", () => {

            amountButtons.forEach(button => {
                button.classList.remove("active");
            });

        });

    }


    /* =====================================================
       CAUSE DONATE BUTTONS
    ===================================================== */

    const causeButtons =
        document.querySelectorAll(".cause-donate");

    const causeSelect =
        document.getElementById("causeSelect");


    causeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const cause =
                button.dataset.cause;

            if (causeSelect) {

                causeSelect.value = cause;

            }

            const donationSection =
                document.getElementById("donate");

            if (donationSection) {

                donationSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });


    /* =====================================================
       DONATION FORM
    ===================================================== */

    const donationForm =
        document.getElementById("donationForm");

    const donationModal =
        document.getElementById("donationModal");

    const modalMessage =
        document.getElementById("modalMessage");


    if (donationForm) {

        donationForm.addEventListener("submit", event => {

            event.preventDefault();

            const amount =
                amountInput
                    ? amountInput.value
                    : "";

            if (!amount || Number(amount) <= 0) {

                if (amountInput) {
                    amountInput.focus();
                }

                return;

            }


            const cause =
                causeSelect
                    ? causeSelect.value
                    : "general";


            if (modalMessage) {

                modalMessage.textContent =
                    `Your $${Number(amount).toLocaleString()} donation for ${cause} has been prepared. Secure payment processing will be connected in the next stage.`;

            }


            if (donationModal) {

                donationModal.classList.add("active");

            }

        });

    }


    /* =====================================================
       DONATION MODAL
    ===================================================== */

    const closeModal =
        document.getElementById("closeModal");

    const modalContinue =
        document.getElementById("modalContinue");


    function closeDonationModal() {

        if (donationModal) {

            donationModal.classList.remove("active");

        }

    }


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeDonationModal
        );

    }


    if (modalContinue) {

        modalContinue.addEventListener(
            "click",
            closeDonationModal
        );

    }


    if (donationModal) {

        donationModal.addEventListener("click", event => {

            if (event.target === donationModal) {

                closeDonationModal();

            }

        });

    }


    /* =====================================================
       BITCOIN COPY BUTTON
    ===================================================== */

    const copyBtc =
        document.getElementById("copyBtc");


    if (copyBtc) {

        copyBtc.addEventListener("click", async () => {

            const btcAddress =
                document.querySelector(".btc-address");

            if (!btcAddress) return;

            const address =
                btcAddress.textContent.trim();


            if (
                !address ||
                address === "BTC wallet will appear here"
            ) {

                copyBtc.textContent =
                    "Wallet not configured yet";

                setTimeout(() => {

                    copyBtc.textContent =
                        "Copy wallet address";

                }, 2000);

                return;

            }


            try {

                await navigator.clipboard.writeText(address);

                copyBtc.textContent =
                    "Copied!";

                setTimeout(() => {

                    copyBtc.textContent =
                        "Copy wallet address";

                }, 2000);

            } catch (error) {

                copyBtc.textContent =
                    "Copy failed";

            }

        });

    }


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


});
