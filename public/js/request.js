
const username = document.getElementById('username');
const password = document.getElementById('password');
const item = document.getElementById('item');
const quantity = document.getElementById('quantity');
const requestForm = document.getElementById('request-form');
const requestElement = document.getElementById('row')
const myRequestsButton =document.getElementById('myRequests')
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
async function myRequests(){
    try{
        console.log(username.value)
    const res3 = await fetch(`/api/users?name=${username.value}&password=${password.value}`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
        },
        
    })
    const data = await res3.json()
    const data2 = await data.data
    var requests = data2[0].requests
    requests.map(request=>{
        var card_box = document.createElement("DIV");
            card_box.className = "col-md-4";

            var card = document.createElement("DIV");
            card.className = "card mb-4 box-shadow";
            
            var card_body = document.createElement("DIV");
            card_body.className = "card-body";

            var header = document.createElement("H4");
            header.className = "card-header";
            
            var p1 = document.createElement("P");
            p1.className = "card-text";
            
            var p2 = document.createElement("P");
            p2.className = "card-text";

            var div = document.createElement("DIV");
            div.className = "d-flex justify-content-between align-items-center";

            

            var small = document.createElement("SMALL");
            small.className = "text-muted";
            
            card_box.appendChild(card);
            card.appendChild(header);
            card.appendChild(card_body);
            card_body.appendChild(p1);
            card_body.appendChild(p2);
            card_body.appendChild(div);
            div.appendChild(small);

            var text1 = document.createTextNode("Quantity: " + request.quantity);
            var text2 = document.createTextNode("Status: " + request.status);
            var title_text = document.createTextNode(request.item);
            var time_since = document.createTextNode("5 min");
            small.appendChild(time_since);
            header.appendChild(title_text);
            p1.appendChild(text1);
            p2.appendChild(text2);
            
            requestElement.appendChild(card_box);


    })
}catch(err){
    console.log(err)
}
}
myRequestsButton.addEventListener('click',myRequests)
requestForm.addEventListener('submit',addRequest);
