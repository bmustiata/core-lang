import { XMap, XMapEntry } from './Map';
import { XIterable } from './Iterable';
import { XArrayList } from './ArrayList';
import { XList } from './List';

export class XHashMap<K, V> extends XMap<K, V> {
    private _storage = {};
    private _elementCount = 0;

    put(key : K, value : V) : void {
        var k: string = "" + key;

        if (!this._storage.hasOwnProperty(k)) {
            this._elementCount++;
        }

        this._storage[k] = value;
    }

    get(key : K) : V {
        var k : string = "" + key;
        return this._storage[k];
    }

    removeKey(key : K) : V {
        var k : string = "" + key;

        var result = this._storage[k];

        delete this._storage[k];
        this._elementCount--;

        return result;
    }

    hasKey(key : K) : boolean {
        var k : string = "" + key;

        return this._storage.hasOwnProperty(k);
    }

    keys() : XIterable<K> {
        var k,
            result : XList<K> = new XArrayList<K>();

        for (k in this._storage) {
            result.add(<K> k);
        }

        return result;
    }

    values() : XIterable<V> {
        return this.keys().map(k => {
            return this.get(k);
        });
    }

    entries() : XIterable<XMapEntry<K, V>> {
        return this.keys().map(k => {
            return new XMapEntry(k, this.get(k));
        });
    }

    size() : number {
        return this._elementCount;
    }
}
