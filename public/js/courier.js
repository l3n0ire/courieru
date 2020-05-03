const courier = document.getElementById('courier');
const courierForm = document.getElementById('courier-form');

mapboxgl.accessToken = 'pk.eyJ1IjoiY29saW5jb29sMTAwIiwiYSI6ImNrOWc3cnJicjBqbWQzaG5hejR0YzdqdGoifQ.NMHDHTEqTUaFgpmvvMXl1A';
var warehouseLocation =[-79.374697,43.7227]
var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom:10,
        center: warehouseLocation // sunnybrook
})
var warehouse=turf.featureCollection([turf.point(warehouseLocation)]);
var waypoints=[]
var waypointElement=document.getElementById('waypoints');
var usersArray;
function loadmap(data,routeGeoJSON){
    
        console.log('works')

      // Create a circle layer
        map.addLayer({
          id: 'warehouse',
          type: 'circle',
          source: {
            data: warehouse,
            type: 'geojson'
          },
          paint: {
            'circle-radius': 20,
            'circle-color': 'white',
            'circle-stroke-color': '#3887be',
            'circle-stroke-width': 3
          }
        });

        // Create a symbol layer on top of circle layer
        map.addLayer({
          id: 'warehouse-symbol',
          type: 'symbol',
          source: {
            data: warehouse,
            type: 'geojson'
          },
          layout: {
            'icon-image': 'grocery-15',
            'icon-size': 1,
            'text-field':'Warehouse',
            'text-offset':[0,1.5],
            'text-anchor':'top',
          },
          paint: {
            'text-color': '#000000'
          }
        });

        map.addSource('route', {
            type: 'geojson',
            'data': routeGeoJSON
          });
          
        map.addLayer({
            id: 'routeline-active',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3887be',
              'line-width': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 3,
                22, 12
              ]
            }
          }, 'waterway-label');

        map.addLayer({
            id: 'routearrows',
            type: 'symbol',
            source: 'route',
            layout: {
              'symbol-placement': 'line',
              'text-field': '▶',
              'text-size': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 24,
                22, 60
              ],
              'symbol-spacing': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 30,
                22, 160
              ],
              'text-keep-upright': false
            },
            paint: {
              'text-color': '#3887be',
              'text-halo-color': 'hsl(55, 11%, 96%)',
              'text-halo-width': 3
            }
          }, 'waterway-label');
        
     map.addSource('point', {
         'type': 'geojson',
         
         'data': {
         'type': 'FeatureCollection',
         'features':data
         }
         });
         map.addLayer({
         'id': 'points',
         'type': 'symbol',
         'source': 'point',
         'layout': {
         'icon-image': '{icon}-15',
         'icon-size': 1.5,
         'text-field':'{name}',
         'text-offset':[0,0.9],
         'text-anchor':'top'
         }
         });

         map.on('click', function(e) {
          /* Determine if a feature in the "locations" layer exists at that point. */
          console.log("clicked") 
          var features = map.queryRenderedFeatures(e.point, {
            layers: ['points']
          });
          
          /* If yes, then: */
          if (features.length) {
            var clickedPoint = features[0];
            
            /* Fly to the point */
            flyToStore(clickedPoint);
            
            /* Close all other popups and display popup for clicked store */
            createPopUp(clickedPoint);
            
        
          }});


    
} 


async function getUsers(addresses){
    const res = await fetch('/api/users');
    const data = await res.json();
    usersArray = data.data;
    const filteredData = data.data.filter(user=>{
        return addresses.includes(user.location.formattedAddress)
    })
    console.log(filteredData)
    const users = filteredData.map((user,i)=>{
      let icon='car';
      if (user.role=='recipient')
      icon='shop'
      
        return {
            
                type: 'Feature',
                  geometry: {
                  type: 'Point',
                  coordinates: [user.location.coordinates[0],user.location.coordinates[1]]
                  },
                  properties:{
                      username:user.username,
                      name:user.contactInfo.fullName,
                      email:user.contactInfo.email,
                      phonenumber:user.contactInfo.phonenumber,
                      icon:icon,
                      address:user.location.formattedAddress,
                      role:user.role,
                      index:i
                }
                
        }
    });
    const coordinates =  [[filteredData[0].location.coordinates[0],filteredData[0].location.coordinates[1]]]
    coordinates.push(warehouseLocation)
    filteredData.map((user,i)=>{
        if(i!=0)
          coordinates.push([user.location.coordinates[0],user.location.coordinates[1]])
    })
    console.log(coordinates)
    const distributions =[]
    coordinates.map((c,i)=>{
      if(i!=1 && i!=0)
        distributions.push([[1,i]])
      
    })
    console.log(distributions);
    const req='https://api.mapbox.com/optimized-trips/v1/mapbox/driving/' + coordinates.join(';') +'?distributions='+distributions.join(';')+  '&source=first&geometries=geojson&access_token=' + mapboxgl.accessToken
    console.log(req);
    // Make a request to the Optimization API
    const res2 = await fetch(req);
    const data2 = await res2.json();
    console.log(data2);
    waypoints=data2.waypoints;
    waypoints.sort((a,b)=>{
      if(a.waypoint_index>b.waypoint_index){
        return 1;
      }
      if(a.waypoint_index<b.waypoint_index){
        return -1;
      }
      return 0;

    })
    const output = await Promise.all(waypoints.map(async function(way,i){
      let url = "https://api.radar.io/v1/geocode/reverse?coordinates="+way.location[1]+","+way.location[0];
      
      let res = await fetch(url,{headers:{Authorization:"prj_live_pk_bc355842d1d55d195b361380237c58fde8a6ef48"}})
      let data = await res.json();
      console.log(i+" "+ data.addresses[0].formattedAddress)
      
      return  await data.addresses[0].formattedAddress


    }))
    output.map((address,i)=>{
      var accordian = document.getElementById('route')
            var card=document.createElement("DIV")
            card.className="card"
            var cardHeader=document.createElement("DIV")
            cardHeader.className="card-header"
            var h2=document.createElement("H2")
            h2.className="mb-0"
            var button=document.createElement("BUTTON")
            button.className="btn btn-link"
            button.setAttribute("data-toggle","collapse")
            button.setAttribute("data-target","#w"+i)
            button.setAttribute("aria-expanded","true")
            button.setAttribute("aria-controls","#w"+i)
            var c1 = document.createElement("DIV")
            c1.id="w"+i
            c1.className="collapse show"
            var cardBody=document.createElement("DIV")
            cardBody.className="card-body"
            cardBody.innerHTML=address

            button.innerHTML ="Stop #"+(i+1)
            h2.appendChild(button)
            cardHeader.appendChild(h2)
            cardHeader.appendChild(button)
            card.appendChild(cardHeader)
            c1.appendChild(cardBody)
            card.appendChild(c1)
            accordian.appendChild(card)

    })
    document.getElementById('distance').innerHTML=data2.trips[0].distance/1000+"km"
    document.getElementById('duration').innerHTML=data2.trips[0].duration/60+"minutes"
    var features = output.map((name,i)=>{
      return turf.feature(data2.trips[0].geometry)
    })
    // Create a GeoJSON feature collection
    var routeGeoJSON = turf.featureCollection(features);
    console.log(routeGeoJSON);
    //map.getSource('route').setData(routeGeoJSON);
    loadmap(users,routeGeoJSON);
}

  

