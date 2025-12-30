//URL
const apiUrl = "http://localhost:3000/users";

//selecteur html
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const loginSubmitBtn = document.getElementById("login-submit-btn");
const errorMessage = document.getElementById("error-message");

errorMessage.style.color = "red";
// Fonction pour générer un token (simulation)
function generateToken() {
     // Génère une chaîne aléatoire + timestamp (OK pour apprentissage)
     return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
// Affiche ou cache le loader
function toggleLoader(show) {
    const loader = document.getElementById("login-loader");
    loader.style.display = show ? "block" : "none";
}

// Simule un délai (utile pour loader)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction de connexion utilisateur
async function loginUser(username ,password){
   
   //Appel de la fonction pour afficher le loader
    toggleLoader(true);
   try {
      // Simule un délai de chargement
        await delay(1500); 
      // Réinitialise le message d'erreur à chaque tentative
    errorMessage.textContent = "";

      // Vérifie si les champs sont vides
    if (!username || !password) {
      errorMessage.textContent = "Please fill in all fields.";
      // Stoppe la fonction si invalide
      return;
    }

    // Désactive le bouton pour éviter les doubles clics
    loginSubmitBtn.disabled = true;

     // Requête vers l'API pour récupérer les utilisateurs
    const response = await fetch (apiUrl);

    // Vérifie si la réponse du serveur est valide
        if (!response.ok) {
      throw new Error("Server error");
    }

     // Conversion de la réponse en JSON
    const data = await response.json();

    // Recherche d'un utilisateur correspondant au username et password
    const user = data.find(user =>user.username === username && user.password === password);

     // Si un utilisateur est trouvé
    if(user){
      // Génère un token
    const token = generateToken();
    // Stocke le token dans le localStorage
    localStorage.setItem("token", token);
     // Stocke l'id de l'utilisateur connecté
    localStorage.setItem("id", user.id);
    // Redirige vers le dashboard
    window.location.href = "dashboard.html";

    }else{
       // Si aucun utilisateur ne correspond
      errorMessage.textContent = "Invalid username or password.";
    }
   } catch (error) {
       // Capture et affiche les erreurs (réseau, serveur, etc.)
    console.error("Error during login:", error);

   } finally {
       // Cache le loader et réactive le bouton
        toggleLoader(false);
      // Réactive le bouton dans tous les cas
    loginSubmitBtn.disabled = false;
   }
}

//evenement de soumission
loginSubmitBtn.addEventListener("click", (e) => {
   // Empêche le rechargement de la page
    e.preventDefault();

   // Récupère et nettoie les valeurs des champs
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Appelle la fonction de connexion
    loginUser(username, password);
});
