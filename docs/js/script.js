document.addEventListener("DOMContentLoaded", function () {
  // Fetch menu data from the JSON file
  fetch("data/menu.json")
    .then(response => response.json())
    .then(data => displayMenu(data));
});

let currentOffset = 0;

function displayMenu(menuData) {
  // Get the current date
  const currentDate = new Date();

  // Display the current date in the header
  const dateDisplay = document.getElementById("date-display");
  dateDisplay.textContent = `Menù della mensa - ${currentDate.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

  // Get the current day
  const today = currentDate.toLocaleDateString("en-US", { weekday: "long" });

  // Get the current week
  const currentWeek = getWeekNumberWithReference(currentDate);

  // Get the menu for the current day
  const todayMenu = menuData[`week${currentWeek}`][today];

  // Display the menu
  const menuSection = document.getElementById("menu");
  const menuList = document.createElement("ul");

  todayMenu.forEach(dish => {
    const listItem = document.createElement("li");
    listItem.textContent = dish;
    menuList.appendChild(listItem);
  });

  menuSection.appendChild(menuList);
}

function showPreviousDay() {
  changeDay(--currentOffset);
}

function showNextDay() {
  changeDay(++currentOffset);
}

function showToday() {
  changeDay(0);
}

function getWeekNumberWithReference(date) {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  // This reference date represents the wwek 4
  const referenceDate = new Date("2023-11-20T00:00:00");

  date = shiftToMonday(date);

  // Calculate the difference in days between the input date and the reference date
  const daysDifference = Math.floor((date - referenceDate) / millisecondsInDay);

  // Calculate the week number (1-4)
  const weekNumber = (daysDifference / 7) % 4;
  return weekNumber === 0 ? 4 : weekNumber;
}

function shiftToMonday (date){
   
   date.setHours(0, 0, 0, 0);
   const dayOfWeek = date.getDay();
   const daysUntilMonday = (dayOfWeek === 0 ? 6 : 1 - dayOfWeek);
   date.setDate(date.getDate() + daysUntilMonday);

   return date;
}

function changeDay(offset) {
  // Get the current date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);

  // Get the new day
  const newDay = currentDate.toLocaleDateString(navigator.language, { weekday: "long" });

  // Fetch menu data from the JSON file
  fetch("data/menu.json")
    .then(response => response.json())
    .then(data => {
      // Display the new date in the header
      const dateDisplay = document.getElementById("date-display");
      dateDisplay.textContent = `Menù della mensa - ${currentDate.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

      // Get the new menu for the day
      const newMenu = data[`week${getWeekNumberWithReference(currentDate)}`][newDay];

      const menuSection = document.getElementById("menu");
      // Add the class to hide the menu
      menuSection.classList.add("menu-hidden");

      // Use a timeout to allow the transition to complete before updating the menu content
      setTimeout(() => {
        // Clear existing menu
        menuSection.innerHTML = "";

        // Display the new menu
        const menuList = document.createElement("ul");

        newMenu.forEach(dish => {
          const listItem = document.createElement("li");
          listItem.textContent = dish;
          menuList.appendChild(listItem);
        });

        menuSection.appendChild(menuList);

        // Remove the class to reveal the menu with the new content
        menuSection.classList.remove("menu-hidden");
      }, 500); // Wait for the transition duration (500ms) before updating the menu content

    });
}
