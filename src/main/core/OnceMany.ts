import { XIterator } from './Iterable';

/**
 * <p>A OnceMany will return the first element once when its next() method
 * will be called, and from that moment on always return the other value.</p>
 */
export class OnceMany<T> implements XIterator<T> {
    private firstPassed = false;

    constructor(public first : T, public allNext : T) {
    }

    hasNext():boolean {
        return true;
    }

    next():T {
        if (this.firstPassed) {
            return this.allNext;
        }

        this.firstPassed = true;

        return this.first;
    }

}
