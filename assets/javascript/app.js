
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

$("#searchBar").on("click", function (event) {
  event.preventDefault();
  city = $("#cityInput").val().trim();
  console.log(city);
  zip = $("#form-zip").val().trim();
  console.log(zip);
  state = $("#form-state").val().trim();
  console.log(state);
})

