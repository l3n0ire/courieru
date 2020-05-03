
const username = document.getElementById('username');
const password = document.getElementById('password');
const loginForm = document.getElementById('login-form');
async function loginSubmit(e){
    console.log("WOW")
    $.jStorage.set("username", username.value);
    $.jStorage.set("password", password.value);
}
loginForm.addEventListener("submit", loginSubmit)
