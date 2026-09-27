// =========================================================
// GLOBAL VISION AID — DYNAMIC CAUSE DETAILS
// =========================================================

const SUPABASE_URL =
    "https://xhokpjbikxlbxrbjtqit.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_6bJ1WmGEKvDQ1pPafd0TlQ_XIcr0U52";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================================================
// ELEMENTS
// =========================================================

const loadingEl = document.getElementById("causeLoading");
const errorEl = document.getElementById("causeError");
const contentEl = document.getElementById("causeContent");

const imageEl = document.getElementById("causeImage");
const categoryEl = document.getElementById("causeCategory");
const titleEl = document.getElementById("causeTitle");
const locationEl = document.getElementById("causeLocation");

const shortDescriptionEl =
    document.getElementById("causeShortDescription");

const raisedEl =
    document.getElementById("causeRaised");

const goalEl =
    document.getElementById("causeGoal");

const progressEl =
    document.getElementById("causeProgress");

const percentEl =
    document.getElementById("causePercent");

const descriptionEl =
    document.getElementById("causeDescription");

const supportButton =
    document.getElementById("supportCauseButton");


// =========================================================
// HELPERS
// =========================================================

function formatCurrency(amount) {
    const value = Number(amount) || 0;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(value);
}


function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getCauseSlug() {
    const params = new URLSearchParams(
        window.location.search
    );

    return params.get("slug");
}


function showError() {
    loadingEl.style.display = "none";
    contentEl.classList.remove("show");
    errorEl.classList.add("show");
}


// =========================================================
// LOAD CAUSE
// =========================================================

async function loadCause() {

    const slug = getCauseSlug();

    if (!slug) {
        showError();
        return;
    }


    try {

        const {
            data: cause,
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
            .eq("slug", slug)
            .eq("status", "published")
            .maybeSingle();


        if (error) {
            console.error(
                "Supabase cause error:",
                error
            );

            showError();
            return;
        }


        if (!cause) {
            showError();
            return;
        }


        renderCause(cause);

    } catch (err) {

        console.error(
            "Unexpected cause error:",
            err
        );

        showError();
    }
}


// =========================================================
// RENDER CAUSE
// =========================================================

function renderCause(cause) {

    const title =
        cause.title || "Untitled Cause";

    const category =
        cause.category || "Community Support";

    const location =
        cause.location || "Global";

    const shortDescription =
        cause.short_description ||
        "Your support can help make a meaningful difference.";

    const description =
        cause.description ||
        shortDescription;

    const raised =
        Number(cause.raised_amount) || 0;

    const target =
        Number(cause.target_amount) || 0;


    // -------------------------------------------------------
    // IMAGE
    // -------------------------------------------------------

    const image =
        cause.image_url &&
        cause.image_url.trim()
            ? cause.image_url
            : "images/story-1.jpg";

    imageEl.src = image;

    imageEl.alt = title;

    imageEl.onerror = function () {
        this.onerror = null;
        this.src = "images/story-1.jpg";
    };


    // -------------------------------------------------------
    // BASIC INFORMATION
    // -------------------------------------------------------

    categoryEl.textContent =
        category;

    titleEl.textContent =
        title;

    locationEl.textContent =
        `📍 ${location}`;

    shortDescriptionEl.textContent =
        shortDescription;


    // -------------------------------------------------------
    // PROGRESS
    // -------------------------------------------------------

    const percentage =
        target > 0
            ? Math.min(
                100,
                Math.round(
                    (raised / target) * 100
                )
            )
            : 0;


    raisedEl.textContent =
        formatCurrency(raised);

    goalEl.textContent =
        `Goal: ${formatCurrency(target)}`;

    percentEl.textContent =
        `${percentage}%`;

    progressEl.style.width =
        `${percentage}%`;


    // -------------------------------------------------------
    // FULL DESCRIPTION
    // -------------------------------------------------------

    descriptionEl.innerHTML =
        escapeHTML(description)
            .replace(/\n/g, "<br><br>");


    // -------------------------------------------------------
    // SUPPORT BUTTON
    // -------------------------------------------------------

    supportButton.href =
        `index.html?cause=${encodeURIComponent(cause.slug)}#donate`;


    // -------------------------------------------------------
    // PAGE TITLE
    // -------------------------------------------------------

    document.title =
        `${title} | Global Vision Aid`;


    // -------------------------------------------------------
    // SHOW PAGE
    // -------------------------------------------------------

    loadingEl.style.display =
        "none";

    errorEl.classList.remove("show");

    contentEl.classList.add("show");
}


// =========================================================
// START
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    loadCause
);