function getRoutes(e){
    e.preventDefault();
    var data
    var data2
    try{
        fetch(`/api/routes?courier=${courier.value}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
        }).then(res=>{
            data =res.json().then(data=>{
                data2=data.data
            console.log(data2)
        data2.map((data,i)=>{
            var accordian = document.getElementById('deliveryRequests')
            var card=document.createElement("DIV")
            card.className="card"
            var cardHeader=document.createElement("DIV")
            cardHeader.className="card-header"
            var h2=document.createElement("H2")
            h2.className="mb-0"
            var button=document.createElement("BUTTON")
            button.className="btn btn-link"
            button.setAttribute("data-toggle","collapse")
            button.setAttribute("data-target","#e"+data._id)
            button.setAttribute("aria-expanded","true")
            button.setAttribute("aria-controls","#e"+data._id)
            var c1 = document.createElement("DIV")
            c1.id="e"+data._id
            c1.className="collapse show"
            var cardBody=document.createElement("DIV")
            cardBody.className="card-body"
            
            data.addresses.map(address=>{
              var p =document.createElement("p")
              p.innerHTML=address
              cardBody.appendChild(p)
            })
            var acceptButton =document.createElement("BUTTON")
            acceptButton.className="btn btn-success"
            acceptButton.innerHTML="accept"
            acceptButton.value=data._id

            acceptButton.addEventListener('click',(e)=>{
              var id=e.target.value
              fetch(`/api/routes?id=${id}`,{
                  method:'POST',
                  headers:{
                      'Content-Type':'application/json',
                  },
              }).then(res=>{
                  alert('user added');
                  var att = document.createAttribute("disabled")
                  e.target.setAttributeNode(att)
                  console.log("accepted")
              })
              

          },false)

            
            button.innerHTML ="Delivery request #"+(i+1)
            h2.appendChild(button)
            cardHeader.appendChild(h2)
            cardHeader.appendChild(button)
            card.appendChild(cardHeader)
            cardBody.appendChild(acceptButton)
            c1.appendChild(cardBody)
            card.appendChild(c1)
            accordian.appendChild(card)

            

            
            

            console.log(data.addresses)
            getUsers(data.addresses);
            })
            
            

        })
        })
        
        

        
        //alert('request sent');
        //window.location.href='/index.html';
    }catch(err){
        console.log(err)
        return;
    }


}
courierForm.addEventListener('submit',getRoutes);
function updateStatus(id,status){
  var username = usersArray[id.value].username
  try{
    fetch(`/api/users?username=${username}&status=${status}`,{
      method:'POST',
      headers:{
          'Content-Type':'application/json',
      }
    }).then(res=>{
    alert('status updated');

    })

  }catch(err){
    console.log(err)
  }

}

function delivered(id){

  updateStatus(id,"delivered")

}

function omw(id){

  updateStatus(id,"on my way")
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
  if (popUps[0]) popUps[0].remove();
  var popuphtml ='<h3>'+currentFeature.properties.name+'</h3>' +
  '<p class=\'my-1 text\'>' + currentFeature.properties.role + '</p>'+
  '<p class=\'my-1 text\'>' + currentFeature.properties.phonenumber + '</p>'+
  '<p class=\'my-1 text\'>' + currentFeature.properties.email + '</p>'+
    '<p class=\'my-1 text\'>' + currentFeature.properties.address + '</p>'
  if(currentFeature.properties.role=='Recipient'){
    popuphtml +='<button class=\'btn btn-warning my-1\' value='+currentFeature.properties.index+' onClick=\'omw(this)\'>On My Way </button>'
    popuphtml +='<button class=\'btn btn-success my-1\' value='+currentFeature.properties.index+' onClick=\'delivered(this)\'>Delivered to Customer </button>'
  }
  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(popuphtml)
    .addTo(map);
}
function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}
