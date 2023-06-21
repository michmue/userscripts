export function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function event(event: string, selector: string) {
    let e = document.querySelector(selector);
    let events = undefined;
    while (events === undefined) {
        await sleep(1);
        // @ts-ignore
        events = unsafeWindow['$']._data(e).events
    }

    return events[event] !== undefined
}

export declare type RejectCondition = () => boolean;

export async function element(selector: string, target = document.documentElement, rejectCondition: RejectCondition = () => {return false}) {
    let e = document.querySelector(selector);
    if (e) {
        return e as HTMLElement;
    }

    return new Promise<HTMLElement>((resolve, reject) => {
        new MutationObserver((mutations, observer) => {
            let e = document.querySelector(selector);
            if (e) {
                resolve(e as HTMLElement);
                observer.disconnect()
            }

            if (rejectCondition()) {
                console.debug(`rejected ${selector}`);
                reject();
                observer.disconnect();
            }
        }).observe(target, {
            childList: true,
            subtree: true
        })
    });
}