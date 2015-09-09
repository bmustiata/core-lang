import { XMap, XHashMap, XList, XIterable, list } from './Iterable';

/**
* <p>Utilities for "reflection" in JavaScript, for example returning the function name
* from a function object.</p>
*/

/**
* Return the function name from a function object.
* @param f
* @returns {*}
*/
export function functionName(f : any) : string {
    return /^function\s*(.*?)\(/.exec(f.toString())[1];
}

/**
* Return all the functions that are present into the given object.
* @param obj
*/
export function functions(obj : any) : XMap<string, Function> {
    var key,
        result = new XHashMap<string, Function>();

    for (key in obj) {
        if (typeof(obj[key]) === "function") {
            result.put(key, obj[key]);
        }
    }

    return result;
}

/**
* Returns a list with the names of the arguments for the given method, in the
* order they were declared.         
*/
export function argumentNames(f : any) : XList<string> {
    var paramsString = /^function\s*.*?\((.*?)\)/.exec(f.toString())[1];
    var argumentNames = !!paramsString ? paramsString.split(/\s*,\s*/) : [];

    return list<string>(argumentNames);
}

/**
 * Calls the given function as a constructor with the given arguments.
 * @param clazz
 * @param args
 * @returns {F}
 */
export function create<T>(clazz: ClassDefinition<T>, args: XIterable<any>): T {
    function F() {
        clazz.apply(this, args.asArray());
    }

    F.prototype = clazz.prototype;

    return new F();
}

export function invoke(f : Function, args : XIterable<any>): any {
    return f.apply(this, args.asArray());
}

export interface ClassDefinition<T> {
    new(...any) : T;
    apply : Function;
}
