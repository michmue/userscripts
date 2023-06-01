export class SPA {
    private PAGES;


    constructor(PAGES: any) {
        this.PAGES = PAGES;
    }

    async onLocation(page:string) {
        return new Promise<void>(resolve => {
            let locationChecker = setInterval(() => {
                console.log(`waiting: ${page}`);
                if (page === this.PAGES.INDEX
                    && location.href === page) {

                    clearInterval(locationChecker);
                    resolve();

                } else if (page !== this.PAGES.INDEX
                    && location.href.includes(page)) {

                    clearInterval(locationChecker);
                    resolve();
                }
            }, 200);
        });
    };

    async locationChange() {
        let loc = location.href;
        return new Promise<void>(resolve => {
            let locationChanger = setInterval(() => {
                console.log(`checking ${loc} !== ${location.href}`);
                if (loc !== location.href) {
                    resolve();
                    clearInterval(locationChanger);
                }
            }, 200);
        });
    }
}
