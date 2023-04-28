// ==UserScript==
// @name						Arbeitsagentur Filter
// @match
// @version          1.0
// @match						*://*.arbeitsagentur.de/jobsuche/suche*
// @match						*://*.arbeitsagentur.de/jobsuche/pd/profil/vormerkungen*
// @run-at document-end
// ==/UserScript==

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

  /** @type {Job[]} */
  let notAvailable = [...document.querySelectorAll("jb-job-listen-eintrag")]
    .filter(x => x.textContent.includes("Stelle nicht mehr"))
    .map(x => ({
      "Hauptberuf": x.querySelector(".oben").textContent,
      "Titel": x.querySelector("span.mitte-links-titel").textContent.trimEnd(1),
      "Arbeitgeber": x.querySelector(".mitte-links-arbeitgeber").textContent.trimStart(1).trimEnd(1),
      "Ort": x.querySelector(".mitte-links-ort").textContent.trimStart().trimEnd().replaceAll(/\(.*/g, ""),
      "Veröffentlichung": x.querySelector(".unten-datum").textContent.trimStart(1).trimEnd(1),
      "Extern": x.querySelector(".mitte-rechts").querySelector("span") !== null ? true : false,
    }));

  let available = [...document.querySelectorAll("jb-job-listen-eintrag")]
    .filter(x => !x.textContent.includes("Stelle nicht mehr"))
    .map(x => ({
      "Hauptberuf": x.querySelector(".oben").textContent,
      "Titel": x.querySelector("span.mitte-links-titel").textContent.trimEnd(1),
      "Arbeitgeber": x.querySelector(".mitte-links-arbeitgeber").textContent.trimStart(1).trimEnd(1),
      "Ort": x.querySelector(".mitte-links-ort").textContent.trimStart().trimEnd().replaceAll(/\(.*/g, ""),
      "Veröffentlichung": x.querySelector(".unten-datum").textContent.trimStart(1).trimEnd(1),
      "URL": x.querySelector("a").href,
      "Extern": x.querySelector(".mitte-rechts").querySelector("span") !== null ? true : false,
    }));


  favCounter.innerHTML = `
    <Button>Aktuell verfügbar: ${available.length}</Button>
    <Button>Nicht mehr verfügbar: ${notAvailable.length}</Button>
  `;
  tabbar.after(favCounter);


  var exelStr = notAvailable.flatMap(job => job.Titel + ";" + job.Arbeitgeber + ";" + job.Extern).join("\n")

  favCounter.children[0].onclick = function () {
    let availableJobs = [...document.querySelectorAll("jb-job-listen-eintrag")]
      .filter(x => !x.textContent.includes("Stelle nicht mehr"));
    let isHidden = availableJobs[0].hidden;

    if (isHidden){
      availableJobs.forEach(job => job.hidden = false);
    } else {
      availableJobs.forEach(job => job.hidden = true);
    }

    navigator.clipboard.writeText(JSON.stringify(available));
  }
  favCounter.children[1].onclick = function () {
    let NotAvailableJobs = [...document.querySelectorAll("jb-job-listen-eintrag")]
      .filter(x => x.textContent.includes("Stelle nicht mehr"));
    let isHidden = NotAvailableJobs[0].hidden;

    if (isHidden){
      NotAvailableJobs.forEach(job => job.hidden = false);
    } else {
      NotAvailableJobs.forEach(job => job.hidden = true);
    }

   navigator.clipboard.writeText(exelStr);
  }
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