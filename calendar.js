const calendar = document.getElementById("calendar");
const monthSelector = document.getElementById("month-selector");
const currentMonthDisplay = document.getElementById("current-month");
const calendarGrid = document.getElementById("calendar-grid");
const todoContainer = document.getElementById("todo-container");
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task-btn");
const tasksList = document.getElementById("tasks");
const selectedDateDisplay = document.getElementById("selected-date");
const globalTasksList = document.getElementById("global-tasks-list");

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
const tasks = {}; // Stocke les tâches par date

// Initialisation du calendrier
function initCalendar() {
  updateCalendar();
  updateGlobalTasks();
}

// Met à jour l'affichage du calendrier
function updateCalendar() {
  calendarGrid.innerHTML = "";
  const date = new Date(currentYear, currentMonth, 1);
  currentMonthDisplay.textContent = date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  // Ajuste le premier jour de la semaine
  const firstDayIndex = (date.getDay() + 6) % 7; // Lundi commence à 0 en France
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    calendarGrid.appendChild(emptyCell);
  }

  // Affiche les jours du mois
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  for (let day = 1; day <= lastDay; day++) {
    const dayCell = document.createElement("div");
    dayCell.textContent = day;
    dayCell.classList.add("day");

    const dateStr = `${day}-${currentMonth + 1}-${currentYear}`;
    if (dateStr === selectedDate) {
      dayCell.classList.add("selected");
    }

    dayCell.addEventListener("click", () => {
      selectedDate = dateStr;
      displayTasks(selectedDate);
      document
        .querySelectorAll(".day")
        .forEach((cell) => cell.classList.remove("selected"));
      dayCell.classList.add("selected");
    });

    calendarGrid.appendChild(dayCell);
  }
}

// Affiche les tâches pour la date sélectionnée
function displayTasks(date) {
  tasksList.innerHTML = "";
  selectedDateDisplay.textContent = date;

  if (!tasks[date]) return;

  tasks[date].forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.textContent = task;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.addEventListener("click", () => {
      deleteTask(date, index);
    });

    taskItem.appendChild(deleteButton);
    tasksList.appendChild(taskItem);
  });
}

// Ajoute une tâche à la date sélectionnée
function addTask() {
  const date = selectedDate;
  const task = taskInput.value.trim();

  if (!task) {
    alert("Veuillez entrer une tâche.");
    return;
  }

  if (!date) {
    alert("Veuillez sélectionner une date.");
    return;
  }

  if (!tasks[date]) tasks[date] = [];
  tasks[date].push(task);

  taskInput.value = "";
  displayTasks(date);
  updateGlobalTasks(); // Met à jour la vue globale après ajout
}

// Supprime une tâche pour une date donnée
function deleteTask(date, index) {
  tasks[date].splice(index, 1);
  if (tasks[date].length === 0) delete tasks[date];
  displayTasks(date);
  updateGlobalTasks(); // Met à jour la vue globale après suppression
}

// Met à jour la vue globale des tâches
function updateGlobalTasks() {
  globalTasksList.innerHTML = "";

  // Parcourt les dates avec des tâches
  Object.keys(tasks).forEach((date) => {
    const taskItems = tasks[date];

    taskItems.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("global-task-item");
      taskItem.textContent = `${date}: ${task}`;
      globalTasksList.appendChild(taskItem);
    });
  });
}

// Navigation dans les mois
document.getElementById("prev-month").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendar();
});

// Écouteur pour ajouter une tâche
addTaskButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Initialisation du calendrier et des tâches globales
initCalendar();
