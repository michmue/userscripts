export async function element(selector:string) {
    return new Promise<HTMLElement>(resolve => {
        let intervalId = setInterval(() => {
            console.debug(`waiting: ${selector}`);
            let ele = document.querySelector(selector) as HTMLElement;
            if (ele) {
                clearInterval(intervalId);
                resolve(ele);
            }
        }, 200);
    });
}


export class DOM {
    static async element2(selector:string , path:string) {
        return new Promise(resolve => {
            let intervalId = setInterval(() => {
                let ele = document.querySelector(selector);
                if (location.href.includes(path) && ele) {
                    clearInterval(intervalId);
                    resolve(ele);
                }
            }, 200);
        });
    }

    /**
     *
     * @returns {Promise<HTMLElement>}
     */
    static async element() {

    }


    /**
     *
     * @returns {Promise<HTMLElement>}
     */
    static async location(page: string) {

    }

    /**
     *
     * @returns {Promise<HTMLElement>}
     */
    static async OnPage(page: string) {
        // await location(page);

    }

    static async domainController() {
        let MAIN_DOMAIN = window.top === window.self;
        if (MAIN_DOMAIN) {
            // main();
        } else {
            // await mainSubDomain();
        }
    }

    static async main() {
        while (true) {
            // await this.OnPage(PLAYER_PAGE);
            // let p = await element('player');
            // p.click();
            //
            // let settings = await element('settings');
            // settings.click();
        }
    }

    static async mainSubDomain() {
        // let m4 = await element('.m4');
        // let p360 = m4.querySelector('div:last-child');
        // p360.click();
    }
}

// $ = document.querySelector;
// $$ = document.querySelectorAll;