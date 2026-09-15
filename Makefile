VENV := env
PY := $(VENV)/bin/python
PIP := $(VENV)/bin/pip
REMOTE := wwa:/var/www/kylemulleady.com/

.PHONY: help setup build serve deploy clean

help:
	@echo "setup   - create virtualenv and install dependencies"
	@echo "build   - render content/ into dist/"
	@echo "serve   - build, then serve dist/ at http://localhost:8000"
	@echo "deploy  - build, then rsync dist/ to the server"
	@echo "clean   - remove dist/"

setup:
	python3 -m venv $(VENV)
	$(PIP) install -q -r requirements.txt
	@echo "ready. run: make build"

build:
	$(PY) build.py

serve: build
	@echo "serving http://localhost:8000 (ctrl-c to stop)"
	cd dist && $(abspath $(PY)) -m http.server 8000

deploy: build
	rsync -avz --delete dist/ $(REMOTE)
	@echo "deployed to https://kylemulleady.com"

clean:
	rm -rf dist
