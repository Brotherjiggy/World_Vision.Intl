/* =========================================================
   GLOBAL VISION AID
   MAIN JAVASCRIPT
   FLUTTERWAVE PAYMENT VERSION
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
       CONFIGURATION
    ===================================================== */

    const PAYMENT_FUNCTION =
        "create-flutterwave-payment";


    /* =====================================================
       GLOBAL ELEMENTS
    ===================================================== */

    const causeSelect =
        document.getElementById("causeSelect");

    const donationForm =
        document.getElementById("donationForm");

    const amountInput =
        document.getElementById("amount");


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
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

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
            <option value="general">
                Where needed most
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


                if (method === "btc") {

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
       FLUTTERWAVE DONATION PAYMENT
    ===================================================== */

    if (donationForm) {

        donationForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                /* -----------------------------------------
                   GET DONOR INFORMATION
                ----------------------------------------- */

                const donorNameInput =
                    document.getElementById(
                        "donorName"
                    );


                const donorEmailInput =
                    document.getElementById(
                        "donorEmail"
                    );


                const donorPhoneInput =
                    document.getElementById(
                        "donorPhone"
                    );


                const donorName =
                    donorNameInput
                        ? donorNameInput.value.trim()
                        : "";


                const donorEmail =
                    donorEmailInput
                        ? donorEmailInput.value.trim()
                        : "";


                const donorPhone =
                    donorPhoneInput
                        ? donorPhoneInput.value.trim()
                        : "";


                const amount =
                    amountInput
                        ? Number(
                            amountInput.value
                        )
                        : 0;


                /* -----------------------------------------
                   VALIDATE
                ----------------------------------------- */

                if (!donorName) {

                    showPaymentMessage(
                        "Please enter your name."
                    );

                    donorNameInput?.focus();

                    return;

                }


                if (!donorEmail) {

                    showPaymentMessage(
                        "Please enter your email address."
                    );

                    donorEmailInput?.focus();

                    return;

                }


                if (!isValidEmail(donorEmail)) {

                    showPaymentMessage(
                        "Please enter a valid email address."
                    );

                    donorEmailInput?.focus();

                    return;

                }


                if (
                    !amount ||
                    amount <= 0
                ) {

                    showPaymentMessage(
                        "Please enter a valid donation amount."
                    );

                    amountInput?.focus();

                    return;

                }


                const selectedCause =
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
                        ? selectedOption.textContent.trim()
                        : "Where needed most";


                const activeFrequency =
                    document.querySelector(
                        ".frequency-btn.active"
                    );


                const frequency =
                    activeFrequency
                        ? activeFrequency.dataset.frequency
                        : "once";


                /* -----------------------------------------
                   PREPARE BUTTON
                ----------------------------------------- */

                const submitButton =
                    donationForm.querySelector(
                        ".donate-submit"
                    );


                const originalButtonHTML =
                    submitButton
                        ? submitButton.innerHTML
                        : "";


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.innerHTML = `
                        <i class="fa-solid fa-circle-notch fa-spin"></i>
                        Preparing secure checkout...
                    `;

                }


                try {

                    /* -------------------------------------
                       CALL SUPABASE EDGE FUNCTION
                    ------------------------------------- */

                    const {
                        data,
                        error
                    } = await supabaseClient.functions.invoke(
                        PAYMENT_FUNCTION,
                        {
                            body: {
                                amount: amount,
                                currency: "USD",
                                email: donorEmail,
                                name: donorName,
                                phone: donorPhone,
                                cause: selectedCause,
                                cause_name: causeName,
                                frequency: frequency
                            }
                        }
                    );


                    if (error) {

                        console.error(
                            "Supabase payment error:",
                            error
                        );

                        throw new Error(
                            error.message ||
                            "Unable to connect to the payment service."
                        );

                    }


                    if (
                        !data ||
                        !data.success ||
                        !data.payment_link
                    ) {

                        console.error(
                            "Invalid payment response:",
                            data
                        );

                        throw new Error(
                            data?.error ||
                            "Flutterwave did not return a payment link."
                        );

                    }


                    /* -------------------------------------
                       REDIRECT TO FLUTTERWAVE
                    ------------------------------------- */

                    window.location.href =
                        data.payment_link;


                } catch (error) {

                    console.error(
                        "Donation payment error:",
                        error
                    );


                    showPaymentMessage(
                        error.message ||
                        "We couldn't start the secure payment. Please try again."
                    );


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            originalButtonHTML;

                    }

                }

            }
        );

    }


    /* =====================================================
       PAYMENT MESSAGE
    ===================================================== */

    function showPaymentMessage(message) {

        const modal =
            document.getElementById(
                "donationModal"
            );


        const modalMessage =
            document.getElementById(
                "modalMessage"
            );


        const modalContinue =
            document.getElementById(
                "modalContinue"
            );


        if (modalMessage) {

            modalMessage.textContent =
                message;

        }


        if (modalContinue) {

            modalContinue.textContent =
                "Close";

        }


        if (modal) {

            modal.classList.add(
                "active"
            );

        }

    }


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    /* =====================================================
       DONATION MODAL
    ===================================================== */

    const donationModal =
        document.getElementById(
            "donationModal"
        );


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
