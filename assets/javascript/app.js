
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
    var zomatoRestaurantQuery = "https://developers.zomato.com/api/v2.1/search?entity_id="+zomatoKey+"&entity_type=city&start=0&count=10"
    $.ajax({
      url: zomatoRestaurantQuery,
      method: "GET",
      headers: {
        Accept: "application/json",
        "user-key": "0d9d7319d7127204add1f39cf9d0bd39"
      }
    }).then(function (response) {
      console.log(response.restaurants);
      var restaurantList = response.restaurants;
      for (var i = 0; i <restaurantList.length; i++){
        var newRestaurantDiv = $("<div>").addClass("col s4 center")
        var newRestaurantName = $("<h5>").text(restaurantList[i].restaurant.name);
        var newRestaurantType = $("<p>").text(restaurantList[i].restaurant.cuisines);
        var newRestaurantLink = $("<p>").html("<a target = '_blank' href ="+restaurantList[i].restaurant.url+"> Website </a>")
        newRestaurantDiv.append(newRestaurantName)
        .append(newRestaurantType)
        .append(newRestaurantLink);
        $("#restaurantGrid").append(newRestaurantDiv);

      }
    })
  })
})
