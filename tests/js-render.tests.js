////
//// Rendering into an inline <script> block: values must not be able to
//// close it, and names must not be able to inject syntax.
//// See _js_literal and _js_identifier_p in lib/pup-tent.js.
////

var assert = require('chai').assert;
var pup_tent = require('pup-tent');

describe('inline script rendering', function () {

    var pt = pup_tent(['tests/rsrc3']);

    function render(value, name) {
	return pt.render('content.tmpl', {
	    'pup_tent_js_variables': [{name: name || 'global_test', value: value}]
	}, 'frame.tmpl');
    }

    // What the browser's JS parser would end up with.
    function value_of(out) {
	var m = out.match(/var global_test = ([\s\S]*?);<\/script>/);
	assert.isNotNull(m, 'variable should be rendered');
	return eval('(' + m[1] + ')');
    }

    describe('values cannot escape the block', function () {

	it('a closing tag in a string is neutralized', function () {
	    var out = render('</script><svg onload=alert(1)>');
	    assert.notInclude(out, '</script><svg');
	    assert.include(out, '\\u003c/script');
	});

	it('and inside an object', function () {
	    var out = render({evil: '</script><svg onload=alert(1)>'});
	    assert.notInclude(out, '</script><svg');
	});

	it('comment-like sequences are neutralized too', function () {
	    assert.notInclude(render('<!--'), '"<!--');
	});

	it('the rendered value is unchanged', function () {
	    assert.equal(value_of(render('</script>')), '</script>');
	    assert.equal(value_of(render('gomodel:12345')), 'gomodel:12345');
	    assert.equal(value_of(render('caf\u00e9 \u{1F600}')), 'caf\u00e9 \u{1F600}');
	});
    });

    describe('JS-source hazards that JSON does not cover', function () {

	it('line separators are escaped', function () {
	    var out = render('a\u2028b\u2029c');
	    assert.include(out, '\\u2028');
	    assert.include(out, '\\u2029');
	    assert.equal(value_of(out), 'a\u2028b\u2029c');
	});

	it('surrogates are escaped, so output survives transport', function () {
	    var out = render('\ud800');                  // lone surrogate
	    assert.include(out, '\\ud800');
	    assert.notMatch(out.split('global_test')[1].slice(0, 20), /[\ud800-\udfff]/);
	});
    });

    describe('unrepresentable values do not break the render', function () {

	it('an object whose toJSON returns undefined renders as null', function () {
	    var out = render({toJSON: function () { return undefined; }});
	    assert.include(out, 'var global_test = null;');
	});
    });

    describe('names are validated as identifiers', function () {

	it('a name carrying syntax is rejected', function () {
	    assert.throws(function () { render('ok', 'x;alert(1);var y'); },
			  /unusable JS variable name/);
	});

	it('ordinary names still work', function () {
	    assert.include(render('ok', 'global_barista_token'),
			   'var global_barista_token = "ok";');
	});
    });
});
