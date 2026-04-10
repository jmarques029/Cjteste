# Histórico de Conversa: Configuração da API Backend com Clean Architecture & Docker

Este documento resume as discussões e o passo a passo da nossa sessão no chat, focado na implementação da prova de conceito (MVP) do provedor de internet.

## 1. O Ponto de Partida e Requisitos
Você nos forneceu o projeto (`Cjteste`) e o documento final desenhado em 60 horas de especificação (`mvp_design_document.md`). O seu pedido central foi: 
> *A partir dessas "spexs", ler o projeto e propor uma API no backend utilizando recursos do Clean Architecture com o paradigma de desenvolvimento orientado à testes (TDD). Além disso, garantir que os dados seriam salvos num PostgreSQL embutido no Docker.*

## 2. Nossa Primeira Ação: Construção da Estrutura

Imediatamente ajustamos o backend e adotamos arquitetura TDD:
- **`docker-compose.yml`**: Criamos os serviços simulando a estrutura (`db` para Postgres 15+). 
- **TDD e Domain**: Definimos os testes do domínio antes (`tests/domain`) e logo implementamos as Dataclasses `Plan`, `Lead` e `User`. Em seguida estruturamos também as respostas de Casos de Uso com mock (em `tests/use_cases`).
- **Infraestrutura**: Configurações de conexão através do `SQLAlchemy` e repasses com Repository Pattern (conectando à `Base` e `engine` interna).
- Finalizamos montando as **Rotas FastAPI** (`api_router.py`) para poder receber requisições.

## 3. A Execução Real (Subindo no Docker)
Após a aprovação do plano, rodamos todo o ambiente em Docker usando:
```bash
docker compose up -d --build
```
Nós então fizemos o primeiro teste de validação rodando as suítes do pytest em container isolado através do comando: 
```bash
docker compose exec api pytest tests/
```
Os testes retornaram "8 passed"!

## 4. Dúvidas do Chat Resolvidas:

1. **"Como acesso o site / API?"**
   Disponibilizamos toda a documentação web que o FastAPI gerou pra você sem precisar programar uma interface inicial, sendo acessada via http://localhost:8000/docs.

2. **"Como acesso ao meu Banco de Dados Postgres visualmente?"**
   Foi ensinado sobre DBeaver/PgAdmin. Em momento posterior, automatizamos essa parte embutindo um container `pgadmin` ao próprio arquivo para que você checasse os dados na URL `http://localhost:5050`.

3. **"Criar o Banco de dados através do docker / endereço"**
   Entendendo que você queria que as tabelas "Lisas" aparecessem lá dentro, incluímos no arquivo de inicialização (`src/main.py`) a sentença embutida do sqlalchemy `Base.metadata.create_all(bind=engine)`, forçando o FastAPI levantar as tabelas originais sozinho quando ligasse!

4. **"O comando `docker exec -it backend uv run pytest` erro?"**
   Corrigimos a tentativa paralela e reafirmamos que o correto neste Docker foi `docker compose exec api pytest tests/`. Eliminamos juntos um aviso (warning) amarelo na tela removendo a flag assíncrona que estava perdida no arquivo `pytest.ini`.

## 5. Implementações Finais (Timezone e Test Coverage)
O seu pedido final incluía garantir fuso horário para o Brasil e uma ferramenta de relatório para mostrar o que de fato o TDD testou.
- Alocamos `TZ=America/Sao_Paulo` nos contêineres e refizemos build.
- Implementamos a flag `--cov=src` em conjunto com a lib `pytest-cov`, atingindo, ao longo do teste, incríveis **86% de cobertura de código (Code Coverage)** nas estruturas testadas.

---
**Status Atual**: Toda a infraestrutura, rotas e tabelas principais estão estáveis, validadas e testadas 100% debaixo do Docker.
