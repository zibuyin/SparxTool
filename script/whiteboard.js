let calculatorIcon = document.getElementsByClassName("_CalculatorInfoContainer_5oh8x_10");
let whiteboardElement = document.getElementsByClassName("spx-status-embed");

let whiteboardElementBlur = whiteboardElement[0]

function openWhiteboard() {
    whiteboardElementBlur.id = "open";
    whiteboardElementBlur.style.height = "100vh";
    whiteboardElementBlur.style.display = "flex";
}

async function closeWhiteboard() {
    whiteboardElementBlur.id = "closed";
    whiteboardElementBlur.removeEventListener("click", null);
    await wait(180);
    whiteboardElementBlur.style.display = "none";
}

async function whiteboard() {
    while (true) {
        if (calculatorIcon.length > 0 && calculatorIcon[0].getElementsByTagName("button").length == 0) {
            calculatorIcon[0].innerHTML += `&nbsp; &nbsp; <button class="_Chip_bu06u_1 _Selected_bu06u_13 _Boxy_bu06u_75 _Filled_bu06u_8 _md_bu06u_84" id="whiteboardButton">
            whiteboard
            </button>`;
            while (!whiteboardElementBlur) {
                await wait(5);
            }
            closeWhiteboard();
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
            while (whiteboardElement.length == 0) {
                await wait(3);
            }
            closeWhiteboard();
        }
        await wait(5);
    }
}

whiteboard();