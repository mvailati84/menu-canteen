document.addEventListener("DOMContentLoaded", function () {
    // Fetch menu data from the JSON file
    fetch("data/menu.json")
      .then(response => response.json())
      .then(data => displayMenu(data));
  });
  
  function displayMenu(menuData) {
    // Get the current day
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  
    // Get the current week
    const currentWeek = Math.ceil(new Date().getDate() / 7);
  
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
  