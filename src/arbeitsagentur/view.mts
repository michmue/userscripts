import {AgenturController} from "./controller.mjs";
import {Job} from "./models.mjs";

function createJsonTextInput(): HTMLInputElement {
    return document.createElement("Input") as HTMLInputElement;
}

export function renderView() {
    let filterElement = createFilterBar();
    insertCustomControl(filterElement);
}

function insertCustomControl(favFilter: HTMLElement) {
    let c = document.querySelector(".container-fluid")!;
    let ro = c.childNodes[4];

    c.insertBefore(favFilter, ro);
}

function createTextFilters() : [HTMLInputElement, HTMLInputElement] {
    let excludeCtrl = document.createElement("Input") as HTMLInputElement;
    excludeCtrl.placeholder = "Text Filter";

    let includeCtrl = document.createElement("Input") as HTMLInputElement;
    includeCtrl.placeholder = "Text Eingrenzen";

    excludeCtrl.onchange = () => AgenturController.filterJobs(excludeCtrl, includeCtrl);
    includeCtrl.onchange = () => AgenturController.filterJobs(excludeCtrl, includeCtrl);

    return [excludeCtrl, includeCtrl]
}

export function createFilterBar() : HTMLElement {

    let favFilter = document.createElement("favFilter");

    let filters = createTextFilters();
    let excludeCtrl = filters[0];
    let includeCtrl = filters[1];

    let btnToggleKnown = createBtnToggleKnown();
    let btnToggleFav = createBtnToggleFav();
    let btnExportVisible = createBtnExportVisible();
    let ipText = createJsonTextInput();
    let btnMarkKnown = createBtnMarkKnown(ipText);
    ipText.placeholder = "JSON Jobs";

    favFilter.appendChild(btnMarkKnown);
    favFilter.appendChild(btnToggleKnown);
    favFilter.appendChild(btnToggleFav);
    favFilter.appendChild(btnExportVisible);
    favFilter.appendChild(ipText);
    favFilter.appendChild(document.createElement("br"));
    favFilter.appendChild(excludeCtrl);
    favFilter.appendChild(includeCtrl);

    return favFilter;
}

function createBtnToggleFav() : HTMLButtonElement {
    let btnToggleFav = document.createElement("Button") as HTMLButtonElement;
    btnToggleFav.textContent = "Favoriten umschalten";

    btnToggleFav.onclick = () => {
        let jobs = [...document.querySelectorAll("button.ba-icon-favorite-full")];
        let hidden = jobs[0].parentElement!.hidden;
        if (hidden) {
            jobs.forEach(x => x.parentElement!.hidden = false);
        } else if (!hidden) {
            jobs.forEach(x => x.parentElement!.hidden = true);
        }
    };

    return btnToggleFav;
}

function createBtnExportVisible() : HTMLButtonElement{
    let btnExportVisible = document.createElement("Button") as HTMLButtonElement;
    btnExportVisible.textContent = "Sichtbare Jobs Exportieren";

    btnExportVisible.onclick = () => {
        let data = AgenturController.getAllJobs().filter(x => !x.Hidden);
        navigator.clipboard.writeText(JSON.stringify(data)).then();
    };
    return btnExportVisible;
}

function createBtnToggleKnown() : HTMLButtonElement {
    let btnToggleKnown = document.createElement("Button") as HTMLButtonElement;
    btnToggleKnown.textContent = "Bekannte umschalten";

    btnToggleKnown.onclick = () => {
        let jobsHtml = ([...document.querySelectorAll("jb-job-listen-eintrag")] as HTMLElement[])
            .filter(h => h.style.backgroundColor == 'grey');

        let hidden = jobsHtml[0].hidden;
        if (hidden) {
            jobsHtml.forEach(h => h.hidden = !hidden);
        }
    };

    return btnToggleKnown;
}

function createBtnMarkKnown(ipText: HTMLInputElement) : HTMLButtonElement {
    let btnMarkKnown = document.createElement("Button") as HTMLButtonElement;
    btnMarkKnown.textContent = "Bekannte hervorheben";
    btnMarkKnown.onclick = () => {
        let jobs = AgenturController.getAllJobs();
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

    return btnMarkKnown;
}

