#!/usr/bin/env node
"use strict";

function parseCallExpression(astNode) {
	var id = getIdentifier(astNode.callee);
	if (!id || id.join('.') !== '$.t') {
		return;
	}
	var result = computeValue(astNode.arguments[0]);
	if (result && result.value !== '' && result.value != null){
		return {
			'string': result.value
		};
	}
}

function computeValue(astNode) {
	if (!astNode) {
		return;
	}
	if (astNode.type === 'Literal') {
		return {
			value: astNode.value
		};
	}
	if (astNode.type === 'BinaryExpression') {
		var left = computeValue(astNode.left);
		var right = computeValue(astNode.right);
		if (!left || !right) {
			return;
		}
		var newValue;
		switch (astNode.operator) {
			case '+':
				newValue = left.value + right.value;
				break;
			case '-':
				newValue = left.value - right.value;
				break;
			case '*':
				newValue = left.value * right.value;
				break;
			case '/':
				newValue = left.value / right.value;
				break;
		}
		return {
			value: newValue
		};
	}
}

function getIdentifier(astNode) {
	if (!astNode) {
		return;
	}
	if (astNode.type === 'Identifier') {
		return [astNode.name];
	}
	if (astNode.type === 'Literal') {
		return [astNode.value];
	}
	if (astNode.type === 'MemberExpression') {
		var left = getIdentifier(astNode.object);
		var right = getIdentifier(astNode.property);
		if (!left || !right) {
			return;
		}
		return [].concat(left, right);
	}
}

function extract(code) {
	if (typeof code !== 'string'){
		throw new TypeError('extract expects 1st argument to be a string');
	}

	var acorn = require('acorn/dist/acorn_loose');
	var ast = acorn.parse_dammit(code, {
		ecmaVersion: 6,
		allowReturnOutsideFunction: true,
		allowImportExportEverywhere: true,
		allowHashBang: true
	});

	var matched = [];

	function recurse(astNode) {
		if (astNode.type === 'CallExpression') {
			var result = parseCallExpression(astNode);
			if (result) {
				matched.push(result);
			}
		}
		for (var key in astNode) {
			if (astNode[key] && typeof astNode[key] === 'object') {
				recurse(astNode[key]);
			}
		}
	}

	recurse(ast);

	return matched;
}

module.exports.extract = extract;
