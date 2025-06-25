let sliderContainer;
let slider;

async function fetchLocal() {
    await fetch(chrome.runtime.getURL('./script/settings.html'))
    .then(t => t.text())
    .then(console.log)
}

async function settings() {
    while (document.getElementsByClassName("_SectionContainer_hgytc_20").length == 0) {
        await wait(5);
    }
    document.getElementsByTagName("h2")[0].remove()
    document.getElementsByTagName("p")[0].remove()
    document.getElementsByClassName("_SectionContainer_hgytc_20")[0].remove()
    while (true) {
        if (document.getElementsByClassName("_Container_hgytc_1").length > 0) {
            if (document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section").length > 0 & 
            document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section")[0].getElementsByClassName("themeSpace").length == 0) {
                document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section")[0].innerHTML += fetchLocal()

                for (var i = 0; i < document.getElementsByClassName("sliderContainer").length; ++i) {

                    sliderContainer = document.getElementsByClassName("sliderContainer")[i];

                    sliderContainer.id = `${i}`
                    sliderContainer.getElementsByTagName("div")[0].style.marginLeft = "2px";

                    sliderContainer.addEventListener("click", (event) => {
                        slider = event.target.getElementsByTagName("div")[0];
                        if (!slider) {
                            slider = event.target;
                        }

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