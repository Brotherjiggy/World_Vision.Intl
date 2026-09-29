/* =========================================================
   GLOBAL VISION AID
   MAIN JAVASCRIPT
   CORRECTED + FLUTTERWAVE
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
       HELPERS
    ===================================================== */

    const $ = (id) =>
        document.getElementById(id);

    const $$ = (selector) =>
        document.querySelectorAll(selector);


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function escapeAttribute(value) {

        return escapeHTML(value);

    }


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
       PRELOADER
    ===================================================== */

    const preloader =
        $("preloader");

    window.addEventListener(
        "load",
        () => {

            setTimeout(() => {

                if (preloader) {
                    preloader.classList.add(
                        "loaded"
                    );
                }

            }, 500);

        }
    );


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuToggle =
        $("menu-toggle");

    const navLinks =
        $("nav-links");


    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "open"
                );

                const isOpen =
                    navLinks.classList.contains(
                        "open"
                    );

                menuToggle.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close navigation"
                        : "Open navigation"
                );

                menuToggle.innerHTML =
                    isOpen
                        ? '<i class="fa-solid fa-xmark"></i>'
                        : '<i class="fa-solid fa-bars"></i>';

            }
        );


        navLinks
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navLinks.classList.remove(
                            "open"
                        );

                        menuToggle.setAttribute(
                            "aria-label",
                            "Open navigation"
                        );

                        menuToggle.innerHTML =
                            '<i class="fa-solid fa-bars"></i>';

                    }
                );

            });

    }


    /* =====================================================
       HERO SLIDESHOW
    ===================================================== */

    const slides =
        $$(".hero-slide");

    const slideDots =
        $("slideDots");

    const prevSlide =
        $("prevSlide");

    const nextSlide =
        $("nextSlide");


    let currentSlide = 0;
    let slideTimer = null;


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


        slides.forEach(
            (slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === currentSlide
                );

            }
        );


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


        slides.forEach(
            (_, index) => {

                const dot =
                    document.createElement(
                        "button"
                    );

                dot.type = "button";

                dot.className =
                    "slide-dot";


                if (
                    index ===
                    currentSlide
                ) {

                    dot.classList.add(
                        "active"
                    );

                }


                dot.setAttribute(
                    "aria-label",
                    `Go to slide ${index + 1}`
                );


                dot.addEventListener(
                    "click",
                    () => {

                        showSlide(index);

                        restartSlider();

                    }
                );


                slideDots.appendChild(
                    dot
                );

            }
        );

    }


    function updateDots() {

        if (!slideDots) {
            return;
        }


        slideDots
            .querySelectorAll(
                ".slide-dot"
            )
            .forEach(
                (dot, index) => {

                    dot.classList.toggle(
                        "active",
                        index === currentSlide
                    );

                }
            );

    }


    function startSlider() {

        if (slides.length <= 1) {
            return;
        }


        slideTimer =
            setInterval(
                () => {

                    showSlide(
                        currentSlide + 1
                    );

                },
                7000
            );

    }


    function restartSlider() {

        if (slideTimer) {
            clearInterval(
                slideTimer
            );
        }

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
       IMPORTANT:
       YOUR HTML USES data-count
    ===================================================== */

    const counters =
        $$("[data-count]");


    function animateCounter(
        element
    ) {

        const target =
            Number(
                element.dataset.count
            );


        if (
            !Number.isFinite(target)
        ) {
            return;
        }


        const duration = 1600;

        const start =
            performance.now();


        function update(
            currentTime
        ) {

            const progress =
                Math.min(
                    (
                        currentTime -
                        start
                    ) / duration,
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
                    target * eased
                );


            element.textContent =
                current.toLocaleString();


            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            } else {

                element.textContent =
                    target.toLocaleString();

            }

        }


        requestAnimationFrame(
            update
        );

    }


    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            animateCounter(
                                entry.target
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.3
                }
            );


        counters.forEach(
            counter => {

                observer.observe(
                    counter
                );

            }
        );

    } else {

        counters.forEach(
            counter => {

                counter.textContent =
                    Number(
                        counter.dataset.count
                    ).toLocaleString();

            }
        );

    }


    /* =====================================================
       CAUSES
    ===================================================== */

    const causeGrid =
        document.querySelector(
            ".cause-grid"
        );

    const causeSelect =
        $("causeSelect");


    async function loadPublishedCauses() {

        if (!causeGrid) {
            return;
        }


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

                /*
                 * Keep the original HTML cards
                 * visible if Supabase fails.
                 */

                attachCauseButtons();

                return;

            }


            if (
                !causes ||
                !causes.length
            ) {

                attachCauseButtons();

                return;

            }


            causeGrid.innerHTML = "";


            causes.forEach(
                cause => {

                    causeGrid.appendChild(
                        createCauseCard(
                            cause
                        )
                    );

                }
            );


            populateCauseSelect(
                causes
            );

        } catch (error) {

            console.error(
                "Causes loading error:",
                error
            );

            attachCauseButtons();

        }

    }


    /* =====================================================
       CREATE DYNAMIC CAUSE CARD
    ===================================================== */

    function createCauseCard(
        cause
    ) {

        const article =
            document.createElement(
                "article"
            );


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


        const percentage =
            target > 0
                ? Math.min(
                    100,
                    Math.max(
                        0,
                        (
                            raised /
                            target
                        ) * 100
                    )
                )
                : 0;


        const image =
            cause.image_url &&
            cause.image_url.trim()
                ? cause.image_url
                : "images/story-1.jpg";


        const title =
            escapeHTML(
                cause.title ||
                "Untitled Cause"
            );


        const category =
            escapeHTML(
                cause.category ||
                "General"
            );


        const description =
            escapeHTML(
                cause.short_description ||
                cause.description ||
                "Support this important humanitarian cause."
            );


        const location =
            cause.location
                ? escapeHTML(
                    cause.location
                )
                : "";


        const identifier =
            cause.slug ||
            cause.id;


        const causeUrl =
            `cause.html?slug=${encodeURIComponent(
                identifier
            )}`;


        article.innerHTML = `

            <div class="cause-image">

                <img
                    src="${escapeAttribute(
                        image
                    )}"
                    alt="${escapeAttribute(
                        title
                    )}"
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
                            ${formatCurrency(
                                raised
                            )}
                        </strong>

                    </div>


                    <div class="progress-bar">

                        <span
                            style="width:${percentage}%"
                        ></span>

                    </div>


                    <small>
                        Goal:
                        ${formatCurrency(
                            target
                        )}
                    </small>

                </div>


                <a
                    class="cause-donate"
                    href="${escapeAttribute(
                        causeUrl
                    )}"
                >
                    View &amp; Support
                </a>

            </div>

        `;


        const imageElement =
            article.querySelector(
                "img"
            );


        if (imageElement) {

            imageElement.addEventListener(
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
       ORIGINAL CAUSE BUTTONS
       THIS RESTORES YOUR OLD BUTTONS
    ===================================================== */

    function attachCauseButtons() {

        $$(".cause-donate")
            .forEach(
                button => {

                    /*
                     * Don't interfere with dynamic
                     * <a> links.
                     */

                    if (
                        button.tagName
                            .toLowerCase() ===
                        "a"
                    ) {
                        return;
                    }


                    button.addEventListener(
                        "click",
                        () => {

                            const cause =
                                button.dataset.cause;


                            if (
                                causeSelect &&
                                cause
                            ) {

                                const option =
                                    Array.from(
                                        causeSelect.options
                                    ).find(
                                        item =>
                                            item.value ===
                                            cause
                                    );


                                if (option) {

                                    causeSelect.value =
                                        cause;

                                }

                            }


                            const donateSection =
                                $("donate");


                            if (
                                donateSection
                            ) {

                                donateSection.scrollIntoView(
                                    {
                                        behavior:
                                            "smooth",
                                        block:
                                            "start"
                                    }
                                );

                            }

                        }
                    );

                }
            );

    }


    /* =====================================================
       POPULATE CAUSE SELECT
    ===================================================== */

    function populateCauseSelect(
        causes
    ) {

        if (!causeSelect) {
            return;
        }


        causeSelect.innerHTML = `

            <option value="">
                Where needed most
            </option>

        `;


        causes.forEach(
            cause => {

                const option =
                    document.createElement(
                        "option"
                    );


                /*
                 * Keep the database ID as
                 * the actual value.
                 */

                option.value =
                    cause.id;


                option.textContent =
                    cause.title;


                option.dataset.slug =
                    cause.slug || "";


                option.dataset.cause =
                    cause.slug || "";


                causeSelect.appendChild(
                    option
                );

            }
        );

    }


    /* =====================================================
       DONATION TABS
    ===================================================== */

    const donationTabs =
        $$(".donation-tab");

    const cardPayment =
        $("cardPayment");

    const btcPayment =
        $("btcPayment");


    donationTabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    donationTabs.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    tab.classList.add(
                        "active"
                    );


                    const method =
                        tab.dataset.method;


                    if (
                        method ===
                        "btc"
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

        }
    );


    /* =====================================================
       FREQUENCY
    ===================================================== */

    const frequencyButtons =
        $$(".frequency-btn");


    let selectedFrequency =
        "once";


    frequencyButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    frequencyButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedFrequency =
                        button.dataset.frequency ||
                        "once";

                }
            );

        }
    );


    /* =====================================================
       AMOUNT BUTTONS
    ===================================================== */

    const amountButtons =
        $$(".amounts button");

    const amountInput =
        $("amount");


    amountButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    amountButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    if (amountInput) {

                        amountInput.value =
                            button.dataset.amount;

                    }

                }
            );

        }
    );


    if (amountInput) {

        amountInput.addEventListener(
            "input",
            () => {

                amountButtons.forEach(
                    button => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       DONATION MODAL
    ===================================================== */

    const donationModal =
        $("donationModal");

    const modalMessage =
        $("modalMessage");

    const closeModal =
        $("closeModal");

    const modalContinue =
        $("modalContinue");


    function showModal(
        html
    ) {

        if (modalMessage) {

            modalMessage.innerHTML =
                html;

        }


        if (donationModal) {

            donationModal.classList.add(
                "active"
            );

        }

    }


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
       FLUTTERWAVE PAYMENT
    ===================================================== */

    const donationForm =
        $("donationForm");


    if (donationForm) {

        donationForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                /* =========================================
                   DONOR FIELDS
                   Supports the fields we added earlier.
                ========================================= */

                const donorName =
                    $("donorName")?.value.trim() ||
                    "";


                const donorEmail =
                    $("donorEmail")?.value.trim() ||
                    "";


                const donorPhone =
                    $("donorPhone")?.value.trim() ||
                    "";


                /*
                 * If donor fields don't exist in the
                 * current HTML yet, stop here with a
                 * useful message instead of silently
                 * breaking checkout.
                 */

                if (!donorName) {

                    showModal(
                        `
                        <h3>Name required</h3>

                        <p>
                            Please enter your full name
                            before continuing.
                        </p>
                        `
                    );

                    return;

                }


                if (
                    !donorEmail ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(donorEmail)
                ) {

                    showModal(
                        `
                        <h3>Email required</h3>

                        <p>
                            Please enter a valid email
                            address before continuing.
                        </p>
                        `
                    );

                    return;

                }


                const amount =
                    Number(
                        amountInput?.value
                    );


                if (
                    !Number.isFinite(amount) ||
                    amount <= 0
                ) {

                    showModal(
                        `
                        <h3>Donation amount required</h3>

                        <p>
                            Please select or enter a
                            valid donation amount.
                        </p>
                        `
                    );

                    return;

                }


                const selectedOption =
                    causeSelect?.options[
                        causeSelect.selectedIndex
                    ];


                const causeId =
                    causeSelect?.value ||
                    null;


                const causeName =
                    selectedOption?.textContent
                        ?.trim() ||
                    "Where needed most";


                const submitButton =
                    donationForm.querySelector(
                        ".donate-submit"
                    );


                const originalButtonText =
                    submitButton?.innerHTML ||
                    "Continue with Card";


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.innerHTML =
                        `
                        Processing...
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        `;

                }


                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .functions
                            .invoke(
                                "create-flutterwave-payment",
                                {
                                    body: {

                                        amount:
                                            amount,

                                        currency:
                                            "USD",

                                        email:
                                            donorEmail,

                                        name:
                                            donorName,

                                        phone:
                                            donorPhone,

                                        donation_id:
                                            causeId,

                                        cause:
                                            causeId,

                                        cause_name:
                                            causeName,

                                        frequency:
                                            selectedFrequency

                                    }
                                }
                            );


                    if (error) {
                        throw error;
                    }


                    if (
                        !data ||
                        !data.success ||
                        !data.payment_link
                    ) {

                        throw new Error(
                            data?.error ||
                            "Flutterwave did not return a payment link."
                        );

                    }


                    /*
                     * Store enough information to verify
                     * the transaction after Flutterwave
                     * redirects the donor back.
                     */

                    localStorage.setItem(
                        "gva_pending_donation",
                        JSON.stringify({

                            amount:
                                amount,

                            currency:
                                "USD",

                            donor_name:
                                donorName,

                            donor_email:
                                donorEmail,

                            donor_phone:
                                donorPhone,

                            cause_id:
                                causeId,

                            cause_name:
                                causeName,

                            frequency:
                                selectedFrequency,

                            tx_ref:
                                data.tx_ref ||
                                null,

                            created_at:
                                new Date()
                                    .toISOString()

                        })
                    );


                    /*
                     * Send donor to Flutterwave.
                     */

                    window.location.href =
                        data.payment_link;

                } catch (error) {

                    console.error(
                        "Payment initialization failed:",
                        error
                    );


                    showModal(
                        `
                        <h3>
                            Payment could not start
                        </h3>

                        <p>
                            We couldn't connect to
                            Flutterwave.
                        </p>

                        <p>
                            ${escapeHTML(
                                error?.message ||
                                "Please try again."
                            )}
                        </p>
                        `
                    );


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            originalButtonText;

                    }

                }

            }
        );

    }


    /* =====================================================
       FLUTTERWAVE RETURN
    ===================================================== */

    async function handleFlutterwaveReturn() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const status =
            params.get("status");


        const transactionId =
            params.get(
                "transaction_id"
            );


        const txRef =
            params.get(
                "tx_ref"
            );


        /*
         * Normal visit:
         * do nothing.
         */

        if (
            !status &&
            !transactionId &&
            !txRef
        ) {

            return;

        }


        /*
         * Read the pending donation.
         */

        let pendingDonation =
            null;


        try {

            const stored =
                localStorage.getItem(
                    "gva_pending_donation"
                );


            if (stored) {

                pendingDonation =
                    JSON.parse(
                        stored
                    );

            }

        } catch (error) {

            console.error(
                "Pending donation read error:",
                error
            );

        }


        /*
         * IMPORTANT:
         * We still verify the transaction even if
         * localStorage is missing, provided we have
         * the transaction ID.
         */

        if (
            status !== "successful" ||
            !transactionId
        ) {

            localStorage.removeItem(
                "gva_pending_donation"
            );


            showModal(
                `
                <h3>
                    Payment not completed
                </h3>

                <p>
                    The Flutterwave payment was not
                    completed successfully.
                </p>
                `
            );


            cleanFlutterwaveUrl();

            return;

        }


        /*
         * If localStorage is missing, we can still
         * verify the transaction itself.
         */

        showModal(
            `
            <h3>
                Verifying your payment...
            </h3>

            <p>
                Please wait while we securely confirm
                the transaction with Flutterwave.
            </p>
            `
        );


        try {

            const expectedAmount =
                pendingDonation?.amount ||
                null;


            const expectedCurrency =
                pendingDonation?.currency ||
                "USD";


            const {
                data,
                error
            } =
                await supabaseClient
                    .functions
                    .invoke(
                        "verify-flutterwave-payment",
                        {
                            body: {

                                transaction_id:
                                    transactionId,

                                tx_ref:
                                    txRef ||
                                    pendingDonation?.tx_ref ||
                                    null,

                                expected_amount:
                                    expectedAmount,

                                expected_currency:
                                    expectedCurrency

                            }
                        }
                    );


            if (error) {

                throw error;

            }


            if (
                !data ||
                data.verified !== true
            ) {

                throw new Error(
                    data?.error ||
                    data?.message ||
                    "Payment could not be verified."
                );

            }


            /*
             * SUCCESS
             */

            const verifiedAmount =
                Number(
                    data.transaction?.amount ||
                    pendingDonation?.amount ||
                    0
                );


            showModal(
                `
                <h3>
                    Thank you for caring. ❤️
                </h3>

                <p>
                    Your payment has been
                    successfully verified.
                </p>

                <p>
                    <strong>
                        ${formatCurrency(
                            verifiedAmount
                        )}
                    </strong>
                    has been confirmed.
                </p>

                <p>
                    Transaction ID:
                    <strong>
                        ${escapeHTML(
                            String(
                                data.transaction?.id ||
                                transactionId
                            )
                        )}
                    </strong>
                </p>
                `
            );


            /*
             * Keep the verified transaction temporarily.
             * We will use this in the next database step.
             */

            localStorage.setItem(
                "gva_verified_donation",
                JSON.stringify({

                    ...(pendingDonation || {}),

                    transaction_id:
                        data.transaction?.id ||
                        transactionId,

                    tx_ref:
                        data.transaction?.tx_ref ||
                        txRef ||
                        null,

                    flw_ref:
                        data.transaction?.flw_ref ||
                        null,

                    verified_amount:
                        data.transaction?.amount ||
                        verifiedAmount,

                    verified_currency:
                        data.transaction?.currency ||
                        expectedCurrency,

                    verified_at:
                        new Date()
                            .toISOString()

                })
            );


            localStorage.removeItem(
                "gva_pending_donation"
            );


            cleanFlutterwaveUrl();

        } catch (error) {

            console.error(
                "Flutterwave verification failed:",
                error
            );


            showModal(
                `
                <h3>
                    Verification needs attention
                </h3>

                <p>
                    Flutterwave returned the transaction,
                    but our secure verification check
                    did not complete.
                </p>

                <p>
                    Transaction ID:
                    <strong>
                        ${escapeHTML(
                            String(
                                transactionId
                            )
                        )}
                    </strong>
                </p>
                `
            );

        }

    }


    /* =====================================================
       CLEAN PAYMENT PARAMETERS
    ===================================================== */

    function cleanFlutterwaveUrl() {

        try {

            const cleanUrl =
                window.location.origin +
                window.location.pathname;

            window.history.replaceState(
                {},
                document.title,
                cleanUrl
            );

        } catch (error) {

            console.error(
                "URL cleanup error:",
                error
            );

        }

    }


    /* =====================================================
       BITCOIN COPY
    ===================================================== */

    const copyBtc =
        $("copyBtc");


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
                    btcAddress.textContent
                        .trim();


                if (!address) {
                    return;
                }


                try {

                    await navigator.clipboard
                        .writeText(
                            address
                        );


                    copyBtc.textContent =
                        "Copied!";


                    setTimeout(
                        () => {

                            copyBtc.textContent =
                                "Copy wallet address";

                        },
                        2000
                    );

                } catch (error) {

                    console.error(
                        "Clipboard error:",
                        error
                    );


                    copyBtc.textContent =
                        "Copy failed";


                    setTimeout(
                        () => {

                            copyBtc.textContent =
                                "Copy wallet address";

                        },
                        2000
                    );

                }

            }
        );

    }


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    $$(
        'a[href^="#"]'
    ).forEach(
        link => {

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


                    target.scrollIntoView(
                        {
                            behavior:
                                "smooth",
                            block:
                                "start"
                        }
                    );

                }
            );

        }
    );


    /* =====================================================
       START
    ===================================================== */

    /*
     * Attach the original static cause buttons
     * immediately.
     */

    attachCauseButtons();


    /*
     * Then load the published Supabase causes.
     */

    loadPublishedCauses();


    /*
     * Finally check whether Flutterwave has
     * redirected the donor back.
     */

    handleFlutterwaveReturn();

});
