
const username = document.getElementById('username');
const password = document.getElementById('password');
const loginForm = document.getElementById('login-form');
async function loginSubmit(e){
    e.preventDefault()
    sessionStorage.setItem("username", username.value);
    sessionStorage.setItem("password", password.value);
}
loginForm.addEventListener("submit", loginSubmit)
