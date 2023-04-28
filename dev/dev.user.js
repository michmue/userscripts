// ==UserScript==
// @name						Development
// @version 1
// @match						*://portal.zentrale-pruefstelle-praevention.de/portfolio/aokbayern/suchergebnis*
// @grant   GM.fetch
// ==/UserScript==


let url = `http://localhost:8080/AOK Filter.user.js?ts=${(+new Date())}`;
GM.fetch(url)
    .then(resp => eval(resp.text))