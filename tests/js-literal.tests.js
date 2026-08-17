////
//// Values rendered into an inline <script> block must not be able to
//// close it. See _js_literal in lib/pup-tent.js.
////

var assert = require('chai').assert;
var pup_tent = require('pup-tent');

describe('js variables cannot escape the script block', function () {

    var pt = pup_tent(['tests/rsrc3']);

    function render(value) {
	return pt.render('content.tmpl', {
	    'pup_tent_js_variables': [{name: 'global_test', value: value}]
	}, 'frame.tmpl');
    }

    it('a string containing </script> is neutralized', function () {
	var out = render('</script><svg onload=alert(1)>');
	assert.notInclude(out, '</script><svg', 'must not emit a raw closing tag');
	assert.include(out, '\\u003c/script', 'the "<" must be escaped');
    });

    it('the same applies inside objects', function () {
	var out = render({evil: '</script><svg onload=alert(1)>'});
	assert.notInclude(out, '</script><svg');
	assert.include(out, '\\u003c/script');
    });

    it('ordinary values are unchanged', function () {
	var out = render('gomodel:12345');
	assert.include(out, '"gomodel:12345"');
    });

    it('line separators legal in JSON but not in JS are escaped', function () {
	var out = render('a\u2028b\u2029c');
	assert.include(out, '\\u2028');
	assert.include(out, '\\u2029');
    });
});
