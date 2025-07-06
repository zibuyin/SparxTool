let sliderContainer;
let slider;

let darkMode = (readLargeNumber(key) % 2) > 0;
let fakeIndependentLearning = (readLargeNumber(key) % 4) > 1;
let nightLight = (readLargeNumber(key) % 8) > 3;

async function settings() {
    while (document.getElementsByClassName("_SectionContainer_hgytc_20").length == 0) {
        await wait(5);
    }
    while (true) {
        if (document.getElementsByClassName("_Container_hgytc_1").length > 0) {
            if (document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section").length > 0 & 
            document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section")[0].getElementsByClassName("themeSpace").length == 0) {
                document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section")[0].innerHTML = `<br>
                    <h2>Dark Mode</h2>
                    <button class="sliderContainer themeSpace"><div class="slider" style="margin-Left: ${darkMode ? "16px" : "2px"};"></div></button>
                    <br><br>

                    <h2>Fake Independent Learning</h2>
                    <button class="sliderContainer themeSpace"><div class="slider" style="margin-left: ${fakeIndependentLearning ? "16px" : "2px"};"></div></button>
                    <br><br>
                    
                    <h2>Night Light</h2>
                    <button class="sliderContainer themeSpace"><div class="slider" style="margin-Left: ${nightLight ? "16px" : "2px"};"></div></button>`

                for (var i = 0; i < document.getElementsByClassName("sliderContainer").length; ++i) {

                    sliderContainer = document.getElementsByClassName("sliderContainer")[i];

                    slider = sliderContainer.getElementsByClassName("slider")[0];
                    slider.id = `${i}`
                    
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
                        if (slider.id == "0") {
                            if (slider.style.marginLeft == "2px") {
                                storeLargeNumber(key, readLargeNumber(key) - 1);
                            }
                            else {
                                storeLargeNumber(key, readLargeNumber(key) + 1);
                            }
                        }
                        else if (slider.id == "1") {
                            if (slider.style.marginLeft == "2px") {
                                storeLargeNumber(key, readLargeNumber(key) - 2);
                            }
                            else {
                                storeLargeNumber(key, readLargeNumber(key) + 2);
                            }
                        }
                        else if (slider.id == "2") {
                            if (slider.style.marginLeft == "2px") {
                                storeLargeNumber(key, readLargeNumber(key) - 4);
                            }
                            else {
                                storeLargeNumber(key, readLargeNumber(key) + 4);
                            }
                        }
                        darkMode = (readLargeNumber(key) % 2) > 0;
                        fakeIndependentLearning = (readLargeNumber(key) % 4) > 1;
                        nightLight = (readLargeNumber(key) % 8) > 3;
                        independent();
                        fetchCss();
                        Night();
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