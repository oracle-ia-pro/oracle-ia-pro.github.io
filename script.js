/* ============================================================
   NOAM DOUMENC — JAVASCRIPT
   3 petites fonctions, independantes les unes des autres :
   1. afficherAnnee()        -> met l'annee a jour dans le pied de page
   2. activerNavigation()    -> surligne le lien de la section visible
   3. activerFormulaire()    -> ouvre un mail pre-rempli au clic
   ============================================================ */


/* ------------------------------------------------------------
   1. ANNÉE AUTOMATIQUE DANS LE PIED DE PAGE
   ------------------------------------------------------------ */
function afficherAnnee() {
  const champAnnee = document.getElementById("year");
  if (champAnnee) {
    champAnnee.textContent = new Date().getFullYear();
  }
}


/* ------------------------------------------------------------
   2. NAVIGATION : surligner le lien de la section a l'ecran
   On utilise IntersectionObserver : le navigateur nous previent
   quand une section entre ou sort de l'ecran. C'est plus leger
   qu'ecouter le scroll en permanence.
   ------------------------------------------------------------ */
function activerNavigation() {
  const liens = document.querySelectorAll(".topbar__nav a");
  if (liens.length === 0) return;

  // On associe chaque section a son lien : { "apropos": <a>, ... }
  const liensParSection = {};
  liens.forEach(function (lien) {
    const id = lien.getAttribute("href").replace("#", "");
    if (document.getElementById(id)) {
      liensParSection[id] = lien;
    }
  });

  const observateur = new IntersectionObserver(
    function (entrees) {
      entrees.forEach(function (entree) {
        const lien = liensParSection[entree.target.id];
        if (!lien) return;
        if (entree.isIntersecting) {
          liens.forEach(function (l) { l.classList.remove("is-active"); });
          lien.classList.add("is-active");
        }
      });
    },
    // La section est "active" quand elle occupe la bande centrale de l'ecran.
    { rootMargin: "-45% 0px -45% 0px" }
  );

  Object.keys(liensParSection).forEach(function (id) {
    observateur.observe(document.getElementById(id));
  });
}


/* ------------------------------------------------------------
   3. FORMULAIRE DE CONTACT
   Il n'envoie rien tout seul (un site statique ne peut pas envoyer
   de mail). Il construit un lien "mailto:" et ouvre la messagerie
   du visiteur avec l'objet et le message deja ecrits.

   L'adresse de destination se change dans index.html,
   attribut data-email du <form>.
   ------------------------------------------------------------ */
function activerFormulaire() {
  const formulaire = document.getElementById("contact-form");
  if (!formulaire) return;

  const message = document.getElementById("form-status");
  const destinataire = formulaire.dataset.email || "noam.doumenc@gmail.com";

  formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault(); // on empeche le rechargement de la page

    const nom = formulaire.nom.value.trim();
    const email = formulaire.email.value.trim();
    const texte = formulaire.message.value.trim();

    // --- Verification simple des champs ---
    const champsManquants = [];
    if (nom === "") champsManquants.push("nom");
    if (email === "") champsManquants.push("email");
    if (texte === "") champsManquants.push("message");

    // On marque en rouge les champs vides
    formulaire.querySelectorAll(".field").forEach(function (champ) {
      const saisie = champ.querySelector("input, textarea");
      champ.classList.toggle("is-invalid", saisie && saisie.value.trim() === "");
    });

    if (champsManquants.length > 0) {
      message.textContent = "Merci de remplir : " + champsManquants.join(", ") + ".";
      message.classList.add("is-error");
      return;
    }

    // Format d'email tres basique : quelque chose@quelque chose.quelque chose
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.textContent = "Cette adresse email ne semble pas valide.";
      message.classList.add("is-error");
      return;
    }

    // --- Construction du mail ---
    const objet = "Contact via le portfolio — " + nom;
    const corps =
      texte +
      "\n\n—\n" +
      nom + "\n" +
      email;

    // encodeURIComponent() protege les accents, espaces et retours a la ligne.
    const lien =
      "mailto:" + destinataire +
      "?subject=" + encodeURIComponent(objet) +
      "&body=" + encodeURIComponent(corps);

    window.location.href = lien;

    message.classList.remove("is-error");
    message.textContent = "Votre messagerie vient de s'ouvrir. Si rien ne se passe, écrivez directement à " + destinataire + ".";
  });
}


/* ------------------------------------------------------------
   Lancement une fois la page chargee
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", function () {
  afficherAnnee();
  activerNavigation();
  activerFormulaire();
});
