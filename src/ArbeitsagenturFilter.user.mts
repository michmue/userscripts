// ==UserScript==
// @name						Arbeitsagentur Filter
// @match
// @version          1.0
// @match						*://*.arbeitsagentur.de/jobsuche/suche*
// @match						*://*.arbeitsagentur.de/jobsuche/pd/profil/vormerkungen*
// @run-at document-end
// ==/UserScript==

import "./core/extensions.mjs";

class Job {
    Hauptberuf = "";
    Titel = "";
    Arbeitgeber = "";
    Entfernung = "";
    Ort = "";
    Veroeffentlichung = "";
    Extern: boolean | null = null;
    URL = "";

    static From(obj: {
        Hauptberuf: string,
        Titel: string,
        Arbeitgeber: string,
        Entfernung: string,
        Ort: string,
        Veroeffentlichung: string,
        Extern: boolean | null,
        URL: string
    }): Job {
        let job = new Job();
        job.Hauptberuf = obj.Hauptberuf;
        job.Titel = obj.Titel;
        job.Arbeitgeber = obj.Arbeitgeber;
        job.Entfernung = obj.Entfernung;
        job.Ort = obj.Ort;
        job.Veroeffentlichung = obj.Veroeffentlichung;
        job.Extern = obj.Extern;
        job.URL = obj.URL;
        return job;
    }

    static FromHTMLElement(htmlEle: HTMLElement): Job {
        let job = new Job();
        job.Hauptberuf = htmlEle.querySelector(".oben")!.textContent!;
        job.Titel = htmlEle.querySelector("span.mitte-links-titel")!.textContent!.trimEnd();
        job.Arbeitgeber = htmlEle.querySelector(".mitte-links-arbeitgeber")!.textContent!.trimStart().trimEnd();
        job.Entfernung = htmlEle.querySelector(".mitte-links-ort")!.textContent!.match(/\d+/)![0];
        job.Ort = htmlEle.querySelector(".mitte-links-ort")!.textContent!.trimStart().trimEnd().replace(/\(.*/g, "");
        job.Veroeffentlichung = htmlEle.querySelector(".unten-datum")!.textContent!.trimStart().trimEnd();
        job.URL = htmlEle.querySelector("a")!.href!;
        job.Extern = htmlEle.querySelector(".mitte-rechts")!.querySelector("span") !== null;
        return job;
    }

    static FromHTMLElements(htmlEles: HTMLElement[]): Job[] {
        let jobs: Job[] = [];

        htmlEles.forEach(htmlEle => {
            let job = Job.FromHTMLElement(htmlEle);
            jobs.push(job);
        });
        return jobs;
    }

    static equals(job1: Job, job2: Job) {
        return job1.Hauptberuf == job2.Hauptberuf &&
            job1.Titel == job2.Titel &&
            job1.Arbeitgeber == job2.Arbeitgeber &&
            job1.Entfernung == job2.Entfernung &&
            job1.Ort == job2.Ort &&
            job1.Extern == job2.Extern;
        //job1.URL == job2.URL;
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
        let b = document.querySelector("#ergebnisliste-ladeweitere-button") as HTMLElement;
        if (b) {
            b.click();
        } else {
            console.log("clear loadAllPages");
            clearInterval(inter);
        }
    }, 100);

}

function uiStatusFinished(callback: () => void) {
    let f = callback;
    let uistatusInverval = setInterval(() => {
        let e = document.querySelector("jb-suchergebnis-container") as HTMLElement;
        let ejobs = e.querySelectorAll("jb-job-listen-eintrag").length;
        if (e && ejobs > 0) {
            console.log("clearing interval");
            f();
            clearInterval(uistatusInverval);
        }
    }, 200);
}

