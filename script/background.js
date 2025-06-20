// async function wait(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    console.log(tabId, changeInfo, tab);
  });