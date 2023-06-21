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

const PLAYER_FLEX = "div.player.flex";

let spa = new SPA(PAGES);


async function onPlayerDomain() {
    let playIcon = await element('.op-poster.pointer');
    playIcon.click();
    console.debug(`${"playIcon.click()"}`);


    let setting = await element('.vjs-control.vjs-button.vjs-icon-cog');
    console.log(`setting clicked`);
    setting.click();
    //
    // // @ts-ignore
    // let app_el = Array.from(unsafeWindow.document.querySelector('*')).find(e => e.__vue__)!;
    // console.debug(`clicked: vue play?`);
    // console.debug(`${app_el}`);
    // // @ts-ignore
    // await sleep(2000);
    // // @ts-ignore
    // app_el.__vue__.$el.__vue__.player.children_[7].children_[0].click();

    // let vueCtrl = undefined;
    // while (vueCtrl === undefined) {
    //     await sleep(100);
    //     try {
    //         console.log("trying");
    //         // @ts-ignore
    //         vueCtrl = videoPlayerVue.__vue__.$el.__vue__.player.children_[7].children_[0].el_
    //     } catch (e) {
    //
    //     }
    // }
    // console.log("found");
    
    // console.debug(setting);
    //
    // setting.click();

    // // await sleep(500);
    // setting.click();
    // console.debug("play clicked");
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

    if (window.top === window.self) {
        onTopDomain();
    } else {
        onPlayerDomain();
    }
}

main();