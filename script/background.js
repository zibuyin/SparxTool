// async function wait(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    console.log(tabId, changeInfo, tab);
});

// chrome.action.onClicked.addListener((tab) => {
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ['content.js']
//     });
// });