let spa = null;
const PAGES = {
    'INDEX': 'https://hanime.tv/',
    'PLAYER': 'https://hanime.tv/videos/hentai/'
};

function init() {
    spa = new SPA(PAGES);
}


async function onPlayerDomain() {
    let setting = await element('button.vjs-control.vjs-button.vjs-icon-cog');
    setting.click();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function onTopDomain() {
    while (true) {
        await spa.onLocation(PAGES.PLAYER);
        await sleep(200);
        let player = await element('div.player.flex > div > div');
        player.click();

        let p360 = await element('div.htvssd-server.mt-4 > div:last-child');
        p360.click();
        player.click();
        console.log("await location change");
        await spa.locationChange();
        console.log("location changed");
    }
}

async function main() {
    spa = new SPA(PAGES);

    if (window.top === window.self) {
        onTopDomain();
    } else {
        onPlayerDomain();
    }
}

async function element(selector) {
    return new Promise(resolve => {
        let intervalId = setInterval(() => {
            console.log(`waiting: ${selector}`);
            let ele = document.querySelector(selector);
            if (ele) {
                clearInterval(intervalId);
                resolve(ele);
            }
        }, 200);
    });
}

class SPA {


    /**
     * @param {{PLAYER_PAGE: string, INDEX_PAGE: string}} pages
     */
    constructor(pages) {
        this.pages = pages;
    }

    /**
     * @return Promise<String>
     */
    async onLocation(page) {
        return new Promise(resolve => {
            let locationChecker = setInterval(() => {
                console.log(`waiting: ${page}`);
                if (page === PAGES.INDEX
                    && location.href === page) {

                    clearInterval(locationChecker);
                    resolve();

                } else if (page !== PAGES.INDEX
                    && location.href.includes(page)) {

                    clearInterval(locationChecker);
                    resolve();
                }
            }, 200);
        });
    };

    async locationChange() {
        let loc = location.href;
        return new Promise(resolve => {
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

init();
main();