import {element} from "../core/dom.mjs";
import {Job} from "./models.mjs";

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
            .map(x => Job.fromHTMLElement(x));

        let available = ([...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[])
            .filter(x => !x.textContent!.includes("Stelle nicht mehr"))
            .map(x => Job.fromHTMLElement(x));


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
