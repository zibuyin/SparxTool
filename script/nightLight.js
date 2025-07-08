async function Night() {
    while (document.getElementsByClassName("_ColourOverlay_msfx9_1").length == 0) {
        await wait(5)
    }
    console.log("hi")
    if ((readLargeNumber(key) % 8) > 3) {
        document.getElementsByClassName("_ColourOverlay_msfx9_1")[0].style.backgroundColor = "#ffecd2"
        // document.getElementsByClassName("_ColourOverlay_msfx9_1")[0].style.mixBlendMode = "hue";
    }
    else {
        document.getElementsByClassName("_ColourOverlay_msfx9_1")[0].style.backgroundColor = "#fff"
    }
}

Night();