/// <reference path="../../../typings/mocha/mocha.d.ts"/>
/// <reference path="../../../typings/node/node.d.ts"/>
/// <reference path="../../../typings/assert/assert.d.ts"/>

import { XMap, XLinkedHashMap } from "../../main/core/Iterable";
import { CorePromise as Promise } from "core-promise";
import assert = require("assert");

describe("LinkedHashSet", function() {
	it("should allow adding elements in order", function() {
		var map: XMap<string, string> = new XLinkedHashMap<string, string>();

		map.put("a", "a");
		map.put("b", "b");
		map.put("c", "c");
		map.put("d", "d");

		var expected = ["a", "b", "c", "d"];

		map.forEach((entry, index) => {
			assert.equal(expected[index], entry.key);
			assert.equal(expected[index], entry.value);
		});
	});
	
	it("should allow adding elements out of order", function() {
		var map: XMap<string, string> = new XLinkedHashMap<string, string>();

		map.put("b", "b");
		map.put("a", "a");
		map.put("d", "d");
		map.put("c", "c");

		var expected = ["b", "a", "d", "c"];

		map.forEach((entry, index) => {
			assert.equal(expected[index], entry.key);
			assert.equal(expected[index], entry.value);
		});
	});
	
	it("should allow adding and removal out of order", function() {
		var map: XMap<string, string> = new XLinkedHashMap<string, string>();

		map.put("a", "a");
		map.put("d", "d");
		map.put("c", "c");
		map.put("b", "b");
		map.removeKey("c");
		map.put("e", "e");

		var expected = ["a", "d", "b", "e"];

		map.forEach((entry, index) => {
			assert.equal(expected[index], entry.key);
			assert.equal(expected[index], entry.value);
		});
	})
});