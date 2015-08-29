import { XIterator } from './Iterator';
import { XIterable } from './Iterable';
import { XList } from './List';

/**
 * An iterator specific to an array list.
 */
export class XArrayListIterator<T> implements XIterator<T> {
    private list : XArrayList<T>;
    private index = 0;

    constructor(list : XArrayList<T>) {
        this.list = list;
    }

    hasNext():boolean {
        return this.index < this.list.storage.length;
    }

    next():T {
        return this.list.storage[ this.index++ ];
    }
}

/**
 * ArrayList is a very effective implementation of a list that allows fast
 * indexed access to its internal storage.
 */
export class XArrayList<T> extends XList<T> {
    storage = [];

    constructor(items? : XIterable<T>) {
        super();

        if (items) {
            this.addAll( items );
        }
    }

    iterator() : XIterator<T> {
        return new XArrayListIterator(this);
    }

    add( o : T ) {
        this.storage.push(o);
    }

    remove(o: T) {
        var index = this.indexOf(o);

        if (index < 0) {
            throw new Error("ArrayList doesn't contain item " + o);
        }

        this.storage.splice(index, 1);
    }

    size() : number {
        return this.storage.length;
    }

    isEmpty() : boolean {
        return this.storage.length == 0;
    }

    get(i : number) : T {
        return this.storage[i];
    }
}
