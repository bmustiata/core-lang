/// <reference path="../../../typings/mocha/mocha.d.ts"/>
/// <reference path="../../../typings/node/node.d.ts"/>
/// <reference path="../../../typings/assert/assert.d.ts"/>

import { list, XIterable, XIterator, XCollection, XList } from "../../main/core/Iterable";
import { DefaultPromise as Promise } from "core-promise";
import assert = require("assert");

describe('ArrayList', function() {
    it('should allow `filter`ing', function() {
        var items : XIterable<number> = list([1, 2, 3, 4]),
            filteredItems: XIterable<number>,
            iterator : XIterator<number>;

        filteredItems = items.filter(it => it % 2 == 0);
        iterator = filteredItems.iterator();
        
        assert.equal(iterator.next(), 2);
        assert.equal(iterator.next(), 4);
        assert.ok(!iterator.hasNext());
    });

    it('should allow `map`', function() {
        var items : XCollection<number> = list([1, 2, 3, 4]),
            squaredItems : XIterable<number>,
            iterator : XIterator<number>;

        squaredItems = items.map(it => it * it);
        iterator = squaredItems.iterator();

        assert.equal(iterator.next(), 1);
        assert.equal(iterator.next(), 4);
        assert.equal(iterator.next(), 9);
        assert.equal(iterator.next(), 16);
        assert.ok(!iterator.hasNext());
    });
    
    it('should allow `forEach`', function() {
        var items : XCollection<number> = list([1, 2, 3, 4]);

        items.forEach((it, index) => {
            assert.equal( index + 1, it);
        });
    });
    
    it('should allow `filter`/`map` chaining', function() {
        var items : XList<string> = list(["a", "b", "c"]),
            collected : XIterable<string>;

        collected = items.filter(it => {
            return /[ab]/.test(it)
        }).map(it => {
            return "'" + it + "'";
        });

        var iterator = collected.iterator();

        assert.ok(iterator.hasNext());
        assert.equal(iterator.next(), "'a'");

        assert.ok(iterator.hasNext());
        assert.equal(iterator.next(), "'b'");

        assert.ok(!iterator.hasNext());
    });
    
    it('should allow `join`', function() {
        var items : XList<string> = list(["a", "b", "c"]);

        assert.equal(items.join(), "a,b,c");
        assert.equal(items.join(""), "abc");
        assert.equal(items.join(", "), "a, b, c");
    });
    
    it('should allow `join`ing numbers', function() {
        var items : XList<number> = list([1, 2, 3, 4]);

        assert.equal(items.join(), "1,2,3,4");
        assert.equal(items.join(", "), "1, 2, 3, 4");
    });
    
    it('should allow `reduce`', function() {
        var items : XList<number> = list([1, 2, 3, 4]);

        assert.equal( items.reduce( (acc, it) => acc + it ), 10 );
        assert.equal( items.reduce( (acc, it) => acc + it, 5 ), 15 );
    });
    
    it('should allow `some`', function() {
        var items : XList<number> = list([1, 2, 3, 4]);

        assert.ok( ! items.some( x => x > 5 ) );
        assert.ok( items.some( x => x % 2 == 0 ) );
    });
    
    it('should allow `groupBy`', function() {
        var array1 : XIterable<number> = list([1,2,3,4]),
            map = array1.groupBy((it) => it % 2 ? "odd" : "even"); 

        assert.deepEqual(list([2, 4]), map.get("even"));
        assert.deepEqual(list([1, 3]), map.get("odd"));
        
        assert.equal(2, map.size());
    });
    
    it('should allow `mapPromise`', function() {
        var array1 = list([1, 2, 3, 4]);

        return array1.mapPromise((it : number) => {
            return Promise.resolve(it * it);
        }).then(data => {
            var iterator = data.iterator();
            
            assert.equal(iterator.next(), 1);
            assert.equal(iterator.next(), 4);
            assert.equal(iterator.next(), 9);
            assert.equal(iterator.next(), 16);
            
            assert.ok(!iterator.hasNext());
        });
    });
});
