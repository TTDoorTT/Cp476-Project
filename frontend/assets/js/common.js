// M2 mock auth state: store "isLoggedIn" in localStorage
(function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const logoutLink = document.getElementById("nav-logout");
  const loginLink = document.getElementById("nav-login");
  const registerLink = document.getElementById("nav-register");

  if (logoutLink && loginLink && registerLink) {
    if (isLoggedIn) {
      logoutLink.classList.remove("hidden");
      loginLink.classList.add("hidden");
      registerLink.classList.add("hidden");

      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("isLoggedIn", "false");
        window.location.href = "../index.html";
      });
    } else {
      logoutLink.classList.add("hidden");
      loginLink.classList.remove("hidden");
      registerLink.classList.remove("hidden");
    }
  }
})();