// EDIT: change the WhatsApp number here if it changes (format: country code + number, no + or spaces)
const WHATSAPP_NUMBER = "254748414590";
const WHATSAPP_MESSAGE = "Hello Caldonald, I found your portfolio and I'd like to chat.";

// Opens WhatsApp with an optional custom pre-filled message.
// If no message is passed, falls back to the general greeting above.
function openWhatsApp(message){
  const text = message || WHATSAPP_MESSAGE;
  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener");
}

document.getElementById("whatsappBtn").addEventListener("click", () => openWhatsApp());
document.getElementById("whatsappBtn2").addEventListener("click", () => openWhatsApp());

// Each e-Citizen service card sends a pre-filled message naming that
// specific service, so you immediately know what the person needs.
document.querySelectorAll(".service-card[data-service]").forEach(function(card){
  card.addEventListener("click", function(){
    const service = card.getAttribute("data-service");
    openWhatsApp("Hello Caldonald, I'd like help with: " + service);
  });
  // keyboard accessibility: Enter/Space also triggers it
  card.addEventListener("keydown", function(e){
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      card.click();
    }
  });
});
