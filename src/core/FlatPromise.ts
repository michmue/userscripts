import {log} from "util";

class FlatPromise<T> extends Promise<T>{
    _reject: any;
    _resolve: any;

    constructor(executor: (resolve: (value: (PromiseLike<T> | T)) => void,
                           reject: (reason?: any) => void) => void) {
        let __reject, __resolve;
        super((resolve, reject) => {
            __reject = resolve;
            __resolve = reject;
        });
        this._reject = __reject;
        this._resolve = __resolve;
        executor(this._resolve, this._reject);
    }

    reject(reason?: any): any {

    }

    resolve(value: (PromiseLike<T> | T)): void {

    }

}

async function main() {
    new FlatPromise((resolve,reject) => {
            reject("hi2");
            resolve("hi2");
            console.log("hi");
    }).then(value => console.log("hi3"))
        .catch(reason => console.log(reason));
}

main();
