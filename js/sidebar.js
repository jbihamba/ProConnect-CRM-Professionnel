// URL de l'API pour récupérer les utilisateurs
const apiUrl = "http://localhost:3000/users"
// Sélecteurs HTML pour les éléments de navigation
const navTasks = document.getElementById("nav-tasks");
const navEmail = document.getElementById("nav-email");
const navDeals = document.getElementById("nav-deals");
// Sélecteurs HTML pour les sous-menus  
const submenuTasks = document.getElementById("submenu-tasks");
const submenuEmail = document.getElementById("submenu-email");
const submenuDeals = document.getElementById("submenu-deals"); 
// Sélecteurs HTML pour afficher les infos utilisateur
const userNameElement= document.getElementById("user-name");
const userEmailElement= document.getElementById("user-email");
// Sélecteurs pour les fonctionnalités de la sidebar
const sidebarLogout = document.getElementById("sidebar-logout");
const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
const overlay = document.getElementById("sidebar-overlay");

// Récupération des informations utilisateur depuis le localStorage
const userId = localStorage.getItem("id")

// Attendre que le DOM soit entièrement chargé
 async function loadUserInfo () {
  try {
    // Vérifie que l'userId existe avant de fetch
    if (!userId) {
      window.location.href = "index.html";
      return;
    }

    // Requête fetch pour récupérer les informations de l'utilisateur
    const response = await fetch(`${apiUrl}?id=${userId}`);
    console.log("Fetch response status:", response.status);
    
    // Vérifie si la réponse est correcte
    if (!response.ok) throw new Error("Failed to fetch user data");

    // Conversion de la réponse en JSON
    const user = await response.json();
    const data = user[0];
    // Affichage des informations utilisateur dans le DOM
    if(userNameElement) userNameElement.textContent = data?.name || "Unknown";
    if(userEmailElement) userEmailElement.textContent = data?.email || "Unknown";

  } catch (error) {
    // En cas d'erreur (réseau, ID manquant...), afficher un fallback
    console.error("User recovery error:", error);
    userNameElement.textContent = "Unknown";
    userEmailElement.textContent = "Unknown";
  }
};

// initial
loadUserInfo ();

// Toggle sidebar visibility
sidebarToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("sidebar-open");
});
// Close sidebar when clicking on overlay
overlay.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});


// Fonction générique pour basculer l'affichage d'un sous-menu
function toggleSubmenu(navElement, submenuElement) {
   // Masque le sous-menu par défaut au chargement
  submenuElement.style.display = "none";
  // Ajoute un écouteur d'événement sur l'élément de navigation
  navElement.addEventListener("click", () => {
     // Si le sous-menu est masqué, on l'affiche en flex, sinon on le masque
    submenuElement.style.display = submenuElement.style.display === "none" ? "flex" : "none";
  });
}
// Applique la fonction au menu "Tasks"
toggleSubmenu(navTasks, submenuTasks);
// Applique la fonction au menu "Email"
toggleSubmenu(navEmail, submenuEmail);
// Applique la fonction au menu "Deals"
toggleSubmenu(navDeals, submenuDeals);


// Logout button functionality
if (sidebarLogout) {
  sidebarLogout.addEventListener("click", () => {
    // Supprime les données de session
    localStorage.removeItem("token");
    localStorage.removeItem("id");

    // Redirige vers la page de login sans possibilité de revenir en arrière 
    window.location.replace("index.html");
  });
}