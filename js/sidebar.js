const navTasks = document.getElementById("nav-tasks");
const navEmail = document.getElementById("nav-email");
const navDeals = document.getElementById("nav-deals");  
const submenuTasks = document.getElementById("submenu-tasks");
const submenuEmail = document.getElementById("submenu-email");
const submenuDeals = document.getElementById("submenu-deals");  
const sidebarLogout = document.getElementById("sidebar-logout");

// Toggle submenu for Tasks
submenuTasks.style.display = "none";
navTasks.addEventListener("click", () => {
  submenuTasks.style.display = submenuTasks.style.display === "none" ? "block" : "none";
});

// Toggle submenu for Email
submenuEmail.style.display = "none";
navEmail.addEventListener("click", () => {
  submenuEmail.style.display = submenuEmail.style.display === "none" ? "block" : "none";
});

// Toggle submenu for Deals
submenuDeals.style.display = "none";
navDeals.addEventListener("click", () => {
  submenuDeals.style.display = submenuDeals.style.display === "none" ? "block" : "none";
});

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