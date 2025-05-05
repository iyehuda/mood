.PHONY: install lint test dev

install:
	npm install -g concurrently
	cd mood-backend && npm install
	cd mood-frontend && npm install
	cd llm-service && uv sync

lint:
	cd mood-backend && npm run lint
	cd mood-frontend && npm run lint
	cd llm-service && \
		uv run mypy llm_service && \
		uv run ruff check llm_service --fix && \
		uv run ruff format llm_service

test:
	cd mood-backend && npm run test
	cd llm-service && \
		uv run coverage run --source=app -m pytest && \
		uv run coverage report --show-missing && \
		uv run coverage html --title coverage

dev:
	npx concurrently -k \
	    "cd mood-backend && npm run dev" \
	    "cd mood-frontend && npm run dev" \
	    "cd llm-service && uv run fastapi dev"

compose:
	COMPOSE_BAKE=true docker compose up --build -d
