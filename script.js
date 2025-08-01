
document.addEventListener("DOMContentLoaded", function () {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");
  const userArea = document.getElementById("user-area");
  const loginSection = document.getElementById("login-section");
  const homeSection = document.getElementById("home-section");

  let isLoggedIn = false;

  function showSection(id) {
    sections.forEach((section) => section.classList.remove("active"));
    document.getElementById(id + "-section").classList.add("active");
  }

  function updateNav() {
    navButtons.forEach((btn) => {
      if (isLoggedIn) {
        btn.style.display = "inline-block";
      } else {
        btn.style.display = (btn.dataset.section === "home") ? "inline-block" : "none";
      }
    });
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      showSection(btn.dataset.section);
    });
  });

  // Default view
  showSection("login");
  updateNav();

  // Fake login for testing
  window.fakeLogin = function () {
    isLoggedIn = true;
    userArea.textContent = "Logged in as Player";
    updateNav();
    showSection("home");
  };
});
