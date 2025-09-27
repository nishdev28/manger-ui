let extensions = [];

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    extensions = data.map((ext) => ({
      ...ext,
      status: ext.isActive ? "active" : "inactive",
    }));
    renderExtensions();
  })
  .catch((error) => console.error("Error loading JSON:", error));

const extensionsContainer = document.getElementById("extensions-container");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function renderExtensions(filter = "all") {
  extensionsContainer.innerHTML = "";

  const filteredExtensions =
    filter === "all"
      ? extensions
      : extensions.filter((ext) => ext.status === filter);

  filteredExtensions.forEach((extension) => {
    const extensionCard = document.createElement("div");
    extensionCard.className = "extension-card";

    extensionCard.innerHTML = `
          <div class="extension-header">
            <div class="logo-name">
              <img src="${extension.logo}" alt="${
      extension.name
    } logo" class="extension-logo">
              <div>
                <div class="extension-name">${extension.name}</div>
                  <p class="extension-description">${extension.description}</p>
              </div>
            </div>
          </div>
          <div class="extension-content">
        
            <div class="extension-actions">
              <button class="remove-btn" data-name="${
                extension.name
              }">Remove</button>
              <label class="extension-toggle">
                <input type="checkbox" ${
                  extension.status === "active" ? "checked" : ""
                } data-name="${extension.name}">
                <span class="toggle-slider-round"></span>
              </label>
            </div>
          </div>
        `;

    extensionsContainer.appendChild(extensionCard);
  });

  document.querySelectorAll(".extension-toggle input").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const extensionName = this.dataset.name;
      toggleExtension(extensionName, this.checked);
    });
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", function () {
      removeExtension(button.dataset.name);
    });
  });
}

function toggleExtension(name, isActive) {
  const extension = extensions.find((ext) => ext.name === name);
  if (extension) {
    extension.status = isActive ? "active" : "inactive";
    extension.isActive = isActive;
    const currentFilter =
      document.querySelector(".filter-btn.active").dataset.filter;
    renderExtensions(currentFilter);
  }
}

function removeExtension(name) {
  if (confirm(`Are you sure you want to remove "${name}"?`)) {
    const index = extensions.findIndex((ext) => ext.name === name);
    if (index !== -1) {
      extensions.splice(index, 1);
      const currentFilter =
        document.querySelector(".filter-btn.active").dataset.filter;
      renderExtensions(currentFilter);
    }
  }
}

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("light-theme");
  const isLightTheme = document.body.classList.contains("light-theme");
  localStorage.setItem("theme", isLightTheme ? "light" : "dark");

  themeIcon.src = isLightTheme
    ? "./assets/images/icon-sun.svg"
    : "./assets/images/icon-moon.svg";
});
filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    renderExtensions(this.dataset.filter);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
});
