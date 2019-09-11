# Lint code style
lint:
	flake8 lyrics_scraper

# Sort imports
isort:
	isort -s env -s src/hyperwallet-sdk -rc .

dev:
	nodemon --watch * --exec "electron ."

# Start python server
start-server:
	python lyrics_scraper/api.py

# Initialise virtualenv
venv: venv-create

# Create a new virtualenv
venv-create:
	virtualenv -p python3 env

deps-pre:
	pip install pip-tools

deps-compile:
	pip-compile lyrics_scraper/requirements.in

deps-compile-upgrade:
	pip-compile lyrics_scraper/requirements.in --upgrade

deps-install:
	pip-sync lyrics_scraper/requirements.txt

deps: deps-pre deps-compile deps-install

deps-upgrade: deps-pre deps-compile-upgrade deps-install

package-python:
	pyinstaller lyrics_scraper/api.py --distpath lyrics_scraper_dist
	rm -rf build/
	rm -rf api.spec

package-electron:
	./node_modules/.bin/electron-packager . --overwrite --ignore="lyrics_scraper$" --ignore="\.venv" --ignore="old-post-backup"

-include Makefile.local
