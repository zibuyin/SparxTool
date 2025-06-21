async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let header = document.getElementsByClassName("_BannerSpacing_u9l2x_29")

async function independent() {
    await wait(1000)
    // if (header) {
        console.log("hi")
        header[0].innerHTML = "hi"
    // }
}

independent()