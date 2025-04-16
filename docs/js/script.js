document.addEventListener("DOMContentLoaded", function () {
  // Get the current date
  const currentDate = new Date();

  loadMenu(currentDate);
});

let currentOffset = 0;

// Function to show the loader
function showLoader() {
  const loaderContainer = document.querySelector('.loader-container');
  loaderContainer.style.display = 'flex';
}

// Function to hide the loader
function hideLoader() {
  const loaderContainer = document.querySelector('.loader-container');
  loaderContainer.style.display = 'none';
}

function loadMenu(currentDate){
  showLoader(); // Show the loader while content is being updated
  
  // Fetch menu data from the JSON file
  fetch("data/menu.json")
    .then(response => response.json())
    .then(data => {
      displayMenu(data, currentDate);
      hideLoader();
    });
}

function displayMenu(menuData, currentDate) {
  // Get the current day
  const today = currentDate.toLocaleDateString("en-US", { weekday: "long" });

  // Get the current week
  const currentWeek = getWeekNumberWithReference(currentDate);

  // Display the current date in the header
  const dateDisplay = document.getElementById("date-display");
  const dateDisplayText = `${currentDate.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
  dateDisplay.textContent = dateDisplayText + " (w" + currentWeek + ")";
  // Get the menu for the current day
  const todayMenu = menuData[`week${currentWeek}`][today];

  // Display the menu
  const menuSection = document.getElementById("menu");

  // Clear existing menu
  menuSection.innerHTML = "";

  const menuList = document.createElement("ul");

  todayMenu.forEach(dish => {
    const listItem = document.createElement("li");
    listItem.textContent = dish;
    menuList.appendChild(listItem);
  });

  menuSection.appendChild(menuList);
}

function showPreviousDay() {
  currentOffset--;

  // Get the current date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + currentOffset);

  const currentDay = currentDate.getDay();
  if (currentDay === 0 || currentDay === 6){
    showPreviousDay();
    return;
  }

  loadMenu(currentDate);
}

function showNextDay() {
  currentOffset++;

  // Get the current date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + currentOffset);

  const currentDay = currentDate.getDay();
  if (currentDay === 0 || currentDay === 6){
    showNextDay();
    return;
  }

  loadMenu(currentDate);
}

function getWeekNumberWithReference(date) {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  // This reference date represents the week 4
  const referenceDate = new Date("2025-03-31T00:00:00");

  date = shiftToMonday(date);

  // Calculate the difference in days between the input date and the reference date
  const daysDifference = Math.floor((date - referenceDate) / millisecondsInDay);

  // Calculate the week number (1-4)
  const weekNumber = Math.ceil((daysDifference / 7) % 4);
  return weekNumber === 0 ? 4 : weekNumber;
}

function shiftToMonday (inputDate){
   let date = new Date(inputDate);
   date.setHours(0, 0, 0, 0);
   const dayOfWeek = date.getDay();
   const daysUntilMonday = (dayOfWeek === 0 ? 6 : 1 - dayOfWeek);
   date.setDate(date.getDate() + daysUntilMonday);

   return date;
}
