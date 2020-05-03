
const username = document.getElementById('username');
const password = document.getElementById('password');
const loginForm = document.getElementById('login-form');
const logoutForm = document.getElementById('logout-form');
async function loginSubmit(e){
    e.preventDefault()
    sessionStorage.setItem("username", username.value);
    sessionStorage.setItem("password", password.value);
    location.reload();
}

async function logoutSubmit(e) {
    e.preventDefault();
    console.log("got here!");
    sessionStorage.clear();
    location.reload();
}

loginForm.addEventListener("submit", loginSubmit)
logoutForm.addEventListener("submit", logoutSubmit)
