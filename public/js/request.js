const username = document.getElementById('username');
const password = document.getElementById('password');
const item = document.getElementById('item');
const quantity = document.getElementById('quantity');
const requestForm = document.getElementById('request-form');
async function addRequest(e){
    e.preventDefault();
    try{
        const sendBody={
            item:item.value,
            quantity:quantity.value
        }
        const res= await fetch(`/api/users?username=${username.value}&password=${password.value}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(sendBody)
        })
        const res2 =await fetch('/api/items',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(sendBody)

        })
        console.log(res.json())
        console.log(res2.json())

        if(res.status ===400 || res2.status==400){
            throw Error('something went wrong')
        }
        //alert('request sent');
        //window.location.href='/index.html';


    }catch(err){
        console.log(err)
        return;
    }


}

requestForm.addEventListener('submit',addRequest);
