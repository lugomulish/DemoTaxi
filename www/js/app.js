
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller('AppController', function($scope, $http) {
  var rendererOptions = {
  draggable: true
};
  
  var myCurrentLocation = {};
  

$scope.getCurrentPosition = function(tipo_client){  
  var tipo_cliente = tipo_client;
  setInterval(function(){
      // method to be executed;
      
  navigator.geolocation.getCurrentPosition(
    function(position) {
         // alert("Lat: " + position.coords.latitude + "\nLon: " + position.coords.longitude);
         // myCurrentLocation.lat = position.coords.latitude;
         // myCurrentLocation.lon = position.coords.latitude;                              
          
          var latitude  = position.coords.latitude;
          var longitude = position.coords.longitude;

          $http.get('http://calm-thicket-9609.herokuapp.com/update_cordenadas?tipo_cliente='+tipo_cliente+'&latitude='+latitude+'&longitude='+longitude)
             .success(function (data,status) {                  
                  calcRoute()
             });
    },
    function(error){
         alert(error.message);
    }, {
         enableHighAccuracy: true
              ,timeout : 5000
    }
  ); 
  },5000); 
}

var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();
var map;

//Creamos la ubicacion del df con sus cordenadas.
var df = new google.maps.LatLng(19.4331716,-99.1266943);

//Creamos el mapa principal de googleMaps, le pasamos la ubicacion del DF.
function initialize() {
  var mapOptions = {
    zoom: 7,
    center: df
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  $scope.map = map;
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    computeTotalDistance(directionsDisplay.getDirections());
  });

  calcRoute();
}

function calcRoute() {  
  //Creamos 2 ubicaciones estaticas, Bellas Artes y la basilica de guadalupe
  var taxi = "";
  var cliente = "";

  //var bellasArtes = new google.maps.LatLng(19.4352,-99.1412);
  //var basilicaGuadalupe = new google.maps.LatLng(19.484857,-99.117862);
  $http.get('http://calm-thicket-9609.herokuapp.com/')
             .success(function (data,status) {                        
                  cliente = new google.maps.LatLng(Number(data.results[0].lat),Number(data.results[0].leng))
                  taxi = new google.maps.LatLng(Number(data.results[1].lat),Number(data.results[1].leng))
                  pintarRuta()
             });
  function pintarRuta(){
  //Creamos el objeto Request, que se enviara con el directionsService
  //en el cual se indica el origen, destino y metodo de viaje con el 
  //que se trazara la ruta.  
  var request = {    
    origin: taxi,
    destination: cliente,
    // waypoints:[{location: 'Bourke, NSW'}, {location: 'Broken Hill, NSW'}],          
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
  }           
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.0;
  document.getElementById('total').innerHTML = total + ' km';
}

google.maps.event.addDomListener(window, 'load', initialize);
})

.run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});