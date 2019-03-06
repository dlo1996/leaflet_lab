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
    }).addTo(map);``

//call getData function
    getData(map);
};
// function onEachFeature(feature, layer) {
//     var popupContent = "";
//     if (feature.properties) {
//         for (var property in feature.properties){
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         layer.bindPopup(popupContent);
//     };
// };

//Step 3: Add circle markers for point features to the map
// function createPropSymbols(data, map){
//   var attribute = "total" //CHANGE TO YOUR VARIABLE
//   //create marker options
//   var geojsonMarkerOptions = {
//       radius: 8,
//       fillColor: "#ff7800",
//       color: "#000",
//       weight: 1,
//       opacity: 1,
//       fillOpacity: 0.8
//   };
//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];


    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>name:</b> " + feature.properties.name + "</p>";
    var year = attribute.split(" ")[1];
    popupContent += "<p><b> total refugees" + ": </b>" + feature.properties[attribute] + " million </p>";
    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
      offset: new L.Point(0,-options.radius)
    });
    //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
    })

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};
  //calculate the radius of each proportional symbol
  function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = .00001;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
  };
  //create a Leaflet GeoJSON layer and add it to the map
//   L.geoJson(data, {
//       pointToLayer: function (feature, latlng) {
//           //Step 5: For each feature, determine its value for the selected attribute
//           var attValue = Number(feature.properties[attribute]);
//
//           //Step 6: Give each feature's circle marker a radius based on its attribute value
//           geojsonMarkerOptions.radius = calcPropRadius(attValue);
//           console.log(geojsonMarkerOptions.radius)
//
//           //create circle markers
//           return L.circleMarker(latlng, geojsonMarkerOptions);
//
//       }
//   }).addTo(map);
// };
//
function createSequenceControls(map, attributes){
  $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
  $('#panel').append('<input class="range-slider" type= "range">');
  $('#panel').append('<button class="skip" id="forward">Forward</button>');


  $('.range-slider').attr({
    max: 6,
    min: 0,
    value: 0,
    step: 1,
  });
  //Example 3.12 line 2...Step 5: click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 6 : index;
        };

        //Step 8: update slider
        $('.range-slider').val(index);
        $('.range-slider').on('input', function(){

        });
        updatePropSymbols(map, attributes[index]);
    });
};
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
      if (layer.feature && layer.feature.properties[attribute]){
                  //access feature properties
                  var props = layer.feature.properties;

                  //update each feature's radius based on new attribute values
                  var radius = calcPropRadius(props[attribute]);
                  layer.setRadius(radius);

                  //add city to popup content string
                  var popupContent = "<p><b>name:</b> " + props.name + "</p>";

                  //add formatted attribute to panel content string
                  var year = attribute.split("")[1];
                  popupContent += "<p><b> total refugees" + props.name+ ": </b>" + props[attribute] + "</p>";

                  //replace the layer popup
                  layer.bindPopup(popupContent, {
                      offset: new L.Point(0,-radius)
                  });
              };
        });
    };


function processData(data){
  var attributes = [];
  var properties = data.features[0].properties;
  for (var attribute in properties){
    if (attribute.indexOf("0") > -1){
      attributes.push(attribute);
    };
  };
  console.log(attributes);

  return attributes;
};



function getData(map){
    $.ajax("data/map.geojson", {
        dataType: "json",
        success: function(response){

          var attributes = processData(response);
          createPropSymbols(response, map, attributes);
          createSequenceControls(map, attributes);


//
//           // var geojsonMarkerOptions = {
//           //   radius: 8,
//           //   fillColor: "#ff7800",
//           //   color: "#000",
//           //   weight: 1,
//           //   opacity: 1,
//           //   fillOpacity: 0.8
//           // };
//
//           //   L.geoJson(response, {
//           //     onEachFeature: onEachFeature,
//           //     pointToLayer: function (onEachFeature, latlng){
//           //       return L.circleMarker(latlng, geojsonMarkerOptions);
//           //     },
//           //     filter: function(feature, layer) {
//           //       if (feature.properties.total > 20 ) {
//           //         return 'true'
//           //       }
//           //     }
//           //   }).addTo(map);
//
        }

    });
};
//
$(document).ready(createMap);
