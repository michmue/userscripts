async function* foo() {
    yield new Promise<boolean>((resolve, reject) => {

    });
    yield new Promise<boolean>((resolve, reject) => {

    })
}

(async function() {
    for await (const num of foo()) {


        console.log(num);
        // Expected output: 1

        break; // Closes iterator, triggers return
    }


})();


export class PromiseBuilder<T> {
    constructor(promises: Promise<T>[]) {
        this.promises = promises;
    }
    promises : Promise<T>[]

    async chain() : Promise<void> {
        let newVar = await Promise.race(this.promises);
        Promise.
    }
}