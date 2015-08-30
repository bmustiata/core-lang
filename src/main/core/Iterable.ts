/// <reference path="../../../node_modules/core-promise/core-promise.d.ts"/>

import { CorePromise as Promise } from 'core-promise';

export interface XIterator<T> {
    hasNext() : boolean;
    next() : T;
}

export class XIterable<T> {
    /**
     * <p>Get an iterator over the iterable, that will iterate over each element.</p>
     * @abstract
     */ 
    iterator() : XIterator<T> {
        throw new Error("Abstract method");
    }

    /**
     * <p>Iterates over each element executing the given function with the element
     * given as a parameter.</p>
     * @param f
     * @param thisParam
     * @returns {Iterable}
     */
    forEach( f: (it : T, index : number, iterable : XIterable<T>) => void, thisParam? : any ) : XIterable<T> {
        var it = this.iterator(),
            index = 0;

        while (it.hasNext()) {
            f.call(thisParam, it.next(), index++, this );
        }

        return this;
    }

    /**
     * Promise resolves all the elements from the current collection, then invokes the 
     * processing callback. Afterwards resolves again all the results from the callback
     * response, in order to guarantee that the result is actually just the resolved
     * values of the promises.
     * @param {(it: T, index: number, iterable: XIterable<T>) => void} f
     * @param {any?} thisParam
     * @return {Promise<XIterable<T>>}
     */ 
    forEachPromise(f: (it: T, index: number, iterable: XIterable<T>) => void, thisParam?: any): Promise<XIterable<T>> {
        return this.resolvePromises()
            .then(data => data.forEach(f, thisParam))
            .then(data => data.resolvePromises());
    }

    /**
     * <p>Creates a new iterable from the giving iterable, by transforming
     * each element via the function giving as argument.<p>
     * @param f
     * @param thisParam
     * @returns {Iterable<U>}
     */
    map<U>(f: (it: T, index: number, iterable: XIterable<T>) => U, thisParam?: any): XIterable<U>;
    map(f: (it: T, index: number, iterable: XIterable<T>) => any, thisParam?: any): XIterable<any> {
        var result = new XArrayList<any>();
        this.forEach((it, index, arr) => result.add( f.call(thisParam, it, index, arr)), thisParam);

        return result;
    }

    /**
     * <p>Creates a new iterable from the giving iterable, by transforming
     * each element via the function giving as argument, resolving the element with
     * the Promises, and also the result.<p>
     * @param f
     * @param thisParam
     * @returns {Iterable<U>}
     */
    mapPromise<U>(f: (it: T, index: number, iterable: XIterable<T>) => U, thisParam?: any): Promise<XIterable<U>>;
    mapPromise<U>(f: (it: T, index: number, iterable: XIterable<T>) => Promise<U>, thisParam?: any): Promise<XIterable<U>>;
    mapPromise(f: (it: T, index: number, iterable: XIterable<T>) => any, thisParam?: any): Promise<XIterable<any>> {
        return this.resolvePromises()
            .then(data => data.map(f, thisParam))
            .then(data => data.resolvePromises());
    }

    /**
     * Maps the current iterable with promises.
     */
    resolvePromises<T>(): Promise<XIterable<T>> {
        return this.map(Promise.resolve, Promise)
            .transform(c => Promise.all(c.asArray()))
            .then((data : Array<T>) => new XArrayList<T>().addAll(data));
    }

    /**
     * <p>Reduces the current iterable to an item that is returned by processing
     * the elements in the iterable using the given function.</p>
     * <p>If the initialValue is passed then reduce will iterate over each element.</p>
     * <p>If the initialValue is not passed, then the first element of the iterable
     * will be the initial value of the accumulator, and the callback function will be
     * called for each element, starting with the second element.</p>
     * @param f
     * @param initialValue
     * @returns {*}
     */
    reduce(f: (accumulator: T, item: T, index: number, iterable: XIterable<T>) => T, initialValue?: T) : T;
    reduce<TA>(f: (accumulator: TA, item: T, index: number, iterable: XIterable<T>) => T, initialValue?: TA): TA;
    reduce<TU>(f: (accumulator: TU, item: T, index: number, iterable: XIterable<T>) => TU, initialValue?: TU) : TU {
        var result,
            firstReached = false;

        if (typeof(initialValue) !== "undefined") {
            result = initialValue;
            firstReached = true;
        }

        this.forEach((it, index, iterable) => {
            if (firstReached) {
                result = f(result, it, index, iterable);
            } else {
                result = it;
                firstReached = true;
            }
        });

        return result;
    }

