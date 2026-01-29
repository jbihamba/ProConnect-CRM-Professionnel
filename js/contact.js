var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// URL de l’API backend pour gérer les contacts
var apiUrlContact = "http://localhost:3000/contact";
var apiUrlCompany = "http://localhost:3000/company";
// Récupération des éléments du DOM
// Bouton qui ouvre le formulaire / modal d’ajout de contact
var addContactBtn = document.getElementById("add-contact-btn");
// Fenêtre modale contenant le formulaire de contact
var contactModal = document.getElementById("contact-modal");
// Bouton pour fermer la fenêtre modale
var closeContactModalBtn = document.getElementById("close-contact-modal-btn");
//modal elements
var contactFullName = document.getElementById("contact-full-name");
var contactEmail = document.getElementById("contact-email");
var contactCompany = document.getElementById("contact-company");
var contactCompanySector = document.getElementById("contact-sector");
var contactAvatar = document.getElementById("contact-photo");
var saveContactBtn = document.getElementById("save-contact-btn");
// Gestion des événements
// Fonction qui affiche ou cache la fenêtre modale
function toggleModal(isOpen) {
    // Ajoute ou enlève la classe "hidden" selon la valeur de isOpen
    contactModal.classList.toggle("hidden", !isOpen);
}
//  ouvre la fenêtre modale
addContactBtn.addEventListener("click", function () { return toggleModal(true); });
//  ferme la fenêtre modale
closeContactModalBtn.addEventListener("click", function () { return toggleModal(false); });
//Fonction pour sécuriser le texte et éviter injection HTML
function escapeHtml(str) {
    if (str === void 0) { str = ""; }
    // si null ou undefined, utiliser une chaîne vide
    str = str || "";
    return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
// Fonction pour valider les données du formulaire de contact
function validateContactForm() {
    // Tableau pour stocker les messages d'erreur
    var errors = [];
    // Récupère les valeurs des champs du formulaire
    var fullName = contactFullName.value.trim();
    var email = contactEmail.value.trim();
    var company = contactCompany.value.trim();
    var sector = contactCompanySector.value.trim();
    // Validation du nom complet
    if (!fullName) {
        // Nom vide
        errors.push("The  name is required.");
    }
    else if (fullName.length < 2) {
        // Nom trop court
        errors.push("The name must contain at least 2 characters.");
    }
    // Validation de l'email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Vérifie si l'email est vide ou invalide
    if (!email) {
        // Email vide
        errors.push("Email is required.");
    }
    else if (!emailRegex.test(email)) {
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
        errors: errors
    };
}
var editingContactId = null;
var editingCompanyId = null;
// Fonction asynchrone pour sauvegarder un nouveau contact
function saveContact() {
    return __awaiter(this, void 0, void 0, function () {
        var isEdit, avatarFile, sendContact, reader, avatarUrl;
        var _this = this;
        var _a, _b;
        return __generator(this, function (_c) {
            isEdit = editingContactId !== null;
            avatarFile = (_b = (_a = contactAvatar.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
            sendContact = function (avatarValue) { return __awaiter(_this, void 0, void 0, function () {
                var companyRes, company, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 8, , 9]);
                            if (!isEdit) return [3 /*break*/, 3];
                            // Met à jour la company associée au contact
                            return [4 /*yield*/, fetch("".concat(apiUrlCompany, "/").concat(editingCompanyId), {
                                    // Méthode HTTP pour mise à jour
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        // Nouveau nom de la company
                                        name: contactCompany.value.trim(),
                                        // Nouveau secteur de la company
                                        sectors: contactCompanySector.value.trim()
                                    })
                                })];
                        case 1:
                            // Met à jour la company associée au contact
                            _a.sent();
                            // Met à jour le contact existant
                            return [4 /*yield*/, fetch("".concat(apiUrlContact, "/").concat(editingContactId), {
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
                                })];
                        case 2:
                            // Met à jour le contact existant
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 3: return [4 /*yield*/, fetch(apiUrlCompany, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    // Nom de la company
                                    name: contactCompany.value.trim(),
                                    // Secteur de la company
                                    sectors: contactCompanySector.value.trim()
                                })
                            })];
                        case 4:
                            companyRes = _a.sent();
                            return [4 /*yield*/, companyRes.json()];
                        case 5:
                            company = _a.sent();
                            // Crée un nouveau contact lié à la company créée
                            return [4 /*yield*/, fetch(apiUrlContact, {
                                    // Méthode HTTP pour création
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        fullName: contactFullName.value.trim(),
                                        email: contactEmail.value.trim(),
                                        avatar: avatarValue,
                                        companyId: company.id
                                    })
                                })];
                        case 6:
                            // Crée un nouveau contact lié à la company créée
                            _a.sent();
                            _a.label = 7;
                        case 7:
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
                            return [3 /*break*/, 9];
                        case 8:
                            error_1 = _a.sent();
                            // Affiche une erreur en cas d’échec
                            console.error("Save failed:", error_1);
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            }); };
            // GESTION DE L’AVATAR
            // Si un fichier avatar est sélectionné
            if (avatarFile) {
                reader = new FileReader();
                // Quand la lecture est terminée
                reader.onload = function (e) {
                    var _a;
                    var result = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                    sendContact(typeof result === "string" ? result : null);
                };
                // Lance la lecture du fichier en Base64
                reader.readAsDataURL(avatarFile);
            }
            // Si aucun avatar n’est sélectionné 
            else {
                avatarUrl = "https://ui-avatars.com/api/?name=".concat(encodeURIComponent(contactFullName.value.trim()));
                // Envoie le contact avec l’avatar en Base64
                sendContact(avatarUrl);
            }
            return [2 /*return*/];
        });
    });
}
// Événement de clic sur le bouton d’enregistrement du contact
saveContactBtn.addEventListener("click", function () {
    // Valide le formulaire et récupère les erreurs éventuelles
    var validation = validateContactForm();
    // Récupère l'élément DOM où les messages d'erreur seront affichés
    var erreurMessage = document.getElementById("erreur-message");
    // Masque les messages d'erreur précédents
    erreurMessage.style.display = "none";
    erreurMessage.innerHTML = "";
    // Si le formulaire est valide, enregistre le contact
    if (validation.isValid) {
        // Appelle la fonction pour sauvegarder le contact
        saveContact();
    }
    else {
        // Sinon, affiche les erreurs
        erreurMessage.style.display = "block";
        // Joint toutes les erreurs avec un saut de ligne HTML
        erreurMessage.innerHTML = validation.errors.join("<br>");
        // Met le texte des erreurs en rouge
        erreurMessage.style.color = "red";
    }
});
// Stocker les contacts en mémoire
var allContacts = [];
// Stocker les componies en memoire
var allCompanies = [];
// Fonction asynchrone pour récupérer et afficher la liste des contacts
function fetchContacts() {
    return __awaiter(this, void 0, void 0, function () {
        var response, contacts, responseCompanies, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, fetch(apiUrlContact)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 5];
                    return [4 /*yield*/, response.json()];
                case 2:
                    contacts = _a.sent();
                    // stockage global
                    allContacts = contacts;
                    return [4 /*yield*/, fetch(apiUrlCompany)];
                case 3:
                    responseCompanies = _a.sent();
                    if (!responseCompanies.ok)
                        throw new Error("Erreur lors de la récupération des companies");
                    return [4 /*yield*/, responseCompanies.json()];
                case 4:
                    allCompanies = _a.sent();
                    // Fonction pour afficher les contacts dans l’interface utilisateur
                    displayContacts(getPaginatedContacts(allContacts));
                    renderPagination(allContacts.length);
                    return [3 /*break*/, 6];
                case 5:
                    // Affiche une erreur si la récupération échoue
                    console.error("Error fetching contacts");
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    // Capture et affiche toute erreur réseau ou autre
                    console.error("Error fetching contacts :", error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// pagination varaible
var currentPage = 1;
var contactsPerPage = 5;
//Fonction qui découpe les contacts pour ne retourner que ceux de la page courante
function getPaginatedContacts(contacts) {
    // Calcule l’index de départ en fonction de la page actuelle
    var start = (currentPage - 1) * contactsPerPage;
    // Calcule l’index de fin (non inclus dans slice)
    var end = start + contactsPerPage;
    // Retourne uniquement la portion du tableau correspondant à la page courante
    return contacts.slice(start, end);
}
// Fonction qui gère l’affichage des boutons de pagination
function renderPagination(totalContacts) {
    // Récupère le conteneur HTML de la pagination
    var pagination = document.getElementById("pagination");
    // Vide le contenu pour éviter les doublons
    pagination.innerHTML = "";
    // Calcule le nombre total de pages
    var totalPages = Math.ceil(totalContacts / contactsPerPage);
    // Crée le bouton "précédent"
    var prevBtn = document.createElement("button");
    // Définit le texte du bouton
    prevBtn.textContent = "<";
    // Désactive le bouton si on est déjà sur la première page
    prevBtn.disabled = currentPage === 1;
    // Ajoute un événement au clic sur le bouton PREV
    prevBtn.addEventListener("click", function () {
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
    var nextBtn = document.createElement("button");
    // Définit le texte du bouton
    nextBtn.textContent = ">";
    // Désactive le bouton si on est déjà sur la dernière page
    nextBtn.disabled = currentPage === totalPages;
    // Ajoute un événement au clic sur le bouton NEXT
    nextBtn.addEventListener("click", function () {
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
var searchTimeout = null;
// Fonction pour rechercher les contacts en mémoire
function searchContacts() {
    // Vérifie si les données (contacts et companies) sont chargées
    // si non, quitte la fonction pour éviter les erreurs
    if (!allContacts || !allCompanies)
        return;
    // Annule le timer précédent pour éviter de lancer plusieurs recherches trop rapidement
    clearTimeout(searchTimeout);
    // Définit un nouveau timer pour exécuter la recherche après un petit délai
    searchTimeout = setTimeout(function () {
        try {
            // Récupère la valeur de l'input, convertit en minuscules et supprime les espaces
            var query_1 = document.getElementById("search-input").value.toLowerCase().trim();
            // Sélectionne l'élément HTML où le message d'erreur sera affiché
            var searchErrorMessage = document.getElementById("search-error-message");
            // Si l'input est vide, afficher tous les contacts et effacer le message d'erreur
            if (query_1 === "") {
                currentPage = 1;
                displayContacts(getPaginatedContacts(allContacts));
                renderPagination(allContacts.length);
                if (searchErrorMessage)
                    searchErrorMessage.innerHTML = "";
                // quitte la fonction pour ne pas continuer la recherche
                return;
            }
            // Filtre les contacts selon le texte de recherche
            var filteredContacts = allContacts.filter(function (contact) {
                // Trouve la company associée à ce contact via son ID
                var company = allCompanies.find(function (c) { return c.id === contact.companyId; });
                return (
                // Retourne true si le nom, l'email, le nom de la company ou le secteur contiennent la recherche
                contact.fullName.toLowerCase().includes(query_1) ||
                    contact.email.toLowerCase().includes(query_1) ||
                    (company === null || company === void 0 ? void 0 : company.name.toLowerCase().includes(query_1)) ||
                    (company === null || company === void 0 ? void 0 : company.sectors.toLowerCase().includes(query_1)));
            });
            // Si aucun contact ne correspond, affiche un message d'erreur
            if (filteredContacts.length === 0) {
                if (searchErrorMessage)
                    searchErrorMessage.innerHTML = "<p style=\"color:red\">User not found</p>";
            }
            else {
                // Sinon, efface le message d'erreur précédent et affiche les contacts filtrés
                if (searchErrorMessage)
                    searchErrorMessage.innerHTML = "";
                currentPage = 1;
                displayContacts(getPaginatedContacts(filteredContacts));
                renderPagination(filteredContacts.length);
            }
        }
        catch (error) {
            // Capture et affiche toute erreur pendant la recherche
            console.error("Erreur lors de la recherche :", error);
            alert("Une erreur est survenue lors de la recherche. Vérifiez la console.");
        }
    }, 300); // délai de 300ms après la dernière frappe
}
// Événement sur l'input de recherche
document.getElementById("search-input").addEventListener("input", searchContacts);
// Récupère une company par ID
function getCompanyById(companies, companyId) {
    //Parcourt le tableau des companies et retourne celle dont l'id correspond
    return companies.find(function (c) { return c.id === companyId; }) || null;
}
// Crée une ligne (<tr>) pour un contact
function createContactRow(contact, company) {
    // Crée un élément HTML <tr> (ligne de tableau)
    var tr = document.createElement("tr");
    // Ajoute une classe CSS à la ligne pour le style
    tr.className = "contact-item";
    // Définit le contenu HTML de la ligne avec les données du contact
    tr.innerHTML = "\n    <td><input type=\"checkbox\" class=\"contact-checkbox\"></td>\n    <td><img src=\"".concat(contact.avatar, "\" alt=\"\" class=\"contact-avatar\"></td>\n    <td >").concat(escapeHtml(contact.fullName), "</td>\n    <td>").concat(escapeHtml(contact.email), "</td>\n    <td>").concat(escapeHtml((company === null || company === void 0 ? void 0 : company.name) || ""), "</td>\n    <td>").concat(escapeHtml((company === null || company === void 0 ? void 0 : company.sectors) || ""), "</td>\n    <td class=\"contact-actions\">\n      <button class=\"action-btn edit-btn\" title=\"Update\">\n        <i class=\"bi bi-pen-fill\"></i>\n      </button>\n      <button class=\"action-btn delete-btn\" title=\"Delete\">\n        <i class=\"bi bi-trash-fill\"></i>\n      </button>\n    </td>\n  ");
    tr.addEventListener("click", function (e) {
        var target = e.target;
        if (target === null || target === void 0 ? void 0 : target.closest(".contact-actions"))
            return;
        window.injectContactDetails(contact.id);
    });
    // Retourne la ligne <tr> complètement construite
    return tr;
}
// Gestion du bouton "Edit"
function handleEdit(contact, rowElement) {
    var _this = this;
    // Sélectionne le bouton "edit" dans la ligne du contact
    var editBtn = rowElement.querySelector(".edit-btn");
    // Ajoute un écouteur d'événement au clic sur le bouton "edit"
    editBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var response, contactData, companyResponse, companyData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, fetch("".concat(apiUrlContact, "/").concat(contact.id))];
                case 1:
                    response = _a.sent();
                    // Vérifie si la réponse HTTP est valide
                    if (!response.ok) {
                        throw new Error("Contact not found");
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    contactData = _a.sent();
                    // Préremplit le champ "Nom complet" du formulaire
                    contactFullName.value = contactData.fullName;
                    // Préremplit le champ "Email" du formulaire
                    contactEmail.value = contactData.email;
                    return [4 /*yield*/, fetch("".concat(apiUrlCompany, "/").concat(contactData.companyId))];
                case 3:
                    companyResponse = _a.sent();
                    if (!companyResponse.ok) return [3 /*break*/, 5];
                    return [4 /*yield*/, companyResponse.json()];
                case 4:
                    companyData = _a.sent();
                    // Préremplit le champ "Nom de la company"
                    contactCompany.value = companyData.name;
                    // Préremplit le champ "Secteur de la company"
                    contactCompanySector.value = companyData.sectors;
                    _a.label = 5;
                case 5:
                    // Stocke l'ID du contact en cours d'édition
                    editingContactId = contactData.id;
                    // Stocke l'ID de la company associée
                    editingCompanyId = contactData.companyId;
                    // Ouvre la fenêtre modale d'édition
                    toggleModal(true);
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    // Affiche l'erreur en cas de problème réseau ou logique
                    console.error("Error fetching contact for edit:", error_3);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); });
}
// Gestion du bouton "Delete"
function handleDelete(contact, rowElement) {
    var _this = this;
    // Sélectionne le bouton "delete" dans la ligne du contact
    var deleteBtn = rowElement.querySelector(".delete-btn");
    // Ajoute un écouteur d'événement au clic sur le bouton "delete"
    deleteBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("".concat(apiUrlContact, "/").concat(contact.id), {
                            method: "DELETE"
                        })];
                case 1:
                    response = _a.sent();
                    // Vérifie si la suppression a réussi
                    if (response.ok) {
                        // Supprime immédiatement la ligne du tableau
                        rowElement.remove();
                        // Affiche un message de confirmation
                        alert("Contact ".concat(contact.fullName, " successfully deleted"));
                    }
                    else {
                        // Affiche une erreur si la suppression a échoué côté serveur
                        console.error("Error deleting contact");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    // Affiche une erreur en cas de problème réseau
                    console.error("Network error during deletion:", error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
// Fonction principale d’affichage
function displayContacts(contacts) {
    return __awaiter(this, void 0, void 0, function () {
        var companies, contactsList;
        return __generator(this, function (_a) {
            companies = allCompanies;
            contactsList = document.getElementById("contacts-table-body");
            // Vide le tableau avant de le remplir à nouveau
            contactsList.innerHTML = "";
            // Parcourt chaque contact reçu en paramètre
            contacts.forEach(function (contact) {
                // Récupère la company associée au contact
                var company = getCompanyById(companies, contact.companyId);
                // Crée la ligne du tableau pour ce contact
                var row = createContactRow(contact, company);
                // Attache la logique d'édition à la ligne
                handleEdit(contact, row);
                // Attache la logique de suppression à la ligne
                handleDelete(contact, row);
                // Ajoute la ligne au tableau
                contactsList.appendChild(row);
            });
            return [2 /*return*/];
        });
    });
}
// On récupère l'élément <select> qui permet de filtrer les contacts
var filterMain = document.getElementById("filter-main");
// On ajoute un écouteur d'événement qui se déclenche quand l'utilisateur change l'option du select
filterMain.addEventListener("change", function () {
    // Vérifie que les listes de contacts et de companies existent et ne sont pas vides
    if (!allContacts.length || !allCompanies.length)
        return;
    // Crée un objet pour accéder rapidement aux companies via leur ID
    var companyMap = Object.fromEntries(allCompanies.map(function (c) { return [c.id, c]; }));
    // Initialisation du tableau qui contiendra les contacts filtrés
    var filteredContacts = [];
    // Si l'utilisateur choisit "All Contacts", on affiche tous les contacts
    if (filterMain.value === "all") {
        filteredContacts = allContacts;
        // Si l'utilisateur choisit "Company", on veut afficher un contact unique par company
    }
    else if (filterMain.value === "company") {
        // Crée un Set pour garder la trace des company déjà ajoutées
        var seenCompanies_1 = new Set();
        // Filtre les contacts
        filteredContacts = allContacts.filter(function (c) {
            // récupère la company du contact
            var co = companyMap[c.companyId];
            // ignore si company manquante ou déjà vue
            if (!co || seenCompanies_1.has(co.id))
                return false;
            // ajoute cette company au Set pour éviter les doublons
            seenCompanies_1.add(co.id);
            return true;
        });
        // Si l'utilisateur choisit "Sector", on veut afficher un contact unique par secteur
    }
    else if (filterMain.value === "sector") {
        // Crée un Set pour garder la trace des secteurs déjà ajoutés
        var seenSectors_1 = new Set();
        // Filtre les contacts
        filteredContacts = allContacts.filter(function (c) {
            // récupère la company du contact
            var co = companyMap[c.companyId];
            // ignore si company manquante, secteur vide ou déjà ajouté
            if (!co || !co.sectors || seenSectors_1.has(co.sectors))
                return false;
            // ajoute ce secteur au Set pour éviter les doublons
            seenSectors_1.add(co.sectors);
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
document.addEventListener("DOMContentLoaded", function () {
    // Récupère l'élément de la modal des détails du contact
    var contactDetailsModal = document.getElementById("contact-details-modal");
    var overlay = document.getElementById("contact-modal-overlay");
    var closeBtn = document.getElementById("close-modal-btn");
    // Fonction pour ouvrir la modal des détails
    function openDetailsModal() {
        // Retire la classe "hidden" si la modal existe
        if (contactDetailsModal)
            contactDetailsModal.classList.remove("hidden");
        // Retire la classe "hidden" si l'overlay existe
        if (overlay)
            overlay.classList.remove("hidden");
    }
    // Fonction pour fermer la modal des détails
    function closeDetailsModal() {
        // Ajoute la classe "hidden" si la modal existe
        if (contactDetailsModal)
            contactDetailsModal.classList.add("hidden");
        // Ajoute la classe "hidden" si l'overlay existe
        if (overlay)
            overlay.classList.add("hidden");
    }
    // Si le bouton de fermeture existe, on ajoute un écouteur au clic pour fermer la modal
    if (closeBtn)
        closeBtn.addEventListener("click", closeDetailsModal);
    // Si l'overlay existe, on ajoute un écouteur au clic pour fermer la modal
    if (overlay)
        overlay.addEventListener("click", closeDetailsModal);
    // On définit la fonction injectContactDetails sur l'objet global "window"
    // pour qu'elle soit accessible depuis d'autres parties du code
    window.injectContactDetails = function (contactId) {
        // Cherche le contact dans le tableau allContacts correspondant à l'ID
        var contact = allContacts.find(function (c) { return c.id === contactId; });
        // Si aucun contact n'est trouvé, on quitte la fonction
        if (!contact)
            return;
        // Cherche la company associée au contact via son companyId
        var company = allCompanies.find(function (co) { return co.id === contact.companyId; });
        // Récupère les éléments du DOM où on affichera les détails
        var avatarEl = document.getElementById("modal-avatar");
        var nameEl = document.getElementById("modal-fullname");
        var emailEl = document.getElementById("modal-email");
        var companyEl = document.getElementById("modal-company");
        var sectorEl = document.getElementById("modal-sector");
        // Met à jour l'avatar (ou affiche un avatar par défaut si absent)
        if (avatarEl)
            avatarEl.src = contact.avatar || "https://ui-avatars.com/api/?name=User";
        // Met à jour le nom complet du contact
        if (nameEl)
            nameEl.textContent = contact.fullName || "-";
        // Met à jour l'email du contact
        if (emailEl)
            emailEl.textContent = contact.email || "-";
        // Met à jour le nom de la company (ou "—" si absent)
        if (companyEl)
            companyEl.textContent = (company === null || company === void 0 ? void 0 : company.name) || "—";
        if (sectorEl)
            sectorEl.textContent = (company === null || company === void 0 ? void 0 : company.sectors) || "—";
        // Ouvre la modal après avoir injecté toutes les données
        openDetailsModal();
    };
});
// Chargement initial
fetchContacts();
