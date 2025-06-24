let calculatorIcon = document.getElementsByClassName("_CalculatorInfoContainer_5oh8x_10");
let whiteboardElement = document.getElementsByClassName("spx-status-embed");

let whiteboardElementBlur = whiteboardElement[0]

function openWhiteboard() {
    whiteboardElementBlur.style.width = "100vw";
    whiteboardElementBlur.style.height = "100vh";
    whiteboardElementBlur.style.position = "fixed";
    whiteboardElementBlur.style.top = 0;
    whiteboardElementBlur.style.left = 0;
    whiteboardElementBlur.style.display = "block";
    whiteboardElementBlur.innerHTML += '<div id="whiteboard"></div>'
    document.getElementById("whiteboard").style.width = "80vw";
    document.getElementById("whiteboard").style.height = "70vh";
    document.getElementById("whiteboard").style.backgroundColor = "#f00";
    whiteboardOpen = true;
}

function closeWhiteboard() {
    whiteboardElementBlur.style.display = "none";
    whiteboardOpen = false;
    whiteboardElementBlur.removeEventListener("click", null);
}

async function whiteboard() {
    while (true) {
        if (calculatorIcon.length > 0 && calculatorIcon[0].getElementsByTagName("button").length == 0) {
            calculatorIcon[0].innerHTML += `&nbsp; &nbsp; <button class="_Chip_bu06u_1 _Selected_bu06u_13 _Boxy_bu06u_75 _Filled_bu06u_8 _md_bu06u_84">
            whiteboard
            </button>`;
            calculatorIcon[0].getElementsByTagName("button")[0].addEventListener("click", function() {
                if (whiteboardElementBlur) {
                    if (whiteboardElement.length > 0) {
                        openWhiteboard();
                        whiteboardElementBlur.addEventListener("click", function() {
                            closeWhiteboard();
                        });
                    }
                }
            });
        }
        await wait(5);
    }
}

whiteboard();