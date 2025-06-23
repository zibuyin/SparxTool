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
                Light<br class="themeSpace">
                Dark
                <h2>Fake Independent Learning</h2>`
                return(0)
            }
        }
        await wait(5)
    }
}

settings();

window.navigation.addEventListener("navigate", (event) => {
    settings();
})