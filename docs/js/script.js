document.addEventListener("DOMContentLoaded", function () {
  // Fetch menu data from the JSON file
  fetch("data/menu.json")
    .then(response => response.json())
    .then(data => displayMenu(data));
});

function displayMenu(menuData) {
  // Get the current date
  const currentDate = new Date();
  
  // Display the current date in the header
  const dateDisplay = document.getElementById("date-display");
  dateDisplay.textContent = `Menu Mensa - ${currentDate.toLocaleDateString("it-IT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;

  // Get the current day
  const today = currentDate.toLocaleDateString("en-US", { weekday: "long" });

  // Get the current week
  const currentWeek = Math.ceil(currentDate.getDate() / 7);

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
  changeDay(-1);
}

function showNextDay() {
  changeDay(1);
}

function showToday() {
  changeDay(0);
}

function changeDay(offset) {
  // Get the current date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);

  // Get the new day
  const newDay = currentDate.toLocaleDateString("en-US", { weekday: "long" });

  // Fetch menu data from the JSON file
  fetch("data/menu.json")
    .then(response => response.json())
    .then(data => {
      // Display the new date in the header
      const dateDisplay = document.getElementById("date-display");
      dateDisplay.textContent = `Menu Mensa - ${currentDate.toLocaleDateString("it-IT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;

      // Get the new menu for the day
      const newMenu = data[`week${Math.ceil(currentDate.getDate() / 7)}`][newDay];

      // Clear existing menu
      const menuSection = document.getElementById("menu");
      menuSection.innerHTML = "";

      // Display the new menu
      const menuList = document.createElement("ul");

      newMenu.forEach(dish => {
        const listItem = document.createElement("li");
        listItem.textContent = dish;
        menuList.appendChild(listItem);
      });

      menuSection.appendChild(menuList);
    });
}
