//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

//add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

//call getData function
    getData(map);
};
function onEachFeature(feature, layer) {
    var popupContent = "";
    if (feature.properties) {
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

function getData(map){
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){

          var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          };

            L.geoJson(response, {
              onEachFeature: onEachFeature,
              pointToLayer: function (onEachFeature, latlng){
                return L.circleMarker(latlng, geojsonMarkerOptions);
              },
              filter: function(feature, layer) {
                if (feature.properties.Pop_2015 > 20 ) {
                  return 'true'
                }
              }
            }).addTo(map);

        }
    });
};

$(document).ready(createMap);
