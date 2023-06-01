// ==UserScript==
// @name						AOK Filter
// @version 2.3
// @match						*://portal.zentrale-pruefstelle-praevention.de/portfolio/aokbayern/suchergebnis*
// @grant   GM.fetch
// ==/UserScript==

(async function main() {
    await element(".portfolio-content", "suchergebnis");
    let filter = createUIFilter();

    let c = document.querySelector(".portfolio-sortierung-selector-options");
    c.after(filter);

    // noinspection InfiniteLoopJS
    while (true) {
        await backToLocationMain();

        let c = document.querySelector(".portfolio-sortierung-selector-options");
        c.after(filter);
    }
})();


async function backToLocationMain() {
    await OnUiUpdate('portfolio-suche pagefade-enter pagefade-enter-active');
    return location.href.includes("portal.zentrale-pruefstelle-praevention.de/portfolio/aokbayern/suchergebnis");
}


/**
 *
 * @param selector
 * @param path
 * @returns {Promise<Element>}
 */
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


/**
 * @param {string} selector
 */
async function OnUiUpdate(selector) {
    return new Promise(resolve => {
        let target = document.querySelector(".portfolio-content");

        let m = new MutationObserver(mutations => {

            let isPortfolioSearchMutated = mutations.filter(mutation => {
                return mutation.type === "childList"
                    && mutation.addedNodes.length > 0
                    && [...mutation.addedNodes].filter(node => node.className === selector).length > 0;
            }).length > 0;

            if (isPortfolioSearchMutated) {
                m.disconnect();
                resolve();
            }
        });

        m.observe(target, {
            childList: true
        });
    });
}


function createUIFilter() {

    let filter = document.createElement("filter");
    let input = document.createElement("input");
    let filterBtn = document.createElement("Button");
    filterBtn.textContent = "Filter";

    filterBtn.onclick = function () {
        let value = input.value;
        let words = value.split(',');

        [...document.querySelectorAll(".portfolio-suche-ergebnis--kurs")].forEach(d => d.style.display = "flex");
        let foundMatches = [...document.querySelectorAll(".portfolio-suche-ergebnis--kurs")]
            .filter(d => {
                let lowerTitle = d.querySelector("h1").textContent
                    .toLowerCase();
                for (const word of words) {
                    let w = word.trimEnd()
                        .trimStart()
                        .toLowerCase();

                    if (lowerTitle.includes(w)) return true;
                }
            });

        foundMatches
            .forEach(d => d.style.display = "none");

    };

    filter.appendChild(input);
    filter.appendChild(filterBtn);

    return filter;
}
