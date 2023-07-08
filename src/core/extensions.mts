
declare global {
    interface ArrayConstructor {
        diffLeft<T>(leftArray: T[], rightArray: T[]): T[];
    }
}

if (!Array.diffLeft) {
    Array.diffLeft = function <T>(leftArray: T[], rightArray: T[]) {
        return leftArray.filter(value => !rightArray.includes(value));
    };
}
