async function deleteBanner() {
    while (true)  {
        if (document.getElementsByClassName("_WelcomeBanner_1ehfm_13").length > 0) {
            document.getElementsByClassName("_WelcomeBanner_1ehfm_13")[0].remove();
            return(0);
        }
        await wait(5);
    }
}

deleteBanner();

window.navigation.addEventListener("navigate", (event) => {
    deleteBanner();
});