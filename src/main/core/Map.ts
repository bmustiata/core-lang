import { XCollection } from './Collection';
import { XIterable } from './Iterable';
import { XIterator } from './Iterator';

export class XMapEntry<K, V> {
    public constructor(public key : K,
                       public value: V)
    {
    }
}

export class XMap<K, V> extends XCollection<XMapEntry<K, V>> {
    put(key : K, value : V) : void {
        throw new Error("Abstract method");
    }

    get(key : K) : V {
        throw new Error("Abstract method");
    }

    removeKey(key : K) : V {
        throw new Error("Abstract method");
    }

    hasKey(key : K) : boolean {
        throw new Error("Abstract method");
    }

    keys() : XIterable<K> {
        throw new Error("Abstract method");
    }

    values() : XIterable<V> {
        throw new Error("Abstract method");
    }

    entries() : XIterable<XMapEntry<K, V>> {
        throw new Error("Abstract method");
    }

    iterator() : XIterator<XMapEntry<K, V>> {
        return this.entries().iterator();
    }

    /**
     * Returns the current map as an object, with its keys as properties of the object.
     * @returns {Object}
     */
    asObject() : Object {
        var result = {};

        this.forEach(function(it : XMapEntry<K, V>) {
            result["" + it.key] = it.value;
        });

        return result;
    }
}
