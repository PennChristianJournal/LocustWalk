chrome.browserAction.onClicked.addListener(function(tab) {
  // console.log(tab)
  return chrome.tabs.executeScript(tab.id, {
    file: 'toggleSidebar.js'
  })

  chrome.tabs.executeScript(tab.id, {
    file: 'getID.js'
  }, function(res) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
    if (res) {
      chrome.tabs.create({
        url: 'localhost:3000/admin/articles/' + res + '/edit'
      })
      /*

      chrome.tabs.create({url: "publish_settings.html"}, function(tab) {
        var handler = function(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === "complete"){
            chrome.tabs.onUpdated.removeListener(handler);
            chrome.tabs.sendMessage(tab.id, {id: res});
          }
        }

        // in case we're faster than page load (usually):
        chrome.tabs.onUpdated.addListener(handler);

        // just in case we're too late with the listener:
        chrome.tabs.sendMessage(tab.id, {id: res});
      })


      // check if exists on server. If it does, pull existing information

      // if not, present fields

      */
    }
  })
})