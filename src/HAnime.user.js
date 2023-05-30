// ==UserScript==
// @name						Arbeitsagentur Filter
// @match
// @version          1.0
// @match						*://hanime.tv/videos/hentai/*
// @match						*://*.arbeitsagentur.de/jobsuche/pd/profil/vormerkungen*
// @run-at document-end
// ==/UserScript==

PLAYER_PAGE = 'hanime.tv/videos/hentai/'
// elementOnPage('.divs', PLAYER_PAGE)
async function elementOnPage(selector, page1){
    return new Promise(resolve => {
        let intervalId = setInterval(() => {
            let ele = document.querySelector(selector);
            if (location.href.includes(page) && ele) {
                clearInterval(intervalId);
                resolve(ele);
            }
        }, 200);
    });

}

async function element(selector, path) {
    return new Promise(resolve => {
        let intervalId = setInterval(() => {
            let ele = document.querySelector(selector);
            if (location.href.includes(path) && ele) {
                clearInterval(intervalId);
                resolve(ele);
            }
        }, 200);
    });
}

async function main() {
    console.log("wait .player.flex");
    await element('div.player.flex', PLAYER_PAGE);
    console.log("found");
}