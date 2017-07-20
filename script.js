$(document).ready(function() {

  if(!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  /**
  * Get you location when you allowed the prompt
  */
  navigator.geolocation.getCurrentPosition(function(position) {

    var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    new google.maps.Geocoder().geocode({'latLng': point}, function(res, status) {

      if(status === 'OK')
        getWeather(position.coords.latitude, position.coords.longitude);

      $(".city").html("<h2>"+res[0].address_components[3].long_name+"</h2>");

    });
  }, function(err) {
    console.log(err);
  });

  /**
  * Get the weather (api fc weather) from your geolocation and show info to html page
  *
  * @param {float} lat Latitud of your location
  * @param {float} lng Longitude of your location
  */
  function getWeather(lat, lng) {

    var requestString = "https://fcc-weather-api.glitch.me//api/current?lat="+lat+"&lon="+lng;

    $.ajax({
      type: 'GET',
      url: requestString,
      success: function(response) {
        $(".temperature").html("<h4>"+Math.round(response.main.temp)+" &#8451;</h4>");
        $(".description").html("<p>"+response.weather[0].description+"</p><span><img src='"+response.weather[0].icon+"'/></span>");
        $(".sunrise-sunset").html("<p>Sunrise: "+convertTimestamp(response.sys.sunrise)+"</p><p>Sunset: "+convertTimestamp(response.sys.sunset)+"</p>");
      },
      error: function(err) {
        console.log(err);
      }
    })
  }

  /**
  * Change the temperature scale to fahrenheit o celsius
  */
  $(".temperature").on("click", function(evt) {
    var text = evt.target.innerText;
    text = text.split(' ');
    if(text[1] === '℃') {
      var fahrenheit = Math.round(toFahrenheit(text[0]));
      $(".temperature").html("<h4>"+fahrenheit+" &#8457;</h4>");
    } else if([text[1] === '℉']) {
      var celsius = Math.round(toCelsius(text[0]));
      $(".temperature").html("<h4>"+celsius+" &#8451;</h4>");
    }
  })

  /**
  * Convert a temperature value from celsius to fahrenheit
  *
  * @param {number} celsius the temperature in celsius scale
  * @return {number} The temperature in fahrenheit scale
  */

  function toFahrenheit(celsius) { return ((celsius * 1.8) + 32); }

  /**
  * Convert a temperature value from fahrenheit to celsius
  *
  * @param {number} fahrenheit the temperature in fahrenheit scale
  * @return {number} The temperature in celsius scale
  */
  function toCelsius(fahrenheit) { return ((fahrenheit - 32) * (5/9)); }

  /**
  * Convert Unix time to formated time
  *
  * @param {number} timestamp Unix format to represent time
  * @return {string} formattedTime time with normal user representation
  */
  function convertTimestamp(timestamp) {

    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
  }

});
