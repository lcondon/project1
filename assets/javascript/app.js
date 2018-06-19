(function($){
    $(function(){
  
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
  