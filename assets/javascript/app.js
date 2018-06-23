
(function ($) {
  $(function () {

    $('.sidenav').sidenav();
    $('.parallax').parallax();


  });
})(jQuery);

//Loaded for Algolia Places
var placesAutocomplete = places({
  container: document.querySelector("#cityInput"),
  language: "en_US",
  countries: "us",
  aroundLatLngViaIP: false,
});

//Takes user input as a CITY and then suggests the STATE and ZIP
var placesAutocomplete = places({
  container: document.querySelector('#cityInput'),
  type: 'city',
  templates: {
    value: function (suggestion) {
      return suggestion.name;
    }
  }
});
placesAutocomplete.on('change', function resultSelected(e) {
  document.querySelector('#form-state').value = e.suggestion.administrative || ''
  document.querySelector('#form-zip').value = e.suggestion.postcode || '';
});

//Global Variables 
var city = "";
var zip = "";
var state = "";
var zomatoKey = "";

$("#searchBar").on("click", function (event) {
  event.preventDefault();
  city = $("#cityInput").val().trim();
  console.log(city);
  zip = $("#form-zip").val().trim();
  console.log(zip);
  state = $("#form-state").val().trim();
  console.log(state);

  //Find the Zomato ID
  var zomatoQuery = "https://developers.zomato.com/api/v2.1/cities?q=" + city + "%2C%20" + state + "&count=1"
  $.ajax({
    url: zomatoQuery,
    method: "GET",
    headers: {
      Accept: "application/json",
      "user-key": "0d9d7319d7127204add1f39cf9d0bd39"
    }
  }).then(function (response) {
    console.log(response);
    zomatoKey = response.location_suggestions[0].id;
    console.log(zomatoKey);
    //Find the restaurants using Zomato
    var zomatoRestaurantQuery = "https://developers.zomato.com/api/v2.1/search?entity_id=" + zomatoKey + "&entity_type=city&start=0&count=10"
    $.ajax({
      url: zomatoRestaurantQuery,
      method: "GET",
      headers: {
        Accept: "application/json",
        "user-key": "0d9d7319d7127204add1f39cf9d0bd39"
      }
    }).then(function (response) {
      console.log(response);
    })
  })

  var trailUrl = "https://trailapi-trailapi.p.mashape.com/?q[city_cont]=" + city + "&q[state_cont]=" + state;

  $.ajax({
    url: trailUrl,
    method: 'GET',
    headers: {
      "X-Mashape-Key": "9P0eBNZEeGmshd3pS2BerOChm5t5p1BXzT8jsnj1QooihhfQhl",
      "Accept": "text/plain"
    }
  }).then(function (result) {
    console.log(result.places);
  })


  var googleUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + city + "%20" + state + "&inputtype=textquery&fields=place_id,id,photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyA5Ag7VdkbFo4eRs7x383DpttV1xDr5uRk";

  $.ajax({
    url: 'https://cors-anywhere.herokuapp.com/' + googleUrl,
    method: 'GET',
    headers: {

    }
  }).then(function (result) {
    var city = result.candidates[0];
    console.log(city);
  })

var unsplashUrl = "https://api.unsplash.com/search/photos?client_id=7e1468f8407999fec4a3b0c0f43ef7924b8963590f6d7929f2e3dd9a8c6cf0c4&page=1&query=richmond+virginia&orientation=landscape";

$.ajax({
    url: unsplashUrl,
    method: 'GET',
}).then(function (result) {
    console.log(result.results[0].urls.raw);
    var url1 = result.results[0].urls.raw;
    multiple.update("url('" + url1 + "')");
})

})

var multiple = new Multiple({
  selector: '.bgound',
  background: 'linear-gradient(#273463, #8B4256)'
});


