const userForm = document.getElementById('user-form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const role = document.getElementById('role');
const address = document.getElementById('address');
const fullName = document.getElementById('fullName');
const phonenumber= document.getElementById('phonenumber');
const email = document.getElementById('email');


async function addStore(e){
    e.preventDefault();
    const sendBody = {
        username: username.value,
        password: password.value,
        role: role.value,
        address: address.value,
        contactInfo:{
            fullName:fullName.value,
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
