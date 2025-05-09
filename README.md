# Gympass API

API para gerenciamento de academias e check-ins de usuários no estilo Gympass. Este projeto implementa um sistema de autenticação, cadastro de academias, busca geolocalizada e sistema de check-in com validação.

## 📋 Tabela de Conteúdo

- [Tecnologias](#-tecnologias)
- [Requisitos Funcionais](#-requisitos-funcionais)
- [Regras de Negócio](#-regras-de-negócio)
- [Requisitos Não-Funcionais](#-requisitos-não-funcionais)
- [Documentação da API](#-documentação-da-api)
- [Instalação](#-instalação)
- [Execução](#️-execução)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [CI/CD](#cicd)

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [Vitest](https://vitest.dev/)
- [Zod](https://zod.dev/)
- [Swagger](https://swagger.io/)
- [Docker](https://www.docker.com/)

## 📝 Requisitos Funcionais

- [x] Cadastro de usuários
- [x] Autenticação de usuários
- [x] Perfil de usuário
- [x] Contagem de check-ins
- [x] Histórico de check-ins
- [x] Busca de academias próximas (até 10km)
- [x] Busca de academias por nome
- [x] Realização de check-in
- [x] Validação de check-in
- [x] Cadastro de academias

## ⚖️ Regras de Negócio

- [x] Usuário não pode se cadastrar com e-mail duplicado
- [x] Usuário não pode fazer 2 check-ins no mesmo dia
- [x] Usuário não pode fazer check-in se não estiver perto (100m) da academia
- [x] Check-in só pode ser validado até 20 minutos após criado
- [x] Check-in só pode ser validado por administradores
- [x] Academia só pode ser cadastrada por administradores

## 🔧 Requisitos Não-Funcionais

- [x] Senha do usuário criptografada
- [x] Dados persistidos em PostgreSQL
- [x] Listas paginadas com 20 itens por página
- [x] Autenticação via JWT
- [x] Documentação com Swagger

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI no endpoint [`/docs`](http://localhost:3333/docs) quando a aplicação estiver em execução.

### Principais Endpoints:

**Usuários:**

- `POST /users` - Registro de usuário
- `POST /sessions` - Autenticação
- `GET /me` - Perfil do usuário logado
- `PATCH /token/refresh` - Renovar token de acesso

**Academias:**

- `GET /gyms/search` - Buscar academias por nome
- `GET /gyms/nearby` - Buscar academias próximas
- `POST /gyms` - Cadastrar academia (admin)

**Check-ins:**

- `GET /check-ins/history` - Histórico de check-ins
- `GET /check-ins/metrics` - Contagem de check-ins
- `POST /gyms/:gymId/check-ins` - Realizar check-in
- `PATCH /check-ins/:checkInId/validate` - Validar check-in (admin)

## 💻 Instalação

```bash
# Clone o repositório
git clone https://github.com/alexandrejuniorc/gympass-api.git
cd gympass-api

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicialize o banco de dados no Docker
make docker/dev/start

# Execute as migrações do Prisma
pnpm prisma migrate dev
```

## ▶️ Execução

```bash
# Desenvolvimento
pnpm start:dev

# Produção
pnpm build
pnpm start
```

A API estará disponível em `http://localhost:3333` e a documentação em `http://localhost:3333/docs`.

## 🧪 Testes

```bash
# Testes unitários
pnpm test

# Testes de integração/e2e
pnpm test:e2e

# Cobertura de testes
pnpm test:coverage
```

## 🚢 Deploy

O projeto está configurado para deploy no [Render](https://render.com/).

1. Crie uma conta no Render
2. Conecte-se ao repositório GitHub
3. Configure as variáveis de ambiente:
   - `JWT_SECRET`
   - `DATABASE_URL`
   - `NODE_ENV` (deve ser configurado como `production` para o deploy)

## 🔄 CI/CD

O projeto utiliza GitHub Actions para integração contínua e entrega contínua:

- Execução automática de testes em pull requests
- Verificação de qualidade de código
- Deploy automático quando merge na branch principal

---

Desenvolvido por [Alexandre Junior](https://github.com/alexandrejuniorc)
