var mymap = L.map('mapid').setView([51.505, -0.09], 13);
// creating map box and using accesstoken to open file
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data & copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'sk.eyJ1IjoiZGxvbWJhcmRvMTAiLCJhIjoiY2pzOWR5ZXIwMGJ4bDRhbnh0Nnd6bWZ6aCJ9.VosBWquUo48cmzoQ5qmuAg'
}).addTo(mymap);
// creating marker on map
var marker = L.marker([51.5, -0.09]).addTo(mymap);
//creating circle, giving it a location and color, adding to map
var circle = L.circle([51.508, -0.11], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 500
}).addTo(mymap);
// creating a polygon and adding to map
var polygon = L.polygon([
  [51.509, -0.08]
  [51.503, -0.06]
  [51.51, -0.047]
]).addTo(mymap);
// creating popup if you click on polygon or circle
marker.bindPopup("<b>Hello world!</b><br> I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");
// creating a popup on its own
var popup = L.popup()
  .setLatLng([51.5, - 0.09])
  .setContent("I am a standalone popup.")
  .openOn(mymap);

//function onMapClick(e) {
//    alert("you clicked the map at" + e.latlng);
mymap.on('click', onMapClick);

var popup = L.popup();
// popup for where you click on the map
function onMapClick(e){
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
}
mymap.on('click', onMapClick);

// creating a 2 line segment on map
var myLines = [{
  "type": "LineString",
  "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
  "type": "LineString",
  "coordinates": [[-105,40], [-110,45], [-115,55]]
}];
// color for the lines
var myStyle = {
  "color": "#ff7800",
  "weight": 5,
  "opacity": 0.65
};
L.geoJSON(myLines, {
  style: myStyle
}).addTo(map);
//creating states, giving them an attribute of political affliation
var states = [{
  "type": "Feature",
  "properties": {"party": "Republican"},
  "geometry": {
    "type": "{Polygon}",
    "coordinates": [[
      [-104.05, 48.99],
      [-97.22, 48.98],
      [-96.58, 45.94],
      [-104.03, 45.94],
      [-104.05, 48.99]
    ]]
  }, {
    "type": "Feature",
    "porperties": {"party": "Democrat"},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [-109.05, 41.00],
        [-102.06, 40.99],
        [-102.03, 36.99],
        [-109.04, 36.99],
        [-109.05, 41.00],
      ]]
    }
  }
}];
//assinging color for red and blue states
L.geoJSON(states, {
  style: function(feature) {
    switch (feature.properties.party) {
      case 'Republican': return {color: "#ff0000"}
      case 'Democrat': return {color: "#0000ff"}
    }
  }
}).addTo(map);

var geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

L.geoJSON(someGeojsonFeature, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
  }
}).addTo(map);

function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
}
// creating a point feature for coors stadium with a popup
var geojsonFeature = {
  "type": "Feature"
  "properties": {
    "name": "Coors Field",
    "amenity": "Baseball Stadium",
    "popupContent": "This is where the Rockies play!"
  },
  "geometry": {
    "type": "point",
    "coordinates": [-104.99404, 39.75621]
  }
};
L.geoJSON(geojsonFeature, {
  onEachFeature: onEachFeature
}).addTo(map);
// giving a boolean for the two Baseball fields and making coors field show
var someFeatures =[{
  "type": "Feature",
  "properties": {
    "name": "Coors Field",
    "show_on_map": true
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-104.99404, 39.75621]
  }
}, {
  "type": "Feature",
  "properties": {
    "name": "Busch Field",
    "show_on_map": false
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-104.98404, 39.74621]
  }
}],
L.geoJSON(someFeatures),{
  filter: function(feature, layer) {
    return feature.properties.show_on_map;
  }
}.addTo(map);
