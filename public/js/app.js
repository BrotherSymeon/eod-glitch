var map, featureList, boroughSearch = [], theaterSearch = [], museumSearch = [];
//var datUrl = "http://map-data.azurewebsites.net"
//var datUrl = "http://localhost:1337";
var datUrl = "https://endurable-spatula.glitch.me/";

var player;

//'data-setup=\'{"example_option":true}\'>' +

function videoHTML(feedUrl) {
    return '<video id="video-js" class="video-js vjs-default-skin" ' +
        'controls preload="auto" width="420" height="260" >' +
        
        '\t<source src="' + feedUrl + '" type="rtmp/mp4" /> \n' +
        '\t\t<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>\n' +
        '</video>';
}

function setupPlayer(feedUrl){
    player.dispose();
 
    $('div.video-background').html(videoHTML(videoNumber));
 
    player = videojs('#video-js');   
    
}

$(document).ready(function () {
    //$('div.video-background').html(videoHTML(''));
    //player = videojs('#video-js');
});


$(document).on("click", ".feature-row", function(e) {
  sidebarClick(parseInt($(this).attr('id')));
});

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

function sidebarClick(id) {

  var clusters = [];

  clusters.push(markerClusters);
  clusters.push(incidentCluster);

  for(var i = 0; i < clusters.length; i++){
    if(clusters[i].getLayer(id)){
      var layer = clusters[i].getLayer(id);
      clusters[i].zoomToShowLayer(layer, function() {
        map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
        layer.fire("click");
      });

    }
  }


  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});

var Thunderforest_Transport = L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '<your apikey>',
	maxZoom: 22
})

/* Basemap Layers */
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

var incidentCluster = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});


function getMarker(title, latlng, iconUrl){
     return L.marker(latlng, {
      icon: L.icon({
        iconUrl: iconUrl,
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: title,
      riseOnHover: true
    });
    
}


//http://www.vdotdatasharing.org/geoserver/orci/wms?LAYERS=orci:vat_road_cond_line&STYLES=&FORMAT=image/png&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG:4326&BBOX=-78.222255924716,38.516698841006,-76.264180948958,39.196157034486&WIDTH=951&HEIGHT=330&cql_filter=lrs_route_name+IN+(%27I-95RN%27,%27I-95RS%27,%27I-395RN%27,%27I-395RS%27)

//http://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?date=1527811200&appid=730960791d3bd7f756526bff133db63e
var cloudLayer = L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=63ff59439f62a92a70a6bb430a8350de', {
    attribution: 'Map data © OpenWeatherMap',
    maxZoom: 18
});
//precipitation_new
var rainLayer = L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=63ff59439f62a92a70a6bb430a8350de', {
    attribution: 'Map data © OpenWeatherMap',
    maxZoom: 18
});

var snowLayer = L.tileLayer('https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=63ff59439f62a92a70a6bb430a8350de', {
    attribution: 'Map data © OpenWeatherMap',
    maxZoom: 18
});


var highImpactIncidentsLayer = L.geoJson(null);
var highImpactIncidents = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
      return getMarker(feature.properties.id, latlng, "https://cdn.glitch.com/95a95dc9-7c08-4f24-b0f9-4c72b646384c%2Fcaution.png?v=1572705443615");
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Id</th><td>" + feature.id + "</td></tr>" + "<tr><th>Priority</th><td>" + feature.properties.priority + "</td></tr>" + "<tr><th>Location</th><td >" + feature.properties.location_description + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.id);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.7,
            radius: 10
          }));
        }
      });
        
      $("#feature-list tbody").append('<tr class="feature-row" id="'+L.stamp(layer)+'"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/mapicons/caution.png"></td><td class="feature-name">'+layer.feature.properties.location_description+'</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      museumSearch.push({
        jurisdiction: layer.feature.properties.location_description,
        source: "Museums",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON( datUrl + "/data/highImpactIncidents", function (data) {
  highImpactIncidents.addData(data);
  map.addLayer(highImpactIncidentsLayer);
    console.log("added highImpactIncidents layer");
});




var constructionLayer = L.geoJson(null);
var construction = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
      return getMarker(feature.properties.id, latlng, "https://cdn.glitch.com/95a95dc9-7c08-4f24-b0f9-4c72b646384c%2Fconstruction.png?v=1572705442906");
  },

  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Id</th><td>" + feature.id + "</td></tr>" + "<tr><th>Priority</th><td>" + feature.properties.priority + "</td></tr>" + "<tr><th>Location</th><td >" + feature.properties.location_description + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.id);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.7,
            radius: 10
          }));
        }
      });
        
      //$("#feature-list tbody").append('<tr class="feature-row" id="'+L.stamp(layer)+'"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/mapicons/construction.png"></td><td class="feature-name">'+layer.feature.properties.location_description+'</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      museumSearch.push({
        jurisdiction: layer.feature.properties.location_description,
        source: "Museums",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }


});
$.getJSON( datUrl + "/data/construction", function (data) {
  construction.addData(data);
  map.addLayer(constructionLayer);
    console.log("added construction layer");
});


