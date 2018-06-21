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
var queryUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Richmond%20Virginia&inputtype=textquery&fields=id,photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyA5Ag7VdkbFo4eRs7x383DpttV1xDr5uRk";
queryUrl ="https://trailapi-trailapi.p.mashape.com/?q[city_cont]=Richmond&q[state_cont]=virginia";

$.ajax({
  url: queryUrl,
  method: 'GET',
  headers: {
    "X-Mashape-Key": "9P0eBNZEeGmshd3pS2BerOChm5t5p1BXzT8jsnj1QooihhfQhl",
    "Accept": "text/plain"
  }
}).then(function (result) {
  console.log(result);
})
queryUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Richmond%20Virginia&inputtype=textquery&fields=place_id,id,photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyA5Ag7VdkbFo4eRs7x383DpttV1xDr5uRk";

$.ajax({
  url: 'https://cors-anywhere.herokuapp.com/' + queryUrl,
  method: 'GET',
  headers: {

  }
}).then(function (result) {
  console.log(result.candidates[0]);
})

var multiple = new Multiple({
  selector: '.bgound',
  background: 'linear-gradient(#273463, #8B4256)'
});