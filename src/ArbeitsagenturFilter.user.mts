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

const FAVORITES = "/profil/vormerkungen";
const JOB_LISTINGS = "/jobsuche/suche";

SPA.onLocationChance(url => {
    if (url.includes(FAVORITES)) {
            AgenturController.renderFavorites()
        }

        if (url.includes(JOB_LISTINGS)) {
            AgenturController.renderJobListings();
        }

        AgenturController.loadAllPages()
});