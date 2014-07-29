####
#### Testing and release procedures for Pup Tent.
####
#### See README.org in this directory for more detail.
####

TESTS = \
 $(wildcard tests/*.js.tests)

## Test JS environment.
TEST_JS_ENV = NODE_PATH="./lib"
TEST_JS = node
TEST_JS_FLAGS = 

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
	@echo "Current development version: $(PUP_TENT_VERSION)"
	@echo "See README.org in this directory for more details."

###
### Tests.
###

.PHONY: test $(TESTS)
test: $(TESTS)
$(TESTS):
	echo "trying: $@"
	$(TEST_JS_ENV) $(TEST_JS) $(TEST_JS_FLAGS) $(@D)/$(@F)

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
npm:
	./scripts/release-npm.pl -v -i lib/pup-tent.js -o npm/pup-tent -r $(PUP_TENT_VERSION)
	npm publish npm/pup-tent
	make patch-incr

###
### Release: docs and bundle.
###

.PHONY: release
release: npm docs
