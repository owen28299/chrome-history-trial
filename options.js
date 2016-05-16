'use strict';

var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 30;
var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

var urls = {};

document.getElementById('sendhistory').addEventListener("click", function(){
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

  console.log(urls);

});