    /**
     * <p>Reduces the current iterable to an item that is returned by processing
     * the elements in the iterable using the given function, and resolving the promises from
     * the collection if they are existing.</p>
     * <p>If the initialValue is passed then reduce will iterate over each element.</p>
     * <p>If the initialValue is not passed, then the first element of the iterable
     * will be the initial value of the accumulator, and the callback function will be
     * called for each element, starting with the second element.</p>
     * @param f
     * @param initialValue
     * @returns {*}
     */
    reducePromise(f: (accumulator: T, item: T, index: number, iterable: XIterable<T>) => T, initialValue?: T): Promise<T>;
    reducePromise(f: (accumulator: T, item: T, index: number, iterable: XIterable<T>) => Promise<T>, initialValue?: T): Promise<T>;
    reducePromise<TA>(f: (accumulator: TA, item: T, index: number, iterable: XIterable<T>) => T, initialValue?: TA): Promise<TA>;
    reducePromise<TA>(f: (accumulator: TA, item: T, index: number, iterable: XIterable<T>) => Promise<T>, initialValue?: TA): Promise<TA>;
    reducePromise<TU>(f: (accumulator: TU, item: T, index: number, iterable: XIterable<T>) => TU, initialValue?: TU): Promise<TU> {
        return this.resolvePromises()
            .then(data => data.reduce(f, initialValue));
    }

    /**
     * <p>Filter all the items in the iterable, keeping only the ones where the
     * condition check via the function given passes.</p>
     * @param f
     * @returns {XIterable<T>}
     */
    filter (f : (it : T, index : number, iterable : XIterable<T>) => boolean, thisParam? : any) : XIterable<T>  {
        var result = new XArrayList<T>();

        this.forEach((it, index, iterable) => {
            if (f.call(thisParam, it, index, iterable)) {
                result.add(it);
            }
        }, thisParam);

        return result;
    }

    
    /**
     * <p>Filter all the items in the iterable, keeping only the ones where the
     * condition check via the function given passes.</p>
     * @param f
     * @returns {XIterable<T>}
     */
    filterPromise(f: (it: T, index: number, iterable: XIterable<T>) => boolean, thisParam?: any): Promise<XIterable<T>>;
    filterPromise(f: (it: T, index: number, iterable: XIterable<T>) => Promise < boolean>, thisParam?: any): Promise < XIterable < T >>;
    filterPromise(f: (it: T, index: number, iterable: XIterable<T>) => any, thisParam?: any): Promise<XIterable<T>> {
        var resolvedData;
        
        return this.resolvePromises() 
            .then(data => {
                resolvedData = data;
                return data.mapPromise(f);
            })
            .then(data => {
                var iterator = data.iterator();
                return resolvedData.filter(() => {
                    return iterator.next();
                }); 
            });
    }

    /**
     * Join multiple elements, eventually interceding the symbol.
     * @param symbol
     * @returns {T}
     */
    join(symbol? : string) : string {
        var result : string = "";
        symbol = typeof symbol !== "undefined" ? symbol : ",";

        this.forEach((it, index) => {
            if (index == 0) {
                result = ""  + it;
            } else {
                if (symbol) {
                    result = result + symbol + it;
                } else {
                    result = result + it;
                }
            }
        });

        return result;
    }

