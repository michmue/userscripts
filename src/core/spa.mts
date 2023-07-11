export class SPA {
    // private PAGES;
    private static loc: string;

    static {
        SPA.listenAndEmmitLocation();
    }

    constructor(/*PAGES: any*/) {
        // this.PAGES = PAGES;
    }


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


    static onLocationChance(callback: ((url:string) => void)){
        self.addEventListener('onLocationChance', e => {
            callback((e as CustomEvent).detail.path);
        });
    }
}
