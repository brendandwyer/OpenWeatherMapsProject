var API = "http://api.openweathermap.org/data/2.5/forecast/daily?";
var key = "&APPID=8cd9b0be137c94f160547ccf36b640f5";
var forecastdata;
var map;

function setup() {
    
    var city = document.getElementById("city").value, country = document.getElementById("country").value, units = "Metric", list = document.getElementById("days"), days = list.options[list.selectedIndex].value, button = document.getElementById('submit');
    
    if (city.length < 1) {
        alert("Invalid input for 'City'");
        return;
    }
    
    if (document.getElementById('units1').checked) {
        units = document.getElementById('units1').value;
    } else if (document.getElementById('units2').checked) {
        units = document.getElementById('units2').value;
    }
    
    button.mousePressed(weatherquery(city, country, units, days));
    
}

function weatherquery(city, country, units, days) {
    
    var URL = API + "q=" + city + "," + country + key + "&units=" + units + "&cnt=" + days, data, xmlhttp;
    
    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
    
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            displayresults(xmlhttp.responseText, days, units);
        }
    };
    
    xmlhttp.open("GET", URL, true);
    xmlhttp.send();    
}


function displayresults(result, days, units) {
        
    forecastdata = JSON.parse(result);
    
    var latitude = forecastdata.city.coord.lat, longitude = forecastdata.city.coord.lon, i, rain, symbol, pressureUnit, humidityUnit, windunit, out = "<table><tr><th>City</th><th>Country</th><th>Weather</th><th></th><th>Minimum Temperature </th><th>Maximum Temperature </th><th>Predicted Rainfall</th><th>Day</th></tr>";
    
    var outPressure = "<table><tr><th>Pressure</th><th>Day</th>";
    var outHumidity = "<table><tr><th>Humidity</th><th>Day</th>";
    var outWindSpeed = "<table><tr><th>Windspeed</th><th>Day</th>";
    
    // I left these outside the above declarations for readability
    
    pressureUnit = "Pa";
    humidityUnit = "g/m³";
    
    // Pressure and Humidity hardcoded to Metric units because JSON only returns one value despite 'Imperial' parameter.
    
    if (units === 'Metric') {
        symbol = "C";
        windunit = "m/s";
    } else {
        symbol = "F";
        windunit = "miles/h";
    }
    
    for (i = 0; i < days; i++) {
        if (forecastdata.list[i].rain == null){
            rain = "No rain recorded";
            // Error handling!
        }
        else {
            rain = forecastdata.list[i].rain + " mm";
            // Hard coded to 'mm' because JSON always returns same value
        }
        out += "<tr><td>" + 
        forecastdata.city.name +
        "</td><td>" +
        forecastdata.city.country +
        "</td><td>" +
        forecastdata.list[i].weather[0].main +
        "</td><td>" +
        "<img src =" + createIcon(forecastdata.list[i].weather[0].icon) + ">" +
        "</td><td>" +
        forecastdata.list[i].temp.min + "°" + symbol +
        "</td><td>" +
        forecastdata.list[i].temp.max + "°" + symbol +
        "</td><td>" +
        rain +
        "</td><td>" +
        (i + 1) +
        "</td></tr>";
        
        outPressure += "<tr><td>" +
        forecastdata.list[i].pressure + " " + pressureUnit +
        "</td><td>" +
        (i + 1) +
        "</td></tr>";
        
        outHumidity += "<tr><td>" +
        forecastdata.list[i].humidity + " " +humidityUnit +
        "</td><td>" +
        (i + 1) +
        "</td></tr>";
        
        outWindSpeed += "<tr><td>" +
        forecastdata.list[i].speed + " " + windunit +
        "</td><td>" +
        (i + 1) +
        "</td></tr>";
    }    
    
    out += "</table>";
    
    outPressure += "</table>";
    outHumidity += "</table>";
    outWindSpeed += "</table>";
    
    document.getElementById("table").innerHTML = out;
    document.getElementById("pressureTable").innerHTML = outPressure;
    document.getElementById("humidityTable").innerHTML = outHumidity;
    document.getElementById("windspeedTable").innerHTML = outWindSpeed;

    
    toggle('checks');
    
    
    initMap(latitude, longitude, forecastdata.city.name, forecastdata.list[0].weather[0].main, forecastdata.list[0].weather[0].icon, forecastdata.list[0].temp.day, forecastdata.list[0].speed, windunit);
}


function createIcon(iconRef){
    var iconSource = "http://openweathermap.org/img/w/" + iconRef + ".png";
    return iconSource;
}


//http://api.openweathermap.org/data/2.5/forecast/daily?q=Dublin,IE&APPID=8cd9b0be137c94f160547ccf36b640f5&units=Metric&cnt=1

//http://api.openweathermap.org/data/2.5/forecast/?q=Dublin,IE&APPID=8cd9b0be137c94f160547ccf36b640f5&units=Metric



function initMap(latitude, longitude, city, weather, icon, daytemperature, windspeed, windunit) {
    
    // Code used from https://developers.google.com/maps/documentation/javascript/examples/map-simple
    
    var LatLng = {lat: latitude, lng: longitude};
    
    map = new google.maps.Map(document.getElementById('map'), {
    center: LatLng,
          zoom: 10
    });
    
    var image = ("images/greenpin.png");
    var marker = new google.maps.Marker({
        position: LatLng, map: map, title: 'Click me for fancy bouncing animation!',
        animation: google.maps.Animation.DROP,
        icon: image
        
 // Code used from https://developers.google.com/maps/documentation/javascript/examples/marker-simple
        
    });
    
    marker.addListener('click', toggleBounce);
    
function toggleBounce() {
    
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
  } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
    
    var contentstring = "<b>City: </b>" + city + "<br><br><b>Weather: </b><br>" + weather + "<br>" + "<img src =" + createIcon(icon) + "></br><b>Day temperature:</b><br>" + daytemperature + "<br><br><b>Wind Speed:</b><br>" + windspeed + " " + windunit;
    
    var infowindow = new google.maps.InfoWindow({
    content: contentstring
    });
    
    // Code used from https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    
    marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
    // "Additional use of the Google Maps API"!
}


function toggle(id) {
    var e = document.getElementById(id);
    
    // You would not believe how long this bit took me to apply to the checkboxes...
    
    if(e.style.visibility == 'visible' && id != "checks"){
        e.style.visibility = 'hidden';
    // So if the checkboxes are already visible (ie. have been triggered once by the 'submit' button), they won't toggle off.
    // Tables will continue to toggle as normal.
    }
    else {
        e.style.visibility = 'visible';
    }
}