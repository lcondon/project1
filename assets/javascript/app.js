
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
var startDate;
var endDate;

$("#searchBar").on("click", function (event) {
  event.preventDefault();
  city = $("#cityInput").val().trim();
  console.log(city);
  zip = $("#form-zip").val().trim();
  console.log(zip);
  state = $("#form-state").val().trim();
  console.log(state);
  startDate = $("#startDate").val();
  console.log(startDate);
  endDate = $("#endDate").val();
  console.log(endDate);

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

  var trailUrl = "https://trailapi-trailapi.p.mashape.com/?limit=12&q[city_cont]=" + city + "&q[state_cont]=" + state;

  $.ajax({
    url: trailUrl,
    method: 'GET',
    headers: {
      "X-Mashape-Key": "9P0eBNZEeGmshd3pS2BerOChm5t5p1BXzT8jsnj1QooihhfQhl",
      "Accept": "text/plain"
    }
  }).then(function (result) {
    console.log(result);
    console.log(result.places);
    var trailsList = result.places;
  for (var i = 0; i < trailsList.length; i++){
    var activities = [];
    var arr = result.places[i].activities;
    console.log(arr);
    $.each(arr, function( index, value ) {
      activities.push(result.places[i].activities[index].activity_type_name);
    });
    activities.join(", ");
    console.log(activities);
    var newTrailsDiv = $("<div>").addClass("col m4 center");
    var newBackgroundDiv = $("<div>").addClass("trailsBackground");
    var newTrailsName = $("<h5>").text(trailsList[i].name);
    var newTrailsActivities = $("<p>").text(activities);
    var newTrailsDescription = $("<p>").text(trailsList[i].activities[0].description);
    var newTrailsLink = $("<p>").html("<a target = '_blank' href =''> Get Directions </a>");
    newBackgroundDiv.append(newTrailsName)
    .append(newTrailsActivities)
    .append(newTrailsDescription)
    .append(newTrailsLink);
    newTrailsDiv.append(newBackgroundDiv);
    $("#trailsGrid").append(newTrailsDiv);

  }
  
  $.ajax({
    url: unsplashUrl,
    method: 'GET',
  }).then(function (result) {
    var url2 = result.results[1].urls.raw;
    eventMultiple.update("url('" + url2 + "')");
  })
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

var tixUrl = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=1GDdZL6noFYxnKbqNYTgjdxLIKzBPFLG&size=12&startDateTime=" + startDate + "T00:00:00Z&endDateTime=" + endDate + "T23:59:00Z&city=" + city;

$.ajax({
  type:"GET",
  url: 'https://cors-anywhere.herokuapp.com/' + tixUrl,
  async:true,
  dataType: "json"
}).then(function(result) {
  console.log(result);
  console.log(result._embedded.events);
  var eventList = result._embedded.events;
  for (var i = 0; i < eventList.length; i++){
    var newEventDiv = $("<div>").addClass("col m4 center");
    var newBackgroundDiv = $("<div>").addClass("eventBackground");
    var newEventName = $("<h5>").text(eventList[i].name);
    var newEventVenue = $("<p>").text(eventList[i]._embedded.venues[0].name);
    var newEventDate = $("<p>").text(eventList[i].dates.start.localDate);
    var newEventLink = $("<p>").html("<a target = '_blank' href ="+eventList[i].url+"> More Info Here </a>");
    newBackgroundDiv.append(newEventName)
    .append(newEventVenue)
    .append(newEventDate)
    .append(newEventLink);
    newEventDiv.append(newBackgroundDiv);
    $("#eventGrid").append(newEventDiv);

  }

  $.ajax({
    url: unsplashUrl,
    method: 'GET',
  }).then(function (result) {
    var url2 = result.results[1].urls.raw;
    eventMultiple.update("url('" + url2 + "')");
  })

});

var unsplashUrl = "https://api.unsplash.com/search/photos?client_id=7e1468f8407999fec4a3b0c0f43ef7924b8963590f6d7929f2e3dd9a8c6cf0c4&page=1&query=richmond+virginia&orientation=landscape";

$.ajax({
  url: unsplashUrl,
  method: 'GET',
}).then(function (result) {
  console.log(result.results[0].urls.raw);
  var url1 = result.results[0].urls.raw;
  var url2 = result.results[1].urls.raw;
  menuMultiple.update("url('" + url1 + "')");
  eventMultiple.update("url('" + url2 + "')");
})


})

var menuMultiple = new Multiple({
  selector: '.menuBackground',
  background: 'linear-gradient(#273463, #8B4256)'
});

var eventMultiple = new Multiple({
  selector: '.eventBackground',
  background: 'linear-gradient(#273463, #8B4256)'
});




