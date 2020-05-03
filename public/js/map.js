mapboxgl.accessToken = 'pk.eyJ1IjoiY29saW5jb29sMTAwIiwiYSI6ImNrOWc3cnJicjBqbWQzaG5hejR0YzdqdGoifQ.NMHDHTEqTUaFgpmvvMXl1A';
var warehouseLocation =[-79.374697,43.7227]
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
zoom:10,
center: warehouseLocation // sunnybrook


});
var warehouse=turf.featureCollection([turf.point(warehouseLocation)]);
var waypoints=[]
var waypointElement=document.getElementById('waypoints');
var usersArray;
var locations=[];
//loadmap();
// fetch users from api
async function getUsers(){
    const res = await fetch('/api/users');
    const data = await res.json();
    usersArray = data.data;
    const users = data.data.map((user,i)=>{
      let icon='car';
      if (user.role=='Recipient')
      icon='shop'
      
        return {
            
                type: 'Feature',
                  geometry: {
                  type: 'Point',
                  coordinates: [user.location.coordinates[0],user.location.coordinates[1]]
                  },
                  properties:{
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
    loadmap(users);
  }
  async function makeRoute(){
    //locations =  [[data.data[0].location.coordinates[0],data.data[0].location.coordinates[1]]]
    if (!locations.includes(warehouseLocation))
      locations.push(warehouseLocation)
  // data.data.map((user,i)=>{
  //     if(i!=0)
  //       coordinates.push([user.location.coordinates[0],user.location.coordinates[1]])
  // })
    console.log(locations)
    const distributions =[]
    locations.map((c,i)=>{
      if(i!=1 && i!=0)
        distributions.push([[1,i]])
      
    })
    console.log(distributions);
    const req='https://api.mapbox.com/optimized-trips/v1/mapbox/driving/' + locations.join(';') +'?distributions='+distributions.join(';')+  '&source=first&geometries=geojson&access_token=' + mapboxgl.accessToken
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
    const output = await Promise.all( waypoints.map(async function(way,i){
      let url = "https://api.radar.io/v1/geocode/reverse?coordinates="+way.location[1]+","+way.location[0];
      
      let res = await fetch(url,{headers:{Authorization:"prj_live_pk_bc355842d1d55d195b361380237c58fde8a6ef48"}})
      let data = await res.json();
      console.log(i+" "+ data.addresses[0].formattedAddress)
      return  data.addresses[0].formattedAddress


    }))
    let demo = document.getElementById('waypoints')
    demo.innerHTML=''
    console.log("cleared")
    output.map((address,i)=>{
      var accordian = document.getElementById('waypoints')
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
    var distance =data2.trips[0].distance/1000
    distance= distance.toFixed(2)
    document.getElementById('distance').innerHTML = distance+" km"
    var duration=data2.trips[0].duration/60
    duration= duration.toFixed(0)
    var hours
    if(duration>=60){
      hours = duration/60
      hours= hours.toFixed(0)
      duration=duration%60
      document.getElementById('duration').innerHTML=hours+" hours" + duration+" minutes"
    }
    else
      document.getElementById('duration').innerHTML=duration+" minutes"
    var features = output.map((name,i)=>{
      return turf.feature(data2.trips[0].geometry)
    })
    // Create a GeoJSON feature collection
    var routeGeoJSON = turf.featureCollection(features);
    console.log(routeGeoJSON);
    //map.getSource('route').setData(routeGeoJSON);
    

  
    mapRoute(routeGeoJSON);
}
function mapRoute(routeGeoJSON){
  if (map.getLayer('routeline-active'))
    map.removeLayer('routeline-active');
  if (map.getLayer('routearrows'))
    map.removeLayer('routearrows');
  if (map.getSource('route'))
  map.removeSource('route');
  
  map.addSource('route', {
    'type': 'geojson',
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

}

function loadmap(data){
    map.on('load',function(){
      

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
}



    )
}
function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

var addresses=[];

var addresssElement = document.getElementById('addresses')
var requestsDict={}
var sendBody

function add(id){
  var address =usersArray[id.value].location.formattedAddress
  usersArray[id.value].requests.map((req)=>{
    if(req.item in requestsDict){
      requestsDict[req.item]=requestsDict[req.item]+parseInt(req.quantity)
    }
    else{
      requestsDict[req.item]=parseInt(req.quantity)
    }
  })
  
  addresses.push(address)
  locations.push(usersArray[id.value].location.coordinates)
  var clear = document.getElementById('addresses')
  clear.innerHTML=''
  addresses.map((address,i)=>{
            var accordian = document.getElementById('addresses')
            var card=document.createElement("DIV")
            card.className="card"
            var cardHeader=document.createElement("DIV")
            cardHeader.className="card-header"
            var h2=document.createElement("H2")
            h2.className="mb-0"
            var button=document.createElement("BUTTON")
            button.className="btn btn-link"
            button.setAttribute("data-toggle","collapse")
            button.setAttribute("data-target","#a"+i)
            button.setAttribute("aria-expanded","true")
            button.setAttribute("aria-controls","#a"+i)
            var c1 = document.createElement("DIV")
            c1.id="a"+i
            c1.className="collapse show"
            var cardBody=document.createElement("DIV")
            cardBody.className="card-body"
            cardBody.innerHTML=address

            button.innerHTML ="Address #"+(i+1)
            h2.appendChild(button)
            cardHeader.appendChild(h2)
            cardHeader.appendChild(button)
            card.appendChild(cardHeader)
            c1.appendChild(cardBody)
            card.appendChild(c1)
            accordian.appendChild(card)
  })
  makeRoute()
}
var courier=""
var courierElement = document.getElementById('courier')


function selectCourier(id){
  courier = usersArray[id.value].contactInfo.fullName
  addresses.push(usersArray[id.value].location.formattedAddress)
  locations.push(usersArray[id.value].location.coordinates)
  console.log(courier)
  courierElement.innerHTML=courier
  makeRoute()
}
var assignRouteButton = document.getElementById('assignRoute');


assignRouteButton.addEventListener('click',()=>{
  
  
  const sendBody={
    courier:courier,
    addresses:addresses,
    accepted:false
  }
  try{
    fetch('/api/routes',{
      method:'POST',
      headers:{
          'Content-Type':'application/json',
      },
      body: JSON.stringify(sendBody)
      
  }).then(res=>{
    console.log(res.json());
    alert('Route Assigned');
    window.location.href='/index.html';
  if(res.status ===400){
    throw Error('something went wrong')
}})

  }catch(err){
    console.log(err)
    return
  }
}
)




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
    popuphtml +='<button class=\'btn btn-success my-1\' value='+currentFeature.properties.index+' onClick=\'add(this)\'>Add address </button>'
  }
  else{
    popuphtml +='<button class=\'btn btn-primary my-1\' value='+currentFeature.properties.index+' onClick=\'selectCourier(this)\'>Select Courier </button>'

  }
  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(popuphtml)
    .addTo(map);
}
map.on('click', function(e) {
  /* Determine if a feature in the "locations" layer exists at that point. */ 
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
    

  }
})
//loadmap();
getUsers();
