# CJnet - Comandos de Deploy

# Frontend
build-frontend:
	cd frontend && docker build \
		--build-arg NEXT_PUBLIC_API_URL=$(API_URL) \
		-t cjnet-frontend:latest .

run-frontend:
	docker run -d -p 3000:3000 \
		-e NEXT_PUBLIC_API_URL=$(API_URL) \
		--name cjnet-frontend \
		cjnet-frontend:latest

stop-frontend:
	docker stop cjnet-frontend || true
	docker rm cjnet-frontend || true

# Backend
build-backend:
	cd backend && docker build -t cjnet-backend:latest .

run-backend:
	docker run -d -p 8000:8000 \
		-e DATABASE_URL=$(DATABASE_URL) \
		-e JWT_SECRET=$(JWT_SECRET) \
		--name cjnet-backend \
		cjnet-backend:latest

stop-backend:
	docker stop cjnet-backend || true
	docker rm cjnet-backend || true

# Full stack (Docker Compose)
up:
	docker-compose up --build -d

down:
	docker-compose down

logs:
	docker-compose logs -f

# Deploy frontend (build a partir do repositório)
.PHONY: build-frontend run-frontend stop-frontend build-backend run-backend stop-backend up down logs
