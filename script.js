// EDIT: change the WhatsApp number here if it changes (format: country code + number, no + or spaces)
const WHATSAPP_NUMBER = "254748414590";
// General button message — used by the main "Chat on WhatsApp" buttons
// (hero + contact), which are for website/portfolio enquiries, not the
// e-Citizen service popups (those send their own specific message).
const WHATSAPP_MESSAGE = "Hello Caldonald, I found your portfolio and I'd like to talk about getting a website or portfolio built.";

// Opens WhatsApp with an optional custom pre-filled message.
// If no message is passed, falls back to the general greeting above.
function openWhatsApp(message){
  const text = message || WHATSAPP_MESSAGE;
  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener");
}

document.getElementById("whatsappBtn").addEventListener("click", () => openWhatsApp());
document.getElementById("whatsappBtn2").addEventListener("click", () => openWhatsApp());

// ============================================================
// SUB-SERVICES
// ============================================================
// EDIT: this is the full list of sub-services shown for each
// e-Citizen card. The object key MUST match the card's
// data-key attribute in index.html.
// Add, remove, or rename entries freely — each string becomes
// one tappable option in that card's popup.
const SUB_SERVICES = {
  "business-registration": [
    "Business Name Registration",
    "Company (Ltd) Registration",
    "Business Name Search & Reservation",
    "Change of Business Details"
  ],
  "kra": [
    "KRA PIN Registration",
    "KRA PIN Recovery",
    "Change of Primary Email / Primary Phone Number",
    "Filing Tax Returns"
  ],
  "birth-certificate": [
    "New Birth Certificate Application",
    "Late Registration of Birth",
    "Correction of Birth Certificate Details"
  ],
  "marriage-certificate": [
    "Marriage Certificate Application",
    "Marriage Certificate Search",
    "Correction of Marriage Certificate Details"
  ],
  "police-clearance": [
    "New Certificate of Good Conduct",
    "Renewal of Certificate of Good Conduct"
  ],
  "passport": [
    "New Passport Application",
    "Passport Renewal",
    "Lost or Damaged Passport Replacement"
  ],
  "driving-license": [
    "New Driving License (DL) Application",
    "Driving License Renewal",
    "Provisional License / Learner's Permit"
  ],
  "tsc": [
    "TSC New Registration",
    "TSC Number Reprint / Recovery",
    "TSC Registration Update (upgrade, name change, etc.)"
  ],
  "helb": [
    "HELB First-Time Application",
    "HELB Subsequent Application",
    "Change of HELB Profile Details (bank, contacts, etc.)"
  ],
  "nursing": [
    "NCK Registration",
    "NCK Licence Renewal",
    "Verification / Retrieval of NCK Documents"
  ]
};

// ============================================================
// POPUP (list of sub-services -> confirm -> WhatsApp)
// ============================================================
const modal = document.getElementById("serviceModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

let lastFocusedCard = null;   // returns focus here when popup closes
let currentMainService = "";  // e.g. "KRA Services"
let currentKey = "";          // e.g. "kra"

function openModal(){
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedCard){ lastFocusedCard.focus(); }
}

// Step 1: show the sub-service list for the clicked card
function showSubServiceList(mainService, key){
  currentMainService = mainService;
  currentKey = key;
  modalTitle.textContent = mainService;

  const options = SUB_SERVICES[key] || [];
  modalBody.innerHTML = "";

  const intro = document.createElement("p");
  intro.className = "modal-intro";
  intro.textContent = "Tap a service below to chat with me on WhatsApp for more discussion:";
  modalBody.appendChild(intro);

  const list = document.createElement("div");
  list.className = "modal-option-list";
  options.forEach((sub) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "modal-option";
    btn.textContent = sub;
    btn.addEventListener("click", () => showConfirmStep(sub));
    list.appendChild(btn);
  });
  modalBody.appendChild(list);

  openModal();
}

// Step 2: confirm the chosen sub-service before messaging WhatsApp
function showConfirmStep(subService){
  modalTitle.textContent = "Confirm your request";
  modalBody.innerHTML = "";

  const question = document.createElement("p");
  question.className = "modal-intro";
  question.innerHTML = "You're about to message Caldonald on WhatsApp about:<br><strong>" + subService + "</strong>";
  modalBody.appendChild(question);

  const actions = document.createElement("div");
  actions.className = "modal-confirm-actions";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn modal-cancel";
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", () => showSubServiceList(currentMainService, currentKey));

  const continueBtn = document.createElement("button");
  continueBtn.type = "button";
  continueBtn.className = "btn primary modal-continue";
  continueBtn.textContent = "Continue";
  continueBtn.addEventListener("click", () => {
    openWhatsApp("Hello Caldonald, I'd like help with: " + subService);
    closeModal();
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(continueBtn);
  modalBody.appendChild(actions);
}

// Wire up every e-Citizen service card to open the popup
document.querySelectorAll(".service-card[data-key]").forEach(function(card){
  card.addEventListener("click", function(){
    lastFocusedCard = card;
    const mainService = card.getAttribute("data-service");
    const key = card.getAttribute("data-key");
    showSubServiceList(mainService, key);
  });
  // keyboard accessibility: Enter/Space also triggers it
  card.addEventListener("keydown", function(e){
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      card.click();
    }
  });
});

// Closing the popup: the × button, clicking the overlay, or Escape
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", function(e){
  if (e.target === modal){ closeModal(); }
});
document.addEventListener("keydown", function(e){
  if (e.key === "Escape" && modal.classList.contains("open")){ closeModal(); }
});
