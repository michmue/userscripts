// ==UserScript==
// @name						Arbeitsagentur Filter
// @match
// @version          1.0
// @match						*://*.arbeitsagentur.de/jobsuche/suche*
// @match						*://*.arbeitsagentur.de/jobsuche/pd/profil/vormerkungen*
// @run-at document-end
// ==/UserScript==

import {AgenturController} from "./arbeitsagentur/controller.mjs";

AgenturController.render();