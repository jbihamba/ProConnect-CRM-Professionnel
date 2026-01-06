// URL de l’API backend pour gérer les contacts
const apiUrl = "http://localhost:3000/contact";
// Récupération des éléments du DOM
// Bouton qui ouvre le formulaire / modal d’ajout de contact
const addContactBtn = document.getElementById("add-contact-btn");
// Fenêtre modale contenant le formulaire de contact
const contactModal = document.getElementById("contact-modal");
// Bouton pour fermer la fenêtre modale
const closeContactModalBtn = document.getElementById("close-contact-modal-btn");
//modal elements
const contactFullName = document.getElementById("contact-full-name");
const contactEmail = document.getElementById("contact-email");
const contactCompany = document.getElementById("contact-company");
const contactCompanySector = document.getElementById("contact-sector");
const contactAvatar = document.getElementById("contact-photo");
const saveContactBtn = document.getElementById("save-contact-btn");


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

// Fonction pour enregistrer un nouveau contact
async function saveContact() {
        // Récupération des valeurs du formulaire
        const newContact = {
            fullName: contactFullName.value,
            email: contactEmail.value,
            company: contactCompany.value,
            sector: contactCompanySector.value,
            avatar: contactAvatar.value
        };
        try {
            // Envoi de la requête POST à l’API
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newContact)
            });
            if (response.ok) {
                // Fermeture du modal après l'enregistrement
                toggleModal(false);
                // Actualisation de la liste des contacts
                fetchContacts();
            } else {
                console.error("Error saving contact");
            }
        } catch (error) {
            console.error("Error saving contact :", error);
        }
    }
