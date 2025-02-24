chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");
    chrome.action.setBadgeText({
      text: "OFF",
    });
  });