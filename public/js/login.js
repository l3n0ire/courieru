
const username = document.getElementById('username');
const password = document.getElementById('password');
const loginForm = document.getElementById('login-form');
async function loginSubmit(e){
    e.preventDefault()
    sessionStorage.setItem("username", username.value);
    sessionStorage.setItem("password", password.value);
    const res = await fetch(`/api/users?name=${username.value}&password=${password.value}`)
    const data = await res.json()
    const data2 = await data.data
    sessionStorage.setItem("role", data2[0].role);
    console.log(data2[0].contactInfo.fullName)
    if(data2[0].role == 'Courier'){
       await sessionStorage.setItem("courier", data2[0].contactInfo.fullName);
       window.location.href='/courier.html'
        

    }
    else if(data2[0].role='Recipient')
        window.location.href='/request.html'
}
loginForm.addEventListener("submit", loginSubmit)
