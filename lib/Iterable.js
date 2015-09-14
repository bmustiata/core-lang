/// <reference path="../../../node_modules/grunt-typescript/node_modules/typescript/bin/lib.es6.d.ts"/>
/// <reference path="../../../node_modules/core-promise/core-promise.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var core_promise_1 = require("core-promise");
var XIterable = (function () {
    function XIterable() {
    }
    /**
     * <p>Get an iterator over the iterable, that will iterate over each element.</p>
     * @abstract
     */
    XIterable.prototype.iterator = function () {
        throw new Error("Abstract method");
    };
    /**
     * <p>Iterates over each element executing the given function with the element
     * given as a parameter.</p>
     * @param f
     * @param thisParam
     * @returns {Iterable}
     */
    XIterable.prototype.forEach = function (f, thisParam) {
        var it = this.iterator(), index = 0;
        while (it.hasNext()) {
            f.call(thisParam, it.next(), index++, this);
        }
        return this;
    };
    /**
     * Promise resolves all the elements from the current collection, then invokes the
     * processing callback. Afterwards resolves again all the results from the callback
     * response, in order to guarantee that the result is actually just the resolved
     * values of the promises.
     * @param {(it: T, index: number, iterable: XIterable<T>) => void} f
     * @param {any?} thisParam
     * @return {Promise<XIterable<T>>}
     */
    XIterable.prototype.forEachPromise = function (f, thisParam) {
        return this.resolvePromises()
            .then(function (data) { return data.forEach(f, thisParam); })
            .then(function (data) { return data.resolvePromises(); });
    };
    XIterable.prototype.map = function (f, thisParam) {
        var result = new XArrayList();
        this.forEach(function (it, index, arr) { return result.add(f.call(thisParam, it, index, arr)); }, thisParam);
        return result;
    };
    XIterable.prototype.mapPromise = function (f, thisParam) {
        return this.resolvePromises()
            .then(function (data) { return data.map(f, thisParam); })
            .then(function (data) { return data.resolvePromises(); });
    };
    /**
     * Maps the current iterable with promises.
     */
    XIterable.prototype.resolvePromises = function () {
        return this.map(core_promise_1.DefaultPromise.resolve, core_promise_1.DefaultPromise)
            .transform(function (c) { return core_promise_1.DefaultPromise.all(c.asArray()); })
            .then(function (data) { return new XArrayList().addAll(data); });
    };
    XIterable.prototype.reduce = function (f, initialValue) {
        var result, firstReached = false;
        if (typeof (initialValue) !== "undefined") {
            result = initialValue;
            firstReached = true;
        }
        this.forEach(function (it, index, iterable) {
            if (firstReached) {
                result = f(result, it, index, iterable);
            }
            else {
                result = it;
                firstReached = true;
            }
        });
        return result;
    };
    XIterable.prototype.reducePromise = function (f, initialValue) {
        return this.resolvePromises()
            .then(function (data) { return data.reduce(f, initialValue); });
    };
    /**
     * <p>Filter all the items in the iterable, keeping only the ones where the
     * condition check via the function given passes.</p>
     * @param f
     * @returns {XIterable<T>}
     */
    XIterable.prototype.filter = function (f, thisParam) {
        var result = new XArrayList();
        this.forEach(function (it, index, iterable) {
            if (f.call(thisParam, it, index, iterable)) {
                result.add(it);
            }
        }, thisParam);
        return result;
    };
    XIterable.prototype.filterPromise = function (f, thisParam) {
        var resolvedData;
        return this.resolvePromises()
            .then(function (data) {
            resolvedData = data;
            return data.mapPromise(f);
        })
            .then(function (data) {
            var iterator = data.iterator();
            return resolvedData.filter(function () {
                return iterator.next();
            });
        });
    };
    /**
     * Join multiple elements, eventually interceding the symbol.
     * @param symbol
     * @returns {T}
     */
    XIterable.prototype.join = function (symbol) {
        var result = "";
        symbol = typeof symbol !== "undefined" ? symbol : ",";
        this.forEach(function (it, index) {
            if (index == 0) {
                result = "" + it;
            }
            else {
                if (symbol) {
                    result = result + symbol + it;
                }
                else {
                    result = result + it;
                }
            }
        });
        return result;
    };
    /**
     * <p>Finds if there is at least one element in the iterable where f(it) is true.</p>
     * @param f
     * @param thisParam
     * @returns {boolean}
     */
    XIterable.prototype.some = function (f, thisParam) {
        var iterator = this.iterator(), index = 0;
        while (iterator.hasNext()) {
            if (f.call(thisParam, iterator.next(), index++, this)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Returns true if the item is in the iterable.
     * @param item The items to search for in the iterable.
     */
    XIterable.prototype.contains = function (item) {
        return this.some(function (it) {
            return it === item;
        });
    };
    /**
     * Returns the first element where the condition matches.
     */
    XIterable.prototype.findFirst = function (f, thisParam) {
        var iterator = this.iterator(), index = 0, value;
        while (iterator.hasNext()) {
            value = iterator.next();
            if (f.call(thisParam, value, index++, this)) {
                return value;
            }
        }
        return null;
    };
    /**
     * Returns the current iterable as a native javascript array.
     * @returns {Array}
     */
    XIterable.prototype.asArray = function () {
        var result = [];
        this.forEach(function (it) {
            result.push(it);
        });
        return result;
    };
    /**
     * Returns the first element from this iterable, or null if there is no item
     * in the collection..
     * @returns {T}
     */
    XIterable.prototype.first = function () {
        var it = this.iterator();
        return it.hasNext() ? it.next() : null;
    };
    /**
     * Returns an interable that has all the elements, except the first element from
     * the iterable.
     */
    XIterable.prototype.butFirst = function () {
        var data = this.asArray();
        data.shift();
        return new XArrayList().addAll(data);
    };
    /**
     * Group all the items from this iterable into a map, using the returned value from the mapping function as a key.
     * @param mappingFunction
     */
    XIterable.prototype.groupBy = function (mappingFunction) {
        var map = new XHashMap(), key, list;
        this.forEach(function (it, index, arr) {
            key = mappingFunction(it, index, arr);
            list = map.get(key);
            if (!list) {
                list = new XArrayList();
                map.put(key, list);
            }
            list.add(it);
        });
        return map;
    };
    /**
     * Calls the given function with the iterable itself as an argument, and returns the
     * result of the function.
     * @param f
     * @returns {V}
     */
    XIterable.prototype.transform = function (f) {
        return f(this);
    };
    XIterable.prototype.toString = function () {
        return "XIterable";
    };
    return XIterable;
})();
exports.XIterable = XIterable;
/**
 * A Collection of items is an Iterable object that can hold zero or more other
 * objects, allowing items to be added and removed to it.
 */
var XCollection = (function (_super) {
    __extends(XCollection, _super);
    function XCollection() {
        _super.apply(this, arguments);
    }
    /**
     * Add the given element into the collection.
     * @param {T} item Element to be added.
     * @abstract
     */
    XCollection.prototype.add = function (item) {
        throw new Error("Abstract method");
    };
    XCollection.prototype.addAll = function (items) {
        if (typeof items.forEach == 'function') {
            items.forEach(this.add, this);
        }
        else {
            for (var i = 0; i < items.length; i++) {
                this.add(items[i]);
            }
        }
        return this;
    };
    /**
     * <p>Removes the element from the collection.</p>
     * @param item
     */
    XCollection.prototype.remove = function (item) {
        throw new Error("Abstract method");
    };
    /**
     * <p>Returns the number of stored items in the collection.</p>
     */
    XCollection.prototype.size = function () {
        throw new Error("Abstract method");
    };
    /**
     * <p>Returns true if the collection has no elements.</p>
     */
    XCollection.prototype.isEmpty = function () {
        throw new Error("Abstract method");
    };
    return XCollection;
})(XIterable);
exports.XCollection = XCollection;
// //////////////////////////////////////////////////////////////////////////
// LIST /////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////
/**
 * @abstract
 */
var XList = (function (_super) {
    __extends(XList, _super);
    function XList() {
        _super.apply(this, arguments);
    }
    XList.prototype.get = function (i) {
        throw new Error("Abstract method");
    };
    XList.prototype.indexOf = function (item) {
        var result = -1;
        this.some(function (it, index) {
            if (it === item) {
                result = index;
                return true;
            }
            return false;
        });
        return result;
    };
    return XList;
})(XCollection);
exports.XList = XList;
/**
 * An iterator specific to an array list.
 */
var XArrayListIterator = (function () {
    function XArrayListIterator(list) {
        this.index = 0;
        this.list = list;
    }
    XArrayListIterator.prototype.hasNext = function () {
        return this.index < this.list.storage.length;
    };
    XArrayListIterator.prototype.next = function () {
        return this.list.storage[this.index++];
    };
    return XArrayListIterator;
})();
exports.XArrayListIterator = XArrayListIterator;
/**
 * ArrayList is a very effective implementation of a list that allows fast
 * indexed access to its internal storage.
 */
var XArrayList = (function (_super) {
    __extends(XArrayList, _super);
    function XArrayList(items) {
        _super.call(this);
        this.storage = [];
        if (items) {
            this.addAll(items);
        }
    }
    XArrayList.prototype.iterator = function () {
        return new XArrayListIterator(this);
    };
    XArrayList.prototype.add = function (o) {
        this.storage.push(o);
        return this;
    };
    XArrayList.prototype.remove = function (o) {
        var index = this.indexOf(o);
        if (index < 0) {
            throw new Error("ArrayList doesn't contain item " + o);
        }
        this.storage.splice(index, 1);
    };
    XArrayList.prototype.size = function () {
        return this.storage.length;
    };
    XArrayList.prototype.isEmpty = function () {
        return this.storage.length == 0;
    };
    XArrayList.prototype.get = function (i) {
        return this.storage[i];
    };
    return XArrayList;
})(XList);
exports.XArrayList = XArrayList;
/**
 * A list that is wrapped over an existing array, and that will
 * perform all the operations on top of the initial array.
 */
var XArrayListView = (function (_super) {
    __extends(XArrayListView, _super);
    function XArrayListView(data) {
        _super.call(this, null);
        this.storage = data;
    }
    return XArrayListView;
})(XArrayList);
exports.XArrayListView = XArrayListView;
// //////////////////////////////////////////////////////////////////////////
// SET //////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////
var XSet = (function (_super) {
    __extends(XSet, _super);
    function XSet() {
        _super.apply(this, arguments);
    }
    return XSet;
})(XCollection);
exports.XSet = XSet;
var XHashSetIterator = (function () {
    function XHashSetIterator(iteratedSet) {
        this._values = [];
        for (var key in iteratedSet._storage) {
            this._values.push(key);
        }
    }
    XHashSetIterator.prototype.hasNext = function () {
        return this._values.length > 0;
    };
    XHashSetIterator.prototype.next = function () {
        return this._values.shift();
    };
    return XHashSetIterator;
})();
exports.XHashSetIterator = XHashSetIterator;
var XHashSet = (function (_super) {
    __extends(XHashSet, _super);
    function XHashSet() {
        _super.call(this);
        this._storage = {};
    }
    /**
     * <p>Get an iterator over the collection, that will iterate over each element.</p>
     * @abstract
     */
    XHashSet.prototype.iterator = function () {
        return new XHashSetIterator(this);
    };
    /**
     * Add the given element into the collection.
     * @param {T} item Element to be added.
     * @abstract
     */
    XHashSet.prototype.add = function (item) {
        this._storage[item] = item;
        return this;
    };
    /**
     * <p>Removes the element from the collection.</p>
     * @param item
     */
    XHashSet.prototype.remove = function (item) {
        delete this._storage[item];
    };
    /**
     * <p>Returns the number of stored items in the collection.</p>
     */
    XHashSet.prototype.size = function () {
        var count = 0;
        for (var key in this._storage) {
            count++;
        }
        return count;
    };
    /**
     * <p>Returns true if the collection has no elements.</p>
     */
    XHashSet.prototype.isEmpty = function () {
        var key;
        for (key in this._storage) {
            return false;
        }
        return true;
    };
    return XHashSet;
})(XSet);
exports.XHashSet = XHashSet;
// //////////////////////////////////////////////////////////////////////////
// MAP //////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////
var XMapEntry = (function () {
    function XMapEntry(key, value) {
        this.key = key;
        this.value = value;
    }
    return XMapEntry;
})();
exports.XMapEntry = XMapEntry;
var XMap = (function (_super) {
    __extends(XMap, _super);
    function XMap() {
        _super.apply(this, arguments);
    }
    XMap.prototype.add = function (x) {
        throw new Error("Collection.add is not implemented on maps. Use map.put(key, value) instead.");
    };
    XMap.prototype.put = function (key, value) {
        throw new Error("Abstract method");
    };
    XMap.prototype.get = function (key) {
        throw new Error("Abstract method");
    };
    XMap.prototype.removeKey = function (key) {
        throw new Error("Abstract method");
    };
    XMap.prototype.hasKey = function (key) {
        throw new Error("Abstract method");
    };
    XMap.prototype.keys = function () {
        throw new Error("Abstract method");
    };
    XMap.prototype.values = function () {
        throw new Error("Abstract method");
    };
    XMap.prototype.entries = function () {
        throw new Error("Abstract method");
    };
    XMap.prototype.iterator = function () {
        return this.entries().iterator();
    };
    /**
     * Returns the current map as an object, with its keys as properties of the object.
     * @returns {Object}
     */
    XMap.prototype.asObject = function () {
        var result = {};
        this.forEach(function (it) {
            result["" + it.key] = it.value;
        });
        return result;
    };
    return XMap;
})(XCollection);
exports.XMap = XMap;
var XHashMap = (function (_super) {
    __extends(XHashMap, _super);
    function XHashMap() {
        _super.apply(this, arguments);
        this._storage = {};
        this._elementCount = 0;
    }
    XHashMap.prototype.put = function (key, value) {
        var k = "" + key;
        if (!this._storage.hasOwnProperty(k)) {
            this._elementCount++;
        }
        this._storage[k] = value;
    };
    XHashMap.prototype.get = function (key) {
        var k = "" + key;
        return this._storage[k];
    };
    XHashMap.prototype.removeKey = function (key) {
        var k = "" + key;
        var result = this._storage[k];
        delete this._storage[k];
        this._elementCount--;
        return result;
    };
    XHashMap.prototype.hasKey = function (key) {
        var k = "" + key;
        return this._storage.hasOwnProperty(k);
    };
    XHashMap.prototype.keys = function () {
        var k, result = new XArrayList();
        for (k in this._storage) {
            result.add(k);
        }
        return result;
    };
    XHashMap.prototype.values = function () {
        var _this = this;
        return this.keys().map(function (k) {
            return _this.get(k);
        });
    };
    XHashMap.prototype.entries = function () {
        var _this = this;
        return this.keys().map(function (k) {
            return new XMapEntry(k, _this.get(k));
        });
    };
    XHashMap.prototype.size = function () {
        return this._elementCount;
    };
    return XHashMap;
})(XMap);
exports.XHashMap = XHashMap;
var XLinkedHashMap = (function (_super) {
    __extends(XLinkedHashMap, _super);
    function XLinkedHashMap() {
        _super.apply(this, arguments);
        this.orderedKeys = new XArrayList();
    }
    XLinkedHashMap.prototype.put = function (key, value) {
        if (!this.orderedKeys.contains(key)) {
            this.orderedKeys.add(key);
        }
        _super.prototype.put.call(this, key, value);
    };
    XLinkedHashMap.prototype.removeKey = function (key) {
        this.orderedKeys.remove(key);
        return _super.prototype.removeKey.call(this, key);
    };
    XLinkedHashMap.prototype.keys = function () {
        return this.orderedKeys;
    };
    return XLinkedHashMap;
})(XHashMap);
exports.XLinkedHashMap = XLinkedHashMap;
function list(items) {
    var result = new XArrayList();
    for (var i = 0; i < items.length; i++) {
        result.add(items[i]);
    }
    return result;
}
exports.list = list;
/**
 * Convert the given item into a XMap, using its keys as keys of the map.
 * @param item
 * @returns {HashMap<K, V>}
 */
function map(item) {
    var k, result = new XHashMap();
    for (k in item) {
        if (item.hasOwnProperty(k)) {
            result.put(k, item[k]);
        }
    }
    return result;
}
exports.map = map;
function asArray(item) {
    return item.asArray();
}
exports.asArray = asArray;
//# sourceMappingURL=Iterable.js.map