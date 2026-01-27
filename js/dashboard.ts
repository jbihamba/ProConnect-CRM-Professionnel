
// TypeScript strict typing pour les éléments DOM utilisés

// Récupère le conteneur HTML qui affichera les jours de la semaine
 const daysContainer = document.getElementById("weekDays") as HTMLElement;
 // Récupère l'élément HTML qui affichera la date complète du jour
const fullDate = document.getElementById("fullDate") as HTMLElement;
// Récupère le canvas utilisé pour afficher le graphique Chart.js
const coreCharte = document.getElementById("core-charte") as HTMLCanvasElement;
// Recupere le canvas utilise pour afficher le graphique circle
const circleChart = document.getElementById("circle-chart") as HTMLCanvasElement;
if (!daysContainer || !fullDate || !coreCharte || !circleChart) {
  throw new Error("Required DOM elements not found");
}
declare const Chart: any;
// Création d'un graphique circulaire avec Chart.js
new Chart(circleChart, {
  // Type de graphique : doughnut (cercle)
  type: "doughnut",
  // 
  data :{
  labels: [
    'Completed',
    'Ended',
    'Canceled'
  ],
  datasets: [{
    label: 'Deals Status',
    data: [300, 50, 100],
    backgroundColor: [
       '#22c55e',
      '#ef4444',
       '#facc15'
    ],
    hoverOffset: 4
  }]
},
   // Options de configuration du graphique
  options: {
      // Rend le graphique responsive
    responsive: true
    
  }
})

// Création d'un graphique de type ligne avec Chart.js
new Chart(coreCharte, {
  // Type de graphique : ligne
  type: "line",
   // Données du graphique
  data: {
     // Labels affichés sur l'axe horizontal
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"],
     // Jeux de données du graphique
    datasets: [{
       // Nom du dataset affiché dans la légende
      label: "deals status",
      // Valeurs associées à chaque mois
      data: [65, 59, 80, 81, 56, 55, 40],
       // Désactive le remplissage sous la ligne
      fill: true,
        // Couleur de la ligne
      borderColor: "#0d6efd",
      backgroundColor: "rgba(13,110,253,0.08)",
       // Lissage de la ligne (courbure)
      tension: 0.4
    }]
  },
   // Options de configuration du graphique
  options: {
      // Rend le graphique responsive
    responsive: true,
  }
});

// Récupère la date du jour
const today : Date= new Date();
// Crée une copie de la date du jour pour calculer le début de la semaine
const startOfWeek : Date = new Date(today.getTime());
// Définit le début de la semaine au dimanche
startOfWeek.setDate(today.getDate() - today.getDay()); // dimanche
// Tableau des noms des jours de la semaine
const days : string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Affiche la date complète du jour
fullDate.textContent = today.toLocaleDateString("en-US", {
  day: "numeric", // Affiche le jour du mois
  month: "long",   // Affiche le mois en toutes lettres
  weekday: "long"  // Affiche le jour de la semaine
});
// Boucle pour générer les 7 jours de la semaine
for (let i = 0; i < 7; i++) {
  // Crée une nouvelle date pour chaque jour de la semaine
  const date : Date = new Date(startOfWeek.getTime());
   // Ajoute i jours à la date de départ
  date.setDate(startOfWeek.getDate() + i);
 // Crée un élément div pour représenter un jour
  const div : HTMLDivElement = document.createElement("div");
  // Ajoute la classe CSS "day"
  div.className = "day";
 // Vérifie si le jour correspond à aujourd'hui
  if (date.toDateString() === today.toDateString()) {
    // Ajoute la classe "active" pour mettre en évidence le jour actuel
    div.classList.add("active");
  }
 // Injecte le contenu HTML du jour nom + numéro
  div.innerHTML = `
    <span>${days[date.getDay()]}</span>
    <span class="date">${date.getDate()}</span>
  `;
// Ajoute le jour au conteneur principal
  daysContainer.appendChild(div);
}