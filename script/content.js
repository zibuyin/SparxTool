let header = document.getElementsByClassName("_BannerSpacing_u9l2x_29");
let calculatorIcon = document.getElementsByClassName("_CalculatorInfoContainer_5oh8x_10");
let whiteboardElement = document.getElementsByTagName("div")

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
        if (calculatorIcon.length > 0 && calculatorIcon[0].getElementsByTagName("button").length == 0) {
            calculatorIcon[0].innerHTML += `&nbsp; &nbsp; <button class="_Chip_bu06u_1 _Selected_bu06u_13 _Boxy_bu06u_75 _Filled_bu06u_8 _md_bu06u_84">
            whiteboard
            </button>`
            calculatorIcon[0].getElementsByTagName("button")[0].addEventListener("click", function() {
                if (!whiteboardOpen) {
                    // document.body.innerHTML += '<div class="whiteboard"></div>'
                    whiteboardElement[whiteboardElement.length - 1].style.backgroundColor = "#ccc5"
                    whiteboardElement[whiteboardElement.length - 1].style.width = "100vw"
                    whiteboardElement[whiteboardElement.length - 1].style.height = "100vh"
                    whiteboardElement[whiteboardElement.length - 1].style.position = "fixed"
                    whiteboardElement[whiteboardElement.length - 1].style.top = 0
                    whiteboardElement[whiteboardElement.length - 1].style.left = 0
                    whiteboardElement[whiteboardElement.length - 1].style.backdropFilter = "blur(6px)"
                    whiteboardElement[whiteboardElement.length - 1].style.display = "inherit"
                    whiteboardOpen = true;
                    whiteboardElement[whiteboardElement.length - 1].addEventListener("click", function() {
                        whiteboardElement[whiteboardElement.length - 1].style.display = "none";
                        whiteboardOpen = false;
                        whiteboardElement[whiteboardElement.length - 1].removeEventListener("click", null);
                    });
                }
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
    console.log('change')
    independent();
    whiteboard();
})

document.getElementsByTagName("div").array.forEach(element => {
    element.addEventListener("clicked", function() {
        console.log("clicked")
    })
});