.PHONY: install lint test dev

install:
	npm install -g concurrently
	cd mood-backend && npm install
	cd mood-frontend && npm install

lint:
	cd mood-backend && npm run lint
	cd mood-frontend && npm run lint

test:
	cd mood-backend && npm run test

dev:
	npx concurrently -k "cd mood-backend && npm run dev" "cd mood-frontend && npm run dev"
