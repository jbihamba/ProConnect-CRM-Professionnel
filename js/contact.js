// URL de l’API backend pour gérer les contacts
const apiUrlContact = "http://localhost:3000/contact";
const apiUrlCompany = "http://localhost:3000/company";
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

//Fonction pour sécuriser le texte et éviter injection HTML
function escapeHtml(str){
     // si null ou undefined, utiliser une chaîne vide
     str = str || "";
     return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
}

// Fonction pour valider les données du formulaire de contact
  function validateContactForm() {
    const errors = [];
    const fullName = contactFullName.value.trim();
    const email = contactEmail.value.trim();
    const company = contactCompany.value.trim();
    const sector = contactCompanySector.value.trim();

    // Validation du nom
    if (!fullName) {
        errors.push("The  name is required.");
    } else if (fullName.length < 2) {
        errors.push("The name must contain at least 2 characters.");
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.push("Email is required.");
    } else if (!emailRegex.test(email)) {
        errors.push("The email format is invalid.");
    }

    // Validation de l'entreprise (optionnelle mais limitée)
    if (company && company.length > 50) {
        errors.push("The company name is too long.");
    }

    // Validation du secteur
    if (!sector) {
        errors.push("The sector is required.");
    }

    // Résultat final
    return {
        isValid: errors.length === 0,
        errors
    };
}
// Fonction asynchrone pour sauvegarder un nouveau contact
async function saveContact() {
    // Génère des IDs uniques pour le contact et la company
    const contactId = Date.now().toString(); 
    const companyId = Date.now().toString() + "-c";
    // Crée l'objet company à envoyer à l'API
    const companyData = {
        id: companyId,
        name: contactCompany.value.trim(),
        sectors: contactCompanySector.value.trim()
    };
// Récupère le fichier choisi dans l'input type="file" pour l'avatar
    const avatarFile = contactAvatar.files[0];

    // Fonction interne pour envoyer le contact avec un avatar déjà prêt (Base64 ou URL)
    const sendContact = async (avatarValue) => {
         // Création de l'objet contact à envoyer à l'API
        const newContact = {
            id: contactId,
            fullName: contactFullName.value.trim(),
            email: contactEmail.value.trim(),
            companyId: companyId,
            avatar: avatarValue
        };

        try {
             // Envoie les données de la company à l'API
            await fetch(apiUrlCompany, {
                 // Méthode POST pour création
                method: "POST",
                 // Type JSON
                headers: {"Content-Type": "application/json"},
                // Convertir l'objet company en JSON
                body: JSON.stringify(companyData)
            });

           // Envoie les données du contact à l'API
            await fetch(apiUrlContact, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newContact)
            });

            // Ferme la fenêtre modale après l'enregistrement
            toggleModal(false);
             // Recharge la liste des contacts affichée dans le tableau
            fetchContacts();
             // Réinitialise le formulaire pour effacer les champs
            document.getElementById("contact-form").reset();
        } catch (err) {
             // Affiche une erreur en console si l'envoi échoue
            console.error("Error saving contact:", err);
        }
    };
// Vérifie si l'utilisateur a choisi un fichier avatar
    if (avatarFile) {
         // Création d'un FileReader pour lire le fichier en Base64
        const reader = new FileReader();
         // Quand la lecture du fichier est terminée
        reader.onload = (e) => {
             // Appelle sendContact avec la donnée Base64 de l'image
            sendContact(e.target.result); // Base64
        };
        // Commence la lecture du fichier en tant que DataURL (Base64)
        reader.readAsDataURL(avatarFile);
    } else {
         // Si aucun fichier n'est choisi, génère un avatar avec les initiales via ui-avatars.com
        const fullName = contactFullName.value.trim();
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;
            // Appelle sendContact avec l'URL générée
        sendContact(avatarUrl);
    }
}

