// ==UserScript==
// @name						Arbeitsagentur Filter
// @match
// @version          1.0
// @match						*://*.arbeitsagentur.de/jobsuche/suche*
// @match						*://*.arbeitsagentur.de/jobsuche/pd/profil/vormerkungen*
// @run-at document-end
// ==/UserScript==
// noinspection InfiniteLoopJS

import {AgenturController} from "./arbeitsagentur/controller.mjs";
import {SPA} from "./core/spa.mjs";

const FAVORITES = "/profil/vormerkungen?";
const JOB_LISTINGS = "/jobsuche/suche";

let spa = new SPA();

main();

async function main() {
    while (true) {
        let href = await spa.onLocationChance();

        if (href.includes(FAVORITES)) {
            AgenturController.renderFavorites()
        }

        if (href.includes(JOB_LISTINGS)) {
            AgenturController.renderJobListings();
        }
    }
}