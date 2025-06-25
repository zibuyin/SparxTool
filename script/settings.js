document.getElementsByTagName("head")[0] += `<style>${document.getElementById('css')}</style>`

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function settings() {
    while (true) {
        if (document.getElementsByClassName("_Container_hgytc_1").length > 0) {
            if (document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section").length > 0 & 
            document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section")[0].getElementsByClassName("themeSpace").length == 0) {
                document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section")[0].innerHTML += `
                <h2>Theme</h2>
                <button id="sliderContainer" class="themeSpace"><div></div></button>
                <h2>Fake Independent Learning</h2>`

                document.getElementById("sliderContainer").addEventListener("click", (event) => {
                    if (document.getElementById("sliderContainer").getElementsByTagName("div")[0].style.marginLeft == 0) {
                        document.getElementById("sliderContainer").getElementsByTagName("div")[0].style.marginLeft = "18px";
                        document.getElementById("sliderContainer").getElementsByTagName("div")[0].style.backgroundColor = "#222";
                    }
                    else {
                        document.getElementById("sliderContainer").getElementsByTagName("div")[0].style.marginLeft = 0;
                        document.getElementById("sliderContainer").getElementsByTagName("div")[0].style.backgroundColor = "#fff";
                    }
                });
                return(0);
            }
        }
        await wait(5);
    }
}

settings();

window.navigation.addEventListener("navigate", (event) => {
    settings();
})