let header = document.getElementsByClassName("_BannerSpacing_u9l2x_29");
let calculatorIcon = document.getElementsByClassName("_CalculatorInfoContainer_5oh8x_10");
let whiteboardElement = document.getElementsByClassName("whiteboard")

let whiteboardOpen = false;

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function independent() {
    while (true) {
        if (document.getElementsByClassName("_ILBanner_u9l2x_53").length == 0 && header.length > 0) {
            header[0].innerHTML = '<span class="_ILBanner_u9l2x_53">Independent Learning</span>';
            header[0].style.justifyContent = "start";
            return(0);
        }
        else if (document.getElementsByClassName("_ILBanner_u9l2x_53").length == 2) {
            header[0].innerHTML = '<span></span>';
            return(0);
        }
        await wait(5)
        if (document.getElementsByClassName("_ILBanner_u9l2x_53").length == 1 && header.length > 0) {
            return(0);
        }
    }
}

function openWhiteboard() {
    // console.log('working')
}

async function whiteboard() {
    while (true) {
        console.log("whiteboard")
        if (calculatorIcon.length > 0 && calculatorIcon[0].getElementsByTagName("button").length == 0) {
            calculatorIcon[0].innerHTML += `<button> &nbsp; &nbsp; <button class="_Chip_bu06u_1 _Selected_bu06u_13 _Boxy_bu06u_75 _Filled_bu06u_8 _md_bu06u_84">
            whiteboard
            </button>`
            calculatorIcon[0].addEventListener("click", function() {
                if (whiteboardOpen) {

                }
                else {
                    document.body.innerHTML += '<div class="whiteboard"></div>'
                    whiteboardElement[0].style.backgroundColor = "#ccc5"
                    whiteboardElement[0].style.width = "100vw"
                    whiteboardElement[0].style.height = "100vh"
                    whiteboardElement[0].style.position = "fixed"
                    whiteboardElement[0].style.top = 0
                    whiteboardElement[0].style.left = 0
                    whiteboardElement[0].style.backdropFilter = "blur(6px)"
                }
                whiteboardOpen = !whiteboardOpen;
            });
            return(0)
        }
        await wait(5)
        // console.log("waiting")
    }
}

independent();
whiteboard();

window.navigation.addEventListener("navigate", (event) => {
    independent();
    whiteboard(whiteboardOpen = false);
})

