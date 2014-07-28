####
#### Testing and release procedures for Pup Tent.
####
#### See README.org in this directory for more detail.
####

TESTS = \
 $(wildcard lib/*.js.tests)

## Test JS environment.
TEST_JS = rhino
## Some tests require things like "-opt -1" in some cases (big GO tests).
## rhino needs this for the big GO tree in model.tests.go.js.
## Java BUG, so interpretation is forced.
## See: http://coachwei.sys-con.com/node/676073/mobile
#TEST_JS_FLAGS = -modules external/bbop.js -modules staging/bbopx.js -opt -1

## Other JS environments.
NODE_JS ?= /usr/bin/node

## Handle versioning. The patch level is automatically incremented on
## after every release.
# This is always alpha software--peg at 0.9 forever.
PUP_TENT_BASE_VERSION = 0.9
PUP_TENT_PATCH_LEVEL = `cat version-patch.lvl`
PUP_TENT_VERSION_TAG = "" # e.g. -alpha
PUP_TENT_VERSION ?= $(PUP_TENT_BASE_VERSION).$(PUP_TENT_PATCH_LEVEL)$(PUP_TENT_VERSION_TAG)

all:
	@echo "Using JS engine: $(TEST_JS)"
	@echo "Tests defined: $(TESTS)"
	@echo "See README.org in this directory for more details."

###
### Tests.
###

.PHONY: test $(TESTS)
test: $(TESTS)
$(TESTS): bundle
	echo "trying: $@"
	$(TEST_JS) $(TEST_JS_FLAGS) -f $(@D)/$(@F)
#	cd $(@D) && $(TEST_JS) $(TEST_JS_FLAGS) -f $(@F)

###
### Just the exit code results of the tests.
###

.PHONY: pass
pass:
	make test | grep -i fail; test $$? -ne 0

###
### Documentation.
###

.PHONY: docs
docs:
	naturaldocs --rebuild-output --input lib/ --project docs/.naturaldocs_project/ --output html docs/

###
### Create exportable JS bundles.
###

.PHONY: bundle
bundle:
	./scripts/release-js.pl -v -i scripts/release-file-map.txt -o staging/bbopx.js -n bbopx -d lib/bbopx -r $(PUP_TENT_VERSION)

.PHONY: bundle-uncompressed
bundle-uncompressed: update-external
	./scripts/release-js.pl -v -u -i scripts/release-file-map.txt -o staging/bbopx.js -n bbopx -d lib/bbopx -r $(PUP_TENT_VERSION)

###
### Build version control.
###

.PHONY: version
version:
	@echo Current version: $(PUP_TENT_VERSION)

.PHONY: patch-reset
patch-reset:
	echo 0 > version-patch.lvl

.PHONY: patch-incr
patch-incr:
	echo $$(( $(PUP_TENT_PATCH_LEVEL) + 1 )) > version-patch.lvl

###
### Create exportable JS NPM directory.
###

## Steps forward the patch level after every release--this is required
## to really use npm.
.PHONY: npm
npm: bundle
	./scripts/release-npm.pl -v -i lib/bbopx.js -o npm/pup-tent -r $(PUP_TENT_VERSION)
	npm publish npm/pup-tent
	make patch-incr

###
### Release: docs and bundle.
###

.PHONY: release
release: bundle npm docs
