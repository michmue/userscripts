export class Job {
    Hauptberuf = "";
    Titel = "";
    Arbeitgeber = "";
    Entfernung = "";
    Ort = "";
    Veroeffentlichung = "";
    Extern: boolean | null = null;
    URL = "";
    Hidden: boolean = false;

    static From(obj: {
        Hauptberuf: string,
        Titel: string,
        Arbeitgeber: string,
        Entfernung: string,
        Ort: string,
        Veroeffentlichung: string,
        Extern: boolean | null,
        URL: string,
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
        job.Hidden = false;
        return job;
    }

    static fromHTMLElement(htmlEle: HTMLElement): Job {
        let job = Job.fromFavoriteHTMLElement(htmlEle);
        job.Entfernung = htmlEle.querySelector(".mitte-links-ort")!.textContent!.match(/\d+/)![0];
        job.URL = htmlEle.querySelector("a")!.href!;
        return job;
    }
    static fromFavoriteHTMLElement(htmlEle: HTMLElement): Job {
        let job = new Job();

        job.Hauptberuf = htmlEle.querySelector(".oben")!.textContent!;
        job.Titel = htmlEle.querySelector("span.mitte-links-titel")!.textContent!.trimEnd();
        job.Arbeitgeber = htmlEle.querySelector(".mitte-links-arbeitgeber")!.textContent!.trimStart().trimEnd();
        job.Ort = htmlEle.querySelector(".mitte-links-ort")!.textContent!.trimStart().trimEnd().replace(/\(.*/g, "");
        job.Veroeffentlichung = htmlEle.querySelector(".unten-datum")!.textContent!.trimStart().trimEnd();
        job.Extern = htmlEle.querySelector(".mitte-rechts")!.querySelector("span") !== null;
        job.Hidden = htmlEle.hidden;
        job.Entfernung = "-1";
        job.URL = "";

        return job;
    }

    static FromHTMLElements(htmlEles: HTMLElement[]): Job[] {
        let jobs: Job[] = [];

        htmlEles.forEach(htmlEle => {
            let job = Job.fromHTMLElement(htmlEle);
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
