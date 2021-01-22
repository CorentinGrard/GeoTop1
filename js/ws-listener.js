let playerId = null;

document.body.addEventListener("ws_message", e => {
  const data = JSON.parse(e.detail.data)
  if (data.code === "PlayerGuessed") { //GameFinished
    let player = data.battleRoyaleGameState.players.find(player => player.playerId === playerId)
    if (player.playerState === "Qualified") {
      // Increment wins
      browser.runtime.sendMessage({
        action: "win",
      });
    }
  }
});

document.body.addEventListener("ws_send", e => {
  const data = JSON.parse(e.detail.data)
  if (data.code === "SubscribeToLobby") {
    playerId = data.playerId
    browser.runtime.sendMessage({
      action: "newGame",
      message: JSON.parse(e.detail.data),
    });
  }
});


function createJS() {
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.text = `
  WebSocket.prototype = null; // extending WebSocket will throw an error if this is not set
const ORIGINAL_WEBSOCKET = WebSocket;
var WebSocket = window.WebSocket = class extends WebSocket {
  constructor(...args) {
    super(...args);

    this.addEventListener('message', event => {
      let ws_message = new CustomEvent("ws_message", {
        detail: {
          data: event,
          obj: this
        }
      });
      document.body.dispatchEvent(ws_message);
    });
  }

  send(...args) {
    let ws_send = new CustomEvent("ws_send", {
      detail: {
        data: args[0],
        obj: this
      }
    });
    document.body.dispatchEvent(ws_send);
    super.send(...args);
  }
}
  `
  const th = document.getElementsByTagName("head")[0];
  th.insertBefore(s, th.firstChild);
}

createJS();