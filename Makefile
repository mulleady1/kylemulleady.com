VENV := env
PY := $(VENV)/bin/python
PIP := $(VENV)/bin/pip
HOST := wwa
REMOTE := $(HOST):/var/www/kylemulleady.com/
STAGING := $(HOST):/var/www/kylemulleady.com-v2/

.PHONY: help setup build serve stage deploy clean

help:
	@echo "setup   - create virtualenv and install dependencies"
	@echo "build   - render content/ into dist/"
	@echo "serve   - build, then serve dist/ at http://localhost:8000"
	@echo "stage   - one-time: upload the new site and migration script"
	@echo "deploy  - build, then rsync dist/ to the live server"
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

# One-time migration off the 2016 .NET app. Uploads the built site to a staging
# directory so nothing breaks, then the script on the server does the parts that
# need root: certificate, nginx config, removing the dead kestrel service.
stage: build
	rsync -avz --delete dist/ $(STAGING)
	scp deploy/kylemulleady.com.nginx deploy/install-server.sh $(HOST):~/
	@echo
	@echo "Uploaded. Now run on the server:"
	@echo "    ssh $(HOST) 'bash ~/install-server.sh'"

deploy: build
	rsync -avz --delete dist/ $(REMOTE)
	@echo "deployed to https://kylemulleady.com"

clean:
	rm -rf dist
