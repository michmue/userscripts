$ = document.querySelector;
$$ = document.querySelectorAll;

async function element2(selector, path) {
    let d = this;
    d.returnValue
        let intervalId = setInterval(() => {
            let ele = document.querySelector(selector);
            if (location.href.includes(path) && ele) {
                clearInterval(intervalId);
                d.return(ele)
            }
        }, 200);
}

await element2();

/**
 *
 * @returns {Promise<HTMLElement>}
 */
async function element() {

}

/**
 *
 * @returns {Promise<HTMLElement>}
 */
async function element() {

}


/**
 *
 * @returns {Promise<HTMLElement>}
 */
async function location(page) {

}

/**
 *
 * @returns {Promise<HTMLElement>}
 */
async function OnPage(page) {
    await location(page);

}

async function domainController() {
    let MAIN_DOMAIN = window.top === window.self;
    if (MAIN_DOMAIN) {
        main();
    } else {
        await mainSubDomain();
    }
}

async function main() {
    while (true) {
        await OnPage(PLAYER_PAGE);
        let p = await element('player');
        p.click();

        let settings = await element('settings');
        settings.click();
    }
}

async function mainSubDomain() {
    let m4 = await element('.m4');
    let p360 = m4.querySelector('div:last-child');
    p360.click();
}