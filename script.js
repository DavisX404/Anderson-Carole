/* =============================================================
   INVITATION À LA DOT — JAVASCRIPT

   C'EST ICI QUE TU PERSONNALISES LES INFORMATIONS PRINCIPALES :
   1) les prénoms ;
   2) la date et l'heure de la dot ;
   3) l'adresse à ouvrir dans Google Maps ;
   4) les identifiants du formulaire Google pour les confirmations.
   ============================================================= */

// ----- 1. INFORMATIONS À PERSONNALISER -----
const COUPLE_FIRST_NAME = "Anderson";
const COUPLE_SECOND_NAME = "Carole";

// Format obligatoire : AAAA-MM-JJTHH:MM:SS
// Exemple : "2026-11-14T09:00:00" signifie le 14 novembre 2026 à 09 h 00.
// Le compte à rebours utilise l'heure locale du navigateur.
const WEDDING_DATE = "2026-11-14T09:00:00";

// Mets ici l'adresse exacte ou le nom du lieu à rechercher dans Google Maps.
const LOCATION_QUERY = "5.36430279461449,-3.9734620250162354";

// ----- 2. RÉCUPÉRER LES ÉLÉMENTS HTML -----
const envelopeScreen = document.getElementById("envelopeScreen");
const envelopeButton = document.getElementById("openInvitation");
const envelopeArt = document.getElementById("envelopeArt");
const invitation = document.getElementById("invitation");

const weddingMusic = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");
const musicButtonLabel = document.getElementById("musicButtonLabel");
const musicStatus = document.getElementById("musicStatus");

// ----- 3. AFFICHER LES PRÉNOMS ET LES INITIALES -----
// Le même nom apparaît à plusieurs endroits dans la page.
// Grâce à data-couple-names, il suffit de modifier les deux prénoms ci-dessus.
const coupleNames = `${COUPLE_FIRST_NAME} & ${COUPLE_SECOND_NAME}`;
document.querySelectorAll("[data-couple-names]").forEach((element) => {
  element.textContent = coupleNames;
});

// Les initiales du logo sont calculées à partir des deux prénoms.
const initials = `${COUPLE_FIRST_NAME.trim().charAt(0)}${COUPLE_SECOND_NAME.trim().charAt(0)}`.toUpperCase();
document.querySelectorAll("[data-initials]").forEach((element) => {
  element.textContent = initials;
});

document.title = `Invitation à la dot — ${COUPLE_FIRST_NAME} & ${COUPLE_SECOND_NAME}`;

const couplePhoto = document.getElementById("couplePhoto");
if (window.matchMedia("(hover: none)").matches) {
  couplePhoto.addEventListener("click", () => {
    const isActive = couplePhoto.classList.toggle("is-active");
    couplePhoto.setAttribute("aria-pressed", String(isActive));
  });
}

// ----- 4. FORMATER ET AFFICHER LA DATE -----
const weddingDate = new Date(WEDDING_DATE);
const dateIsValid = !Number.isNaN(weddingDate.getTime());

function capitalizeFirstLetter(text) {
  return text.charAt(0).toLocaleUpperCase("fr-FR") + text.slice(1);
}

if (dateIsValid) {
  const fullDate = capitalizeFirstLetter(
    new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(weddingDate)
  );

  // Actualise la date à deux endroits sans devoir modifier le HTML.
  const weddingDateLabel = document.getElementById("weddingDateLabel");
  const heroDate = document.getElementById("heroDate");
  if (weddingDateLabel) weddingDateLabel.textContent = fullDate;
  if (heroDate) heroDate.textContent = fullDate;
}

