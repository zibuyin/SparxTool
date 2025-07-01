// async function fetchCss() {
//     var darkmodeEnabled = (readLargeNumber(key) % 2) == 1;
//     if (darkmodeEnabled && !document.getElementById("darkmodeCss")) {
//         document.getElementsByTagName("head")[0].innerHTML += `
//         <style id="darkmodeCss">
//         ${await fetch('https://raw.githubusercontent.com/zibuyin/SparxTool/refs/heads/main/css/sparxMathDark.css')
//             .then(
//                 t => t.text()
//             )
//         }
//         </style>`;
//     }
//     else if (!darkmodeEnabled && document.getElementById("darkmodeCss")) {
//         document.getElementById("darkmodeCss").remove()
//     }
// }
// fetchCss()