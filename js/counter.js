browser.runtime.onMessage.addListener(updateCounter);

let win = 0
let nbGames = 0

function updateCounter(message) {
  if (message.action == "updateWin") {
    win = message.message
  }
  if (message.action == "updateNbGames") {
    nbGames = message.message
  }
  updateUI()
}

function updateUI() {
  const counter = document.getElementById('br_counter');
  counter.textContent = `Top 1 : ${win} / ${nbGames} Games played`
}

async function createCounter() {
  // Create the DOM
  if (document.getElementById("br_counter") === null) {
    const header = document.querySelector('.header__items');
    const counter = document.createElement('div')
    counter.id = "br_counter"
    counter.classList.add("label-1");
    counter.style["align-items"] = "center";
    counter.style["color"] = "white";
    counter.classList.add("header__item")
    header.prepend(counter)
  }

  // Get the data
  let counter = await browser.runtime.sendMessage({ action: "getCounter" })
  win = counter.win
  nbGames = counter.nbGames
  updateUI()
}

createCounter();