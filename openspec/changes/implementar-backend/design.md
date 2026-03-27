## Context

A aplicação requer uma base sólida para a lógica de negócios e para expor APIs. O design atual propõe o uso de FastAPI, focado em performance e tipagem, acoplado com uma abordagem rigorosa de Clean Architecture e Test Driven Development (TDD). A infraestrutura de desenvolvimento será totalmente baseada em Docker para garantir consistência entre os ambientes.

## Goals / Non-Goals

**Goals:**
- Configurar o ambiente Docker (`Dockerfile` e `docker-compose.yml`) adequados para rodar a aplicação FastAPI e testes.
- Estruturar o projeto seguindo a Clean Architecture (Domain, Use Cases, Interfaces, Infrastructure).
- Implementar a camada de Domínio orientada por testes (fazendo os testes falharem primeiro, depois implementando o código para passarem).
- Implementar a camada de Use Cases da mesma forma (TDD).
- Garantir que todos os testes sejam executados exclusivamente pelo contêiner Docker.

**Non-Goals:**
- Implementação completa de banco de dados (Infrastructure layer detalhada) na primeira iteração (foco nas camadas Domain e Use Case).
- Integração profunda com frontend neste momento inicial.

## Decisions

- **Framework**: FastAPI. Escolhido pela alta velocidade, geração automática de documentação via OpenAPI e forte suporte ao Pydantic v2.
- **Arquitetura**: Clean Architecture (Robert C. Martin). Separação rigorosa de responsabilidades. O centro será a camada de Domínio, envolta pela camada de Aplicação (casos de uso). As dependências sempre devem apontar de fora para dentro.
- **TDD (Test Driven Development)**: Exigido como fluxo de trabalho. Os testes de Domínio serão criados antes da implementação real das entidades e regras de negócios. O mesmo fluxo se repetirá nos Use Cases.
- **Ambiente Containerizado**: Uso obrigatório do Docker Compose para desenvolvimento e testes. Embora rodar testes dentro do Docker seja um pouco mais lento na inicialização de comandos, isso garante um ambiente totalmente imutável e idêntico em qualquer máquina, eliminando "na minha máquina funciona".

## Risks / Trade-offs

- **Lentidão no ciclo de feedback do TDD**: Executar testes frequentemente dentro de um contêiner pode ser mais lento do que rodar nativamente.
  - *Mitigação*: Utilizar volumes (bind mounts) no `docker-compose.yml` para evitar o rebuild da imagem a cada mudança no código, garantindo que o `pytest` pegue as alterações em tempo real via bash no container ou comandos rápidos.
- **Complexidade inicial**: Clean Architecture exige muitos arquivos e setups iniciais.
  - *Mitigação*: Criação de uma estrutura de pastas padronizada e modular desde o início, deixando claro onde cada novo componente deve ser inserido.
