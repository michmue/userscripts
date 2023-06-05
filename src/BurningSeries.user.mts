// ==UserScript==
// @name						Burning Series
// @version 1
// @match						https://bs.to/serie/*/*/*/*/*
// @allFrames true
// @run-at document-end
// @grant   GM.fetch
// ==/UserScript==

import {element, event} from "./core/dom.mjs";


let paths = location.pathname.split('/');
let videoHoster = paths.at(-1)!;

const BASIC_PLAYER = '.hoster-player';
const PLAYER_ANCHOR = '.hoster-player > a';
const IFRAME_LINK = ".hoster-player > iframe";

const bsMouseEvent = new MouseEvent("click", {
    bubbles: true,
    clientX: 614,
    clientY: 658,
});


async function awaitBasic(){
    await event('click', BASIC_PLAYER);
    let player = await element(BASIC_PLAYER);
    player.dispatchEvent(bsMouseEvent);

    let url = "none!?";
    if (isVideoHosterUsingIFrame(videoHoster)){
        url = await getURLFromIFrame();
    }

    if (isVideoHosterUsingAnchorTag(videoHoster)) {
        url = await getLinkFromAnchor();
    }

    await GM.setClipboard(url);
}

awaitBasic();


async function getURLFromIFrame() {
    let link = await element(IFRAME_LINK);
    return link.getAttribute('src')!;
}

function isVideoHosterUsingIFrame(videoHoster: string) {
    switch (videoHoster) {
        case "VOE": return false;
        default: return true;
    }
}

function isVideoHosterUsingAnchorTag(videoHoster: string) {
    switch (videoHoster) {
        case "VOE": return true;
        default: return false;
    }
}

async function getLinkFromAnchor() {
    let link = await element(PLAYER_ANCHOR);
    return link.getAttribute('href')!;
}
