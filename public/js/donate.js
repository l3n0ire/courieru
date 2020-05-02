const refreshButton = document.getElementById('refresh');
const donationElement = document.getElementById('row')
const updateElement = document.getElementById('update');
async function refresh(){
    try{
        
        const res= await fetch('/api/items',{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
        })
        const data = await res.json()
        
        const data2 = await data
        console.log(data2)

        donationElement.innerHTML = '';
        updateElement.innerHTML = '';

        var date = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        var time = document.createTextNode("Updated as of " + date);
        updateElement.appendChild(time);

       

        data2.data.map(item=>{
            
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

            var btn_div = document.createElement("DIV");
            btn_div.className = "btn-group";
            
            var btn = document.createElement("BUTTON");
            btn.type = "button";
            btn.className = "btn btn-sm btn-outline-secondary";
            btn.value = "Donate";

            var small = document.createElement("SMALL");
            small.className = "text-muted";
            
            card_box.appendChild(card);
            card.appendChild(header);
            card.appendChild(card_body);
            card_body.appendChild(p1);
            card_body.appendChild(p2);
            card_body.appendChild(div);
            div.appendChild(btn_div);
            div.appendChild(small);
            btn_div.appendChild(btn);

            var text1 = document.createTextNode("requests: " + item.requests);
            var text2 = document.createTextNode("donations: " + item.donations);
            var title_text = document.createTextNode(item.item);
            var time_since = document.createTextNode("5 min");
            var btn_text = document.createTextNode("Donate");
            small.appendChild(time_since);
            header.appendChild(title_text);
            btn.appendChild(btn_text);
            p1.appendChild(text1);
            p2.appendChild(text2);
            
            donationElement.appendChild(card_box);

        })
        
        

        if(res.status ===400){
            throw Error('something went wrong')
        }
        //alert('request sent');
        //window.location.href='/index.html';


    }catch(err){
        console.log(err)
        return;
    }


}
refresh()
refreshButton.addEventListener('click',refresh);