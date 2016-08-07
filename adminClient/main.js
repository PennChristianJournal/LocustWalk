// var s = document.createElement('script');
// s.src = chrome.extension.getURL('inject.js');
// s.onload = function() {
//     this.parentNode.removeChild(this);
// };
// (document.head||document.documentElement).appendChild(s);

// chrome.browserAction.onClicked.addListener(function(tab) {
//   console.log(tab)
// })

// console.log('hi')

(function() {
  var xmlHttp = null;

  xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", chrome.extension.getURL ("/panel.html"), false )
  xmlHttp.send( null )

  var panel = document.createElement("div")
  panel.id = 'LW-admin-panel'
  panel.innerHTML = xmlHttp.responseText
  document.body.insertBefore(panel, document.body.firstChild)

  selectedEl = document.querySelector('[aria-selected="true"]')

  setInterval(function() {
    el = document.querySelector('[aria-selected="true"]')
    if (selectedEl != el) {
      selectedEl = el
      console.log(selectedEl)
    }
  }, 300)

  document.body.classList.add('LW-admin-open')
})()