let calculatorIcon = document.getElementsByClassName("_CalculatorInfoContainer_5oh8x_10");
let whiteboardElement = document.getElementsByClassName("spx-status-embed");

let whiteboardElementBlur = whiteboardElement[0]

function openWhiteboard() {
    whiteboardElementBlur.id = "open";
    whiteboardElementBlur.style.height = "100vh";
    whiteboardElementBlur.style.position = "fixed";
    whiteboardElementBlur.style.top = 0;
    whiteboardElementBlur.style.left = 0;
    whiteboardElementBlur.style.display = "flex";
    if (whiteboardElementBlur.getElementsByClassName("whiteboard").length == 0) {
        whiteboardElementBlur.innerHTML += `
        <div class="whiteboard">hello</div>`;
    }
    whiteboardElementBlur.getElementsByClassName("whiteboard")[0].style.width = "80vw";
    whiteboardElementBlur.getElementsByClassName("whiteboard")[0].style.height = "70vh";
    whiteboardElementBlur.getElementsByClassName("whiteboard")[0].style.backgroundColor = "#f00";
}

async function closeWhiteboard() {
    whiteboardElementBlur.id = "closed";
    whiteboardElementBlur.removeEventListener("click", null);
    await wait(200);
    whiteboardElementBlur.style.display = "none";
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
            while (whiteboardElement.length == 0) {
                await wait(3);
            }
            closeWhiteboard();
        }
        await wait(5);
    }
}

whiteboard();