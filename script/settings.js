async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function settings() {
    while (true) {
        
        if (document.getElementsByClassName("_Container_hgytc_1").length > 0) {
            if (document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section").length > 0) {
                document.getElementsByClassName("_Container_hgytc_1")[0].getElementsByTagName("section")[0].innerHTML += `
                <h2>Theme</h2>
                Light<br>
                Dark
                <h2>
                Fake Independent Learning`
                return(0)
            }
        }
        await wait(5)
    }
}

settings();

console.log("hi")