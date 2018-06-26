//Loaded for firebase
var config = {
  apiKey: "AIzaSyCJOeyyKx9WQpm8jXRB7ICSO5yIvx3Xop0",
  authDomain: "totaltravel-ae741.firebaseapp.com",
  databaseURL: "https://totaltravel-ae741.firebaseio.com",
  projectId: "totaltravel-ae741",
  storageBucket: "totaltravel-ae741.appspot.com",
  messagingSenderId: "404756837934"
};
//Initializes firebase
firebase.initializeApp(config);

//Loaded for parallax design 
(function ($) {
  $(function () {
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $('.fixed-action-btn').floatingActionButton();
  });
})(jQuery);
$(document).ready(function () {
  $('.parallax').parallax();
});

$(window).on('beforeunload', function () {
  $(window).scrollTop(0);
});

$("#colorToggle").on("click", function(){
   var grids = $(".grids");
   grids.toggleClass("textDif");
})

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
var isValid;
var database = firebase.database();

//Makes a button from the firebase database
database.ref().orderByChild('dateAdded').limitToLast(4).on("child_added", function(childSnapshot, prevChildKey){
  event.preventDefault();
  var cityButton = $("<button>").text(childSnapshot.val().city+", "+childSnapshot.val().state);
  var newCity = childSnapshot.val().city
  cityButton.addClass("btn waves-effect waves-light")
  .addClass("newCityBtn")
  .attr("cityName", newCity);
  $("#recentButtons").append(cityButton);
  })

  //When a recent city button is clicked, form automatically populates
  $(document).on("click", ".newCityBtn",function(){
    var buttonCity = $(this).attr("cityName");
    database.ref(buttonCity).once('value').then(function(snapshot){
      var newZip = (snapshot.val().zip);
      var newCity = (snapshot.val().city);
      var newState = (snapshot.val().state);
      $("#cityInput").val(newCity);
      $("#form-zip").val(newZip);
      $("#form-state").val(newState);
    })
    }) 

//When this function is called, the user will be directed to the navigation grid
function movetoGrid(){
  $('html,body').animate({
  scrollTop: $("#navigationGrid").offset().top},
  'slow');}

//Requires that users input dates for event grid can be populated 
function validateForm() {
  isValid = true;
  $('.dateInput').each(function () {
    if ($(this).val() === '')
      isValid = false;
  });
  return isValid;
}

