 const daysContainer = document.getElementById("weekDays");
const fullDate = document.getElementById("fullDate");



const today = new Date();
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay()); // dimanche

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

fullDate.textContent = today.toLocaleDateString("en-US", {
  day: "numeric",
  month: "long",
  weekday: "long"
});

for (let i = 0; i < 7; i++) {
  const date = new Date(startOfWeek);
  date.setDate(startOfWeek.getDate() + i);

  const div = document.createElement("div");
  div.className = "day";

  if (date.toDateString() === today.toDateString()) {
    div.classList.add("active");
  }

  div.innerHTML = `
    <span>${days[date.getDay()]}</span>
    <span class="date">${date.getDate()}</span>
  `;

  daysContainer.appendChild(div);
}