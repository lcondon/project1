(function ($) {
  $(function () {

    $('.sidenav').sidenav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space

var placesAutocomplete = places({
  container: document.querySelector("#cityInput"),
  language: "en_US",
  countries: "us",
  aroundLatLngViaIP: false,
});

var city = "Richmond";
var state = "virginia";

var queryUrl ="https://trailapi-trailapi.p.mashape.com/?q[city_cont]=" + city + "&q[state_cont]=" + state;

$.ajax({
  url: queryUrl,
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

var multiple = new Multiple({
  selector: '.bgound',
  background: 'linear-gradient(#273463, #8B4256)'
});

var gettyUrl = "https://api.gettyimages.com/v3/search/images?fields=id,title,thumb,referral_destinations&sort_order=most_popular&phrase=" + city + "," + state;

$.ajax({
  url: gettyUrl,
  method: 'GET',
  headers: {
    "Api-Key": "j878g39yx378pa77djthzzpn"
  }
}).then(function (result) {
  console.log(result.places);
})
