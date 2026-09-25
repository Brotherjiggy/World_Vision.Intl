const donationModal =
  document.getElementById("donationModal");

const donationCause =
  document.getElementById("donationCause");

const customAmount =
  document.getElementById("customAmount");

let selectedAmount = 50;


/*
====================================
MOBILE MENU
====================================
*/

const menuBtn =
  document.getElementById("menuBtn");

const nav =
  document.getElementById("nav");

menuBtn.addEventListener("click", function () {

  nav.classList.toggle("open");

});


/*
====================================
DONATION MODAL
====================================
*/

function openDonation(cause) {

  if (cause) {

    donationCause.value = cause;

  }

  donationModal.showModal();

}


function closeDonation() {

  donationModal.close();

}


/*
====================================
DONATION AMOUNT
====================================
*/

function selectAmount(amount) {

  selectedAmount = amount;

  customAmount.value = "";

}


/*
====================================
GET DONATION
====================================
*/

function getDonationAmount() {

  const custom =
    Number(customAmount.value);

  if (custom && custom > 0) {

    return custom;

  }

  return selectedAmount;

}


/*
====================================
CREDIT CARD
====================================

IMPORTANT:

Do NOT put Stripe secret keys here.

This button will eventually call
your secure backend.

====================================
*/

function payWithCard() {

  const amount =
    getDonationAmount();

  const cause =
    donationCause.value;

  if (!amount || amount < 1) {

    alert(
      "Please enter a valid donation amount."
    );

    return;

  }


  /*
  TEMPORARY MESSAGE

  Later this becomes:

  fetch("YOUR-BACKEND/api/stripe")
  */

  alert(
    "Card checkout is ready to connect.\n\n" +
    "Amount: $" + amount +
    "\nCause: " + cause
  );

}


/*
====================================
BITCOIN
====================================
*/

function payWithBitcoin() {

  const amount =
    getDonationAmount();

  const cause =
    donationCause.value;

  if (!amount || amount < 1) {

    alert(
      "Please enter a valid donation amount."
    );

    return;

  }


  /*
  TEMPORARY MESSAGE

  Later this becomes a BTCPay
  hosted invoice.

  NEVER put a BTCPay private/API
  key inside this file.
  */

  alert(
    "Bitcoin checkout is ready to connect.\n\n" +
    "Amount: $" + amount +
    "\nCause: " + cause
  );

}
