// ==UserScript==
// @name						AOK Filter
// @version 2.3
// @match						*://portal.zentrale-pruefstelle-praevention.de/portfolio/aokbayern/suchergebnis*
// @grant   GM.fetch
// ==/UserScript==

(async function main() {
  let ele = await element(".portfolio-content", "suchergebnis");
  createUIFilter();

  // noinspection InfiniteLoopJS
  while (true) {
    console.log(await elementRemoved("filter"));
    let ele2 = await element(".portfolio-aktionen-leiste--top", "suchergebnis");
    createUIFilter();
  }
})();

/**
 *
 * @param selector
 * @param path
 * @returns {Promise<Element>}
 */
function element(selector, path) {
  return new Promise((resolve, reject) => {
    let intervalId = setInterval(() =>  {
      let ele = document.querySelector(selector);
      if (location.href.includes(path) && ele) {
        clearInterval(intervalId);
        resolve(ele);
      }
    }, 200);
  });
}


async function OnUiUpdateEnd() {
  return new Promise((resolve, reject) => {

    let m = new MutationObserver((mutations, observer) => {
      console.log(mutations);
      m.disconnect();
      resolve(mutations);
    });

    let target = document.querySelector(".portfolio-content");
    m.observe(target, {
      childList: true
    });
  });
}


function elementRemoved(selector) {
  return new Promise((resolve, reject) => {
    let target = document.querySelector(".portfolio-content");

    // let m = new MutationObserver((mutations, observer) => {
    //   resolve(mutations);
    // });

    // m.observe(target, {characterData:true, attributes:true, childList:true});
  });
}


function createUIFilter() {

  var filter = document.createElement("filter");
  var input = document.createElement("input");
  var filterBtn = document.createElement("Button");
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

            if ( lowerTitle.includes(w) ) return true;
          }
        });

    foundMatches
        .forEach(d => d.style.display = "none");

  }

  filter.appendChild(input);
  filter.appendChild(filterBtn);

  var c = document.querySelector(".portfolio-sortierung-selector-options");
  c.after(filter);
}




async function OnUiUpdate(selector) {
  return new Promise((resolve, reject) => {
    let target = document.querySelector(".portfolio-content");

    let m = new MutationObserver((mutations, observer) => {

      let isPortfolioSearchMutated = mutations.filter(mutation => {
        return mutation.type === "childList"
            && mutation.addedNodes.length > 0
            && [...mutation.addedNodes].filter(node => node.className === "portfolio-suche pagefade-enter pagefade-enter-active").length > 0;
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

(async () => {
  await OnUiUpdate();
  createUIFilter();
})();



