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
            calculatorIcon[0].innerHTML = `<button onclick="console.log('lilBro')">
            <img class="_CalculatorIcon_5oh8x_23" 
            src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2029'%3e%3cdefs%3e%3cstyle%3e.a{fill:%23fffffe;}.b{fill:%231791ce;}.c{fill:none;stroke:%231791ce;stroke-miterlimit:10;stroke-width:1.57px;}.d{fill:%237eb700;}%3c/style%3e%3c/defs%3e%3ctitle%3ecalculator_allowed_mobile%3c/title%3e%3crect%20class='a'%20x='2.06'%20y='1.5'%20width='21.2'%20height='25.92'%20rx='3.29'%20ry='3.29'/%3e%3cpath%20class='b'%20d='M20,2.29A2.51,2.51,0,0,1,22.48,4.8V24.12A2.51,2.51,0,0,1,20,26.63H5.36a2.51,2.51,0,0,1-2.51-2.51V4.8A2.51,2.51,0,0,1,5.36,2.29H20M20,.72H5.36A4.08,4.08,0,0,0,1.28,4.8V24.12a4.09,4.09,0,0,0,4.08,4.09H20a4.09,4.09,0,0,0,4.08-4.09V4.8A4.08,4.08,0,0,0,20,.72Z'/%3e%3crect%20class='c'%20x='5.99'%20y='5.43'%20width='13.35'%20height='4.71'%20rx='0.62'%20ry='0.62'/%3e%3crect%20class='b'%20x='5.65'%20y='14.39'%20width='3.58'%20height='1.72'/%3e%3crect%20class='b'%20x='10.88'%20y='14.39'%20width='3.58'%20height='1.72'/%3e%3crect%20class='b'%20x='16.1'%20y='14.39'%20width='3.58'%20height='1.72'/%3e%3crect%20class='b'%20x='5.65'%20y='18.31'%20width='3.58'%20height='1.72'/%3e%3crect%20class='b'%20x='10.88'%20y='18.31'%20width='3.58'%20height='1.72'/%3e%3crect%20class='b'%20x='16.1'%20y='18.31'%20width='3.58'%20height='1.72'/%3e%3crect%20class='b'%20x='5.65'%20y='22.24'%20width='3.58'%20height='1.72'/%3e%3crect%20class='b'%20x='10.88'%20y='22.24'%20width='3.58'%20height='1.72'/%3e%3crect%20class='b'%20x='16.1'%20y='22.24'%20width='3.58'%20height='1.72'/%3e%3cpath%20class='d'%20d='M17.44,24.41a2.11,2.11,0,0,1-1.61-.86l-4.74-6.32a2.08,2.08,0,0,1-.41-1.58,2.14,2.14,0,0,1,3.82-1l3.19,4.25,8.73-9.63a2.13,2.13,0,0,1,3-.14,2.12,2.12,0,0,1,.7,1.47,2.09,2.09,0,0,1-.56,1.54L19.12,23.71a2.15,2.15,0,0,1-1.58.7Z'/%3e%3cpath%20class='a'%20d='M28,9.09a1.59,1.59,0,0,1,1.1.43,1.63,1.63,0,0,1,.11,2.31L18.75,23.37a1.64,1.64,0,0,1-1.21.54h-.08a1.62,1.62,0,0,1-1.23-.66l-4.74-6.32a1.63,1.63,0,0,1,2.61-2l3.56,4.73L26.79,9.63A1.62,1.62,0,0,1,28,9.09m0-1h0A2.65,2.65,0,0,0,26.05,9l-8.32,9.17L14.9,14.37a2.65,2.65,0,0,0-3.69-.53,2.6,2.6,0,0,0-1,1.74,2.57,2.57,0,0,0,.5,2l4.74,6.32a2.62,2.62,0,0,0,2,1.06h.13A2.65,2.65,0,0,0,19.49,24L30,12.5a2.64,2.64,0,0,0-.19-3.73A2.61,2.61,0,0,0,28,8.09Z'/%3e%3c/svg%3e">
            </button>`
            return(0)
        }
        await wait(5)
    }
}



independent();
whiteboard();

window.navigation.addEventListener("navigate", (event) => {
    independent();
    whiteboard();
    console.log("change");
})

