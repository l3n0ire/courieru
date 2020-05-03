const logoutForm = document.getElementById('logout-form');

async function logoutSubmit(e) {
    e.preventDefault();
    console.log("got here!");
    sessionStorage.clear();
    document.getElementById("logoutButton").style.display = "none";
    document.getElementById("loginLink").style.display = "block";
    window.location.href='/login.html'
}

logoutForm.addEventListener("submit", logoutSubmit)