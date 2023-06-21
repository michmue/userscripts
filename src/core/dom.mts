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

function getLeafsByType(leafs: HTMLElement[]): null | [number, HTMLElement[]][] {
    let leafTypes = new Map<string, HTMLElement[]>;
    for (let leaf of leafs) {
        let type = leaf.nodeName;
        if (leafTypes.has(type)) {
            let newVar = leafTypes.get(type)!;
            newVar.push(leaf as HTMLElement);
        } else {
            leafTypes.set(type, [leaf as HTMLElement])
        }
    }

    let tuples : [number, HTMLElement[]][] = [];
    for (let leafType of leafTypes) {
        let value = leafType[1];
        let length = value.length;
        tuples.push([length, value]);
    }

    return tuples.length == 0 ? null : tuples;

}

export function mostListProbability(tree: HTMLElement) {
    let treeMap = TreeMap(tree);//.sort((a, b) => a[0] - b[0]);

    for (let map of treeMap) {

        let key = map[0];
        let list = map[1];

        let filtered = list.filter(value => value.id.includes("answer-"));
        if (filtered.length > 0) {
            console.debug(`${key}`);
            console.log(filtered);
            console.log(filtered[1]?.getBoundingClientRect().toJSON());
        }
    }
}


export function TreeMap(tree: HTMLElement) : [number,HTMLElement[]][] {
    let maps: [number,HTMLElement[]][] = [];
    for (let treeTraversalElement of treeTraversal(tree)) {

        maps.push([treeTraversalElement[0], treeTraversalElement[1]]);
    }

    return maps;
}

function treeTraversal(tree: HTMLElement, collection: [number,HTMLElement[]][] = []): [number,HTMLElement[]][] {

    let leafs = Array.from(tree.children).map(value => value as HTMLElement);

    let leafsByType = getLeafsByType(leafs);
    if (leafsByType) {
        for (let leafsByTypeElement of leafsByType) {
            let key = leafsByTypeElement[0];
            collection.push([key, leafsByTypeElement[1]]);
        }
    }

    for (let leaf of leafs) {
        treeTraversal(leaf as HTMLElement, collection);
    }

    return collection;
}


