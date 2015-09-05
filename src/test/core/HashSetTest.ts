/// <reference path="../../../typings/mocha/mocha.d.ts"/>
/// <reference path="../../../typings/node/node.d.ts"/>
/// <reference path="../../../typings/assert/assert.d.ts"/>

import { XHashSet } from "../../main/core/Iterable";
import { CorePromise as Promise } from "core-promise";
import assert = require("assert");

describe("HashSet", function() {
	it("should behave like a set, removing duplicates", function() {
		var s = new XHashSet<string>();

		s.addAll(["1", "2", "3", "1", "2"]);

		assert.equal(3, s.size());
		assert.ok(s.contains("2"));
		assert.ok(s.contains("1"));
		assert.ok(s.contains("3"));
		assert.ok(!s.contains("0"));
		assert.ok(!s.contains("4"));
	});
});