function createUIFavCounter() {
    let tabbar = document.querySelector(".tabbar-container") as HTMLElement;
    let favCounter = document.createElement("favCounter");

    let notAvailable = ([...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[])
        .filter(x => x.textContent!.includes("Stelle nicht mehr"))
        .map(x => ({
            "Hauptberuf": x.querySelector(".oben")!.textContent,
            "Titel": x.querySelector("span.mitte-links-titel")!.textContent!.trimEnd(),
            "Arbeitgeber": x.querySelector(".mitte-links-arbeitgeber")!.textContent!.trimStart().trimEnd(),
            "Ort": x.querySelector(".mitte-links-ort")!.textContent!.trimStart().trimEnd().replace(/\(.*/g, ""),
            "Veroeffentlichung": x.querySelector(".unten-datum")!.textContent!.trimStart().trimEnd(),
            "Extern": x.querySelector(".mitte-rechts")!.querySelector("span") !== null,
        }));

    let available = ([...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[])
        .filter(x => !x.textContent!.includes("Stelle nicht mehr"))
        .map(x => ({
            "Hauptberuf": x.querySelector(".oben")!.textContent,
            "Titel": x.querySelector("span.mitte-links-titel")!.textContent!.trimEnd(),
            "Arbeitgeber": x.querySelector(".mitte-links-arbeitgeber")!.textContent!.trimStart().trimEnd(),
            "Ort": x.querySelector(".mitte-links-ort")!.textContent!.trimStart().trimEnd().replace(/\(.*/g, ""),
            "Veroeffentlichung": x.querySelector(".unten-datum")!.textContent!.trimStart().trimEnd(),
            "URL": x.querySelector("a")!.href,
            "Extern": x.querySelector(".mitte-rechts")!.querySelector("span") !== null,
        }));


    favCounter.innerHTML = `
    <Button>Aktuell verfügbar: ${available.length}</Button>
    <Button>Nicht mehr verfügbar: ${notAvailable.length}</Button>
  `;
    tabbar.after(favCounter);


    let exelStr = notAvailable.flatMap(job => job.Titel + ";" + job.Arbeitgeber + ";" + job.Extern).join("\n");

    (favCounter.children[0] as HTMLElement).onclick = function () {
        let availableJobs = ([...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[])
            .filter(x => !x.textContent!.includes("Stelle nicht mehr"));
        let isHidden = availableJobs[0].hidden;

        if (isHidden) {
            availableJobs.forEach(job => job.hidden = false);
        } else {
            availableJobs.forEach(job => job.hidden = true);
        }

        navigator.clipboard.writeText(JSON.stringify(available)).then();
    };

    (favCounter.children[1] as HTMLElement).onclick = function () {
        let NotAvailableJobs = ([...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[])
            .filter(x => x.textContent!.includes("Stelle nicht mehr"));
        let isHidden = NotAvailableJobs[0].hidden;

        if (isHidden) {
            NotAvailableJobs.forEach(job => job.hidden = false);
        } else {
            NotAvailableJobs.forEach(job => job.hidden = true);
        }

        navigator.clipboard.writeText(exelStr).then();
    }
}

function filterJobs(excludes: HTMLInputElement, includes:HTMLInputElement){
    let jobs = ([...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[]);

    let containsExcludes = excludes.value
        .replace(', ',',')
        .replace(' ,',',')
        .toLowerCase()
        .split(",");

    if (containsExcludes[0] === "") containsExcludes.pop();

    let containsIncludes = includes.value
        .replace(', ',',')
        .replace(' ,',',')
        .toLowerCase()
        .split(",");

    if (containsIncludes[0] === "") containsIncludes.pop();


    let jobss = jobs.filter(value => true);
    if (containsExcludes.length > 0)
        jobss = jobss.filter((j,index) => {
            console.log("ex");
            let jobText = j.textContent!.toLowerCase();
            let hasTextToExclude = containsExcludes.some(word => jobText.includes(word));

            if ([0,1,2,3,4].includes(index)) {
                        console.log(`${j.querySelector('.mitte-links-titel')!.textContent} filter: ${!hasTextToExclude}`);
                console.log(containsExcludes);
            }

            return !hasTextToExclude
        });

    if (containsIncludes.length > 0)
        jobss = jobss.filter(j => {
            console.log("inc");
            let jobText = j.textContent!.toLowerCase();
            let hasTextToInclude = containsIncludes.some(word => jobText.includes(word));
            return hasTextToInclude
        });

    if (containsIncludes.length > 0 || containsExcludes.length > 0) {
        console.log(jobss);
        jobss.forEach(j => j.hidden = false);
        Array.diffLeft(jobs, jobss).forEach(j => j.hidden = true);
    } else {
        jobs.forEach(j => j.hidden = false);
    }
}

function createUIFavFilter() {
    let c = document.querySelector(".container-fluid")!;
    let ro = c.childNodes[4];

    let favFilter = document.createElement("favFilter");

    let btnMarkKnown = document.createElement("Button");
    let btnToggleKnown = document.createElement("Button");
    let btnToggleFav = document.createElement("Button");
    let btnExportVisible = document.createElement("Button");
    let ipText = document.createElement("Input") as HTMLInputElement;
    ipText.placeholder = "JSON Jobs";

    let textFilter = document.createElement("Input") as HTMLInputElement;
    textFilter.placeholder = "Text Filter";

    let textInclude = document.createElement("Input") as HTMLInputElement;
    textInclude.placeholder = "Text Eingrenzen";

    btnToggleFav.textContent = "Favoriten umschalten";
    btnMarkKnown.textContent = "Bekannte hervorheben";
    btnToggleKnown.textContent = "Bekannte umschalten";
    btnExportVisible.textContent = "Sichtbare Jobs Exportieren";


    favFilter.appendChild(btnToggleFav);
    favFilter.appendChild(btnMarkKnown);
    favFilter.appendChild(btnToggleKnown);
    favFilter.appendChild(btnExportVisible);
    favFilter.appendChild(ipText);
    favFilter.appendChild(document.createElement("br"));
    favFilter.appendChild(textFilter);
    favFilter.appendChild(textInclude);


    btnToggleFav.onclick = () => {
        let jobs = [...document.querySelectorAll("button.ba-icon-favorite-full")];
        let hidden = jobs[0].parentElement!.hidden;
        if (hidden) {
            jobs.forEach(x => x.parentElement!.hidden = false);
        } else if (!hidden) {
            jobs.forEach(x => x.parentElement!.hidden = true);
        }
    };

    textFilter.onchange = ev => filterJobs(textFilter, textInclude);
    textInclude.onchange = ev => filterJobs(textFilter, textInclude);

    btnMarkKnown.onclick = () => {
        let jobs = getDataByFilter(() => true);
        let jobsFav = [...document.querySelectorAll("button.ba-icon-favorite-full")] as HTMLElement[];
        let jobsHtml = [...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[];
        let knownJobs = JSON.parse(ipText.value) as Job[];

        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            for (let j = 0; j < knownJobs.length; j++) {
                const kj = knownJobs[j];

                for (let k = 0; k < jobsFav.length; k++) {
                    const jobFav = jobsFav[k];
                    if (Job.equals(job, kj) && !Job.equals(Job.FromHTMLElement(jobFav), kj)) {
                        jobsHtml.at(i)!.style.backgroundColor = "grey";
                    }
                }
            }
        }
    };


    btnToggleKnown.onclick = () => {
        let jobsHtml = ([...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[])
            .filter(h => h.style.backgroundColor == 'grey');

        let hidden = jobsHtml[0].hidden;
        if (hidden) {
            jobsHtml.forEach(h => h.hidden = !hidden);
        }
    };


    btnExportVisible.onclick = () => {
        let data = getDataByFilter(x => x.hidden === false);
        navigator.clipboard.writeText(JSON.stringify(data)).then();
    };

    c.insertBefore(favFilter, ro);
}

function getDataByFilter(filter: (x: any) => boolean): Job[] {
    return [...document.querySelectorAll("jb-job-listen-eintrag")]
        .filter(x => filter(x))
        .map(x => {
            let job = new Job();
            job.Hauptberuf = x.querySelector(".oben")!.textContent!;
            job.Titel = x.querySelector("span.mitte-links-titel")!.textContent!.trimEnd();
            job.Arbeitgeber = x.querySelector(".mitte-links-arbeitgeber")!.textContent!.trimStart().trimEnd();
            job.Entfernung = x.querySelector(".mitte-links-ort")!.textContent!.match(/\d+/)![0];
            job.Ort = x.querySelector(".mitte-links-ort")!.textContent!.trimStart().trimEnd().replace(/\(.*/g, "");
            job.Veroeffentlichung = x.querySelector(".unten-datum")!.textContent!.trimStart().trimEnd();
            job.URL = x.querySelector("a")!.href!;
            job.Extern = x.querySelector(".mitte-rechts")!.querySelector("span") !== null;
            return job;
        });
}