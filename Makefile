up:
	docker compose up -d

build:
	docker compose up -d --build

agent-run:
	docker compose up -d --build agent

backend-run:
	docker compose up -d --build postgres backend
