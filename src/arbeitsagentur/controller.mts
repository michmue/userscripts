import {Job} from "./models.mjs";

import "../core/extensions.mjs";
import {JobListingView} from "./JobListingView.mjs";
import {FavoriteView} from "./FavoriteView.mjs";
import {element} from "../core/dom.mjs";

export class AgenturController {

    static async loadAllPages() {
        await element("#ergebnisliste-ladeweitere-button");
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
            .replace(', ', ',')
            .replace(' ,', ',')
            .toLowerCase()
            .split(",");

        if (containsExcludes[0] === "") containsExcludes.pop();

        let containsIncludes = includeCtrl.value
            .replace(', ', ',')
            .replace(' ,', ',')
            .toLowerCase()
            .split(",");

        if (containsIncludes[0] === "") containsIncludes.pop();


        let jobss = jobs.filter(value => true);
        if (containsExcludes.length > 0)
            jobss = jobss.filter((j, index) => {
                console.log("ex");
                let jobText = j.textContent!.toLowerCase();
                let hasTextToExclude = containsExcludes.some(word => jobText.includes(word));

                if ([0, 1, 2, 3, 4].includes(index)) {
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

    static renderJobListings() {
        JobListingView.renderView();
    }

    static renderFavorites() {
        FavoriteView.renderView()
    }
}