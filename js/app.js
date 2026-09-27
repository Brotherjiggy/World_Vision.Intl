/* =========================================================
   GLOBAL VISION AID
   MAIN JAVASCRIPT
   FULL UPGRADED VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SUPABASE
    ===================================================== */

    const SUPABASE_URL =
        "https://xhokpjbikxlbxrbjtqit.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_6bJ1WmGEKvDQ1pPafd0TlQ_XIcr0U52";

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    /* =====================================================
       GLOBAL ELEMENTS
    ===================================================== */

    const causeSelect =
        document.getElementById("causeSelect");


    /* =====================================================
       PRELOADER
    ===================================================== */

    const preloader =
        document.getElementById("preloader");


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

    const menuToggle =
        document.getElementById("menu-toggle");

    const navLinks =
        document.getElementById("nav-links");


    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            navLinks.classList.toggle("open");

            const isOpen =
                navLinks.classList.contains("open");


            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation"
                    : "Open navigation"
            );


            menuToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';

        });


        navLinks
            .querySelectorAll("a")
            .forEach(link => {

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

    const slides =
        document.querySelectorAll(".hero-slide");

    const slideDots =
        document.getElementById("slideDots");

    const prevSlide =
        document.getElementById("prevSlide");

    const nextSlide =
        document.getElementById("nextSlide");


    let currentSlide = 0;

    let slideTimer;


    function showSlide(index) {

        if (!slides.length) {
            return;
        }


        if (index >= slides.length) {

            currentSlide = 0;

        } else if (index < 0) {

            currentSlide =
                slides.length - 1;

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

        if (
            !slideDots ||
            !slides.length
        ) {
            return;
        }


        slideDots.innerHTML = "";


        slides.forEach((_, index) => {

            const dot =
                document.createElement("button");


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

        if (!slideDots) {
            return;
        }


        const dots =
            slideDots.querySelectorAll(
                ".slide-dot"
            );


        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentSlide
            );

        });

    }


    function startSlider() {

        if (slides.length <= 1) {
            return;
        }


        slideTimer =
            setInterval(() => {

                showSlide(
                    currentSlide + 1
                );

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

        nextSlide.addEventListener(
            "click",
            () => {

                showSlide(
                    currentSlide + 1
                );

                restartSlider();

            }
        );

    }


    if (prevSlide) {

        prevSlide.addEventListener(
            "click",
            () => {

                showSlide(
                    currentSlide - 1
                );

                restartSlider();

            }
        );

    }


    /* =====================================================
       IMPACT COUNTERS
    ===================================================== */

    const counters =
        document.querySelectorAll(
            "[data-count]"
        );


    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        const counter =
                            entry.target;


                        const target =
                            Number(
                                counter.dataset.count
                            );


                        let current = 0;

                        const duration = 1600;

                        const increment =
                            target /
                            (duration / 16);


                        function updateCounter() {

                            current += increment;


                            if (current < target) {

                                counter.textContent =
                                    Math.floor(
                                        current
                                    ).toLocaleString();


                                requestAnimationFrame(
                                    updateCounter
                                );

                            } else {

                                counter.textContent =
                                    target.toLocaleString();

                            }

                        }


                        updateCounter();

                        counterObserver.unobserve(
                            counter
                        );

                    });

                },
                {
                    threshold: 0.5
                }
            );


        counters.forEach(counter => {

            counterObserver.observe(counter);

        });

    }


    /* =====================================================
       PUBLIC SUPABASE CAUSES
    ===================================================== */

    async function loadPublishedCauses() {

        const causeGrid =
            document.querySelector(
                ".cause-grid"
            );


        if (!causeGrid) {
            return;
        }


        causeGrid.innerHTML = `
            <div class="cause-loading">
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                <p>Loading causes...</p>
            </div>
        `;


        try {

            const {
                data: causes,
                error
            } = await supabaseClient
                .from("causes")
                .select(`
                    id,
                    title,
                    slug,
                    category,
                    location,
                    status,
                    target_amount,
                    raised_amount,
                    image_url,
                    short_description,
                    description,
                    featured,
                    created_at
                `)
                .eq(
                    "status",
                    "published"
                )
                .order(
                    "featured",
                    {
                        ascending: false
                    }
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


            if (error) {

                console.error(
                    "Could not load causes:",
                    error
                );


                causeGrid.innerHTML = `
                    <div class="cause-loading">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <p>
                            We couldn't load our causes right now.
                            Please try again shortly.
                        </p>
                    </div>
                `;

                return;
            }


            if (
                !causes ||
                !causes.length
            ) {

                causeGrid.innerHTML = `
                    <div class="cause-loading">
                        <i class="fa-solid fa-heart"></i>
                        <p>
                            New causes will appear here soon.
                        </p>
                    </div>
                `;

                return;
            }


            causeGrid.innerHTML = "";


            causes.forEach(cause => {

                const card =
                    createCauseCard(cause);


                causeGrid.appendChild(card);

            });


            /*
             * IMPORTANT:
             * There is intentionally NO
             * attachCauseButtons() here.
             *
             * Cause cards now use normal
             * HTML links.
             */


            populateCauseSelect(
                causes
            );

        } catch (error) {

            console.error(
                "Unexpected causes error:",
                error
            );


            causeGrid.innerHTML = `
                <div class="cause-loading">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <p>
                        Something went wrong while loading causes.
                        Please refresh and try again.
                    </p>
                </div>
            `;

        }

    }


    /* =====================================================
       CREATE CAUSE CARD
    ===================================================== */

    function createCauseCard(cause) {

        const article =
            document.createElement("article");


        article.className =
            "cause-card";


        const target =
            Number(
                cause.target_amount || 0
            );


        const raised =
            Number(
                cause.raised_amount || 0
            );


        let percentage = 0;


        if (target > 0) {

            percentage =
                (raised / target) * 100;

        }


        percentage =
            Math.min(
                Math.max(
                    percentage,
                    0
                ),
                100
            );


        const formattedRaised =
            formatCurrency(
                raised
            );


        const formattedTarget =
            formatCurrency(
                target
            );


        const category =
            escapeHTML(
                cause.category ||
                "General"
            );


        const title =
            escapeHTML(
                cause.title ||
                "Untitled Cause"
            );


        const description =
            escapeHTML(
                cause.short_description ||
                cause.description ||
                "Support this important humanitarian cause."
            );


        const image =
            cause.image_url &&
            cause.image_url.trim()
                ? cause.image_url
                : "images/story-1.jpg";


        const location =
            cause.location
                ? escapeHTML(
                    cause.location
                )
                : "";


        /*
         * Use the cause slug for navigation.
         * If somehow no slug exists, fall back
         * to the database ID.
         */

        const causeIdentifier =
            cause.slug ||
            cause.id;


        const causeUrl =
            `cause.html?slug=${encodeURIComponent(
                causeIdentifier
            )}`;


        article.innerHTML = `

            <div class="cause-image">

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(title)}"
                    loading="lazy"
                >

                <span class="cause-tag">
                    ${category}
                </span>

            </div>


            <div class="cause-body">

                <h3>
                    ${title}
                </h3>


                ${
                    location
                        ? `
                            <small class="cause-location">
                                <i class="fa-solid fa-location-dot"></i>
                                ${location}
                            </small>
                          `
                        : ""
                }


                <p>
                    ${description}
                </p>


                <div class="progress">

                    <div class="progress-top">

                        <span>
                            Raised
                        </span>

                        <strong>
                            ${formattedRaised}
                        </strong>

                    </div>


                    <div class="progress-bar">

                        <span
                            style="width:${percentage}%"
                        ></span>

                    </div>


                    <small>
                        Goal: ${formattedTarget}
                    </small>

                </div>


                <a
                    class="cause-donate"
                    href="${escapeAttribute(causeUrl)}"
                    aria-label="View and support ${escapeAttribute(title)}"
                >
                    View &amp; Support
                </a>

            </div>

        `;


        /*
         * If an image fails, use the existing
         * story image as a safe fallback.
         */

        const cardImage =
            article.querySelector(
                ".cause-image img"
            );


        if (cardImage) {

            cardImage.addEventListener(
                "error",
                function () {

                    this.onerror = null;

                    this.src =
                        "images/story-1.jpg";

                }
            );

        }


        return article;

    }


    /* =====================================================
       FORMAT CURRENCY
    ===================================================== */

    function formatCurrency(value) {

        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0
            }
        ).format(
            Number(value) || 0
        );

    }


    /* =====================================================
       SAFE HTML HELPERS
    ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    function escapeAttribute(value) {

        return escapeHTML(value);

    }


    /* =====================================================
       POPULATE DONATION CAUSE SELECT
    ===================================================== */

    function populateCauseSelect(causes) {

        if (!causeSelect) {
            return;
        }


        causeSelect.innerHTML = `
            <option value="">
                Select a cause
            </option>
        `;


        causes.forEach(cause => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                cause.slug ||
                cause.id;


            option.textContent =
                cause.title;


            causeSelect.appendChild(
                option
            );

        });


        /*
         * Read the cause from the URL.
         *
         * Example:
         *
         * index.html?cause=give-a-child-a-future#donate
         */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const requestedCause =
            params.get("cause");


        if (!requestedCause) {
            return;
        }


        const matchingOption =
            Array.from(
                causeSelect.options
            ).find(
                option =>
                    option.value ===
                    requestedCause
            );


        if (matchingOption) {

            causeSelect.value =
                requestedCause;

        }

    }


    /* =====================================================
       DONATION TABS
    ===================================================== */

    const donationTabs =
        document.querySelectorAll(
            ".donation-tab"
        );


    const cardPayment =
        document.getElementById(
            "cardPayment"
        );


    const btcPayment =
        document.getElementById(
            "btcPayment"
        );


    donationTabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                donationTabs.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                tab.classList.add(
                    "active"
                );


                const method =
                    tab.dataset.method;


                if (
                    method === "btc"
                ) {

                    if (cardPayment) {

                        cardPayment.classList.add(
                            "hidden"
                        );

                    }


                    if (btcPayment) {

                        btcPayment.classList.remove(
                            "hidden"
                        );

                    }

                } else {

                    if (btcPayment) {

                        btcPayment.classList.add(
                            "hidden"
                        );

                    }


                    if (cardPayment) {

                        cardPayment.classList.remove(
                            "hidden"
                        );

                    }

                }

            }
        );

    });


    /* =====================================================
       DONATION FREQUENCY
    ===================================================== */

    const frequencyButtons =
        document.querySelectorAll(
            ".frequency-btn"
        );


    frequencyButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                frequencyButtons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );

            }
        );

    });


    /* =====================================================
       DONATION AMOUNTS
    ===================================================== */

    const amountButtons =
        document.querySelectorAll(
            ".amounts button"
        );


    const amountInput =
        document.getElementById(
            "amount"
        );


    amountButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                amountButtons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                if (amountInput) {

                    amountInput.value =
                        button.dataset.amount;

                }

            }
        );

    });


    if (amountInput) {

        amountInput.addEventListener(
            "input",
            () => {

                amountButtons.forEach(button => {

                    button.classList.remove(
                        "active"
                    );

                });

            }
        );

    }


    /* =====================================================
       DONATION FORM
    ===================================================== */

    const donationForm =
        document.getElementById(
            "donationForm"
        );


    const donationModal =
        document.getElementById(
            "donationModal"
        );


    const modalMessage =
        document.getElementById(
            "modalMessage"
        );


    if (donationForm) {

        donationForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const amount =
                    amountInput
                        ? amountInput.value
                        : "";


                if (
                    !amount ||
                    Number(amount) <= 0
                ) {

                    if (amountInput) {

                        amountInput.focus();

                    }

                    return;

                }


                const cause =
                    causeSelect
                        ? causeSelect.value
                        : "general";


                const selectedOption =
                    causeSelect
                        ? causeSelect.options[
                            causeSelect.selectedIndex
                        ]
                        : null;


                const causeName =
                    selectedOption
                        ? selectedOption.textContent
                        : "Where needed most";


                console.log(
                    "Donation prepared:",
                    {
                        amount,
                        cause
                    }
                );


                if (modalMessage) {

                    modalMessage.textContent =
                        `Your $${Number(amount).toLocaleString()} donation for ${causeName} has been prepared. Secure payment processing will be connected in the next stage.`;

                }


                if (donationModal) {

                    donationModal.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    /* =====================================================
       DONATION MODAL
    ===================================================== */

    const closeModal =
        document.getElementById(
            "closeModal"
        );


    const modalContinue =
        document.getElementById(
            "modalContinue"
        );


    function closeDonationModal() {

        if (donationModal) {

            donationModal.classList.remove(
                "active"
            );

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

        donationModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    donationModal
                ) {

                    closeDonationModal();

                }

            }
        );

    }


    /* =====================================================
       BITCOIN COPY BUTTON
    ===================================================== */

    const copyBtc =
        document.getElementById(
            "copyBtc"
        );


    if (copyBtc) {

        copyBtc.addEventListener(
            "click",
            async () => {

                const btcAddress =
                    document.querySelector(
                        ".btc-address"
                    );


                if (!btcAddress) {
                    return;
                }


                const address =
                    btcAddress.textContent.trim();


                if (
                    !address ||
                    address ===
                    "BTC wallet will appear here"
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

                    await navigator.clipboard.writeText(
                        address
                    );


                    copyBtc.textContent =
                        "Copied!";


                    setTimeout(() => {

                        copyBtc.textContent =
                            "Copy wallet address";

                    }, 2000);

                } catch (error) {

                    console.error(
                        "Clipboard error:",
                        error
                    );


                    copyBtc.textContent =
                        "Copy failed";


                    setTimeout(() => {

                        copyBtc.textContent =
                            "Copy wallet address";

                    }, 2000);

                }

            }
        );

    }


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =====================================================
       LOAD PUBLISHED CAUSES
    ===================================================== */

    loadPublishedCauses();

});
