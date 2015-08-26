////
//// A more realistic example.
////

var assert = require('chai').assert;
var us = require('underscore');
var each = us.each;

describe('use of apply()', function(){

    it('test', function(){

	var pup_tent = require('..')(['tests/rsrc3']);
	assert.ok(pup_tent, 'constructor okay');

	var a = pup_tent.apply('content.tmpl', {content: 'foo'});
	assert.equal(a, 'foo',  "content only");
	//console.log('html (a): ', a);

    });
});

describe('short use of render()', function(){

    it('test', function(){

	var pup_tent = require('..')(['tests/rsrc3']);
	assert.ok(pup_tent, 'constructor okay');

	var s = pup_tent.render('content.tmpl', {content: 'foo'});
	assert.equal(s, 'foo',  "content only");
	//console.log('html (s): ', s);

	// Try again using full pathing.
	var f = pup_tent.render('tests/rsrc3/content.tmpl', {content: 'foo'});
	assert.equal(f, 'foo',  "content only (full)");

    });
});

describe('long use of render()', function(){

    it('test', function(){

	var pup_tent = require('..')(['tests/rsrc3']);
	assert.ok(pup_tent, 'constructor okay');

	var l = pup_tent.render('content.tmpl',
				{content: 'bar', title: 'foo'},
				'frame.tmpl');
	// console.log('html (l):\n', l);
	var expected = [
    	    '<html>',
    	    '  <head>',
    	    '    <title>foo</title>',
    	    '  </head>',
    	    '  <body>',
    	    '  bar',
    	    '  </body>',
    	    '</html>',
    	    ''
	];
	var e = expected.join("\n");
	// console.log('html (e):\n', e);
	// console.log('html (l):', l.length);
	// console.log('html (e):', e.length);
	assert.equal(l.length, e.length,  "inner and outer template lengths");
	assert.equal(l, e,  "inner and outer templates");
	
    });
});

describe('usual use of render()', function(){

    it('test', function(){

	var pup_tent = require('..')(['tests/rsrc3']);
	assert.ok(pup_tent, 'constructor okay');

	pup_tent.set_common('js_vars', {'name': 'foo', 'value': 'bar'});
	pup_tent.set_common('js_libs', 'foo.js');
	pup_tent.set_common('css_libs', 'bar.css');
	var u = pup_tent.render('content.tmpl',
				{content: 'bar', title: 'foo',
				 'pup_tent_js_libraries': ['App.js']},
				'frame.tmpl');
	// console.log('html (u):\n', u);
	var expected = [
    	    '<html>',
    	    '  <head>',
    	    '    <title>foo</title>',
	    '    <link rel="stylesheet" type="text/css" href="bar.css">',
	    '    <script type="text/javascript">var foo = "bar";</script>',
	    '    <script type="text/javascript" src="foo.js"></script>',
	    '    <script type="text/javascript" src="App.js"></script>',
    	    '  </head>',
    	    '  <body>',
    	    '  bar',
    	    '  </body>',
    	    '</html>',
	    ''
	];
	var e = expected.join("\n");
	// console.log('html (e):\n', e);
	// console.log('html (u):', u.length);
	// console.log('html (e):', e.length);
	assert.equal(u.length, e.length,  "inner and outer template lengths");
	assert.equal(u, e,  "inner and outer templates");
	
	// And let's give it a spin with full paths.
	var f = pup_tent.render('tests/rsrc3/content.tmpl',
				{content: 'bar', title: 'foo',
				 'pup_tent_js_libraries': ['App.js']},
				'tests/rsrc3/frame.tmpl');
	assert.equal(f, e,  "inner and outer templates (full)");
    });
});

describe('playing with the caching mechanism off: use_cache_p()', function(){

    it('test', function(){

	var pup_tent = require('..')(['tests/rsrc3']);
	assert.ok(pup_tent, 'constructor okay, no cache call yet');

	assert.equal(true, pup_tent.use_cache_p(),
		     "default is to use the cache");
	pup_tent.use_cache_p(false);
	assert.equal(false, pup_tent.use_cache_p(), "caching now off");

	var s = pup_tent.render('content.tmpl', {content: 'foo'});
	assert.equal(s, 'foo',  "content only, using a filesystem re-read");
	//console.log('html (s): ', s);

	// ...and use full path.
	var f = pup_tent.render('tests/rsrc3/content.tmpl', {content: 'foo'});
	assert.equal(f, 'foo',  "content only, using a filesystem re-read (full)");
	//console.log('html (s): ', s);

    });
});
