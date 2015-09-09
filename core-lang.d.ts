declare module "core-promise"{
    /**
     * <p>A promise represents the eventual result of an asynchronous operation. The primary way
     * of interacting with a promise is through its then method, which registers callbacks to
     * receive either a promise’s eventual value or the reason why the promise cannot be fulfilled.</p>
     * <p>This implementation is fully compatible with the specification from: http://promisesaplus.com/,
     * and passes all the tests defined here: https://github.com/promises-aplus/promises-tests.</p>
     *
     * @inmodule "core-promise"
     */
    export class CorePromise<T> {
        private _state;
        private _value;
        private _followUps;
        /**
         * @param {object} executor A function with two parameters.
         */
        constructor(executor: (resolve: (value) => void, reject: (value) => void) => any);
        /**
         * Chain other callbacks to be executed after the promise gets resolved or rejected.
         * @param onFulfill
         * @param onReject
         * @returns {Promise}
         */
        then<V>(onFulfill?: (value: T) => CorePromise<V>, onReject?: (reason: any) => any): CorePromise<V>;
        then<V>(onFulfill?: (value: T) => V, onReject?: (reason: any) => any): CorePromise<V>;
        then<V>(onFulfill?: (value: T) => void, onReject?: (reason: any) => any): CorePromise<T>;
        /**
         * Chain other callbacks after the promise gets rejected.
         */
        catch<T>(onReject?: (reason: any) => any): CorePromise<T>;
        /**
         * Always permits adding some code into the promise chain that will be called
         * irrespective if the chain is successful or not, in order to be used similarily
         * with a finally block.
         * @param always
         */
        always(fn: Function): CorePromise<T>;
        /**
         * Resolve the given value, using the promise resolution algorithm.
         */
        static resolve(x: number): CorePromise<number>;
        static resolve(x: string): CorePromise<string>;
        static resolve(x: any): CorePromise<any>;
        /**
         * The Promise.all(iterable) method returns a promise that resolves when all of the promises
         * in the iterable argument have resolved.
         * @param {Array<Promise<any>>} args
         * @returns {Promise<Iterable<T>>}
         */
        static all<T>(iterable: Array<CorePromise<any>>): CorePromise<Array<T>>;
        /**
         * Create a new promise that is already rejected with the given value.
         */
        static reject<U>(reason: any): CorePromise<U>;
        /**
         * The Promise.race(iterable) method returns the first promise that resolves or
         * rejects from the iterable argument.
         * @param {Array<Promise<any>>} args
         * @returns {Promise<Iterable<T>>}
         */
        static race<T>(iterable: Array<CorePromise<any>>): CorePromise<Array<T>>;
        /**
         * Resolve a promise.
         * @param {Promise} promise     The promise to resolve.
         * @param {any} x               The value to resolve against.
         */
        private static resolvePromise<U>(promise, x);
        private static resolvePromise<U>(promise, x);
        private _transition(state, value);
        private _fulfill(value);
        private _reject(reason);
        private _notifyCallbacks();
    }

}
declare module 'core-lang/lib/Iterable' {
	/// <reference path="../node_modules/core-promise/core-promise.d.ts" />
	import { CorePromise as Promise } from 'core-promise';
	export interface XIterator<T> {
	    hasNext(): boolean;
	    next(): T;
	}
	export class XIterable<T> {
	    /**
	     * <p>Get an iterator over the iterable, that will iterate over each element.</p>
	     * @abstract
	     */
	    iterator(): XIterator<T>;
	    /**
	     * <p>Iterates over each element executing the given function with the element
	     * given as a parameter.</p>
	     * @param f
	     * @param thisParam
	     * @returns {Iterable}
	     */
	    forEach(f: (it: T, index: number, iterable: XIterable<T>) => void, thisParam?: any): XIterable<T>;
	    /**
	     * Promise resolves all the elements from the current collection, then invokes the
	     * processing callback. Afterwards resolves again all the results from the callback
	     * response, in order to guarantee that the result is actually just the resolved
	     * values of the promises.
	     * @param {(it: T, index: number, iterable: XIterable<T>) => void} f
	     * @param {any?} thisParam
	     * @return {Promise<XIterable<T>>}
	     */
	    forEachPromise(f: (it: T, index: number, iterable: XIterable<T>) => void, thisParam?: any): Promise<XIterable<T>>;
	    /**
	     * <p>Creates a new iterable from the giving iterable, by transforming
	     * each element via the function giving as argument.<p>
	     * @param f
	     * @param thisParam
	     * @returns {Iterable<U>}
	     */
	    map<U>(f: (it: T, index: number, iterable: XIterable<T>) => U, thisParam?: any): XIterable<U>;
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
	    /**
	     * Maps the current iterable with promises.
	     */
	    resolvePromises<T>(): Promise<XIterable<T>>;
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
	    reduce(f: (accumulator: T, item: T, index: number, iterable: XIterable<T>) => T, initialValue?: T): T;
	    reduce<TA>(f: (accumulator: TA, item: T, index: number, iterable: XIterable<T>) => T, initialValue?: TA): TA;
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
	    /**
	     * <p>Filter all the items in the iterable, keeping only the ones where the
	     * condition check via the function given passes.</p>
	     * @param f
	     * @returns {XIterable<T>}
	     */
	    filter(f: (it: T, index: number, iterable: XIterable<T>) => boolean, thisParam?: any): XIterable<T>;
	    /**
	     * <p>Filter all the items in the iterable, keeping only the ones where the
	     * condition check via the function given passes.</p>
	     * @param f
	     * @returns {XIterable<T>}
	     */
	    filterPromise(f: (it: T, index: number, iterable: XIterable<T>) => boolean, thisParam?: any): Promise<XIterable<T>>;
	    filterPromise(f: (it: T, index: number, iterable: XIterable<T>) => Promise<boolean>, thisParam?: any): Promise<XIterable<T>>;
	    /**
	     * Join multiple elements, eventually interceding the symbol.
	     * @param symbol
	     * @returns {T}
	     */
	    join(symbol?: string): string;
	    /**
	     * <p>Finds if there is at least one element in the iterable where f(it) is true.</p>
	     * @param f
	     * @param thisParam
	     * @returns {boolean}
	     */
	    some(f: (it: T, index: number, arr: XIterable<T>) => boolean, thisParam?: any): boolean;
	    /**
	     * Returns true if the item is in the iterable.
	     * @param item The items to search for in the iterable.
	     */
	    contains(item: T): boolean;
	    /**
	     * Returns the first element where the condition matches.
	     */
	    findFirst(f: (it: T, index: number, arr: XIterable<T>) => boolean, thisParam?: any): T;
	    /**
	     * Returns the current iterable as a native javascript array.
	     * @returns {Array}
	     */
	    asArray(): Array<T>;
	    /**
	     * Returns the first element from this iterable, or null if there is no item
	     * in the collection..
	     * @returns {T}
	     */
	    first(): T;
	    /**
	     * Returns an interable that has all the elements, except the first element from
	     * the iterable.
	     */
	    butFirst(): XIterable<T>;
	    /**
	     * Group all the items from this iterable into a map, using the returned value from the mapping function as a key.
	     * @param mappingFunction
	     */
	    groupBy<V>(mappingFunction: (it: T, index: number, arr: XIterable<T>) => V): XMap<V, XList<T>>;
	    /**
	     * Calls the given function with the iterable itself as an argument, and returns the
	     * result of the function.
	     * @param f
	     * @returns {V}
	     */
	    transform<V>(f: (self: XIterable<T>) => V): V;
	    toString(): string;
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
	    add(item: T): XCollection<T>;
	    /**
	     * <p>Adds all the elements from the collection given as a parameter into
	     * this collection.</p>
	     * @param {Collection<T>} items
	     */
	    addAll(items: Array<T>): XCollection<T>;
	    addAll(items: XIterable<T>): XCollection<T>;
	    /**
	     * <p>Removes the element from the collection.</p>
	     * @param item
	     */
	    remove(item: T): void;
	    /**
	     * <p>Returns the number of stored items in the collection.</p>
	     */
	    size(): number;
	    /**
	     * <p>Returns true if the collection has no elements.</p>
	     */
	    isEmpty(): boolean;
	}
	/**
	 * @abstract
	 */
	export class XList<T> extends XCollection<T> {
	    get(i: number): T;
	    indexOf(item: T): number;
	}
	/**
	 * An iterator specific to an array list.
	 */
	export class XArrayListIterator<T> implements XIterator<T> {
	    private list;
	    private index;
	    constructor(list: XArrayList<T>);
	    hasNext(): boolean;
	    next(): T;
	}
	/**
	 * ArrayList is a very effective implementation of a list that allows fast
	 * indexed access to its internal storage.
	 */
	export class XArrayList<T> extends XList<T> {
	    storage: any[];
	    constructor(items?: XIterable<T>);
	    iterator(): XIterator<T>;
	    add(o: T): XList<T>;
	    remove(o: T): void;
	    size(): number;
	    isEmpty(): boolean;
	    get(i: number): T;
	}
	/**
	 * A list that is wrapped over an existing array, and that will
	 * perform all the operations on top of the initial array.
	 */
	export class XArrayListView<T> extends XArrayList<T> {
	    constructor(data: any);
	}
	export class XSet<T> extends XCollection<T> {
	}
	export class XHashSetIterator<T> implements XIterator<T> {
	    private _values;
	    constructor(iteratedSet: XHashSet<T>);
	    hasNext(): boolean;
	    next(): T;
	}
	export class XHashSet<T> extends XSet<T> {
	    _storage: any;
	    constructor();
	    /**
	     * <p>Get an iterator over the collection, that will iterate over each element.</p>
	     * @abstract
	     */
	    iterator(): XIterator<T>;
	    /**
	     * Add the given element into the collection.
	     * @param {T} item Element to be added.
	     * @abstract
	     */
	    add(item: T): XHashSet<T>;
	    /**
	     * <p>Removes the element from the collection.</p>
	     * @param item
	     */
	    remove(item: T): void;
	    /**
	     * <p>Returns the number of stored items in the collection.</p>
	     */
	    size(): number;
	    /**
	     * <p>Returns true if the collection has no elements.</p>
	     */
	    isEmpty(): boolean;
	}
	export class XMapEntry<K, V> {
	    key: K;
	    value: V;
	    constructor(key: K, value: V);
	}
	export class XMap<K, V> extends XCollection<XMapEntry<K, V>> {
	    add(x: any): XMap<K, V>;
	    put(key: K, value: V): void;
	    get(key: K): V;
	    removeKey(key: K): V;
	    hasKey(key: K): boolean;
	    keys(): XIterable<K>;
	    values(): XIterable<V>;
	    entries(): XIterable<XMapEntry<K, V>>;
	    iterator(): XIterator<XMapEntry<K, V>>;
	    /**
	     * Returns the current map as an object, with its keys as properties of the object.
	     * @returns {Object}
	     */
	    asObject(): Object;
	}
	export class XHashMap<K, V> extends XMap<K, V> {
	    private _storage;
	    private _elementCount;
	    put(key: K, value: V): void;
	    get(key: K): V;
	    removeKey(key: K): V;
	    hasKey(key: K): boolean;
	    keys(): XIterable<K>;
	    values(): XIterable<V>;
	    entries(): XIterable<XMapEntry<K, V>>;
	    size(): number;
	}
	export class XLinkedHashMap<K, V> extends XHashMap<K, V> {
	    private orderedKeys;
	    put(key: K, value: V): void;
	    removeKey(key: K): V;
	    keys(): XIterable<K>;
	}
	/**
	 * Convert the given array like items object, into a List. This
	 * will do a copy of the array. If you want to use the current
	 * items object as the actual storage of the list, use the ArrayListView
	 * class instead.
	 * @param items
	 */
	export function list<T>(items: Array<T>): XList<T>;
	export function list<T>(items: {
	    length: number;
	}): XList<T>;
	/**
	 * Convert the given item into a XMap, using its keys as keys of the map.
	 * @param item
	 * @returns {HashMap<K, V>}
	 */
	export function map<K, V>(item: any): XMap<K, V>;
	export function asArray<T>(item: any): Array<T>;

}
declare module 'core-lang/lib/OnceMany' {
	import { XIterator } from 'core-lang/lib/Iterable';
	/**
	 * <p>A OnceMany will return the first element once when its next() method
	 * will be called, and from that moment on always return the other value.</p>
	 */
	export class OnceMany<T> implements XIterator<T> {
	    first: T;
	    allNext: T;
	    private firstPassed;
	    constructor(first: T, allNext: T);
	    hasNext(): boolean;
	    next(): T;
	}

}
declare module 'core-lang/lib/reflect' {
	import { XMap, XList, XIterable } from 'core-lang/lib/Iterable';
	/**
	* <p>Utilities for "reflection" in JavaScript, for example returning the function name
	* from a function object.</p>
	*/
	/**
	* Return the function name from a function object.
	* @param f
	* @returns {*}
	*/
	export function functionName(f: any): string;
	/**
	* Return all the functions that are present into the given object.
	* @param obj
	*/
	export function functions(obj: any): XMap<string, Function>;
	/**
	* Returns a list with the names of the arguments for the given method, in the
	* order they were declared.
	*/
	export function argumentNames(f: any): XList<string>;
	/**
	 * Calls the given function as a constructor with the given arguments.
	 * @param clazz
	 * @param args
	 * @returns {F}
	 */
	export function create<T>(clazz: ClassDefinition<T>, args: XIterable<any>): T;
	export function invoke(f: Function, args: XIterable<any>): any;
	export interface ClassDefinition<T> {
	    new (...any: any[]): T;
	    apply: Function;
	}

}
declare module 'core-lang/lib/stringUtils' {
	/**
	 * <p>Utilities functions for string manipulations.</p>
	 */
	/**
	 * A function that formats a String, using {0}, {1}, etc as arguments for formatting.
	 * @param format
	 * @param args
	 * @returns {string}
	 */
	export function format(format: string, ...args: any[]): string;

}
declare module 'core-lang' {
	import main = require('core-lang/lib/Iterable');
	export = main;
}
