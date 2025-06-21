async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let header = document.getElementsByClassName("_BannerSpacing_u9l2x_29")

async function independent() {
    while (true) {
        await wait(30)
        if (header.length > 0) {
            console.log("hi")
            header[0].innerHTML = "<span> &nbsp; Independent Learning</span>"
            return(0)
        }
    }
}

independent()