import {Job} from "./models.mjs";
import {renderView} from "./view.mjs";

import "../core/extensions.mjs";

if (location.pathname.includes("profil/vormerkungen")) {
    uiStatusFinished(() => {
        createUIFavCounter();
    });
} else if (location.pathname.includes("jobsuche/suche")) {
    uiStatusFinished(() => {
        loadAllPages();
        AgenturController.render();
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

export class AgenturController {
    static getAllJobs(): Job[] {
        return ([...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[])
            .map(j => {
                let job = new Job();

                job.Hauptberuf = j.querySelector(".oben")!
                    .textContent!;

                job.Titel = j.querySelector("span.mitte-links-titel")!
                    .textContent!
                    .trimEnd();

                job.Arbeitgeber = j.querySelector(".mitte-links-arbeitgeber")!
                    .textContent!
                    .trimStart()
                    .trimEnd();

                job.Entfernung = j.querySelector(".mitte-links-ort")!
                    .textContent!
                    .match(/\d+/)![0];

                job.Ort = j.querySelector(".mitte-links-ort")!
                    .textContent!
                    .trimStart()
                    .trimEnd()
                    .replace(/\(.*/g, "");

                job.Veroeffentlichung = j.querySelector(".unten-datum")!
                    .textContent!
                    .trimStart()
                    .trimEnd();

                job.URL = j.querySelector("a")!
                    .href!;

                job.Extern = j.querySelector(".mitte-rechts")!
                    .querySelector("span") !== null;

                job.Hidden = j.hidden;

                return job;
            });
    }

    static filterJobs(excludeCtrl: HTMLInputElement, includeCtrl: HTMLInputElement) {
        let jobs = ([...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[]);

        let containsExcludes = excludeCtrl.value
            .replace(', ',',')
            .replace(' ,',',')
            .toLowerCase()
            .split(",");

        if (containsExcludes[0] === "") containsExcludes.pop();

        let containsIncludes = includeCtrl.value
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
                let hasTextToInclude = containsIncludes.some((word) => jobText.includes(word));
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

    static render() {
        renderView()
    }
}