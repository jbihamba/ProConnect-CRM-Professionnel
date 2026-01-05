// URL de l’API backend pour gérer les contacts
const apiUrl = "http://localhost:3000/contact";
// Récupération des éléments du DOM
// Bouton qui ouvre le formulaire / modal d’ajout de contact
const addContactBtn = document.getElementById("add-contact-btn");
// Fenêtre modale contenant le formulaire de contact
const contactModal = document.getElementById("contact-modal");
// Bouton pour fermer la fenêtre modale
const closeContactModalBtn = document.getElementById("close-contact-modal-btn");


// Gestion des événements
// Fonction qui affiche ou cache la fenêtre modale
function toggleModal(isOpen) {
     // Ajoute ou enlève la classe "hidden" selon la valeur de isOpen
  contactModal.classList.toggle("hidden", !isOpen);
}
//  ouvre la fenêtre modale
addContactBtn.addEventListener("click", () => toggleModal(true));
//  ferme la fenêtre modale
closeContactModalBtn.addEventListener("click", () => toggleModal(false));

