// URL de l’API backend pour gérer les contacts
const apiUrlContact = "http://localhost:3000/contact";
const apiUrlCompany = "http://localhost:3000/company";
// Récupération des éléments du DOM
// Bouton qui ouvre le formulaire / modal d’ajout de contact
const addContactBtn = document.getElementById("add-contact-btn") as HTMLElement;
// Fenêtre modale contenant le formulaire de contact
const contactModal = document.getElementById("contact-modal") as HTMLElement;
// Bouton pour fermer la fenêtre modale
const closeContactModalBtn = document.getElementById("close-contact-modal-btn") as HTMLElement;
//modal elements
const contactFullName = document.getElementById("contact-full-name") as HTMLInputElement;
const contactEmail = document.getElementById("contact-email") as HTMLInputElement;
const contactCompany = document.getElementById("contact-company") as HTMLInputElement;
const contactCompanySector = document.getElementById("contact-sector") as HTMLInputElement;
const contactAvatar = document.getElementById("contact-photo") as HTMLInputElement;
const saveContactBtn = document.getElementById("save-contact-btn") as HTMLElement;

interface Company {
  id: string;
  name: string;
  sectors: string;
}

interface Contact {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  companyId: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
declare global {
  interface Window {
    injectContactDetails: (contactId: string) => void;
  }
}


// Gestion des événements
// Fonction qui affiche ou cache la fenêtre modale
function toggleModal(isOpen : boolean) : void {
     // Ajoute ou enlève la classe "hidden" selon la valeur de isOpen
  contactModal.classList.toggle("hidden", !isOpen);
}
//  ouvre la fenêtre modale
addContactBtn.addEventListener("click", () => toggleModal(true));
//  ferme la fenêtre modale
closeContactModalBtn.addEventListener("click", () => toggleModal(false));

//Fonction pour sécuriser le texte et éviter injection HTML
function escapeHtml(str: string = ""): string {
     // si null ou undefined, utiliser une chaîne vide
     str = str || "";
     return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
}

// Fonction pour valider les données du formulaire de contact
  function validateContactForm(): ValidationResult {
    // Tableau pour stocker les messages d'erreur
    const errors : string[] = [];
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

let editingContactId : string | null = null;
let editingCompanyId : string | null = null;
// Fonction asynchrone pour sauvegarder un nouveau contact
async function saveContact() {
     // Détermine si on est en mode édition (true) ou création (false)
    const isEdit = editingContactId !== null;
     // Récupère le fichier avatar sélectionné (s’il existe)
    const avatarFile : File | null = contactAvatar.files[0] ?? null;
    // Fonction interne qui envoie le contact quand l’avatar est prêt (URL ou Base64)
    const sendContact = async (avatarValue : string | null) => {
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
            (document.getElementById("contact-form") as HTMLFormElement).reset();

        } catch (error) {
              // Affiche une erreur en cas d’échec
            console.error("Save failed:", error);
        }
    };
// GESTION DE L’AVATAR
 // Si un fichier avatar est sélectionné
    if (avatarFile) {
         // Crée un FileReader pour lire le fichier
        const reader : FileReader = new FileReader();
         // Quand la lecture est terminée
        reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        sendContact(typeof result === "string" ? result : null);
        };

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
    const erreurMessage = document.getElementById("erreur-message") as HTMLElement;
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
let allContacts : Contact[] = [];
// Stocker les componies en memoire
let allCompanies : Company[] = [];
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
function getPaginatedContacts(contacts : Contact[]) : Contact[] {
    // Calcule l’index de départ en fonction de la page actuelle
  const start = (currentPage - 1) * contactsPerPage;
   // Calcule l’index de fin (non inclus dans slice)
  const end = start + contactsPerPage;
   // Retourne uniquement la portion du tableau correspondant à la page courante
  return contacts.slice(start, end);
}
// Fonction qui gère l’affichage des boutons de pagination
function renderPagination(totalContacts: number) {
    // Récupère le conteneur HTML de la pagination
  const pagination = document.getElementById("pagination") as HTMLElement;
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
let searchTimeout : number | null = null;

// Fonction pour rechercher les contacts en mémoire
function searchContacts() : void {
   // Vérifie si les données (contacts et companies) sont chargées
  // si non, quitte la fonction pour éviter les erreurs
  if (!allContacts || !allCompanies) return;

 // Annule le timer précédent pour éviter de lancer plusieurs recherches trop rapidement
  clearTimeout(searchTimeout as number);
 // Définit un nouveau timer pour exécuter la recherche après un petit délai
  searchTimeout = setTimeout(() => {
    try {
        // Récupère la valeur de l'input, convertit en minuscules et supprime les espaces
      const query = (document.getElementById("search-input") as HTMLInputElement).value.toLowerCase().trim();
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
(document.getElementById("search-input") as HTMLInputElement).addEventListener("input", searchContacts as EventListener);

// Récupère une company par ID
function getCompanyById(companies : Company[], companyId: string) : void | Company | null {
     //Parcourt le tableau des companies et retourne celle dont l'id correspond
  return companies.find(c => c.id === companyId) || null;
}

// Crée une ligne (<tr>) pour un contact
function createContactRow(contact: Contact, company:Company) {
    // Crée un élément HTML <tr> (ligne de tableau)
  const tr = document.createElement("tr");
    // Ajoute une classe CSS à la ligne pour le style
  tr.className = "contact-item";
 // Définit le contenu HTML de la ligne avec les données du contact
  tr.innerHTML = `
    <td><input type="checkbox" class="contact-checkbox"></td>
    <td><img src="${contact.avatar}" alt="" class="contact-avatar"></td>
    <td >${escapeHtml(contact.fullName)}</td>
    <td>${escapeHtml(contact.email)}</td>
    <td>${escapeHtml(company?.name || "")}</td>
    <td>${escapeHtml(company?.sectors || "")}</td>
    <td class="contact-actions">
      <button class="action-btn edit-btn" title="Update">
        <i class="bi bi-pen-fill"></i>
      </button>
      <button class="action-btn delete-btn" title="Delete">
        <i class="bi bi-trash-fill"></i>
      </button>
    </td>
  `;
        tr.addEventListener("click", (e: MouseEvent) => {
         const target = e.target as HTMLElement | null;
        if (target?.closest(".contact-actions")) return;
        window.injectContactDetails(contact.id);
        });
        
     // Retourne la ligne <tr> complètement construite
  return tr;

}

// Gestion du bouton "Edit"
function handleEdit(contact: Contact, rowElement: HTMLElement) {
    // Sélectionne le bouton "edit" dans la ligne du contact
  const editBtn = rowElement.querySelector(".edit-btn") as HTMLElement;
 // Ajoute un écouteur d'événement au clic sur le bouton "edit"
  editBtn.addEventListener("click", async () => {
    try {
          // Envoie une requête GET pour récupérer le contact depuis l'API
      const response = await fetch(`${apiUrlContact}/${contact.id}`);
        // Vérifie si la réponse HTTP est valide
      if (!response.ok) {
        throw new Error("Contact not found");
      }
       // Convertit la réponse en objet JavaScript
      const contactData = await response.json();
      // Préremplit le champ "Nom complet" du formulaire
      contactFullName.value = contactData.fullName;
       // Préremplit le champ "Email" du formulaire
      contactEmail.value = contactData.email;
      // Récupère la company liée au contact
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
       // Stocke l'ID du contact en cours d'édition
      editingContactId = contactData.id;
       // Stocke l'ID de la company associée
      editingCompanyId = contactData.companyId;
       // Ouvre la fenêtre modale d'édition
      toggleModal(true);
    } catch (error) {
        // Affiche l'erreur en cas de problème réseau ou logique
      console.error("Error fetching contact for edit:", error);
    }
  });
}

// Gestion du bouton "Delete"
function handleDelete(contact: Contact, rowElement: HTMLElement) {
     // Sélectionne le bouton "delete" dans la ligne du contact
  const deleteBtn = rowElement.querySelector(".delete-btn") as HTMLElement;
     // Ajoute un écouteur d'événement au clic sur le bouton "delete"
  deleteBtn.addEventListener("click", async () => {
    try {
          // Envoie une requête DELETE à l'API pour supprimer le contact
      const response = await fetch(`${apiUrlContact}/${contact.id}`, {
        method: "DELETE"
      });
        // Vérifie si la suppression a réussi
      if (response.ok) {
         // Supprime immédiatement la ligne du tableau
        rowElement.remove();
         // Affiche un message de confirmation
        alert(`Contact ${contact.fullName} successfully deleted`);
      } else {
         // Affiche une erreur si la suppression a échoué côté serveur
        console.error("Error deleting contact");
      }
    } catch (error) {
        // Affiche une erreur en cas de problème réseau
      console.error("Network error during deletion:", error);
    }
  });
}

// Fonction principale d’affichage
async function displayContacts(contacts: Contact[]) {
     // Récupère la liste complète des companies déjà chargées
  const companies = allCompanies;
  // Sélectionne le <tbody> du tableau des contacts
  const contactsList = document.getElementById("contacts-table-body") as HTMLElement;
     // Vide le tableau avant de le remplir à nouveau
  contactsList.innerHTML = "";
     // Parcourt chaque contact reçu en paramètre
  contacts.forEach(contact => {
    // Récupère la company associée au contact
    const company = getCompanyById(companies, contact.companyId);
     // Crée la ligne du tableau pour ce contact
    const row = createContactRow(contact as Contact, company as Company);
     // Attache la logique d'édition à la ligne
    handleEdit(contact, row);
     // Attache la logique de suppression à la ligne
    handleDelete(contact, row);
    // Ajoute la ligne au tableau
    contactsList.appendChild(row);
  });
}
// On récupère l'élément <select> qui permet de filtrer les contacts
const filterMain = document.getElementById("filter-main") as HTMLSelectElement;
// On ajoute un écouteur d'événement qui se déclenche quand l'utilisateur change l'option du select
filterMain.addEventListener("change", () => {
      // Vérifie que les listes de contacts et de companies existent et ne sont pas vides
  if (!allContacts.length || !allCompanies.length) return;
 // Crée un objet pour accéder rapidement aux companies via leur ID
  const companyMap = Object.fromEntries(allCompanies.map(c => [c.id, c]));
   // Initialisation du tableau qui contiendra les contacts filtrés
  let filteredContacts : Contact[] = [];
// Si l'utilisateur choisit "All Contacts", on affiche tous les contacts
  if (filterMain.value === "all") {
    filteredContacts = allContacts;
    // Si l'utilisateur choisit "Company", on veut afficher un contact unique par company
  } else if (filterMain.value === "company") {
     // Crée un Set pour garder la trace des company déjà ajoutées
    const seenCompanies = new Set();
     // Filtre les contacts
    filteredContacts = allContacts.filter(c => {
         // récupère la company du contact
      const co = companyMap[c.companyId];
      // ignore si company manquante ou déjà vue
      if (!co || seenCompanies.has(co.id)) return false;
      // ajoute cette company au Set pour éviter les doublons
      seenCompanies.add(co.id);
      return true;
    });
      // Si l'utilisateur choisit "Sector", on veut afficher un contact unique par secteur
  } else if (filterMain.value === "sector") {
    // Crée un Set pour garder la trace des secteurs déjà ajoutés
    const seenSectors = new Set();
    // Filtre les contacts
    filteredContacts = allContacts.filter(c => {
        // récupère la company du contact
      const co = companyMap[c.companyId];
      // ignore si company manquante, secteur vide ou déjà ajouté
      if (!co || !co.sectors || seenSectors.has(co.sectors)) return false;
      // ajoute ce secteur au Set pour éviter les doublons
      seenSectors.add(co.sectors);
       // garde ce contact
      return true;
    });
  }
 // Réinitialise la page courante pour la pagination
  currentPage = 1;
  // Affiche les contacts filtrés avec pagination
  displayContacts(getPaginatedContacts(filteredContacts));
   // Met à jour l'affichage de la pagination
  renderPagination(filteredContacts.length);
});

// On attend que tout le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
      // Récupère l'élément de la modal des détails du contact
  const contactDetailsModal = document.getElementById("contact-details-modal");
  const overlay = document.getElementById("contact-modal-overlay");
  const closeBtn = document.getElementById("close-modal-btn");

// Fonction pour ouvrir la modal des détails
  function openDetailsModal() {
     // Retire la classe "hidden" si la modal existe
    if (contactDetailsModal) contactDetailsModal.classList.remove("hidden");
      // Retire la classe "hidden" si l'overlay existe
    if (overlay) overlay.classList.remove("hidden");
  }


  // Fonction pour fermer la modal des détails
  function closeDetailsModal() {
      // Ajoute la classe "hidden" si la modal existe
    if (contactDetailsModal) contactDetailsModal.classList.add("hidden");
      // Ajoute la classe "hidden" si l'overlay existe
    if (overlay) overlay.classList.add("hidden");
  }
// Si le bouton de fermeture existe, on ajoute un écouteur au clic pour fermer la modal
  if (closeBtn) closeBtn.addEventListener("click", closeDetailsModal);
    // Si l'overlay existe, on ajoute un écouteur au clic pour fermer la modal
  if (overlay) overlay.addEventListener("click", closeDetailsModal);

  // On définit la fonction injectContactDetails sur l'objet global "window"
  // pour qu'elle soit accessible depuis d'autres parties du code
  window.injectContactDetails = function(contactId : string) {
     // Cherche le contact dans le tableau allContacts correspondant à l'ID
    const contact = allContacts.find(c => c.id === contactId);
     // Si aucun contact n'est trouvé, on quitte la fonction
    if (!contact) return;
     // Cherche la company associée au contact via son companyId
    const company = allCompanies.find(co => co.id === contact.companyId);
    // Récupère les éléments du DOM où on affichera les détails
    const avatarEl = document.getElementById("modal-avatar") as HTMLImageElement;
    const nameEl = document.getElementById("modal-fullname") as HTMLElement;
    const emailEl = document.getElementById("modal-email") as HTMLElement;
    const companyEl = document.getElementById("modal-company") as HTMLElement;
    const sectorEl = document.getElementById("modal-sector") as HTMLElement;

    // Met à jour l'avatar (ou affiche un avatar par défaut si absent)
    if (avatarEl) avatarEl.src = contact.avatar || "https://ui-avatars.com/api/?name=User";
    // Met à jour le nom complet du contact
    if (nameEl) nameEl.textContent = contact.fullName || "-";
    // Met à jour l'email du contact
    if (emailEl) emailEl.textContent = contact.email || "-";
     // Met à jour le nom de la company (ou "—" si absent)
    if (companyEl) companyEl.textContent = company?.name || "—";
    if (sectorEl) sectorEl.textContent = company?.sectors || "—";
      // Ouvre la modal après avoir injecté toutes les données
    openDetailsModal();
  };
  
});

// Chargement initial
fetchContacts();
