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
var queryUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Richmond%20Virginia&inputtype=textquery&fields=id,photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyA5Ag7VdkbFo4eRs7x383DpttV1xDr5uRk"

$.ajax({
  url: queryUrl,
  method: 'GET'
}).then(function (result) {
  console.log(result);
})

