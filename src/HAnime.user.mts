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
import {debug} from "util";


const PAGES = {
    'INDEX': 'https://hanime.tv/',
    'PLAYER': 'https://hanime.tv/videos/hentai/'
};

const PLAYER_FLEX = "div.player.flex";

let spa = new SPA(PAGES);


async function onPlayerDomain() {
    let setting = await element('button.vjs-control.vjs-button.vjs-icon-cog');
    await sleep(500);
    setting.click();
}


async function onTopDomain() {
    // while (true) {
    //     // let player = await element('.play-btn.flex.justify-center.dalign-center');
    //     let player = await element('.poster');
    //     player.click();
    //
    //     console.log("Clicked");
    //
    console.debug(`optional: preview image`);
    let rejectCondition = () => {
        return !!document.querySelector('iframe.hvp-panel.ad-content-area.banner-ad.vertical-ad');
    };

    element('.hvp-panel.flex.align-center.justify-center.pointer.htvad', document.documentElement, rejectCondition).then(e => {
        e.click();
    });

        let p360 = await element('div.htvssd-server.mt-4 > div:last-child');
    await sleep(100);
        p360.click();
    console.debug(`clicked 360 ${p360}`);
        // player.click();
    // }
}

const playIcon : string = '.hvp-panel.flex.align-center.justify-center.pointer.htvad2';

async function main() {
    spa = new SPA(PAGES);
    let res1: (value: unknown) => void;
    let rej1: (reason?: any) => void;

    let promise = new Promise((resolve, reject) => {
        res1 = resolve;
        rej1 = reject;
    }).catch(reason => {
        console.debug(`${reason}`);
    });


    new Promise(resolve => {
        setTimeout(() => {
            resolve('rejected rej1');
            rej1('outside');
        }, 2000);
    }).then(value => console.debug(`${value}`));


    // Promise.resolve(promise).then(value => console.debug(`${value.classList}`));

    // if (window.top === window.self) {
    //     onTopDomain();
    // } else {
    //     onPlayerDomain();
    // }
}

main();