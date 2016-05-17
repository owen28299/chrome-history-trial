'use strict';

var myHistory = document.getElementById('topmatch');

myHistory.innerHTML = "This will be your top match";

myHistory.addEventListener("click", function(event){
  console.log(event.target.href);
  chrome.tabs.create({url : event.target.href});
});


function getUrl(callback){
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    console.log(tabs[0]);
    console.log(tabs[0].url);
    console.log(tabs[0].title);
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