$("#searchBar").on("click", function (event) {
  validateForm();
  if (!isValid) {
    // $('.modal').modal('open');
  } else {
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
    var unsplashUrl = "https://api.unsplash.com/search/photos?client_id=7e1468f8407999fec4a3b0c0f43ef7924b8963590f6d7929f2e3dd9a8c6cf0c4&page=1&query=" + city + "+" + state + "&orientation=landscape";

//When submit button is clicked, push the data to firebase
database.ref(city).set({
  city: city,
  zip: zip,
  state: state,
  dateAdded: firebase.database.ServerValue.TIMESTAMP
})

//Once the button is clicked, users are directed to navigation grid
setTimeout(movetoGrid, 1500)

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
      zomatoKey = response.location_suggestions[0].id;
      //Find the restaurants using Zomato
      var zomatoRestaurantQuery = "https://developers.zomato.com/api/v2.1/search?entity_id=" + zomatoKey + "&entity_type=city&start=0&count=12"
      $.ajax({
        url: zomatoRestaurantQuery,
        method: "GET",
        headers: {
          Accept: "application/json",
          "user-key": "0d9d7319d7127204add1f39cf9d0bd39"
        }
      }).then(function (response) {
        //Create restaurant grid
        var restaurantList = response.restaurants;
        for (var i = 0; i < restaurantList.length; i++) {
          var newRestaurantDiv = $("<div>").addClass("col l4 m4 s12 center");
          var newBackgroundDiv = $("<div>").addClass("restaurantBackground");
          var newRestaurantName = $("<h5>").text(restaurantList[i].restaurant.name);
          var newRestaurantType = $("<p>").text(restaurantList[i].restaurant.cuisines);
          var newRestaurantLink = $("<p>").html("<a target = '_blank' href =" + restaurantList[i].restaurant.url + "> Website </a>")
          newBackgroundDiv.append(newRestaurantName)
            .append(newRestaurantType)
            .append(newRestaurantLink);
          newRestaurantDiv.append(newBackgroundDiv);
          $("#restaurantGrid").append(newRestaurantDiv)
        };
        $.ajax({
          url: unsplashUrl,
          method: 'GET',
        }).then(function (result) {
          var url4 = result.results[3].urls.raw;
          restaurantMultiple.update("url('" + url4 + "')");
        })

      })
      //To create the landmark grid
      var foursquareQuery = "https://api.foursquare.com/v2/venues/search?near=" + city + "," + state + "&limit=12&categoryId=4d4b7104d754a06370d81259&client_id=MQF1VPVFWQ2GDP11OKAHEQCQ2JIURK0CZLZA4ER1ECJCWOMH&client_secret=P5SY4OSJDG2KHKNWXGTN0BTLW2IGYW5QN2LWPEM0DWTFC151&v=20180323"
      $.ajax({
        url: foursquareQuery,
        method: "GET",
      }).then(function (answer) {
        var attractionList = answer.response.venues;
        
        for (var i = 0; i < 12; i++) {
          newAttractionDiv = $("<div>").addClass("col l4 m4 s12 center");
          var newBackgroundDiv = $("<div>").addClass("attractionBackground");
          newAttractionName = $("<h6>").text(attractionList[i].name);
          newAttractionType = $("<p>").text(attractionList[i].categories[0].name);
          newAttractionAddress = $("<p>").text(attractionList[i].location.address);
          newBackgroundDiv.append(newAttractionName)
            .append(newAttractionType)
            .append(newAttractionAddress);
          newAttractionDiv.append(newBackgroundDiv);
          $("#attractionGrid").append(newAttractionDiv);
        }
        $.ajax({
          url: unsplashUrl,
          method: "GET",
        }).then(function (result) {
          var url3 = result.results[2].urls.raw;
          attractionMultiple.update("url('" + url3 + "')");
        })
      })

      //To load the shopping grid
      var shoppingQuery = "https://api.foursquare.com/v2/venues/search?near=" + city + "," + state + "&limit=12&categoryId=50be8ee891d4fa8dcc7199a7,4bf58dd8d48988d1fd941735,52f2ab2ebcbc57f1066b8b1b,5744ccdfe4b0c0459246b4dc,5744ccdfe4b0c0459246b4df&client_id=MQF1VPVFWQ2GDP11OKAHEQCQ2JIURK0CZLZA4ER1ECJCWOMH&client_secret=P5SY4OSJDG2KHKNWXGTN0BTLW2IGYW5QN2LWPEM0DWTFC151&v=20180323"
      $.ajax({
        url: shoppingQuery,
        method: 'GET'
      }).then(function (result) {
        
        for (var i = 0; i < 12; i++) {
          newShoppingDiv = $("<div>").addClass("col l4 m4 s12 center");
          var newBackgroundDiv = $("<div>").addClass("shoppingBackground");
          newShopName = $("<h6>").text(result.response.venues[i].name);
          newShopType = $("<p>").text(result.response.venues[i].categories[0].name);
          newShopAddress = $("<p>").text(result.response.venues[i].location.address);
          newBackgroundDiv.append(newShopName)
            .append(newShopType)
            .append(newShopAddress);
          newShoppingDiv.append(newBackgroundDiv);
          $("#shoppingGrid").append(newShoppingDiv);
        };
        $.ajax({
          url: unsplashUrl,
          method: "GET",
        }).then(function (result) {
          var url6 = result.results[6].urls.raw;
          shoppingMultiple.update("url('" + url6 + "')");
        })
      });

      //To load weather in the navigation grid 
      var weatherQuery = "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&APPID=4cb9b0cab7bf5af48f472887e700bf76"
      $.ajax({
        url: weatherQuery,
        method: 'GET'
      }).then(function (result) {
        var weatherDescription = result.weather[0].description;
        var tempInKelvin = result.main.temp;
        var tempInFahrenheight = (Math.round((tempInKelvin - 273.15) * 1.8) + 32);
        var tempP = $("<p>").text(weatherDescription);
        var tempP2 = $("<p>").text(tempInFahrenheight + "°F");
        $("#weatherDiv").append(tempP)
          .append(tempP2)
      });

    })

    //To create the outdoor exploration section 
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
      for (var i = 0; i < trailsList.length; i++) {
        var activities = [];
        var arr = result.places[i].activities;
        $.each(arr, function (index, value) {
          activities.push(result.places[i].activities[index].activity_type_name);
        });
        activities.join(" + ");
        var newTrailsDiv = $("<div>").addClass("col l4 m4 s12 center");
        var newBackgroundDiv = $("<div>").addClass("trailsBackground");
        var newTrailsName = $("<h5>").text(trailsList[i].name);
        var newTrailsActivities = $("<p>").text(activities);
        var newTrailsDescription = $("<p>").html("description");
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
      }).then(function (trailsResults) {
        var url5 = trailsResults.results[4].urls.raw;
        console.log(trailsResults.results[4].urls.raw);
        trailsMultiple.update("url('" + url5 + "')");
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

    //To create events Div 
    var tixUrl = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=1GDdZL6noFYxnKbqNYTgjdxLIKzBPFLG&size=12&startDateTime=" + startDate + "T00:00:00Z&endDateTime=" + endDate + "T23:59:00Z&city=" + city;
    $.ajax({
      type: "GET",
      url: 'https://cors-anywhere.herokuapp.com/' + tixUrl,
      async: true,
      dataType: "json"
    }).then(function (result) {
      console.log(result);
      console.log(result._embedded.events);
      var eventList = result._embedded.events;

      var calculatedEventList = ((Math.floor((eventList.length)/3))*3)-1
      for (var i = 0; i < calculatedEventList; i++) {
        var newEventDiv = $("<div>").addClass("col l4 m4 s12 center");
        var newBackgroundDiv = $("<div>").addClass("eventBackground");
        var newEventName = $("<h5>").text(eventList[i].name);
        var newEventVenue = $("<p>").text(eventList[i]._embedded.venues["0"].name);
        var newEventDate = $("<p>").text(eventList[i].dates.start.localDate);
        var newEventLink = $("<p>").html("<a target = '_blank' href =" + eventList[i].url + "> More Info Here </a>");
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

    $.ajax({
      url: unsplashUrl,
      method: 'GET',
    }).then(function (result) {
      console.log(result.results[0].urls.raw);
      var url1 = result.results[0].urls.raw;
      menuMultiple.update("url('" + url1 + "')");
    })
  }
})

var menuMultiple = new Multiple({
  selector: '.menuBackground',
  background: 'linear-gradient(#273463, #8B4256)'
});

var eventMultiple = new Multiple({
  selector: '.eventBackground',
  background: 'linear-gradient(#273463, #8B4256)'
});

var attractionMultiple = new Multiple({
  selector: '.attractionBackground',
  background: 'linear-gradient(#273463, #8B4256)'
});

var trailsMultiple = new Multiple({
  selector: '.trailsBackground',
  background: 'linear-gradient(#273463, #8B4256)'
});

var restaurantMultiple = new Multiple({
  selector: '.restaurantBackground',
  background: 'linear-gradient(#273463, #8B4256)'
});

var shoppingMultiple = new Multiple({
  selector: '.shoppingBackground',
  background: 'linear-gradient(#273463, #8B4256)'
});






