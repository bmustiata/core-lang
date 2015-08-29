import { XIterator } from './Iterator';
import { XSet } from './Set';

export class XHashSetIterator<T> implements XIterator<T> {
    private _values = [];


    constructor(iteratedSet : XHashSet<T>) {
        for (var key in iteratedSet._storage) {
            this._values.push(key);
        }
    }

    hasNext() : boolean {
        return this._values.length > 0;
    }

    next() : T {
        return this._values.shift();
    }
}

export class XHashSet<T> extends XSet<T> {
    _storage;

    constructor() {
        super();

        this._storage = {};
    }

    /**
     * <p>Get an iterator over the collection, that will iterate over each element.</p>
     * @abstract
     */
    iterator() : XIterator<T> {
        return new XHashSetIterator(this);
    }

    /**
     * Add the given element into the collection.
     * @param {T} item Element to be added.
     * @abstract
     */
    add( item : T ) : void {
        this._storage[<any>item] = item;
    }

    /**
     * <p>Removes the element from the collection.</p>
     * @param item
     */
    remove(item : T) : void {
        delete this._storage[<any>item];
    }

    /**
     * <p>Returns the number of stored items in the collection.</p>
     */
    size() : number {
        var count = 0;

        for (var key in this._storage) {
            count++;
        }

        return count;
    }

    /**
     * <p>Returns true if the collection has no elements.</p>
     */
    isEmpty() : boolean {
        var key;

        for (key in this._storage) {
            return false;
        }

        return true;
    }
}
