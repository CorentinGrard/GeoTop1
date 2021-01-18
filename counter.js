browser.runtime.onMessage.addListener(updateCounter);

function updateCounter({ win, nbGames }) {
  const counter = document.getElementById('br_counter');
  counter.textContent  = `Top 1 : ${win} / ${nbGames} Games played`
}

function initCounter() {
  const header = document.querySelector('.header__items');
  const counter = document.createElement('div')
  counter.id = "br_counter"
  counter.classList.add("label-1");
  counter.style["align-items"] = "center";
  counter.style["color"] = "white";
  const counterText = document.createTextNode("Top 1 : 0 / 0 Games played");
  counter.appendChild(counterText)
  counter.classList.add("header__item")
  header.prepend(counter)
  browser.runtime.sendMessage({ action: "getCounter" })

  const modal = document.querySelector('.br-game-layout__modals');

  const config = { attributes: true, childList: true, subtree: true };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        let testLoose = node.classList.contains("popup--red")
        let testGreen = node.classList.contains("popup--green")
        let testWin = document.querySelector(".popup-view__header") === null

        if (testLoose) {
          console.log("You lost")
          browser.runtime.sendMessage({ action: "loose" })
        }
        if (testGreen && testWin) {
          console.log("You won")
          browser.runtime.sendMessage({ action: "win" })


        }
      })
    });
  });

  // Start observing the target node for configured mutations
  observer.observe(modal, config);
}


initCounter()


