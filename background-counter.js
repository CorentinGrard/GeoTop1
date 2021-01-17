browser.runtime.onMessage.addListener(messageHandler)

async function messageHandler(message) {
  let counter = await readCounter()
  console.log(message)
  console.log(counter)
  if (message.action === "getCounter") {
    // Do nothing
  } else if (message.action === "win") {
    counter.win++
  } else if (message.action === "loose") {
    counter.loose++
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
  const results = await browser.storage.sync.get(["win", "loose"])
  return results
}

async function updateCounter({ win, loose }) {
  const result = await browser.storage.sync.set({ win: win, loose: loose })
}

async function initCounter() {
  const counter = await readCounter();
  if (typeof counter.win === 'undefined' || typeof counter.loose === 'undefined' || counter.win === null || counter.loose === null) {
    updateCounter({ win: 0, loose: 0 })
  }
}

initCounter()