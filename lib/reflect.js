var Iterable_1 = require('./Iterable');
/**
* <p>Utilities for "reflection" in JavaScript, for example returning the function name
* from a function object.</p>
*/
/**
* Return the function name from a function object.
* @param f
* @returns {*}
*/
function functionName(f) {
    return /^function\s*(.*?)\(/.exec(f.toString())[1];
}
exports.functionName = functionName;
/**
* Return all the functions that are present into the given object.
* @param obj
*/
function functions(obj) {
    var key, result = new Iterable_1.XHashMap();
    for (key in obj) {
        if (typeof (obj[key]) === "function") {
            result.put(key, obj[key]);
        }
    }
    return result;
}
exports.functions = functions;
/**
* Returns a list with the names of the arguments for the given method, in the
* order they were declared.
*/
function argumentNames(f) {
    var paramsString = /^function\s*.*?\((.*?)\)/.exec(f.toString())[1];
    var argumentNames = !!paramsString ? paramsString.split(/\s*,\s*/) : [];
    return Iterable_1.list(argumentNames);
}
exports.argumentNames = argumentNames;
/**
 * Calls the given function as a constructor with the given arguments.
 * @param clazz
 * @param args
 * @returns {F}
 */
function create(clazz, args) {
    function F() {
        clazz.apply(this, args.asArray());
    }
    F.prototype = clazz.prototype;
    return new F();
}
exports.create = create;
function invoke(f, args) {
    return f.apply(this, args.asArray());
}
exports.invoke = invoke;
//# sourceMappingURL=reflect.js.map