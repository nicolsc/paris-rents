var map;
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.85, lng: 2.35},
    zoom: 12
  });
  
  drawCircles();
}

function drawCircles(){
  places.forEach(function(place){
    place.circle = new google.maps.Circle({
      strokeWeight: 0,
      fillColor: place.colour,
      fillOpacity: 0.35,
      map: map,
      center: new google.maps.LatLng(place.lat, place.lng),
      radius: place.radius * 1000
    });
  });
}
