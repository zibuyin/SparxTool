let sliderContainer;
let slider;

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.storage.sync.set({'mode': 'light'});


chrome.storage.sync.get(['mode'], function(items) {
    message('Settings retrieved', items);
  });


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
                document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section")[0].innerHTML += `
                <br>
                <h2>Dark Mode</h2>
                <button class="sliderContainer themeSpace"><div id="slider"></div></button>
                <br><br>
                
                <h2>Theme</h2>
                <div id="theme">
                    <span>
                        <input id="ocean" class="radio" type="radio" name="theme"></input> &nbsp; 
                        <label for="ocean">ocean</label>
                    </span>
                    <span>
                        <input id="stone" class="radio" type="radio" name="theme" checked></input> &nbsp; 
                        <label for="stone">stone</label>
                    </span>
                    <span>
                        <input id="candy" class="radio" type="radio" name="theme"></input> &nbsp; 
                        <label for="candy">candy</label><br>
                    </span>
                </div>
                <br>

                <h2>Fake Independent Learning</h2>
                <button class="sliderContainer themeSpace"><div id="slider"></div></button>
                `

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