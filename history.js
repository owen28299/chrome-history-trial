'use strict';

var myHistory = document.getElementById('topmatch');

myHistory.innerHTML = "This will be your top match";

myHistory.addEventListener("click", function(event){
  console.log(event.target.href);
  chrome.tabs.create({url : event.target.href});
});

var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 30;
var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

var urls = {};

chrome.history.search({
  'text' : "",
  'startTime' : oneWeekAgo,
  'maxResults' : 100000
}, function(historyItems){

  historyItems.forEach(function(historyItem){
    var histUrl = historyItem.url.toLowerCase();

    if(histUrl.indexOf("google") === -1){
      urls[histUrl] = historyItem;

      chrome.history.getVisits({url : historyItem.url}, function(itemInfo){
        urls[histUrl].info = itemInfo;
      });
    }

  });

  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:3000/data",
    dataType: 'json',
    data: {
      urls : JSON.stringify(urls)
    },
    success: function(data) {
      console.log(data);
    }
  });

});


function getUrl(callback){
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs[0].url, tabs[0].title);
  });

}

getUrl(function(url, title){
  document.getElementById('query').innerHTML = title;
  var terms = title.toLowerCase().split(" ");
  terms = terms.slice(0, terms.length - 3).join(" ");

  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/data/" + terms,
    success: function(data) {
      myHistory.innerHTML = data.best;
      myHistory.href = data.best;
    }
  });



});