    /**
     * <p>Finds if there is at least one element in the iterable where f(it) is true.</p>
     * @param f
     * @param thisParam
     * @returns {boolean}
     */
    some(f : (it : T, index : number, arr : XIterable<T>) => boolean, thisParam? : any) : boolean {
        var iterator = this.iterator(),
            index = 0;

        while (iterator.hasNext()) {
            if (f.call(thisParam, iterator.next(), index++, this)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns true if the item is in the iterable.
     * @param item The items to search for in the iterable.
     */
    contains(item: T): boolean {
        return this.some(function (it) {
            return it === item;
        });
    }

    /**
     * Returns the first element where the condition matches.
     */
    findFirst(f: (it: T, index: number, arr: XIterable<T>) => boolean, thisParam?: any): T {
        var iterator = this.iterator(),
            index = 0,
            value;

        while (iterator.hasNext()) {
            value = iterator.next();
            if (f.call(thisParam, value, index++, this)) {
                return value;
            }
        }

        return null;
    }

    /**
     * Returns the current iterable as a native javascript array.
     * @returns {Array}
     */
    asArray() : Array<T> {
        var result = [];

        this.forEach(it => {
            result.push(it);
        });

        return result;
    }

    /**
     * Returns the first element from this iterable, or null if there is no item
     * in the collection..
     * @returns {T}
     */
    first() : T {
        var it = this.iterator();

        return it.hasNext() ? it.next() : null;
    }

    /**
     * Returns an interable that has all the elements, except the first element from
     * the iterable.
     */
    butFirst() : XIterable<T> {
        var data = this.asArray();
        data.shift();

        return new XArrayList<T>().addAll(data);
    }

    /**
     * Group all the items from this iterable into a map, using the returned value from the mapping function as a key.
     * @param mappingFunction
     */
    groupBy<V>( mappingFunction : (it : T, index: number, arr: XIterable<T>) => V) : XMap<V, XList<T>> {
        var map = new XHashMap<V, XList<T>>(),
            key : V,
            list : XList<T>;

        this.forEach((it, index, arr) => {
            key = mappingFunction(it, index, arr);
            list = map.get(key);

            if (!list) {
                list = new XArrayList<T>();
                map.put(key, list);
            }

            list.add(it);
        });

        return map;
    }

    /**
     * Calls the given function with the iterable itself as an argument, and returns the
     * result of the function.
     * @param f
     * @returns {V}
     */
    transform<V>( f : (self : XIterable<T>) => V ) : V {
        return f(this);
    }

    toString() : string {
        return "XIterable";
    }
}

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
    add( item : T ) :  XCollection<T> {
        throw new Error("Abstract method");
    }

    /**
     * <p>Adds all the elements from the collection given as a parameter into
     * this collection.</p>
     * @param {Collection<T>} items
     */
    addAll( items : Array<T> ) :  XCollection<T>;
    addAll( items : XIterable<T> ) :  XCollection<T>;
    addAll( items : any ) :  XCollection<T> {
        if (typeof items.forEach == 'function') {
            items.forEach(this.add, this);
        } else {
            for (var i = 0; i < items.length; i++) {
                this.add( items[i] );
            }
        }
        
        return this;
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

// //////////////////////////////////////////////////////////////////////////
// LIST /////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////

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

    add( o : T ) : XList<T> {
        this.storage.push(o);
        
        return this;
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

/**
 * A list that is wrapped over an existing array, and that will
 * perform all the operations on top of the initial array.
 */
export class XArrayListView<T> extends XArrayList<T> {
    constructor(data) {
        super(null);

        this.storage = data;
    }
}

// //////////////////////////////////////////////////////////////////////////
// SET //////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////

export class XSet<T> extends XCollection<T> {
}

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
    add( item : T ) : XHashSet<T> {
        this._storage[<any>item] = item;
        return this;
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

// //////////////////////////////////////////////////////////////////////////
// MAP //////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////

export class XMapEntry<K, V> {
    public constructor(public key : K,
                       public value: V)
    {
    }
}

export class XMap<K, V> extends XCollection<XMapEntry<K, V>> {
    add(x : any) : XMap<K, V> {
        throw new Error("Collection.add is not implemented on maps. Use map.put(key, value) instead.");
    }

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

// //////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS ////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////

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