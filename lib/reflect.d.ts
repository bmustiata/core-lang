import { XMap, XList, XIterable } from './Iterable';
/**
* <p>Utilities for "reflection" in JavaScript, for example returning the function name
* from a function object.</p>
*/
/**
* Return the function name from a function object.
* @param f
* @returns {*}
*/
export declare function functionName(f: any): string;
/**
* Return all the functions that are present into the given object.
* @param obj
*/
export declare function functions(obj: any): XMap<string, Function>;
/**
* Returns a list with the names of the arguments for the given method, in the
* order they were declared.
*/
export declare function argumentNames(f: any): XList<string>;
/**
 * Calls the given function as a constructor with the given arguments.
 * @param clazz
 * @param args
 * @returns {F}
 */
export declare function create<T>(clazz: ClassDefinition<T>, args: XIterable<any>): T;
export declare function invoke(f: Function, args: XIterable<any>): any;
export interface ClassDefinition<T> {
    new (...any: any[]): T;
    apply: Function;
}
