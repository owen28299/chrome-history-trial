'use strict';

//sends history to backend on installation
chrome.runtime.onInstalled.addListener(function(data){
  if(data.reason === "install"){
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
  }
});

//get information before navigation
chrome.webNavigation.onBeforeNavigate.addListener(function(data) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    console.log("URL", tabs);
  });
});

//sends activity data.
chrome.webNavigation.onCommitted.addListener(function(data) {

  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:3000/activity",
    dataType: 'json',
    data: {
      committedData: data
    },
    success: function(data) {

    }
  });

});