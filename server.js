// server.js
// where your node app starts

// init project
var express = require("express");
var request = require("request");
var service = require("./services");
var app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/hello", function(req, res) {
  setTimeout(function() {
    return res.send(200, "hello-duude");
  }, 500);
});

app.get("/data/construction", function(req, res) {
  var url =
    "http://files5.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.construction.geojsonp";
  var funcName = "OpenLayers.Protocol.ScriptLite.registry.load_construction";
  request(url, function(error, response, body) {
    res.setHeader("content-type", "application/json");
    console.log("getting jsonp data for construction");
    var data = service.fixData(funcName, body);
    return res.status(200).send(data);
  });
});



app.get("/data/scheduledBridges", function(req, res) {
  var url =
    "http://files5.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.scheduled_bridge_opening.geojsonp";
  var funcName =
    "OpenLayers.Protocol.ScriptLite.registry.load_scheduled_bridge_opening";
  request(url, function(error, response, body) {
    res.setHeader("content-type", "application/json");
    console.log("getting jsonp data for scheduledBridges");
    var data = service.fixData(funcName, body);

    return res.send(data);
  });
});

app.get("/data/novaDms", function(req, res) {
  var url =
    "http://www.511virginia.org/rtb/data/icons.rtb_dms_metadata.geojson";
  var funcName = "anythingwilldohere";
  request(url, function(error, response, body) {
    res.setHeader("content-type", "application/json");
    console.log("getting jsonp data for novaDms");
    var data = service.fixData(funcName, body);

    return res.send(data);
  });
});

app.get("/data/dms", function(req, res) {
  var url =
    "http://files4.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.ord_dms_active.geojsonp";
  var funcName = "OpenLayers.Protocol.ScriptLite.registry.load_ord_dms_active";
  request(url, function(error, response, body) {
    res.setHeader("content-type", "application/json");
    console.log("getting jsonp data for dms");
    var data = service.fixData(funcName, body);

    return res.send(data);
  });
});

app.get("/data/prettyDms", function(req, res) {
  var url =
    "http://files4.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.pretty_dms_active.geojsonp";
  var funcName =
    "OpenLayers.Protocol.ScriptLite.registry.load_pretty_dms_active";
  request(url, function(error, response, body) {
    res.setHeader("content-type", "application/json");
    console.log("getting jsonp data for prettyDms");
    var data = service.fixData(funcName, body);

    return res.send(data);
  });
});

app.get("/data/inactiveConstruction", function(req, res) {
  var url =
    "http://files4.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.inactive_construction.geojsonp";
  var funcName =
    "OpenLayers.Protocol.ScriptLite.registry.load_inactive_construction";
  request(url, function(error, response, body) {
    res.setHeader("content-type", "application/json");
    console.log("getting jsonp data for inactiveConstruction");
    var data = service.fixData(funcName, body);

    return res.send(data);
  });
});

app.get("/data/inactiveCameras", function(req, res) {
  var url =
    "http://files4.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.cameras_inactive.geojsonp";
  var funcName =
    "OpenLayers.Protocol.ScriptLite.registry.load_cameras_inactive";
  request(url, function(error, response, body) {
    res.setHeader("content-type", "application/json");
    console.log("getting jsonp data for inactiveCameras");
    var data = service.fixData(funcName, body);

    return res.send(data);
  });
});

app.get("/data/cameras", function(req, res) {
  var data;

  request(
    "http://files4.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.cameras.geojsonp",
    function(error, response, body) {
      res.setHeader("content-type", "application/json");
      console.log("getting jsonp data for cameras");
      data = service.fixData(
        "OpenLayers.Protocol.ScriptLite.registry.load_cameras",
        body
      );

      //data = this.fixData("OpenLayers.Protocol.ScriptLite.registry.load_cameras", body);

      //application/json
      return res.send(data);
    }
  );
});

app.get("/data/incidents", function(req, res) {
  request(
    "http://files5.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.incident.geojsonp",
    function(error, response, body) {
      //set the response type
      res.setHeader("content-type", "application/json");
      console.log("getting jsonp data for incidents");
      var data = service.fixData(
        "OpenLayers.Protocol.ScriptLite.registry.load_incident",
        body
      );
      return res.send(data);
    }
  );
});

app.get("/data/weather", function(req, res) {
  var url =
    "http://files5.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.weather.geojsonp";
  var funcName = "OpenLayers.Protocol.ScriptLite.registry.load_weather";
  request(url, function(error, response, body) {
    //set the response type
    res.setHeader("content-type", "application/json");

    console.log("getting jsonp data for weather");

    var data = service.fixData(funcName, body);

    return res.send(data);
  });
});

app.get("/data/specialEvents", function(req, res) {
  var url =
    "http://files6.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.special_event.geojsonp";
  var funcName = "OpenLayers.Protocol.ScriptLite.registry.load_special_event";
  request(url, function(error, response, body) {
    //set the response type
    res.setHeader("content-type", "application/json");

    console.log("getting jsonp data for specialEvents");

    var data = service.fixData(funcName, body);

    return res.send(data);
  });
});

app.get("/data/highImpactIncidents", function(req, res) {
  var url =
    "http://files6.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.high_impact_incident.geojsonp";
  var funcName =
    "OpenLayers.Protocol.ScriptLite.registry.load_high_impact_incident";
  request(url, function(error, response, body) {
    //set the response type
    res.setHeader("content-type", "application/json");

    console.log("getting jsonp data for highImpactIncidents");

    var data = service.fixData(funcName, body);

    return res.send(data);
  });
});
app.get("/data/weatherClosures", function(req, res) {
  var url =
    "http://files6.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.weather_closure.geojsonp";
  var funcName = "OpenLayers.Protocol.ScriptLite.registry.load_weather_closure";
  request(url, function(error, response, body) {
    //set the response type
    res.setHeader("content-type", "application/json");
    debugger;
    console.log("getting jsonp data for weatherClosures");

    var data = service.fixData(funcName, body);

    return res.send(data);
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
