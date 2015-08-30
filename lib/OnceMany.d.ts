import { XIterator } from './Iterable';
/**
 * <p>A OnceMany will return the first element once when its next() method
 * will be called, and from that moment on always return the other value.</p>
 */
export declare class OnceMany<T> implements XIterator<T> {
    first: T;
    allNext: T;
    private firstPassed;
    constructor(first: T, allNext: T);
    hasNext(): boolean;
    next(): T;
}
