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
    // Tableau pour stocker les messages d'erreur
    const errors = [];
    // Récupère les valeurs des champs du formulaire
    const fullName = contactFullName.value.trim();
    const email = contactEmail.value.trim();
    const company = contactCompany.value.trim();
    const sector = contactCompanySector.value.trim();

    // Validation du nom complet
    if (!fullName) {
        // Nom vide
        errors.push("The  name is required.");
    } else if (fullName.length < 2) {
            // Nom trop court
        errors.push("The name must contain at least 2 characters.");
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Vérifie si l'email est vide ou invalide
    if (!email) {
        // Email vide
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

let editingContactId = null;
let editingCompanyId = null;
// Fonction asynchrone pour sauvegarder un nouveau contact
async function saveContact() {
     // Détermine si on est en mode édition (true) ou création (false)
    const isEdit = editingContactId !== null;
     // Récupère le fichier avatar sélectionné (s’il existe)
    const avatarFile = contactAvatar.files[0];
    // Fonction interne qui envoie le contact quand l’avatar est prêt (URL ou Base64)
    const sendContact = async (avatarValue) => {
         // MODE ÉDITION
        try {

            if (isEdit) {
                // Met à jour la company associée au contact
                await fetch(`${apiUrlCompany}/${editingCompanyId}`, {
                    // Méthode HTTP pour mise à jour
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        // Nouveau nom de la company
                        name: contactCompany.value.trim(),
                          // Nouveau secteur de la company
                        sectors: contactCompanySector.value.trim()
                    })
                });

                // Met à jour le contact existant
                await fetch(`${apiUrlContact}/${editingContactId}`, {
                    // Méthode HTTP pour mise à jour
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                         // Nom complet du contact
                        fullName: contactFullName.value.trim(),
                        // Email du contact
                        email: contactEmail.value.trim(),
                         // Avatar (Base64 ou URL)
                        avatar: avatarValue,
                         // ID de la company liée
                        companyId: editingCompanyId
                    })
                });
                 // MODE CRÉATION
            } else {
                // Crée une nouvelle company
                const companyRes = await fetch(apiUrlCompany, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                          // Nom de la company
                        name: contactCompany.value.trim(),
                         // Secteur de la company
                        sectors: contactCompanySector.value.trim()
                    })
                });
                 // Convertit la réponse de l’API en objet JS
                const company = await companyRes.json();

                 // Crée un nouveau contact lié à la company créée
                await fetch(apiUrlContact, {
                    // Méthode HTTP pour création
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                       
                        fullName: contactFullName.value.trim(),
                        email: contactEmail.value.trim(),
                        avatar: avatarValue,
                        companyId: company.id
                    })
                });
            }
            // Réinitialise l’ID du contact en cours d’édition
            editingContactId = null;
              // Réinitialise l’ID de la company en cours d’édition
            editingCompanyId = null;
             // Ferme la fenêtre modale
            toggleModal(false);
            // Recharge la liste des contacts
            fetchContacts();
             // Réinitialise le formulaire
            document.getElementById("contact-form").reset();

        } catch (error) {
              // Affiche une erreur en cas d’échec
            console.error("Save failed:", error);
        }
    };