// ----- 5. OUVRIR L'ENVELOPPE -----
// Le clic joue l'animation, puis révèle la véritable page d'invitation.
envelopeButton.addEventListener("click", () => {
  envelopeButton.disabled = true; // Empêche les clics répétés pendant l'animation.
  envelopeArt.classList.add("is-opening");
  envelopeScreen.classList.add("is-leaving");

  // Le délai correspond à l'animation CSS de l'enveloppe.
  window.setTimeout(() => {
    envelopeScreen.classList.add("is-hidden");
    invitation.classList.remove("is-hidden");
    document.body.classList.remove("intro-active");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 700);
});

// ----- 6. COMPTE À REBOURS -----
const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const countdownMessage = document.getElementById("countdownMessage");

function updateCountdown() {
  if (!dateIsValid) {
    countdownMessage.textContent = "Vérifie le format de la date dans script.js.";
    return;
  }

  const now = new Date();
  const remainingMilliseconds = weddingDate.getTime() - now.getTime();

  // Si le jour de la dot est passé, on affiche des zéros et un message.
  if (remainingMilliseconds <= 0) {
    daysElement.textContent = "000";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    const sameCalendarDay = now.toDateString() === weddingDate.toDateString();
    countdownMessage.textContent = sameCalendarDay
      ? "C'est aujourd'hui ! Profitons de cette belle journée."
      : "Le grand jour est passé. Merci d'avoir partagé cette aventure avec nous.";
    return;
  }

  const totalSeconds = Math.floor(remainingMilliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysElement.textContent = String(days).padStart(3, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
  countdownMessage.textContent = "Chaque seconde nous rapproche de ce grand jour.";
}

updateCountdown();
window.setInterval(updateCountdown, 1000); // Actualise le compteur chaque seconde.

// ----- 7. MUSIQUE DE FOND -----
// Ajoute un fichier audio nommé exactement « musique.mp3 » à côté des 3 fichiers.
// La musique démarre uniquement après un clic sur le bouton (règle des navigateurs).
musicButton.addEventListener("click", async () => {
  if (weddingMusic.paused) {
    musicStatus.textContent = "Chargement de la musique…";

    try {
      await weddingMusic.play();
      musicButton.setAttribute("aria-pressed", "true");
      musicButtonLabel.textContent = "Mettre en pause";
      musicStatus.textContent = "Musique en cours de lecture.";
    } catch (error) {
      // Le message est utile si le fichier n'existe pas ou si son format est incorrect.
      musicButton.setAttribute("aria-pressed", "false");
      musicButtonLabel.textContent = "Écouter la musique";
      musicStatus.textContent = "Ajoute ton fichier audio « musique.mp3 » dans le dossier du site.";
    }
  } else {
    weddingMusic.pause();
    musicButton.setAttribute("aria-pressed", "false");
    musicButtonLabel.textContent = "Écouter la musique";
    musicStatus.textContent = "Musique en pause.";
  }
});

weddingMusic.addEventListener("ended", () => {
  musicButton.setAttribute("aria-pressed", "false");
  musicButtonLabel.textContent = "Écouter la musique";
});

// ----- 8. BOUTON DE LOCALISATION GOOGLE MAPS -----
const locationLink = document.getElementById("locationLink");
const mapsUrl = new URL("https://www.google.com/maps/search/");
mapsUrl.search = new URLSearchParams({ api: "1", query: LOCATION_QUERY }).toString();
locationLink.href = mapsUrl.toString();

// ----- 9. CONFIRMATION RSVP PAR GOOGLE FORMS -----
const rsvpForm = document.getElementById("rsvpForm");
const rsvpResponseFrame = document.getElementById("rsvpResponseFrame");
const rsvpSubmit = document.getElementById("rsvpSubmit");
const rsvpSubmitLabel = document.getElementById("rsvpSubmitLabel");
const rsvpStatus = document.getElementById("rsvpStatus");
const rsvpSuccess = document.getElementById("rsvpSuccess");
const rsvpAddPerson = document.getElementById("rsvpAddPerson");

let responseFrameReady = rsvpResponseFrame.contentDocument?.readyState === "complete";
let rsvpSubmissionPending = false;
let rsvpResponseTimeout;

function setRsvpLoading(isLoading) {
  rsvpSubmit.disabled = isLoading;
  rsvpSubmit.classList.toggle("is-loading", isLoading);
  rsvpSubmit.setAttribute("aria-busy", String(isLoading));
  rsvpSubmitLabel.textContent = isLoading ? "Envoi en cours…" : "Confirmer ma présence";
}

rsvpResponseFrame.addEventListener("load", () => {
  if (!responseFrameReady) {
    responseFrameReady = true;
    return;
  }

  if (!rsvpSubmissionPending) return;

  rsvpSubmissionPending = false;
  window.clearTimeout(rsvpResponseTimeout);
  rsvpForm.reset();
  setRsvpLoading(false);
  rsvpForm.hidden = true;
  rsvpSuccess.hidden = false;
  rsvpAddPerson.focus();
});

rsvpForm.addEventListener("input", () => {
  if (!rsvpSubmissionPending) rsvpStatus.hidden = true;
});

rsvpForm.addEventListener("submit", (event) => {
  if (!responseFrameReady) {
    event.preventDefault();
    rsvpStatus.textContent = "Le formulaire est en cours de préparation. Réessayez dans un instant.";
    rsvpStatus.hidden = false;
    return;
  }

  rsvpSubmissionPending = true;
  setRsvpLoading(true);
  rsvpStatus.textContent = "Envoi de votre confirmation…";
  rsvpStatus.hidden = false;

  rsvpResponseTimeout = window.setTimeout(() => {
    if (!rsvpSubmissionPending) return;

    rsvpSubmissionPending = false;
    setRsvpLoading(false);
    rsvpStatus.textContent = "L’envoi n’a pas pu être confirmé. Vérifiez votre connexion et réessayez.";
  }, 15000);
});

rsvpAddPerson.addEventListener("click", () => {
  rsvpSuccess.hidden = true;
  rsvpForm.reset();
  rsvpStatus.hidden = true;
  setRsvpLoading(false);
  rsvpForm.hidden = false;
  document.getElementById("rsvpName").focus();
});

// FIN : tout le comportement interactif de l'invitation est défini ci-dessus.
