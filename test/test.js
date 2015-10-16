#!/usr/bin/env node
/*global describe, it */
"use strict";

var assert = require('assert');
var txtract = require('../lib/main.js');

describe('Basic', function(){
	it('Should work with double quotes', function(){
		var str = '$.t("Hello");';
		var result = txtract.extract(str);
		var expected = [{
			string: "Hello"
		}];
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	});
	it('Should work with single quotes', function(){
		var str = "$.t('Hello');";
		var result = txtract.extract(str);
		var expected = [{
			string: "Hello"
		}];
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	});
	it('Should process unicode', function(){
		var str = '$.t("Привет");';
		var result = txtract.extract(str);
		var expected = [{
			string: "Привет"
		}];
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	});
	it('Should process invalid javascript', function(){
		var str = 'Я ИДИОТ УБЕЙТЕ МЕНЯ КТО-НИБУДЬ!!!!!\n$.t("Oh, hi!");';
		var result = txtract.extract(str);
		var expected = [{
			string: "Oh, hi!"
		}];
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	});
	it('Should glue strings up', function(){
		var str = '$.t("Oh, hi!" + 2 * 2);';
		var result = txtract.extract(str);
		var expected = [{
			string: "Oh, hi!4"
		}];
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	});
	it('Should process quirky linefeeds', function(){
		var str = '$.t("Oh, \\\nhi!");';
		var result = txtract.extract(str);
		var expected = [{
			string: "Oh, hi!"
		}];
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	});
	it('Should extract several values', function(){
		var str = '$.t("foo") + $.t("bar") / $.t("baz");';
		var result = txtract.extract(str);
		var expected = [
			{string: "foo"},
			{string: "bar"},
			{string: "baz"}
		];
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	});
	it('Should extract in any depth', function(){
		var str = '(function(){with({}) if (false) { $.t("Oh, hi!") };}()';
		var result = txtract.extract(str);
		var expected = [{
			string: "Oh, hi!"
		}];
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	});
});


describe('Context', function(){
	it('Should get context', function(){
		var str = '$.t("Hello", {"context": "world"});';
		var result = txtract.extract(str);
		var expected = [{
			string: "Hello",
			context: "world"
		}];
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	});
	it('Should get context if property is defained as Identifier', function(){
		var str = '$.t("Hello", {context: "world"});';
		var result = txtract.extract(str);
		var expected = [{
			string: "Hello",
			context: "world"
		}];
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	});
});
