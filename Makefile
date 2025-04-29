## Docker Session
docker/dev/start:
	@docker compose up -d
docker/dev/stop:
	@docker compose down
docker/dev/exec:
	@docker compose exec -it dev bash
docker/dev/clear:
	@docker compose down --volumes --remove-orphans