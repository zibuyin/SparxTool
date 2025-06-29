async function fetchCss() {
    var darkmodeEnabled = (await readLargeNumber(key) % 2) == 1;
    if (darkmodeEnabled) {
        document.getElementsByTagName("head")[0].innerHTML += `
        <style id="darkmodeCss">
        ${await fetch('https://raw.githubusercontent.com/zibuyin/SparxTool/refs/heads/main/css/sparxMathDark.css')
            .then(
                t => t.text()
            )
        }
        </style>`;
        return(0)
    }
    if (document.getElementById("darkmodeCss")) {
        document.getElementById("darkmodeCss").remove()
    }
}
fetchCss()