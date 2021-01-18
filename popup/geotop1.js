const reset = document.getElementById("reset")
const win = document.getElementById("win")
const nbGames = document.getElementById("nbGames")

function listenForInputs() {

    reset.addEventListener("click", async e => {
        await browser.storage.sync.set({ win: 0, nbGames: 0 })
        sync()
    })

    win.addEventListener("change",async e => {
        await browser.storage.sync.set({ win: e.target.value })
    })

    nbGames.addEventListener("change",async e => {
        await browser.storage.sync.set({ nbGames: e.target.value })
    })
}

async function sync(){
    const result = await browser.storage.sync.get(["win", "nbGames"])
    win.value = result.win
    nbGames.value = result.nbGames
}

async function init() {
    sync()
    listenForInputs()
}

init()