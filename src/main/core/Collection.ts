import { XIterable } from 'Iterable';

/**
 * A Collection of items is an Iterable object that can hold zero or more other
 * objects, allowing items to be added and removed to it.
 */
export class XCollection<T> extends XIterable<T> {
    /**
     * Add the given element into the collection.
     * @param {T} item Element to be added.
     * @abstract
     */
    add( item : T ) : void {
        throw new Error("Abstract method");
    }

    /**
     * <p>Adds all the elements from the collection given as a parameter into
     * this collection.</p>
     * @param {Collection<T>} items
     */
    addAll( items : Array<T> ) : void;
    addAll( items : XIterable<T> ) : void;
    addAll( items : any ) : void {
        if (typeof items.forEach == 'function') {
            items.forEach(x => this.add(x));
        } else {
            for (var i = 0; i < items.length; i++) {
                this.add( items[i] );
            }
        }
    }

    /**
     * <p>Removes the element from the collection.</p>
     * @param item
     */
    remove(item : T) : void {
        throw new Error("Abstract method");
    }

    /**
     * <p>Returns the number of stored items in the collection.</p>
     */
    size() : number {
        throw new Error("Abstract method");
    }

    /**
     * <p>Returns true if the collection has no elements.</p>
     */
    isEmpty() : boolean {
        throw new Error("Abstract method");
    }
}
