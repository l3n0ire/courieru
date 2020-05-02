const refreshButton = document.getElementById('refresh');
const donationElement =document.getElementById('donation')
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

        data2.data.map(item=>{
            var li = document.createElement("LI");
            var text = document.createTextNode(item.item+": requests: "+item.requests+", donations: "+item.donations);
            li.appendChild(text);
            donationElement.appendChild(li)

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