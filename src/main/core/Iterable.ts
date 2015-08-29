import { Promise } from 'core-promise';
import { XIterator } from './Iterator';

import {list} from './collections';

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
        var result = new module.exports.XArrayList();
        this.forEach((it, index, arr) => result.add( f(it, index, arr)), thisParam);

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
            .then(list);
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

        return list(data);
    }

    /**
     * Group all the items from this iterable into a map, using the returned value from the mapping function as a key.
     * @param mappingFunction
     */
    groupBy<V>( mappingFunction : (it : T, index: number, arr: XIterable<T>) => V) : XMap<V, List<T>> {
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
