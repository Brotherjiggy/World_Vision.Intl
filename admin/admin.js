/* =========================================================
   GLOBAL VISION AID — ADMIN AUTHENTICATION
========================================================= */

/*
   IMPORTANT:
   Replace the two values below with the public values
   from:

   Supabase
   → Project Settings
   → API
*/


const SUPABASE_URL = "https://xhokpjbikxlbxrbjtqit.supabase.co";

const SUPABASE_KEY = "sb_publishable_6bJ1WmGEKvDQ1pPafd0TlQ_XIcr0U52";


/* =========================================================
   SUPABASE CLIENT
========================================================= */

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   ELEMENTS
========================================================= */

const loginForm = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const loginButtonText = document.getElementById("loginButtonText");
const loginSpinner = document.getElementById("loginSpinner");

const loginMessage = document.getElementById("loginMessage");

const togglePassword = document.getElementById("togglePassword");


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        togglePassword.innerHTML = isPassword
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';

        togglePassword.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );
    });
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(message) {

    if (!loginMessage) return;

    loginMessage.textContent = message;
    loginMessage.classList.add("show");
}


function clearMessage() {

    if (!loginMessage) return;

    loginMessage.textContent = "";
    loginMessage.classList.remove("show");
}


/* =========================================================
   BUTTON LOADING STATE
========================================================= */

function setLoading(isLoading) {

    if (!loginButton) return;

    loginButton.disabled = isLoading;

    if (loginButtonText) {

        loginButtonText.textContent =
            isLoading
                ? "Signing in..."
                : "Sign in";
    }

    if (loginSpinner) {

        loginSpinner.hidden = !isLoading;
    }
}


/* =========================================================
   CHECK ADMIN PROFILE
========================================================= */

async function verifyAdmin(user) {

    const { data, error } = await supabaseClient
        .from("admin_profiles")
        .select("id, full_name, role, active")
        .eq("id", user.id)
        .maybeSingle();


    if (error) {

        console.error(
            "Admin profile error:",
            error
        );

        return {
            success: false,
            message:
                "We couldn't verify your administrator profile."
        };
    }


    if (!data) {

        return {
            success: false,
            message:
                "This account does not have administrator access."
        };
    }


    if (!data.active) {

        return {
            success: false,
            message:
                "This administrator account is currently inactive."
        };
    }


    return {
        success: true,
        profile: data
    };
}


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearMessage();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            if (!email || !password) {

                showMessage(
                    "Please enter your email and password."
                );

                return;
            }


            setLoading(true);


            try {

                const { data, error } =
                    await supabaseClient.auth.signInWithPassword({
                        email,
                        password
                    });


                if (error) {

                    console.error(
                        "Login error:",
                        error
                    );

                    showMessage(
                        "Invalid email or password."
                    );

                    setLoading(false);

                    return;
                }


                if (!data.user) {

                    showMessage(
                        "We couldn't complete the login."
                    );

                    setLoading(false);

                    return;
                }


                const adminCheck =
                    await verifyAdmin(data.user);


                if (!adminCheck.success) {

                    await supabaseClient.auth.signOut();

                    showMessage(
                        adminCheck.message
                    );

                    setLoading(false);

                    return;
                }


                /*
                   Admin verified.

                   The dashboard page will be created
                   in the next stage.
                */

                window.location.href =
                    "dashboard.html";

            } catch (error) {

                console.error(
                    "Unexpected login error:",
                    error
                );

                showMessage(
                    "Something went wrong. Please try again."
                );

                setLoading(false);
            }
        }
    );
}


/* =========================================================
   CHECK EXISTING SESSION
========================================================= */

async function checkExistingSession() {

    try {

        const {
            data: { session }
        } = await supabaseClient.auth.getSession();


        if (!session || !session.user) {
            return;
        }


        const adminCheck =
            await verifyAdmin(session.user);


        if (adminCheck.success) {

            window.location.href =
                "dashboard.html";
        }

    } catch (error) {

        console.error(
            "Session check error:",
            error
        );
    }
}


checkExistingSession();
