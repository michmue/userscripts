import {element} from "../core/dom.mjs";

export module FavoriteView {
    export function renderView() {
        createUIFavCounter();
    }

    async function createUIFavCounter() {
        let tabbar = await element(".tabbar-container");
        // let tabbar = document.querySelector(".tabbar-container") as HTMLElement;
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

}
