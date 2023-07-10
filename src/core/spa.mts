export class SPA {
    // private PAGES;
    private static loc: string;

    static {
        SPA.listenAndEmmitLocation();
    }

    constructor(/*PAGES: any*/) {
        // this.PAGES = PAGES;
    }

    // async onLocation(page:string) {
    //     return new Promise<void>(resolve => {
    //         let locationChecker = setInterval(() => {
    //             console.log(`waiting: ${page}`);
    //             if (page === this.PAGES.INDEX
    //                 && location.href === page) {
    //
    //                 clearInterval(locationChecker);
    //                 resolve();
    //
    //             } else if (page !== this.PAGES.INDEX
    //                 && location.href.includes(page)) {
    //
    //                 clearInterval(locationChecker);
    //                 resolve();
    //             }
    //         }, 200);
    //     });
    // };

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

    static listenAndEmmitLocation() {
        new MutationObserver((mutations, observer) => {
            if (SPA.loc !== location.pathname) {
                SPA.loc = location.pathname;
                self.dispatchEvent(new CustomEvent<{
                    path: string
                }>('onLocationChance', {
                    detail: {path: SPA.loc}
                }))
            }
        }).observe(document.body, {
            childList: true,
            subtree: true
        })
    }

    async onLocationChance(): Promise<string> {
        return new Promise<string>(resolve => {
            self.addEventListener('onLocationChance', e => {
                let e1 = e as CustomEvent;
                console.log(e1.detail.path);
                resolve(e1.detail.path);
            }, {once: true});
        });
    }


}
