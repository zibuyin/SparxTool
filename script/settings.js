let sliderContainer;
let slider;

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function settings() {
    while (true) {
        if (document.getElementsByClassName("_Container_hgytc_1").length > 0) {
            if (document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section").length > 0 & 
            document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section")[0].getElementsByClassName("themeSpace").length == 0) {
                document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section")[0].innerHTML += `
                <h2>Dark Mode</h2>
                <button class="sliderContainer themeSpace"><div></div></button>
                <h2>Fake Independent Learning</h2>
                <button class="sliderContainer themeSpace"><div></div></button>`

                for (var i = 0; i < document.getElementsByClassName("sliderContainer").length; ++i) {

                    sliderContainer = document.getElementsByClassName("sliderContainer")[i];
                    
                    sliderContainer.id = `${i}`
                    sliderContainer.getElementsByTagName("div")[0].style.marginLeft = "2px";

                    sliderContainer.addEventListener("click", (event) => {
                        slider = document.getElementById(event.target.id).getElementsByTagName("div")[0];
                        if (slider.style.marginLeft == "2px") {
                            slider.style.marginLeft = "16px";
                        }
                        else {
                            slider.style.marginLeft = "2px";
                        }
                    });
                }
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