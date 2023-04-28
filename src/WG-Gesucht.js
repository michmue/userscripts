// ==UserScript==
// @name						WG Gesucht Export
// @match
// @version          1.0
// @match						*://*.wg-gesucht.de/*
// @run-at document-end
// ==/UserScript==

'use strict';

class WG {
  constructor(Personen, Männer, Frauen, Gesucht, Einstellung, Miete, Größe, Stadtteil, Frei_ab, URL) {
    this.Personen = Personen;
    this.Männer = Männer;
    this.Frauen = Frauen;
    this.Gesucht = Gesucht;
    this.Einstellung = Einstellung;
    this.Miete = Miete;
    this.Größe = Größe;
    this.Stadtteil = Stadtteil;
    this.Frei_ab = Frei_ab;
    this.URL = URL;
  }
}

class WGParser {

  parse(html){
    const allWGsContainer = this.getWGsHtmlContainer(html);
    return allWGsContainer.map(wgTabelRow =>
      new WG(
        this.parseWGsPersonCount(wgTabelRow),
        this.parseWGsMenCount(wgTabelRow),
        this.parseWGsWomenCount(wgTabelRow),
        this.parseWGsSearchingForGender(wgTabelRow),
        this.parseWGsEntrieDate(wgTabelRow),
        this.parseWGsMiete(wgTabelRow),
        this.parseWGsSize(wgTabelRow),
        this.parseWGsCityPart(wgTabelRow),
        this.parseWGsFreeAt(wgTabelRow),
        this.parseWGsURL(wgTabelRow)
    ));
  }

  static parse(html) {
    return new WGParser().parse(html);
  }

  getWGsHtmlContainer(html) {
    return [...html.querySelectorAll("tbody > tr")];
  }

  parseWGsPersonCount(wgTabelRow) {
    return wgTabelRow.querySelector("span[title]").title.replace(/ .*/g,'');
  }

  parseWGsMenCount(wgTabelRow) {
    return wgTabelRow.querySelectorAll("span > img[src*=wgm]").length;
  }

  parseWGsWomenCount(wgTabelRow) {
    return wgTabelRow.querySelectorAll("span > img[src*=wgw]").length;
  }

  parseWGsSearchingForGender(wgTabelRow) {
    return wgTabelRow.querySelectorAll("span > img[src*=wgeg]").length
  }

  parseWGsEntrieDate(wgTabelRow) {
    return wgTabelRow.querySelector("td[class*=ang_spalte_datum] span").textContent.replace(/\s/g,'');
  }

  parseWGsMiete(wgTabelRow) {
    return wgTabelRow.querySelector("td[class*=ang_spalte_miete] span").textContent.replace(/\s/g,'');
  }

  parseWGsSize(wgTabelRow) {
    return wgTabelRow.querySelector("td[class*=ang_spalte_groesse] span").textContent.replace(/\s/g,'');
  }

  parseWGsCityPart(wgTabelRow) {
    return wgTabelRow.querySelector("td[class*=ang_spalte_stadt] span").textContent.trimStart().trimEnd().replace(/\s+/g," ");
  }

  parseWGsFreeAt(wgTabelRow) {
    return wgTabelRow.querySelector("td[class*=ang_spalte_freiab] span").textContent.replace(/\s/g,'');
  }

  parseWGsURL(wgTabelRow) {
    return "https://www.wg-gesucht.de/" + wgTabelRow.getAttribute('adid');
  }

  static async fetchDescription(wg){
    setTimeout(() => {
      return wg['WG-Text'] = "test"
    }, 1000)
  }

  static async parseWithWGDescription(){
    let wgs = new WGParser().parse(document);
    let proms = wgs.map(async(wg) => wg);
    proms = await Promise.allSettled(proms);
    return proms.map(prom => prom.value);
  }
}

async function main() {
  var wgs = await WGParser.parseWithWGDescription();
  console.log(wgs);
}

main();

var wgs = WGParser.parse(document)

wgs.forEach(WG => {
  fetch(WG.URL).then(resp => resp.text()).then(text => {
    let dom = new DOMParser().parseFromString(text, "text/html");
    try {
      WG['WG-Text'] = dom.querySelector("#ad_description_text").textContent;
    } catch {
      WG['WG-Text'] = ""
    }
  })
})

fetching = true
while (fetching) {
  maxTrueCount = wgs.length - 1
  currTrueCount = 0;

  for (let i = 0; i < wgs.length; i++) {
    const wg = wgs[i];
    if (wg.hasOwnProperty("WG-Text")) currTrueCount++;
  }

  if (currTrueCount == maxTrueCount) {
    fetching = false;
  }

}

wgs.find(wg => wg['WG-Text'].toLowerCase().includes("sex") || wg['WG-Text'].toLowerCase().includes("schlafen"))

var t = "";
fetch("url")
.then(resp => resp.text())
.then(text => {
    let dom = new DOMParser().parseFromString(text, "text/html");
    t = dom.querySelector("#freitext_0").textContent
  });


class Job {
  Hauptberuf = "";
  Titel = "";
  Arbeitgeber = "";
  Entfernung = "";
  Ort = "";
  Veröffentlichung = "";
  Extern = "";

  static equals(job1, job2) {
    return job1.Hauptberuf == job2.Hauptberuf &&
      job1.Titel == job2.Titel &&
      job1.Arbeitgeber == job2.Arbeitgeber &&
      job1.Entfernung == job2.Entfernung &&
      job1.Ort == job2.Ort &&
      job1.Extern == job2.Extern;
  }
}

