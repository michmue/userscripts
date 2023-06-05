// ==UserScript==
// @name						Development
// @version 1
// @match						*://hanime.tv/videos/hentai/*
// @match						*://hanime.tv/omni-player/*
// @match						*://player.hanime.tv/*
//
// @allFrames true
// @run-at document-end
// @grant   GM.fetch
// ==/UserScript==

import {SPA} from "./core/spa.mjs";
import {element, sleep} from "./core/dom.mjs";


const PAGES = {
    'INDEX': 'https://hanime.tv/',
    'PLAYER': 'https://hanime.tv/videos/hentai/'
};

let spa = new SPA(PAGES);


async function onPlayerDomain() {
    let setting = await element('button.vjs-control.vjs-button.vjs-icon-cog');
    await sleep(500);
    setting.click();
}


async function onTopDomain() {
    while (true) {
        await spa.onLocation(PAGES.PLAYER);
        await sleep(500);
        let player = await element('div.player.flex > div > div');
        player.click();

        let p360 = await element('div.htvssd-server.mt-4 > div:last-child');
        p360.click();
        player.click();
        console.debug("await location change");
        await spa.locationChange();
        console.debug("location changed");
    }
}
async function main() {
    spa = new SPA(PAGES);

    if (window.top === window.self) {
        onTopDomain();
    } else {
        onPlayerDomain();
    }
}

main();