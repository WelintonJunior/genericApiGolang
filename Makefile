export DB_USER="welinton"
export DB_PASS="123"
export DB_HOST="localhost"
export DB_PORT="3306"
export DB_NAME="apiGeneric"

build:
	# @echo "atualizando documentação do projeto"
	# @swag init --parseDependency
	# @echo "atualizando schemas"
	# @go run main.go schema
	@echo "realizando build do projeto..."
	@go build -o bin/api_server
	@echo "build finalizado..."

run:
	@make build
	./bin/api_server initApiServer

sql_up:
	@echo "Inicializando container MySQL..."
	@docker run --name mysql_local \
		-e MYSQL_ROOT_PASSWORD=${DB_PASS} \
		-e MYSQL_DATABASE=${DB_NAME} \
		-e MYSQL_USER=${DB_USER} \
		-e MYSQL_PASSWORD=${DB_PASS} \
		-p ${DB_PORT}:3306 \
		-d mysql:8.0
	@echo "Aguardando inicialização do MySQL..."
	@sleep 30
	@echo "Container inicializado com sucesso"

sql_down:
	@docker stop mysql_local
