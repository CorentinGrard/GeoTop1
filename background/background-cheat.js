function logURL(requestDetails) {
    console.log(requestDetails);
}

browser.webRequest.onCompleted.addListener(
    logURL,
    { urls: ["wss://game-server.geoguessr.com/ws"] }
);
