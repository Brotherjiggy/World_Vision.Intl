/* =========================================================
   GLOBAL VISION AID
   MAIN JAVASCRIPT
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
       ELEMENT HELPERS
    ===================================================== */

    const get = (selector) =>
        document.querySelector(selector);

    const getAll = (selector) =>
        document.querySelectorAll(selector);


    /* =====================================================
       PRELOADER
    ===================================================== */

    window.addEventListener("load", () => {

        const preloader =
            get("#preloader");

        if (preloader) {
            setTimeout(() => {
                preloader.classList.add("loaded");
            }, 400);
        }

    });


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuToggle =
        get("#menu-toggle");

    const navLinks =
        get("#nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "active"
                );

                menuToggle.classList.toggle(
                    "active"
                );

            }
        );

        getAll("#nav-links a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        navLinks.classList.remove(
                            "active"
                        );

                        menuToggle.classList.remove(
                            "active"
                        );

                    }
                );

            });

    }


    /* =====================================================
       HERO SLIDESHOW
    ===================================================== */

    const heroSlides =
        getAll(".hero-slide");

    let currentHeroSlide = 0;

    if (heroSlides.length > 1) {

        heroSlides.forEach(
            (slide, index) => {

                slide.classList.toggle(
                    "active",
                    index === 0
                );

            }
        );

        setInterval(() => {

            heroSlides[
                currentHeroSlide
            ].classList.remove("active");

            currentHeroSlide =
                (currentHeroSlide + 1) %
                heroSlides.length;

            heroSlides[
                currentHeroSlide
            ].classList.add("active");

        }, 6000);

    }


    /* =====================================================
       IMPACT COUNTERS
    ===================================================== */

    const counters =
        getAll("[data-counter]");

    const animateCounter =
        (element) => {

            const target =
                Number(
                    element.dataset.counter
                );

            if (!Number.isFinite(target)) {
                return;
            }

            const duration = 1600;
            const startTime = performance.now();

            const update = (currentTime) => {

                const progress =
                    Math.min(
                        (currentTime - startTime) /
                        duration,
                        1
                    );

                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );

                element.textContent =
                    Math.floor(
                        target * eased
                    ).toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                }

            };

            requestAnimationFrame(update);

        };


    if (counters.length) {

        const counterObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                animateCounter(
                                    entry.target
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.3
                }
            );

        counters.forEach(
            (counter) => {
                counterObserver.observe(counter);
            }
        );

    }


    /* =====================================================
       PUBLISHED CAUSES
    ===================================================== */

    const causesGrid =
        get("#causesGrid");

    const causeSelect =
        get("#causeSelect");


    async function loadPublishedCauses() {

        if (!causesGrid && !causeSelect) {
            return;
        }

        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("causes")
                .select(
                    "id,title,slug,category,location,status,target_amount,raised_amount,image_url,short_description,description,featured,created_at"
                )
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
                throw error;
            }

            if (!data || !data.length) {
                return;
            }


            /* =============================================
               CAUSE CARDS
            ============================================= */

            if (causesGrid) {

                causesGrid.innerHTML =
                    data.map((cause) => {

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
                                    Math.round(
                                        (
                                            raised /
                                            target
                                        ) * 100
                                    )
                                )
                                : 0;

                        const image =
                            cause.image_url ||
                            "images/hero-1.jpg";

                        return `
                            <article class="cause-card">

                                <div class="cause-image">
                                    <img
                                        src="${image}"
                                        alt="${escapeHtml(
                                            cause.title || "Cause"
                                        )}"
                                        loading="lazy"
                                    >
                                </div>

                                <div class="cause-content">

                                    ${
                                        cause.category
                                            ? `<span class="cause-category">
                                                ${escapeHtml(
                                                    cause.category
                                                )}
                                            </span>`
                                            : ""
                                    }

                                    <h3>
                                        ${escapeHtml(
                                            cause.title || ""
                                        )}
                                    </h3>

                                    ${
                                        cause.location
                                            ? `<p class="cause-location">
                                                ${escapeHtml(
                                                    cause.location
                                                )}
                                            </p>`
                                            : ""
                                    }

                                    <p>
                                        ${escapeHtml(
                                            cause.short_description ||
                                            cause.description ||
                                            ""
                                        )}
                                    </p>

                                    <div class="cause-progress">

                                        <div class="progress-bar">

                                            <span
                                                style="width:${percentage}%"
                                            ></span>

                                        </div>

                                        <div class="progress-info">

                                            <strong>
                                                ${percentage}%
                                            </strong>

                                            <span>
                                                $${raised.toLocaleString()}
                                                raised
                                            </span>

                                        </div>

                                    </div>

                                    <a
                                        href="cause.html?slug=${encodeURIComponent(
                                            cause.slug || ""
                                        )}"
                                        class="cause-btn"
                                    >
                                        Learn More
                                    </a>

                                </div>

                            </article>
                        `;

                    }).join("");

            }


            /* =============================================
               DONATION CAUSE SELECT
            ============================================= */

            if (causeSelect) {

                const currentValue =
                    causeSelect.value;

                causeSelect.innerHTML =
                    `
                    <option value="">
                        Select a cause
                    </option>
                    `;

                data.forEach((cause) => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        cause.id;

                    option.textContent =
                        cause.title;

                    option.dataset.slug =
                        cause.slug || "";

                    option.dataset.name =
                        cause.title || "";

                    causeSelect.appendChild(
                        option
                    );

                });

                if (currentValue) {
                    causeSelect.value =
                        currentValue;
                }

            }

        } catch (error) {

            console.error(
                "Unable to load causes:",
                error
            );

        }

    }


    /* =====================================================
       DONATION TABS
    ===================================================== */

    const cardTab =
        get("#cardTab");

    const btcTab =
        get("#btcTab");

    const cardPayment =
        get("#cardPayment");

    const btcPayment =
        get("#btcPayment");


    function showCardPayment() {

        if (cardPayment) {
            cardPayment.style.display =
                "block";
        }

        if (btcPayment) {
            btcPayment.style.display =
                "none";
        }

        if (cardTab) {
            cardTab.classList.add("active");
        }

        if (btcTab) {
            btcTab.classList.remove("active");
        }

    }


    function showBitcoinPayment() {

        if (cardPayment) {
            cardPayment.style.display =
                "none";
        }

        if (btcPayment) {
            btcPayment.style.display =
                "block";
        }

        if (cardTab) {
            cardTab.classList.remove("active");
        }

        if (btcTab) {
            btcTab.classList.add("active");
        }

    }


    if (cardTab) {
        cardTab.addEventListener(
            "click",
            showCardPayment
        );
    }

    if (btcTab) {
        btcTab.addEventListener(
            "click",
            showBitcoinPayment
        );


    }


    /* =====================================================
       FREQUENCY BUTTONS
    ===================================================== */

    const frequencyButtons =
        getAll(".frequency-btn");

    let selectedFrequency = "once";

    frequencyButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    frequencyButtons.forEach(
                        (item) => {
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
        getAll(".amounts button");

    const amountInput =
        get("#amount");

    amountButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    amountButtons.forEach(
                        (item) => {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );

                    button.classList.add(
                        "active"
                    );

                    const amount =
                        button.dataset.amount;

                    if (amountInput) {
                        amountInput.value =
                            amount || "";
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
                    (button) => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       MODAL
    ===================================================== */

    const donationModal =
        get("#donationModal");

    const modalMessage =
        get("#modalMessage");

    const modalContinue =
        get("#modalContinue");


    function showModal(message) {

        if (modalMessage) {
            modalMessage.innerHTML =
                message;
        }

        if (donationModal) {
            donationModal.classList.add(
                "active"
            );
        }

    }


    function closeModal() {

        if (donationModal) {
            donationModal.classList.remove(
                "active"
            );
        }

    }


    if (modalContinue) {

        modalContinue.addEventListener(
            "click",
            closeModal
        );

    }


    if (donationModal) {

        donationModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    donationModal
                ) {
                    closeModal();
                }

            }
        );

    }


    /* =====================================================
       FLUTTERWAVE RETURN / VERIFICATION
    ===================================================== */

    async function handleFlutterwaveReturn() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const status =
            params.get("status");

        const transactionId =
            params.get("transaction_id");

        const txRef =
            params.get("tx_ref");


        /*
         * If there are no Flutterwave parameters,
         * this is a normal page visit.
         */

        if (
            !status &&
            !transactionId &&
            !txRef
        ) {
            return;
        }


        /* =============================================
           READ PENDING DONATION
        ============================================= */

        let pendingDonation = null;

        try {

            const stored =
                localStorage.getItem(
                    "gva_pending_donation"
                );

            if (stored) {

                pendingDonation =
                    JSON.parse(stored);

            }

        } catch (error) {

            console.error(
                "Unable to read pending donation:",
                error
            );

        }


        /* =============================================
           FAILED / CANCELLED PAYMENT
        ============================================= */

        if (
            status !== "successful" ||
            !transactionId
        ) {

            localStorage.removeItem(
                "gva_pending_donation"
            );

            showModal(
                `
                <h3>Payment not completed</h3>

                <p>
                    Your donation payment was not
                    completed or was cancelled.
                </p>

                <p>
                    No donation has been recorded.
                </p>
                `
            );

            cleanFlutterwaveUrl();

            return;
        }


        /* =============================================
           MISSING LOCAL DONATION DATA
        ============================================= */

        if (!pendingDonation) {

            showModal(
                `
                <h3>Payment received</h3>

                <p>
                    We received the payment return
                    from Flutterwave, but the original
                    donation details are no longer
                    available on this device.
                </p>

                <p>
                    Transaction ID:
                    <strong>${escapeHtml(
                        transactionId
                    )}</strong>
                </p>
                `
            );

            cleanFlutterwaveUrl();

            return;
        }


        /* =============================================
           VERIFY WITH SUPABASE
        ============================================= */

        showModal(
            `
            <h3>Verifying your donation...</h3>

            <p>
                Please wait while we securely confirm
                your payment with Flutterwave.
            </p>
            `
        );


        try {

            const {
                data,
                error
            } = await supabaseClient
                .functions
                .invoke(
                    "verify-flutterwave-payment",
                    {
                        body: {

                            transaction_id:
                                transactionId,

                            tx_ref:
                                txRef ||
                                pendingDonation.tx_ref,

                            expected_amount:
                                pendingDonation.amount,

                            expected_currency:
                                pendingDonation.currency ||
                                "USD"

                        }
                    }
                );


            if (error) {
                throw error;
            }


            /* =========================================
               VERIFICATION FAILED
            ========================================= */

            if (
                !data ||
                data.verified !== true
            ) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Payment could not be verified."
                );

            }


            /* =========================================
               VERIFIED SUCCESS
            ========================================= */

            showModal(
                `
                <h3>Thank you for your donation! ❤️</h3>

                <p>
                    Your payment has been successfully
                    verified.
                </p>

                <p>
                    <strong>
                        $${Number(
                            data.transaction?.amount ||
                            pendingDonation.amount ||
                            0
                        ).toLocaleString()}
                        USD
                    </strong>
                    has been confirmed.
                </p>

                <p>
                    Transaction reference:
                    <strong>
                        ${escapeHtml(
                            data.transaction?.tx_ref ||
                            txRef ||
                            ""
                        )}
                    </strong>
                </p>

                <p>
                    Your support helps Global Vision Aid
                    continue its humanitarian work.
                </p>
                `
            );


            /*
             * Keep the verified transaction information
             * temporarily available for the next step.
             */

            localStorage.setItem(
                "gva_verified_donation",
                JSON.stringify({
                    ...pendingDonation,
                    transaction_id:
                        data.transaction?.id ||
                        transactionId,
                    tx_ref:
                        data.transaction?.tx_ref ||
                        txRef,
                    flw_ref:
                        data.transaction?.flw_ref ||
                        null,
                    verified_amount:
                        data.transaction?.amount ||
                        pendingDonation.amount,
                    verified_currency:
                        data.transaction?.currency ||
                        pendingDonation.currency ||
                        "USD",
                    verified_at:
                        new Date().toISOString()
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
                <h3>We couldn't confirm the payment yet</h3>

                <p>
                    Flutterwave returned your payment,
                    but our verification check did not
                    complete successfully.
                </p>

                <p>
                    Please do not pay again immediately.
                    Your transaction can be checked using
                    this reference:
                </p>

                <strong>
                    ${escapeHtml(
                        txRef || transactionId || ""
                    )}
                </strong>
                `
            );

        }

    }


    /* =====================================================
       CLEAN FLUTTERWAVE URL
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
                "Unable to clean payment URL:",
                error
            );

        }

    }


    /* =====================================================
       DONATION FORM
    ===================================================== */

    const donationForm =
        get("#donationForm");

    if (donationForm) {

        donationForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                /* =========================================
                   DONOR INFORMATION
                ========================================= */

                const donorName =
                    get("#donorName")?.value.trim();

                const donorEmail =
                    get("#donorEmail")?.value.trim();

                const donorPhone =
                    get("#donorPhone")?.value.trim();


                /* =========================================
                   AMOUNT
                ========================================= */

                const amount =
                    Number(
                        amountInput?.value
                    );


                /* =========================================
                   CAUSE
                ========================================= */

                const selectedCause =
                    causeSelect?.selectedOptions?.[0];

                const causeId =
                    causeSelect?.value || null;

                const causeName =
                    selectedCause?.dataset?.name ||
                    selectedCause?.textContent?.trim() ||
                    "";


                /* =========================================
                   VALIDATION
                ========================================= */

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
                    !donorEmail.includes("@")
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


                /* =========================================
                   DISABLE SUBMIT BUTTON
                ========================================= */

                const submitButton =
                    donationForm.querySelector(
                        ".donate-submit"
                    );

                const originalText =
                    submitButton?.textContent ||
                    "Continue with Card";


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Connecting to Flutterwave...";

                }


                try {

                    /* =====================================
                       CREATE PAYMENT
                    ===================================== */

                    const {
                        data,
                        error
                    } = await supabaseClient
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


                    /* =====================================
                       SAVE PENDING PAYMENT
                    ===================================== */

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
                                new Date().toISOString()

                        })
                    );


                    /* =====================================
                       REDIRECT TO FLUTTERWAVE
                    ===================================== */

                    window.location.href =
                        data.payment_link;

                } catch (error) {

                    console.error(
                        "Payment initialization failed:",
                        error
                    );

                    showModal(
                        `
                        <h3>Payment could not start</h3>

                        <p>
                            We couldn't connect to the
                            payment service.
                        </p>

                        <p>
                            ${escapeHtml(
                                error?.message ||
                                "Please try again."
                            )}
                        </p>
                        `
                    );


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            originalText;

                    }

                }

            }
        );

    }


    /* =====================================================
       BITCOIN COPY
    ===================================================== */

    const copyBtc =
        get("#copyBtc");

    if (copyBtc) {

        copyBtc.addEventListener(
            "click",
            async () => {

                const address =
                    "bc1q3dpschks6nq3dfmefezsuzzm8ryy09kp0nznee";

                try {

                    await navigator.clipboard.writeText(
                        address
                    );

                    const original =
                        copyBtc.textContent;

                    copyBtc.textContent =
                        "Copied!";

                    setTimeout(() => {

                        copyBtc.textContent =
                            original;

                    }, 1800);

                } catch (error) {

                    console.error(
                        "Unable to copy Bitcoin address:",
                        error
                    );

                }

            }
        );

    }


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    getAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        get(targetId);

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
       HTML ESCAPE
    ===================================================== */

    function escapeHtml(value) {

        return String(value ?? "")
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


    /* =====================================================
       START
    ===================================================== */

    loadPublishedCauses();

    /*
     * Run this after the page has loaded so that a
     * Flutterwave redirect can be detected.
     */

    handleFlutterwaveReturn();

});
