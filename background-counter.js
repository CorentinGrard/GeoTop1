browser.runtime.onMessage.addListener(messageHandler)

async function messageHandler(message) {
  let counter = await readCounter()
  if (message.action === "getCounter") {
    // Do nothing
  } else if (message.action === "win") {
    counter.win++
    counter.nbGames++
  } else if (message.action === "loose") {
    counter.nbGames++
  }
  await updateCounter(counter)
  let tabs = await browser.tabs.query({
    currentWindow: true,
    active: true
  })
  
  browser.tabs.sendMessage(
    tabs[0].id,
    counter
  )
}

async function readCounter() {
  const results = await browser.storage.sync.get(["win", "nbGames"])
  return results
}

async function updateCounter({ win, nbGames }) {
  const result = await browser.storage.sync.set({ win: win, nbGames: nbGames })
}

async function initCounter() {
  const counter = await readCounter();
  if (typeof counter.win === 'undefined' || typeof counter.nbGames === 'undefined' || counter.win === null || counter.nbGames === null) {
    updateCounter({ win: 0, nbGames: 0 })
  }
}

initCounter()