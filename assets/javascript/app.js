<<<<<<< HEAD
//Loaded for Parallax
=======
>>>>>>> 572318783951b2f393206ce0a4d8836dc154be53
(function ($) {
  $(function () {

    $('.sidenav').sidenav();
    $('.parallax').parallax();
<<<<<<< HEAD

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
=======

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

>>>>>>> 572318783951b2f393206ce0a4d8836dc154be53