// GESTION DE L’AVATAR
 // Si un fichier avatar est sélectionné
    if (avatarFile) {
         // Crée un FileReader pour lire le fichier
        const reader = new FileReader();
         // Quand la lecture est terminée
        reader.onload = (e) => sendContact(e.target.result);
         // Lance la lecture du fichier en Base64
        reader.readAsDataURL(avatarFile);
    }
     // Si aucun avatar n’est sélectionné 
    else {
         // Génère un avatar avec les initiales via ui-avatars
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            contactFullName.value.trim()
        )}`;
        // Envoie le contact avec l’avatar en Base64
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
// Stocker les contacts en mémoire
let allContacts = [];
// Stocker les componies en memoire
let allCompanies = [];
// Fonction asynchrone pour récupérer et afficher la liste des contacts
async function fetchContacts() {
    
    try {
         // Envoie une requête GET vers l'API des contacts
        const response = await fetch(apiUrlContact);

        // Vérifie si la réponse est OK (code 200)
        if (response.ok) {
            const contacts = await response.json();
            // stockage global
             allContacts = contacts; 

              const responseCompanies = await fetch(apiUrlCompany);
             if (!responseCompanies.ok) throw new Error("Erreur lors de la récupération des companies");

              allCompanies = await responseCompanies.json();
            // Fonction pour afficher les contacts dans l’interface utilisateur
             displayContacts(getPaginatedContacts(allContacts));
            renderPagination(allContacts.length);

        } else {
             // Affiche une erreur si la récupération échoue
            console.error("Error fetching contacts");
        }
    } catch (error) {
         // Capture et affiche toute erreur réseau ou autre
        console.error("Error fetching contacts :", error);
    }
}
// pagination varaible
let currentPage = 1;
const contactsPerPage = 5;
//Fonction qui découpe les contacts pour ne retourner que ceux de la page courante
function getPaginatedContacts(contacts) {
    // Calcule l’index de départ en fonction de la page actuelle
  const start = (currentPage - 1) * contactsPerPage;
   // Calcule l’index de fin (non inclus dans slice)
  const end = start + contactsPerPage;
   // Retourne uniquement la portion du tableau correspondant à la page courante
  return contacts.slice(start, end);
}
// Fonction qui gère l’affichage des boutons de pagination
function renderPagination(totalContacts) {
    // Récupère le conteneur HTML de la pagination
  const pagination = document.getElementById("pagination");
   // Vide le contenu pour éviter les doublons
  pagination.innerHTML = "";
    // Calcule le nombre total de pages
  const totalPages = Math.ceil(totalContacts / contactsPerPage);

  // Crée le bouton "précédent"
  const prevBtn = document.createElement("button");
  // Définit le texte du bouton
  prevBtn.textContent = "<";
  // Désactive le bouton si on est déjà sur la première page
  prevBtn.disabled = currentPage === 1;
 // Ajoute un événement au clic sur le bouton PREV
  prevBtn.addEventListener("click", () => {
     // Vérifie qu’on n’est pas déjà sur la première page
    if (currentPage > 1) {
         // Décrémente la page courante
      currentPage--;
       // Réaffiche les contacts correspondant à la nouvelle page
      displayContacts(getPaginatedContacts(allContacts));
       // Met à jour l’état des boutons (activé/désactivé)
      renderPagination(totalContacts);
    }
  });

    // Crée le bouton "suivant"
  const nextBtn = document.createElement("button");
   // Définit le texte du bouton
  nextBtn.textContent = ">";
   // Désactive le bouton si on est déjà sur la dernière page
  nextBtn.disabled = currentPage === totalPages;
// Ajoute un événement au clic sur le bouton NEXT
  nextBtn.addEventListener("click", () => {
    // Vérifie qu’on n’est pas déjà sur la dernière page
    if (currentPage < totalPages) {
        // Incrémente la page courante
      currentPage++;
       // Réaffiche les contacts correspondant à la nouvelle page
      displayContacts(getPaginatedContacts(allContacts));
      // Met à jour l’état des boutons
      renderPagination(totalContacts);
    }
  });

   // Ajoute le bouton PREV dans le DOM
  pagination.appendChild(prevBtn);
  pagination.appendChild(nextBtn);
}



// Variable pour gérer le délai entre les frappes 
let searchTimeout;

// Fonction pour rechercher les contacts en mémoire
function searchContacts() {
   // Vérifie si les données (contacts et companies) sont chargées
  // si non, quitte la fonction pour éviter les erreurs
  if (!allContacts || !allCompanies) return;

 // Annule le timer précédent pour éviter de lancer plusieurs recherches trop rapidement
  clearTimeout(searchTimeout);
 // Définit un nouveau timer pour exécuter la recherche après un petit délai
  searchTimeout = setTimeout(() => {
    try {
        // Récupère la valeur de l'input, convertit en minuscules et supprime les espaces
      const query = document.getElementById("search-input").value.toLowerCase().trim();
        // Sélectionne l'élément HTML où le message d'erreur sera affiché
      const searchErrorMessage = document.getElementById("search-error-message");
          // Si l'input est vide, afficher tous les contacts et effacer le message d'erreur
      if (query === "") {
        currentPage = 1;
       displayContacts(getPaginatedContacts(allContacts));
        renderPagination(allContacts.length);

        if (searchErrorMessage) searchErrorMessage.innerHTML = "";
         // quitte la fonction pour ne pas continuer la recherche
        return;
      }
       // Filtre les contacts selon le texte de recherche
      const filteredContacts = allContacts.filter(contact => {
        // Trouve la company associée à ce contact via son ID
        const company = allCompanies.find(c => c.id === contact.companyId);
        return (
            // Retourne true si le nom, l'email, le nom de la company ou le secteur contiennent la recherche
          contact.fullName.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          (company?.name.toLowerCase().includes(query)) ||
          (company?.sectors.toLowerCase().includes(query))
        );
      });
       // Si aucun contact ne correspond, affiche un message d'erreur
      if (filteredContacts.length === 0) {
        if (searchErrorMessage) searchErrorMessage.innerHTML = `<p style="color:red">User not found</p>`;
      } else {
        // Sinon, efface le message d'erreur précédent et affiche les contacts filtrés
        if (searchErrorMessage) searchErrorMessage.innerHTML = "";
        currentPage = 1;
        displayContacts(getPaginatedContacts(filteredContacts));
        renderPagination(filteredContacts.length);
      }

    } catch (error) {
        // Capture et affiche toute erreur pendant la recherche
      console.error("Erreur lors de la recherche :", error);
      alert("Une erreur est survenue lors de la recherche. Vérifiez la console.");
    }
  }, 300); // délai de 300ms après la dernière frappe
}

// Événement sur l'input de recherche
document.getElementById("search-input").addEventListener("input", searchContacts);


// Fonction asynchrone pour afficher les contacts dans le tableau
 async function displayContacts(contacts) {
  // Récupère toutes les companies depuis l'API
   const companies = allCompanies;


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

        // Selectionne le bouton edit dans cette ligne
        const editBtn = contactItem.querySelector(".edit-btn");
// Ajoute un écouteur d'événement sur le bouton "éditer"
        editBtn.addEventListener("click", async () => {
            try {
                 // Envoie une requête GET pour récupérer le contact à partir de son ID
                const response = await fetch(`${apiUrlContact}/${contact.id}`);
                 // Vérifie si la réponse HTTP n'est pas correcte (404, 500, etc.)
                if (!response.ok) {
                    // Lance une erreur si le contact n'existe pas
                    throw new Error("Contact not found");
                }
                 // Convertit la réponse JSON en objet JavaScript
                const contactData = await response.json();

                // Préremplit le champ "Nom complet" avec les données du contact
                contactFullName.value = contactData.fullName;
                 // Préremplit le champ "Email" avec les données du contact
                contactEmail.value = contactData.email;

                // Envoie une requête GET pour récupérer la company liée au contact
                const companyResponse = await fetch(
                    `${apiUrlCompany}/${contactData.companyId}`
                );
                // Vérifie si la récupération de la company a réussi
                if (companyResponse.ok) {
                      // Convertit la réponse company en objet JavaScript
                    const companyData = await companyResponse.json();
                       // Préremplit le champ "Nom de la company"
                    contactCompany.value = companyData.name;
                      // Préremplit le champ "Secteur de la company"
                    contactCompanySector.value = companyData.sectors;
                }

                 // Stocke l’ID du contact en cours d’édition
                editingContactId = contactData.id;
                 // Stocke l’ID de la company associée au contact en cours d’édition
                editingCompanyId = contactData.companyId;

                 // Ouvre la fenêtre modale pour permettre l’édition du contact
                toggleModal(true);

            } catch (error) {
                 // Affiche l'erreur en cas de problème lors de la récupération des données
                console.error("Error fetching contact for edit:", error);
            }
        });

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
