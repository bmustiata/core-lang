import { XList } from './List';
import { XArrayList } from './ArrayList';
import { XMap } from './Map';
import { XHashMap } from './HashMap';

/**
 * Convert the given array like items object, into a List. This
 * will do a copy of the array. If you want to use the current
 * items object as the actual storage of the list, use the ArrayListView
 * class instead.
 * @param items
 */
export function list<T>(items: Array<T>): XList<T>;
export function list<T>(items: { length: number }): XList<T>;
export function list<T>(items: any): XList<any> {
    var result = new XArrayList<T>();

    for (var i = 0; i < items.length; i++) {
        result.add( items[i] );
    }

    return  result;
}

/**
 * Convert the given item into a XMap, using its keys as keys of the map.
 * @param item
 * @returns {HashMap<K, V>}
 */
export function map<K, V>(item : any) : XMap<K, V> {
    var k,
        result = new XHashMap<K, V>();

    for (k in item) {
        if (item.hasOwnProperty(k)) {
            result.put(k, item[k]);
        }
    }

    return result;
}

export function asArray<T>(item: any) : Array<T> {
    return item.asArray();
}