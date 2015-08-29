import { XHashMap } from './HashMap';
import { XArrayList } from './ArrayList';
import { XList  } from './List';
import { XIterable } from './Iterable';

export class XLinkedHashMap<K, V> extends XHashMap<K, V> {
    private orderedKeys: XList<K> = new XArrayList<K>();

    put(key: K, value: V): void {
        if (!this.orderedKeys.contains(key)) {
            this.orderedKeys.add(key);
        }

        super.put(key, value);
    }

    removeKey(key: K): V {
        this.orderedKeys.remove(key);
        return super.removeKey(key);
    }

    keys(): XIterable<K> {
        return this.orderedKeys;
    }
}
