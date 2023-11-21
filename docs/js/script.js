document.addEventListener("DOMContentLoaded", function () {
  // Fetch menu data from the JSON file
  fetch("data/menu.json")
    .then(response => response.json())
    .then(data => displayMenu(data));

  // Enable swipe navigation using Hammer.js
  const menuSection = document.getElementById("menu");
  const hammer = new Hammer(menuSection);

  hammer.on("swipeleft", showNextDay);
  hammer.on("swiperight", showPreviousDay);
  // Call the updateDots function to set the initial dot state
  updateDots();
});

function displayMenu(menuData) {
  // Get the current date
  const currentDate = new Date();

  // Display the current date in the header
  const dateDisplay = document.getElementById("date-display");
  dateDisplay.textContent = `School Canteen Menu - ${currentDate.toDateString()}`;

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
  const newDay = currentDate.toLocaleDateString(navigator.language, { weekday: "long" });

  // Fetch menu data from the JSON file
  fetch("data/menu.json")
    .then(response => response.json())
    .then(data => {
      // Display the new date in the header
      const dateDisplay = document.getElementById("date-display");
      dateDisplay.textContent = `School Canteen Menu - ${currentDate.toDateString()}`;

      // Get the new menu for the day
      const newMenu = data[`week${Math.ceil(currentDate.getDate() / 7)}`][newDay];

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

      // Update dots after changing day
      updateDots();
    });
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  const activeIndex = dots.length - 3;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[activeIndex].classList.add("active");
}
