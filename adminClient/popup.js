window.onload = function() {
  chrome.tabs.executeScript({
    file: 'getID.js'
  }, function(res) {
    // alert(res)
    // console.log(res)
  })
}