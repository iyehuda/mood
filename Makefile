.PHONY: install lint test dev

install:
	npm install -g concurrently
	cd mood-frontend && npm install
	cd mood-backend && uv sync

lint:
	cd mood-frontend && npm run lint
	cd mood-backend && \
		uv run mypy mood_backend && \
		uv run ruff check mood_backend --fix && \
		uv run ruff format mood_backend

test:
	cd mood-backend && \
		uv run coverage run --source=app -m pytest && \
		uv run coverage report --show-missing && \
		uv run coverage html --title coverage

dev:
	npx concurrently -k \
	    ""cd mood-frontend && npm run dev \
	    "cd mood-backend && uv run fastapi dev"

compose:
	COMPOSE_BAKE=true docker compose up --build -d
