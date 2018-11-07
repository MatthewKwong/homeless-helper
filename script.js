var database = firebase.database();
let userPosition;

function initMap() {
  getLocation();
  console.log('getLocation called');
}

//Google Maps Initialization
//USER LOCATION
function getLocation() {
  console.log('attempting to get location...')
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    console.log('location retrieved')
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

//Literally just shows the user's position on the map
function showPosition(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;
  console.log(lat);
  console.log(long);
  userPosition = {
    lat: lat,
    lng: long
  };

  console.log(userPosition)
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: userPosition
  });

//References saved values in Firebase
  database.ref('userPosition').once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var userCoords = childSnapshot.val();
      console.log(userCoords);

      //Making new Google Map pins for every location
      var newPin = new google.maps.Marker({
        map: map,
        position: userCoords
      });
    });
  });
}

function addMarker() {
  console.log('adding marker')
  // Get a key for a new posiition - Pushes the lat and long coordiantes to Firebase.
  var newPostKey = firebase.database().ref("/userPosition").push(userPosition).key;

  // Write the new user location data.
  var updates = {};
  updates['/posts/' + newPostKey] = userPosition;

  console.log('added')
  //puts a pin on the map at the current location based on lat and long.
  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: userPosition
  });

  var newPin = new google.maps.Marker({
    map: map,
    position: userPosition
  });

  database.ref('userPosition').once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var userCoords = childSnapshot.val();
      console.log(userCoords);
    });
  });


  //References saved values in Firebase
    database.ref('userPosition').once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var userCoords = childSnapshot.val();
        console.log(userCoords);

        //Making new Google Map pins for every location
        var newPin = new google.maps.Marker({
          map: map,
          position: userCoords
        });
      });
    });
  return firebase.database().ref().update(updates);
}
