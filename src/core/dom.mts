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

export async function element(selector: string, target = document.documentElement) {
    let e = document.querySelector(selector);
    if (e)
        return e as HTMLElement;

    return new Promise<HTMLElement>(resolve => {
        new MutationObserver((mutations, observer) => {
            let e = document.querySelector(selector);
            if (e) {
                resolve(e as HTMLElement);
                observer.disconnect()
            }
        }).observe(target, {
            childList: true,
            subtree: true
        })
    });
}

let html = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<div>
    <div>
        <div>
            <div></div>
        </div>
    </div>
</div>
<div></div>
<div></div>
<div></div>
<div></div>
</body>
</html>
`;


function findAllNodesAtCurrentLevel(level: HTMLElement) {
    let map = new Map<string, ChildNode[]>;
    for (let childNode of level.childNodes) {
        let key = childNode.nodeName;
        if (map.has(key)) {
            let arr = map.get(key)!;
            arr.push(childNode);
        } else {
            map.set(key, [childNode]);
        }
    }

    return map;
}

function iterNextLevel(currLevel: HTMLElement) {
    for (const nextLevel of currLevel.childNodes) {
        findAllNodesAtCurrentLevel(nextLevel)
    }
}

function iterDocument() {
    let level = document.documentElement;
    iterNextLevel(level);
}

console.log(findAllNodesAtCurrentLevel(level));