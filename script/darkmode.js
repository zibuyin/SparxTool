const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css'
link.href = chrome.runtime.getURL('./script/sparxMathDark.css');

async function darkModeF() {
    document.getElementsByTagName("head")[0].appendChild(link)

}

darkModeF();

window.navigation.addEventListener("navigate", darkmodeF());