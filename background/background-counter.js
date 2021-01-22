console.log("Initialisation Listeners")
browser.runtime.onMessage.addListener(messageHandler)
browser.storage.onChanged.addListener(storageChange)

async function storageChange(changes, area) {
  if (area === "sync") {

    const tabs = await browser.tabs.query({
      url: "*://*.geoguessr.com/battle-royale*"
    })

    if (typeof changes.win !== "undefined") {
      let newWin = changes.win.newValue
      tabs.forEach(tab => {
        browser.tabs.sendMessage(
          tab.id,
          {
            action: "updateWin",
            message: newWin
          }
        )
      });
    }
    if (typeof changes.nbGames !== "undefined") {
      let newNbGames = changes.nbGames.newValue
      tabs.forEach(tab => {
        browser.tabs.sendMessage(
          tab.id,
          {
            action: "updateNbGames",
            message: newNbGames
          }
        )
      });
    }
  }
}

async function messageHandler(message) {

  switch (message.action) {
    case 'getCounter':
      return await readCounter();
      break;
    case 'win':
      let counter = await readCounter()
      browser.storage.sync.set({ win: counter.win + 1 })
      break;
    case 'newGame':
      addNewGame(message.message)
      break;
  }
}

async function addNewGame(currentGame) {
  let { gameId } = await browser.storage.local.get(["gameId"])
  if (gameId != currentGame.gameId) {
    let { nbGames } = await readCounter()
    gameId = currentGame.gameId
    browser.storage.local.set({ gameId: gameId })
    browser.storage.sync.set({ nbGames: nbGames + 1 })
  }
  return gameId
}

async function readCounter() {
  return await browser.storage.sync.get(["win", "nbGames"])
}

async function initCounter() {
  const counter = await readCounter();
  if (typeof counter.win === 'undefined' || typeof counter.nbGames === 'undefined' || typeof counter.gameId === 'undefined') {
    browser.storage.sync.set({ win: 0, nbGames: 0 })
    browser.storage.local.set({ gameId: "" })
  }
}

initCounter()