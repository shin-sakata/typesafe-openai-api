.PHONY: all install build start test typecheck upgrade clean

TSC := npx tsc
TS_NODE := npx ts-node
NCU := npx ncu

SRC_DIR := src
TS_FILES := $(wildcard $(SRC_DIR)/**/*.ts)
OUT_DIR := dist
NODE_MODULES := node_modules

all: install build

install: $(NODE_MODULES)
$(NODE_MODULES): package.json package-lock.json
	npm install

build: $(OUT_DIR)
$(OUT_DIR): $(NODE_MODULES) $(TS_FILES) tsconfig.json
	$(TSC)

tsconfig.json: tsconfig.base.json
	$(TSC) -p $^ --showConfig > $@

start: install tsconfig.json
	$(TS_NODE) $(SRC_DIR)/app/index.ts

test: install tsconfig.json
	$(TS_NODE) $(SRC_DIR)/tests/index.ts

typecheck: install $(TS_FILES) tsconfig.json
	$(TSC) --noEmit

upgrade: install
	$(NCU) -u
	$(MAKE) install

clean:
	rm -rf $(OUT_DIR) $(NODE_MODULES)
