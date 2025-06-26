let header = document.getElementsByClassName("_BannerSpacing_u9l2x_29");
let number = false;

async function independent() {
    number = (readLargeNumber("h7i") % 4) > 1;
    console.log(number)
    while (true) {
        if ((number && document.getElementsByClassName("_ILBanner_u9l2x_53").length == 0) && header.length > 0) {
            header[0].innerHTML = '<span class="_ILBanner_u9l2x_53">Independent Learning</span>';
            header[0].style.justifyContent = "start";
            return(0);
        }
        else if ((!number) || document.getElementsByClassName("_ILBanner_u9l2x_53").length > 1) {
            header[0].innerHTML = '<span></span>';
            return(0);
        }
        await wait(5)
        if (document.getElementsByClassName("_ILBanner_u9l2x_53").length == 1 && header.length > 0) {
            return(0);
        }
    }
}

independent();

window.navigation.addEventListener("navigate", (event) => {
    independent();
})