import { XCollection } from './Collection';

/**
 * @abstract
 */
export class XList<T> extends XCollection<T> {
    get(i : number) : T {
        throw new Error("Abstract method");
    }

    indexOf(item: T): number {
        var result = -1;

        this.some((it, index) => {
            if (it === item) {
                result = index;
                return true;
            }

            return false;
        });

        return result;
    }
}
