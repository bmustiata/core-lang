/// <reference path="../../../typings/mocha/mocha.d.ts"/>
/// <reference path="../../../typings/node/node.d.ts"/>
/// <reference path="../../../typings/assert/assert.d.ts"/>

import { map as createMap, list, XIterable, XIterator, XCollection, XList, XHashMap } from "../../main/core/Iterable";
import { CorePromise as Promise } from "core-promise";
import assert = require("assert");

describe("HashMap", function() {
	it("should allow `get`", function() {
		var map = new XHashMap<string, string>();

		map.put("test", "asd");
		assert.equal(map.get("test"), "asd");
	});
	
	it("should returng the right keys using `keys()`", function() {
		var map = createMap({
			"a" : 1,
			"b" : 2,
			"c" : 3
		});

		assert.equal(map.keys().join(), "a,b,c");
	});
	
	it("should return the right values using `values()`", function() {
		var map = createMap({
			"a" : 1,
			"b" : 2,
			"c" : 3
		});

		assert.equal(map.values().join(), "1,2,3");
	});
	
	it("should return the right entires using `entries()`", function() {
		var map = createMap({
			"a" : 1,
			"b" : 2,
			"c" : 3
		});

		assert.equal(map.entries()
				.map( e => e.key + ":" + e.value )
				.join(),
			"a:1,b:2,c:3"
		);
	});
	
	it("should not return keys, if the element with that key was removed", function() {
		var map = createMap({
			"a" : 1,
			"b" : 2,
			"c" : 3
		});

		assert.ok(map.hasKey("a"));
		assert.equal(map.removeKey("a"), 1);
		assert.ok(!map.hasKey("a"));
	});
	
	it("should get its `size()` changing, when removal or additions happen", function() {
		var map = createMap({
			"a": 1,
			"b": 2,
			"c": 3
		});

		assert.equal(3, map.size());
		map.put("a", 4);
		assert.equal(3, map.size());
		map.put("d", 5);
		assert.equal(4, map.size());
		map.removeKey("a");
		map.removeKey("d");
		assert.equal(2, map.size());
	});
});