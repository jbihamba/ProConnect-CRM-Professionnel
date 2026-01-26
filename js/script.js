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
//URL
var apiUrl = "http://localhost:3000/users";
//selecteur html
var usernameInput = document.getElementById("username-input");
var passwordInput = document.getElementById("password-input");
var loginSubmitBtn = document.getElementById("login-submit-btn");
var errorMessage = document.getElementById("error-message");
errorMessage.style.color = "red";
// Fonction pour générer un token (simulation)
function generateToken() {
    // Génère une chaîne aléatoire + timestamp (OK pour apprentissage)
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
// Affiche ou cache le loader
function toggleLoader(show) {
    var loader = document.getElementById("login-loader");
    loader.style.display = show ? "block" : "none";
}
// Simule un délai (utile pour loader)
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
// Fonction de connexion utilisateur
function loginUser(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, user, token, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //Appel de la fonction pour afficher le loader
                    toggleLoader(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    // Simule un délai de chargement
                    return [4 /*yield*/, delay(1500)];
                case 2:
                    // Simule un délai de chargement
                    _a.sent();
                    // Réinitialise le message d'erreur à chaque tentative
                    errorMessage.textContent = "";
                    // Vérifie si les champs sont vides
                    if (!username || !password) {
                        errorMessage.textContent = "Please fill in all fields.";
                        // Stoppe la fonction si invalide
                        return [2 /*return*/];
                    }
                    // Désactive le bouton pour éviter les doubles clics
                    loginSubmitBtn.disabled = true;
                    return [4 /*yield*/, fetch(apiUrl)];
                case 3:
                    response = _a.sent();
                    // Vérifie si la réponse du serveur est valide
                    if (!response.ok) {
                        throw new Error("Server error");
                    }
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    user = data.find(function (user) { return user.username === username && user.password === password; });
                    // Si un utilisateur est trouvé
                    if (user) {
                        token = generateToken();
                        // Stocke le token dans le localStorage
                        localStorage.setItem("token", token);
                        // Stocke l'id de l'utilisateur connecté
                        localStorage.setItem("id", user.id);
                        // Redirige vers le dashboard
                        window.location.replace("dashboard.html");
                    }
                    else {
                        // Si aucun utilisateur ne correspond
                        errorMessage.textContent = "Invalid username or password.";
                    }
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    // Capture et affiche les erreurs (réseau, serveur, etc.)
                    console.error("Error during login:", error_1);
                    return [3 /*break*/, 7];
                case 6:
                    // Cache le loader et réactive le bouton
                    toggleLoader(false);
                    // Réactive le bouton dans tous les cas
                    loginSubmitBtn.disabled = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
//evenement de soumission
loginSubmitBtn.addEventListener("click", function (e) {
    // Empêche le rechargement de la page
    e.preventDefault();
    // Récupère et nettoie les valeurs des champs
    var username = usernameInput.value.trim();
    var password = passwordInput.value.trim();
    // Appelle la fonction de connexion
    loginUser(username, password);
});
