// ==UserScript==
// @name						Development
// @version 1
// @match						*://portal.zentrale-pruefstelle-praevention.de/portfolio/aokbayern/suchergebnis*
// @grant   GM.fetch
// ==/UserScript==


function url() {
    return `http://localhost:8080/AOK Filter.user.js?ts=${(+new Date())}`;
}

let currentScript = "";
let previousScript = "";

if (!currentScript) {
    GM.fetch(url())
        .then(resp => {
            currentScript = resp.text;
            eval(currentScript);
        });
}


function reloadOnScriptChance() {
    if (currentScript) {
        previousScript = currentScript;

        GM.fetch(url())
            .then(resp => {
                currentScript = resp.text;

                let isUneqal = currentScript !== previousScript;
                console.log(`isUnqeal: ${isUneqal}`);
                if (isUneqal) {
                    location.reload();
                }
            });
    }
}


addEventListener('focus', () => {
    reloadOnScriptChance();
});