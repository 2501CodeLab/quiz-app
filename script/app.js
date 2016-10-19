// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function() {
  'use strict';


  var app = {
    isLoading: true,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.section--center'),
    addDialog: document.querySelector('.dialog-container'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    currentQuestion: {},
    questionsShown: [],
    questionsAvailable:[]
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  // document.getElementById('butRefresh').addEventListener('click', function() {
  //   // Refresh all of the forecasts
  //   app.updateForecasts();
  // });

  // document.getElementById('butAdd').addEventListener('click', function() {
  //   // Open/show the add new city dialog
  //   app.toggleAddDialog(true);
  // });

  // document.getElementById('butAddCity').addEventListener('click', function() {
  //   // Add the newly selected city
  //   var select = document.getElementById('selectCityToAdd');
  //   var selected = select.options[select.selectedIndex];
  //   var key = selected.value;
  //   var label = selected.textContent;
  //   // TODO init the app.selectedCities array here
  //   app.getForecast(key, label);
  //   // TODO push the selected city to the array and save here
  //   app.toggleAddDialog(false);
  // });

  // document.getElementById('butAddCancel').addEventListener('click', function() {
  //   // Close the add new city dialog
  //   app.toggleAddDialog(false);
  // });

  // $('.activeCard #card-feedback').click(function() {
  //   $('.activeCard #card-feedback').slideToggle();
    
  //   // $('#card-feedback').slideToggle('slow','swing');
  // });
  
  console.log('cf event listener loaded');
  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  app.showAnswerStatus = function (elAnswer) {
      
      
      
      console.log(app.correctAnswerNumber);
      console.log(elAnswer);
      //var elAnswer = document.getElementById(answerId);
      var icon = "thumb_up";
      var currentHeight = getComputedStyle(elAnswer).getPropertyValue("height");
      console.log(currentHeight);
      if ("a" + app.correctAnswerNumber == elAnswer.id) {
        
        // elAnswer.className += " correct";        
        // elAnswer.innerHTML += '<i class="material-icons">' + icon + '</i>';
        // elAnswer.animate(
        //   [{height: currentHeight},{height: '400px'}]
        //   , 100, function() {
        //   // Animation complete.
        // });
        $('.activeCard #card-feedback').slideToggle('fast','swing', function() {console.log('slid')});
        
      }
      else {
        
        elAnswer.classList.remove('mdl-button--accent');
        elAnswer.classList.add('incorrect');
        
        elAnswer.innerHTML += '<i class="material-icons">clear</i>';
        //icon = "thumb_down";
      }
   };



  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };


  app.isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  app.getFormattedIon = function(strIon) {
    var formattedIon = "";
    
    for (var i=0; i< strIon.length - 2; i++) {
      if (app.isNumeric(strIon[i])) {
        formattedIon += '<sub>' + strIon[i] + '</sub>';
      }
      else {
        formattedIon +=  strIon[i] ;
      }
     }
     
     console.log('<sup>' + strIon[i] + strIon[i+1] + '</sup>');
    
     formattedIon += '<sup>' + strIon[i] + strIon[i+1] + '</sup>';
   
    return formattedIon;
  }


  app.loadNextQuestion = function () {
    $(".activeCard").remove();
    app.setCurrentQuestion();
  }

     



  // Update the question card or clone new from template
  app.updateQuestionCard = function(data) {
    app.correctAnswerNumber = -1;
    var card = app.visibleCards[0];
    if (!card || true) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.classList.add('activeCard');
      card.querySelector('#question').textContent = "Identify the ion"; //data["Name"];
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[0] = card;
    }


    card.querySelector('.ion').innerHTML += 
           app.getFormattedIon (''+ data.Symbol + data.Strength + chargeSymbols[data.Charge]) ;
    
 
 
    //  get answer options and randomly display them   
    var answerOptions = [
      data.Name,
      data["Wrong Name 1"],
      data["Wrong Name 2"],
      data["Wrong Name 3"]
    ];
    
    
    // just for testing
    var emptyWrongAnswerOptions =  [
      "Ivysaur",
      "Fushigidane",
      "Hitokage",
      "Butterfree",
      "Onisuzume"
      ]
    
      answerOptions.forEach(function (element, index, array) {
          if (array[index] == "") {
                array[index] = emptyWrongAnswerOptions[Math.floor(Math.random()*emptyWrongAnswerOptions.length)];
          }
        
      });

    
    for (var i=1; i<5; i++) {
      var rand = Math.floor(Math.random()*answerOptions.length);
      var currentIndex = i;
      if (rand==0 && app.correctAnswerNumber<0) {
        app.correctAnswerNumber = i;
      }
      
      var answerText = answerOptions.splice(rand,1);
      var answerEl = card.querySelector('#a' + i);
      answerEl.textContent =
        answerText;

      answerEl.addEventListener('click', function() {
        app.showAnswerStatus(this);
      }, true);
      
      
      console.log("added event listener for answer " + 1)

    }
    
    $('.activeCard #card-feedback').click(function() {
      $('.activeCard #card-feedback').slideToggle();
    });
    
    
    $(".activeCard #nextIon").click(function() {
      app.loadNextQuestion();
    });
    
      
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };




  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * getForecast() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, getForecast() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */
  app.setCurrentQuestion = function () {
    var qIdx = Math.floor(Math.random()*app.questionsAvailable.length)
    console.log(qIdx);
    //console.log(app.questionsAvailable);
    var q = app.questionsAvailable.splice(qIdx,1)[0];
    app.currentQuestion = q;
    console.log(q);    
    app.updateQuestionCard(q);

  }
  
  
  
  app.getForecast = function(key, label) {
    var statement = 'select * from weather.forecast where woeid=' + key;
    var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
        statement;
    // TODO add cache logic here

    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      console.log (request.readyState);
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response.query.results;
          results.key = key;
          results.label = label;
          results.created = response.query.created;
          //app.updateForecastCard(results);
          app.updateQuestionCard(initialQuestion);
        }
      } else {
        // Return the initial weather forecast since no data is available.
        //app.updateForecastCard(initialWeatherForecast);
        app.updateQuestionCard(initialQuestion);
      }
    };
    request.open('GET', url);
    request.send();
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateForecasts = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getForecast(key);
    });
  };

  // TODO uncomment line below to test app with fake data
  //app.updateForecastCard(initialWeatherForecast);

  // TODO add startup code here
  
  // load game questions into the app
  
  app.questionsAvailable = questions.slice(0);
  
  app.setCurrentQuestion();
  

  
  // TODO add service worker code here
})();



$(function() {      
      //Enable swiping...
      $(".answer").swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          $(this).text("You swiped " + direction );  
          $(this).animate({
              'left': '-150%'
          }, 100, "swing" );
          //$(this).hide();
          
          
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:0
      });
    });
  