// Événement de clic sur le bouton d’enregistrement du contact
saveContactBtn.addEventListener("click", () => {
     // Valide le formulaire et récupère les erreurs éventuelles
    const validation = validateContactForm();
      // Récupère l'élément DOM où les messages d'erreur seront affichés
    const erreurMessage = document.getElementById("erreur-message");
    // Masque les messages d'erreur précédents
    erreurMessage.style.display = "none";
    erreurMessage.innerHTML = "";
    // Si le formulaire est valide, enregistre le contact
    if (validation.isValid) {
          // Appelle la fonction pour sauvegarder le contact
        saveContact();
    } else {
         // Sinon, affiche les erreurs
        erreurMessage.style.display = "block";
         // Joint toutes les erreurs avec un saut de ligne HTML
        erreurMessage.innerHTML = validation.errors.join("<br>");
         // Met le texte des erreurs en rouge
        erreurMessage.style.color = "red";
    }
});

// Fonction asynchrone pour récupérer et afficher la liste des contacts
async function fetchContacts() {
    
    try {
         // Envoie une requête GET vers l'API des contacts
        const response = await fetch(apiUrlContact);

        // Vérifie si la réponse est OK (code 200)
        if (response.ok) {
            const contacts = await response.json();
            // Fonction pour afficher les contacts dans l’interface utilisateur
            displayContacts(contacts);
        } else {
             // Affiche une erreur si la récupération échoue
            console.error("Error fetching contacts");
        }
    } catch (error) {
         // Capture et affiche toute erreur réseau ou autre
        console.error("Error fetching contacts :", error);
    }
}

// Fonction asynchrone pour afficher les contacts dans le tableau
 async function displayContacts(contacts) {
  // Récupère toutes les companies depuis l'API
    const companies = await fetch(apiUrlCompany).then(res => res.json());

    // Récupère l'élément tbody du tableau des contacts
    const contactsList = document.getElementById("contacts-table-body");
      // Vide le tableau avant de le remplir
    contactsList.innerHTML = ""; 
// Parcourt chaque contact et crée une ligne dans le tableau
    contacts.forEach(contact => {
         // Cherche la company correspondante via l'ID
        const company = companies.find(c => c.id === contact.companyId);
         // Si la company existe, récupère son nom et son secteur
        const companyName = company ? company.name : "";
        const companySector = company ? company.sectors : "";
// Crée une nouvelle ligne (<tr>) pour le tableau
        const contactItem = document.createElement("tr");
        contactItem.className = "contact-item";
         // Remplit la ligne avec les données du contact
        contactItem.innerHTML = `
            
                          <td><input type="checkbox" class="contact-checkbox"></td>
                          <td><img src="${contact.avatar}" alt="" class="contact-avatar"></td>
                          <td>${escapeHtml(contact.fullName)}</td>
                          <td>${escapeHtml(contact.email)}</td>
                          <td>${escapeHtml(companyName)}</td>
                          <td>${escapeHtml(companySector)}</td>
                           <td class="contact-actions">
                            <button class="action-btn edit-btn" title="Update"><i class="bi bi-pen-fill"></i></button>
                            <button class="action-btn delete-btn" title="Delete"><i class="bi bi-trash-fill"></i></button>
                          </td>
                        ` ;
            // Ajoute la ligne au tableau des contacts
        contactsList.appendChild(contactItem);

        // Sélectionne le bouton delete dans cette ligne
        const deleteBtn = contactItem.querySelector(".delete-btn");

        // Ajoute un événement clic pour supprimer le contact
        deleteBtn.addEventListener("click", async () => {
            try {
                // Envoie une requête DELETE à l'API pour ce contact
                const response = await fetch(`${apiUrlContact}/${contact.id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    // Supprime la ligne du tableau immédiatement
                    contactItem.remove();
                    alert(`Contact ${contact.fullName} successfully deleted`);
                } else {
                    console.error("Error deleting contact");
                }
            } catch (error) {
                console.error("Network error during deletion :", error);
            }
        });
    });
}              
// Appel initial pour charger les contacts au démarrage
fetchContacts();
