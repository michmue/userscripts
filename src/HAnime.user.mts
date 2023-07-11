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


SPA.onLocationChance(url => {
    let isTopDomain = window.top === window.self;
    if (isTopDomain) onTopDomain();
    if (!isTopDomain) onPlayerDomain();
});


async function onPlayerDomain() {
    let setting = await element('button.vjs-control.vjs-button.vjs-icon-cog');
    await sleep(500);
    setting.click();
}


async function onTopDomain() {
        await sleep(500);
        let player = await element('div.player.flex > div > div');
        player.click();

        let p360 = await element('div.htvssd-server.mt-4 > div:last-child');
        p360.click();
        player.click();
}