let header = document.getElementsByClassName("_BannerSpacing_u9l2x_29");
let calculatorIcon = document.getElementsByClassName("_CalculatorInfoContainer_5oh8x_10");

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

async function whiteboard() {
    while (true) {
        if (calculatorIcon.length > 0) {
            calculatorIcon[0].innerHTML = `<button onclick="console.log('lilBro')">test</button>`
            return(0)
        }
        await wait(5)
    }
}


whiteboard()
independent()

window.navigation.addEventListener("navigate", (event) => {
    independent();
    console.log("change");
})

