const userForm = document.getElementById('user-form');
const username = document.getElementById('username');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const password = document.getElementById('password');
const role = document.getElementById('role');
const address = document.getElementById('address');
const country = document.getElementById('country');
const province = document.getElementById('province');
const postalCode = document.getElementById('postalCode');
const phonenumber= document.getElementById('phonenumber');
const email = document.getElementById('email');


async function addStore(e){
    e.preventDefault();
    var roleValue = role.options[role.selectedIndex].text 
    var addressValue = address.value +" "+province.options[province.selectedIndex].text
    +" "+ country.options[country.selectedIndex].text +" "+postalCode.value
    var fullName =firstName.value +" "+lastName.value
    const sendBody = {
        username: username.value,
        password: password.value,
        role: roleValue,
        address: addressValue,
        contactInfo:{
            fullName:fullName,
            phonenumber:phonenumber.value,
            email:email.value
        }
    }
    try{
        const res = await fetch('/api/users',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(sendBody)
            
        });
        if(res.status ===400){
            throw Error('user already exits')
        }
        alert('user added');
        window.location.href='/index.html';

    }catch(e){
        alert(err);
        return;

    }

}

userForm.addEventListener('submit',addStore);
