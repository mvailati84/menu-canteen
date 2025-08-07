document.addEventListener("DOMContentLoaded", function () {
  // Get the current date
  const currentDate = new Date();

  loadMenu(currentDate);
  loadVersionInfo();
});

let currentOffset = 0;

function loadMenu(currentDate){
 
  // Fetch menu data from the JSON file
  fetch("data/menu.json")
    .then(response => response.json())
    .then(data => {
      displayMenu(data, currentDate);
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

function shiftToMonday(inputDate) {
  const date = new Date(inputDate);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysToMonday = (dayOfWeek === 0) ? -6 : 1 - dayOfWeek; // Calculate days to shift to Monday
  date.setDate(date.getDate() + daysToMonday);
  return date;
}

// Load and display version information
function loadVersionInfo() {
  fetch("version.json")
    .then(response => response.json())
    .then(versionData => {
      displayVersionInfo(versionData);
    })
    .catch(error => {
      // Fallback version info if version.json is not available
      const fallbackVersion = {
        version: "1.0.0",
        buildDate: new Date().toISOString().split('T')[0],
        commit: "local"
      };
      displayVersionInfo(fallbackVersion);
    });
}

// Display version information in the footer
function displayVersionInfo(versionData) {
  const versionText = document.getElementById("version-text");
  const buildInfo = document.getElementById("build-info");
  
  if (versionText) {
    versionText.textContent = `v${versionData.version}`;
  }
  
  if (buildInfo) {
    const buildDate = new Date(versionData.buildDate).toLocaleDateString('it-IT');
    buildInfo.textContent = `Build: ${buildDate} | ${versionData.commit}`;
  }
}
