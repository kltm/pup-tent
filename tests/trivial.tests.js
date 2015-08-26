////
//// Some quick and dirty unit testing.
////

var assert = require('chai').assert;
var us = require('underscore');
var each = us.each;

describe('tests for explicit file mentions in the constructor', function(){

    it('first', function(){

	var pup_tent = require('..')(['tests/rsrc1', 'tests/rsrc2'],
				     ['trivial.tmpl']);
	
	assert.isDefined(pup_tent, 'constructor okay');
	
	//console.log(assert.equal(pup_tent.cached_list()));
	assert.equal(pup_tent.cached_list().length, 4, 'four items (a)');
	assert.equal(pup_tent.cached_list('all').length, 4, 'four items (b)');
	assert.equal(pup_tent.cached_list('flat').length, 1, 'one item (a)');
	assert.equal(pup_tent.cached_list('full').length, 1, 'one item (b)');
	assert.equal(pup_tent.cached_list('root').length, 2, 'two items (a)');
	
	assert.equal(pup_tent.get('foo'), null, 'nothing for foo');
	assert.equal(pup_tent.get('trivial.tmpl'), 'name: {{ name }}',
		     'tmpl string');
	
	assert.equal(pup_tent.apply('trivial.tmpl', {name: 1}),
		     'name: 1', 'name: 1');
	
    });
});

describe('trivial tests for file searching in the constructor', function(){

    it('first', function(){

	var pup_tent = require('..')(['tests/rsrc1', 'tests/rsrc2']);
	
	assert.ok(pup_tent, 'constructor okay');
	
	assert.equal(pup_tent.cached_list().length, 4, 'four items (a)');
	assert.equal(pup_tent.cached_list('all').length, 4, 'four items (b)');
	assert.equal(pup_tent.cached_list('flat').length, 1, 'one item (a)');
	assert.equal(pup_tent.cached_list('full').length, 1, 'one item (b)');
	assert.equal(pup_tent.cached_list('root').length, 2, 'two items (a)');
	
	assert.equal(pup_tent.get('foo'), null, 'nothing for foo');
	assert.equal(pup_tent.get('trivial.tmpl'), 'name: {{ name }}',
		     'tmpl string');
	
	assert.equal(pup_tent.apply('trivial.tmpl', {name: 1}),
		     'name: 1', 'name: 1');
    });
});

describe('recursive constructor', function(){

    it('find all files, non-recursive', function(){
    	var pup_tent = require('..')(['tests/rsrc3']);	
    	//console.log(pup_tent.cached_list());
    	assert.equal(pup_tent.cached_list().length, 8, 'two items x 4');
    });

    it('find all files, recursive', function(){
	var pup_tent = require('..')(['tests/rsrc3'], null, true);	
	//console.log(pup_tent.cached_list());
	assert.equal(pup_tent.cached_list().length, 12, 'three items x 4');
    });
});