if (location.pathname.includes("profil/vormerkungen")) {
  uiStatusFinished(() => {
    createUIFavCounter();
  });
} else if (location.pathname.includes("jobsuche/suche")) {
  uiStatusFinished(() => {
    loadAllPages();
    createUIFavFilter();
  });

}

function loadAllPages() {
  let inter = setInterval(() => {
    let b = document.querySelector("#ergebnisliste-ladeweitere-button");
    if (b) {
      b.click();
    }
    else {
      console.log("clear loadAllPages");
      clearInterval(inter);
    }
  }, 100);

}

function uiStatusFinished(callback) {
  let f = callback;
  let uistatusInverval = setInterval(() => {
    let e = document.querySelector("jb-suchergebnis-container");
    let ejobs = e.querySelectorAll("jb-job-listen-eintrag").length;
    if (e && ejobs > 0) {
      console.log("clearing interval");
      f();
      clearInterval(uistatusInverval);
    }
  }, 200);
}

function createUIFavCounter() {
  /** @type {NodeList} */
  var tabbar = document.querySelector(".tabbar-container");
  /** @type {HTMLElement} */
  var favCounter = document.createElement("favCounter");

  let notAvailable = getDataByFilter(x => x.textContent.includes("Stelle nicht mehr"));
  //let available = getDataByFilter(x => !x.textContent.includes("Stelle nicht mehr"));

  console.log(notAvailable);
  //console.log(available);
  // console.log(notAvailable.length);
  // console.log(available.length);

  favCounter.innerHTML = `
    <Button>Aktuell verfügbar: ${1}</Button>
    <Button>Nicht mehr verfügbar: ${1}</Button>
  `;
  tabbar.after(favCounter);
  //favCounter.children[0].onclick = () => navigator.clipboard.writeText(JSON.stringify(available));
  //favCounter.children[1].onclick = () => navigator.clipboard.writeText(JSON.stringify(notAvailable));
}

function createUIFavFilter() {
  var c = document.querySelector(".container-fluid");
  var ro = c.childNodes[4];

  var isFavHidden = false;
  var favFilter = document.createElement("favFilter");

  var btnMarkKnown = document.createElement("Button");
  var btnToggleKnown = document.createElement("Button");
  var btnToggleFav = document.createElement("Button");
  var btnExportVisible = document.createElement("Button");
  var btnImportKnown = document.createElement("Button");
  var ipText = document.createElement("Input");


  btnToggleFav.textContent = "Favoriten umschalten";
  btnMarkKnown.textContent = "Bekannte hervorheben";
  btnToggleKnown.textContent = "Bekannte umschalten";
  btnExportVisible.textContent = "Sichtbare Jobs Exportieren";


  favFilter.appendChild(btnToggleFav);
  favFilter.appendChild(btnMarkKnown);
  favFilter.appendChild(btnToggleKnown);
  favFilter.appendChild(btnExportVisible);
  favFilter.appendChild(ipText);


  btnToggleFav.onclick = () => {
    let jobs = [...document.querySelectorAll("button.ba-icon-favorite-full")];
    let hidden = jobs[0].parentElement.hidden;
    if (hidden) {
      jobs.forEach(x => x.parentElement.hidden = false);
    } else if (!hidden) {
      jobs.forEach(x => x.parentElement.hidden = true);
    }
  };



  btnMarkKnown.onclick = () => {
    /** @type {Job[]} */
    let jobs = getDataByFilter(j => true);
    let jobsFav = [...document.querySelectorAll("button.ba-icon-favorite-full")];
    let jobsHtml = [...document.querySelectorAll("jb-job-listen-eintrag")];
    /** @type {Job[]} */
    let knownJobs = JSON.parse(ipText.value);

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      for (let j = 0; j < knownJobs.length; j++) {
        const kj = knownJobs[j];

        for (let k = 0; k < jobsFav.length; k++) {
          const jobFav = jobsFav[k];
          if (Job.equals(job, kj) && !Job.equals(jobFav, kj)) {
            jobsHtml.at(i).style.backgroundColor = "grey";
          }
        }
      }
    }
  };



  btnToggleKnown.onclick = () => {
    let jobsHtml = [...document.querySelectorAll("jb-job-listen-eintrag")]
      .filter(h => h.style.backgroundColor == 'grey');

    if (jobsHtml[0].hidden === true) {
      jobsHtml.forEach(h => h.hidden = false);
    } else {
      jobsHtml.forEach(h => h.hidden = true);
    }

  };



  btnExportVisible.onclick = () => {
    let data = getDataByFilter(x => x.hidden === false);
    navigator.clipboard.writeText(JSON.stringify(data));
  };

  c.insertBefore(favFilter, ro);

}

function getDataByFilter(filter) {
  return [...document.querySelectorAll("jb-job-listen-eintrag")]
    .filter(x => filter(x))
    .map(x => (
      {
        "Hauptberuf": x.querySelector(".oben").textContent,
        "Titel": x.querySelector("span.mitte-links-titel").textContent.trimEnd(1),
        "Arbeitgeber": x.querySelector(".mitte-links-arbeitgeber").textContent.trimStart(1).trimEnd(1),
        "Entfernung": x.querySelector(".mitte-links-ort").textContent.match(/\d+/)[0],
        "Ort": x.querySelector(".mitte-links-ort").textContent.trimStart().trimEnd().replaceAll(/\(.*/g, ""),
        "Veröffentlichung": x.querySelector(".unten-datum").textContent.trimStart(1).trimEnd(1),
        "URL": x.querySelector("a").href,
        "Extern": x.querySelector(".mitte-rechts").querySelector("span") !== null ? true : false,
      }

    ));
}