/* Empty layer placeholder to add to layer control for listening when to add/remove cameras to markerClusters layer */
var cameraLayer = L.geoJson(null);
var cameras = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
      return getMarker(feature.properties.jurisdiction, latlng, "https://cdn.glitch.com/95a95dc9-7c08-4f24-b0f9-4c72b646384c%2Fvideo.png?v=1572705444083");
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Jurisdiction</th><td>" + feature.properties.jurisdiction + "</td></tr>" + "<tr><th>Description</th><td>" + feature.properties.description + "</td></tr><tr><th>Live Feed</th><td><div id='video_wrapper'></div> </td></tr><table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.jurisdiction);
          $("#feature-info").html(content);
             
          
          if(player){player.dispose();}
 
          $("#video_wrapper").html(videoHTML(feature.properties.rtmp_url));
 
          player = videojs('#video-js'); 
            
          //player.play();
          
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.7,
            radius: 10
          }));
        }
      });
        
      $("#feature-list tbody").append('<tr class="feature-row" id="'+L.stamp(layer)+'"><td style="vertical-align: middle;"><img width="16" height="18" src="https://cdn.glitch.com/95a95dc9-7c08-4f24-b0f9-4c72b646384c%2Fvideo.png?v=1572705444083"></td><td class="feature-name">'+layer.feature.properties.description+'</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      theaterSearch.push({
        jurisdiction: layer.feature.properties.jurisdiction,
        description: layer.feature.properties.description,
        source: "Theaters",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON( datUrl + "/data/cameras", function (data) {
  data.features = cleanFeatures(data.features);
  cameras.addData(data);
  map.addLayer(cameraLayer);
    console.log("added camera layer");
});

// incident layer
var incidentLayer = L.geoJson(null);
var incidents = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
      return getMarker(feature.properties.id, latlng, "https://cdn.glitch.com/95a95dc9-7c08-4f24-b0f9-4c72b646384c%2Fdescent.png?v=1572705441890");
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Id</th><td>" + feature.id + "</td></tr>" + "<tr><th>Priority</th><td>" + feature.properties.priority + "</td></tr>" + "<tr><th>Location</th><td >" + feature.properties.location_description + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.id);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.7,
            radius: 10
          }));
        }
      });
        
      $("#feature-list tbody").append('<tr class="feature-row" id="'+L.stamp(layer)+'"><td style="vertical-align: middle;"><img width="16" height="18" src="https://cdn.glitch.com/95a95dc9-7c08-4f24-b0f9-4c72b646384c%2Fdescent.png?v=1572705441890"></td><td class="feature-name">'+layer.feature.properties.location_description+'</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      museumSearch.push({
        jurisdiction: layer.feature.properties.location_description,
        source: "Museums",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON( datUrl + "/data/incidents", function (data) {
  incidents.addData(data);
  map.addLayer(incidentLayer);
    console.log("added incident layer");
});


/* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
/*var museumLayer = L.geoJson(null);
var museums = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/museum.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.7,
            radius: 10
          }));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="'+L.stamp(layer)+'"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">'+layer.feature.properties.NAME+'</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      museumSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "Museums",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/DOITT_MUSEUM_01_13SEPT2010.geojson", function (data) {
  museums.addData(data);
});*/

map = L.map("map", {
  zoom: 8,
  center: [38.00596639394089, -79.29538499999998],
  layers: [OpenStreetMap_Mapnik, markerClusters, incidentCluster, highlight],
  zoomControl: false,
  attributionControl: false,
  maxZoom: 15
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === cameraLayer) {
    markerClusters.addLayer(cameras);
  }
  if (e.layer === incidentLayer) {
    incidentCluster.addLayer(incidents);
  }
  if (e.layer === constructionLayer) {
    map.addLayer(construction);
  }
 if (e.layer === highImpactIncidentsLayer) {
    incidentCluster.addLayer(highImpactIncidents);
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === cameraLayer) {
    markerClusters.removeLayer(cameras);
  }
  if (e.layer === incidentLayer) {
    incidentCluster.removeLayer(incidents);
  }
  if (e.layer === constructionLayer) {
    map.removeLayer(construction);
  }
 if (e.layer === highImpactIncidentsLayer) {
    incidentCluster.removeLayer(highImpactIncidents);
  }
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

map.on("move", function(e){
    var center = map.getCenter();
    //console.log(e);
   //console.log(e.options.center);
    console.log("lat: " + center.lat);
    console.log("lng: " + center.lng);
});

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed by moebious  | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "icon-direction",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

  //"Street Map": mapquestOSM,
  //"Aerial Imagery": mapquestOAM,
  //"Imagery with Streets": mapquestHYB

var baseLayers = {
  "OpenMap": OpenStreetMap_Mapnik

};

var groupedOverlays = {
  "Points of Interest": {
    "<img src='https://cdn.glitch.com/95a95dc9-7c08-4f24-b0f9-4c72b646384c%2Fvideo.png?v=1572705444083' width='24' height='28'>&nbsp;Cameras": cameraLayer,
    "<img src='https://cdn.glitch.com/95a95dc9-7c08-4f24-b0f9-4c72b646384c%2Fconstruction.png?v=1572705442906' width='24' height='28'>&nbsp;Construction": constructionLayer
  },
  "Incidents": {
      "<img src='https://cdn.glitch.com/95a95dc9-7c08-4f24-b0f9-4c72b646384c%2Fdescent.png?v=1572705441890' width='24' height='28'>&nbsp;Incidents": incidentLayer,
      "<img src='https://cdn.glitch.com/95a95dc9-7c08-4f24-b0f9-4c72b646384c%2Fcaution.png?v=1572705443615' width='24' height='28'>&nbsp;High Impact Incidents": highImpactIncidentsLayer
  },
  "Reference": {
    "<img src='http://icons.wxug.com/i/c/i/nt_cloudy.gif' width='24' height='28'>&nbsp;Clouds": cloudLayer,
    "<img src='http://icons.wxug.com/i/c/i/nt_chancerain.gif' width='24' height='28'>&nbsp;Rain": rainLayer,
    "<img src='http://icons.wxug.com/i/c/i/nt_flurries.gif' width='24' height='28'>&nbsp;Wind": snowLayer
    
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
    //debugger;
  $("#loading").hide();
  /* Fit map to boroughs bounds */
    console.log(cameras.getBounds());
  map.fitBounds(cameras.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  //featureList.sort("feature-name", {order:"asc"});

  var boroughsBH = new Bloodhound({
    name: "Boroughs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boroughSearch,
    limit: 10
  });

  var theatersBH = new Bloodhound({
    name: "Theaters",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.jurisdiction);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: theaterSearch,
    limit: 10
  });

  var museumsBH = new Bloodhound({
    name: "Museums",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: museumSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  boroughsBH.initialize();
  theatersBH.initialize();
  museumsBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Boroughs",
    displayKey: "name",
    source: boroughsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Boroughs</h4>"
    }
  }, {
    name: "Theaters",
    displayKey: "name",
    source: theatersBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;Cameras</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Museums",
    displayKey: "name",
    source: museumsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Boroughs") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Theaters") {
      if (!map.hasLayer(cameraLayer)) {
        map.addLayer(cameraLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Museums") {
      if (!map.hasLayer(incidentLayer)) {
        map.addLayer(incidentLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});
