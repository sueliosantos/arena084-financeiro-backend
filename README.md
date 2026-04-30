# arena084-financeiro-backend

Backend do sistema financeiro Arena084, responsável por gerenciar categorias, lançamentos financeiros, lançamentos recorrentes, autenticação de usuários e resumos mensais/anuais.

A API permite registrar receitas e despesas, organizar lançamentos por categoria, acompanhar valores pagos e pendentes, simular recorrências mensais e consultar indicadores financeiros consolidados.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs
- CORS
- tsx

## Funcionalidades principais

- Cadastro de usuários
- Autenticação com JWT
- Consulta dos dados do usuário autenticado
- CRUD de categorias financeiras
- CRUD de lançamentos financeiros
- Cadastro e manutenção de lançamentos recorrentes
- Materialização de lançamentos recorrentes por mês
- Listagem de lançamentos por mês e ano
- Resumo financeiro anual com receitas, despesas, pendências e saldo
- Suporte a criação de lançamento a partir de mensagem no formato simplificado, como:
  - `+2000 salario`
  - `-50 mercado`
  - `-120,90 energia`

## Estrutura de pastas

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── @types/
│   │   └── express/
│   ├── controllers/
│   │   ├── categoria/
│   │   ├── lancamento/
│   │   ├── recorrente/
│   │   ├── resumo/
│   │   └── user/
│   ├── middlewares/
│   │   └── isAuthenticated.ts
│   ├── prisma/
│   │   └── index.ts
│   ├── services/
│   │   ├── categoria/
│   │   ├── lancamento/
│   │   ├── recorrente/
│   │   ├── resumo/
│   │   └── user/
│   ├── utils/
│   │   ├── date.ts
│   │   ├── normalizers.ts
│   │   ├── recorrencia.ts
│   │   └── whatsappParser.ts
│   ├── app.ts
│   ├── routes.ts
│   └── server.ts
├── .env.example
├── package.json
├── tsconfig.json
└── vercel.json
```

### Principais responsabilidades

- `src/app.ts`: configuração principal do Express, middlewares, CORS e rotas.
- `src/server.ts`: inicialização do servidor HTTP.
- `src/routes.ts`: definição dos endpoints da API.
- `src/controllers`: camada responsável por receber requisições e retornar respostas HTTP.
- `src/services`: camada de regras de negócio e integração com o banco via Prisma.
- `src/middlewares`: middlewares da aplicação, incluindo autenticação JWT.
- `src/utils`: funções auxiliares para datas, normalização, recorrência e parsing de mensagens.
- `prisma/schema.prisma`: definição dos modelos, enums e relacionamentos do banco de dados.

## Como rodar o projeto localmente

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env
```

Configure a conexão com o PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/arena084_financeiro?schema=public"
FRONTEND_URL="http://localhost:5173"
JWT_SECRET="troque-esta-chave"
```

### 4. Executar as migrations do Prisma

```bash
npx prisma migrate dev
```

### 5. Gerar o Prisma Client

```bash
npx prisma generate
```

### 6. Rodar o servidor em ambiente de desenvolvimento

```bash
npm run dev
```

Por padrão, a API será iniciada em:

```text
http://localhost:3000
```

Caso a porta `3000` esteja ocupada, defina outra porta no `.env`:

```env
PORT=3001
```

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---:|---|
| `DATABASE_URL` | Sim | URL de conexão com o banco PostgreSQL utilizada pelo Prisma |
| `FRONTEND_URL` | Não | Origem permitida no CORS. Pode receber uma ou mais URLs separadas por vírgula |
| `JWT_SECRET` | Recomendado | Chave usada para assinatura dos tokens JWT |
| `PORT` | Não | Porta em que o servidor Express será executado. Padrão: `3000` |

Exemplo:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/arena084financeiro?schema=public"
FRONTEND_URL="http://localhost:5173"
JWT_SECRET="minha-chave-secreta"
PORT=3000
```

## Scripts disponíveis

```bash
npm run dev
```

Inicia o servidor em modo desenvolvimento com `tsx watch`.

```bash
npm run build
```

Gera o Prisma Client e compila o projeto TypeScript.

```bash
npm run build:vercel
```

Executa o build preparado para deploy na Vercel.

```bash
npm run start
```

Executa a versão compilada em `dist/server.js`.

```bash
npm run prisma:generate
```

Gera o Prisma Client.

```bash
npm run prisma:migrate
```

Executa migrations em ambiente de desenvolvimento.

```bash
npm run prisma:deploy
```

Aplica migrations em ambiente de produção.

```bash
npm run migrate:deploy
```

Alias para aplicação de migrations em produção.

```bash
npm run postinstall
```

Gera o Prisma Client após a instalação das dependências.

## Endpoints principais da API

A aplicação registra as rotas tanto na raiz quanto sob o prefixo `/api`.

Exemplos válidos:

```text
GET /health
GET /api/health
```

### Health check

| Método | Rota | Autenticação | Descrição |
|---|---|---:|---|
| `GET` | `/health` | Não | Verifica se a API está ativa |

### Usuários e autenticação

| Método | Rota | Autenticação | Descrição |
|---|---|---:|---|
| `POST` | `/users` | Não | Cria um novo usuário |
| `POST` | `/session` | Não | Autentica um usuário e retorna um token JWT |
| `GET` | `/me` | Sim | Retorna os dados do usuário autenticado |

#### Criar usuário

```http
POST /users
Content-Type: application/json
```

```json
{
  "nome": "Usuário Teste",
  "email": "teste@exemplo.com",
  "senha": "123456"
}
```

#### Login

```http
POST /session
Content-Type: application/json
```

```json
{
  "email": "teste@exemplo.com",
  "senha": "123456"
}
```

Resposta:

```json
{
  "id": 1,
  "nome": "Usuário Teste",
  "email": "teste@exemplo.com",
  "token": "jwt-token"
}
```

Para acessar rotas protegidas, envie o token no header:

```http
Authorization: Bearer jwt-token
```

### Categorias

| Método | Rota | Autenticação | Descrição |
|---|---|---:|---|
| `GET` | `/categorias` | Sim | Lista categorias |
| `POST` | `/categorias` | Sim | Cria uma categoria |
| `PUT` | `/categorias/:id` | Sim | Atualiza uma categoria |
| `DELETE` | `/categorias/:id` | Sim | Remove uma categoria |

#### Criar categoria

```json
{
  "nome": "mercado",
  "tipo": "DESPESA"
}
```

Tipos disponíveis:

```text
RECEITA
DESPESA
```

### Lançamentos

| Método | Rota | Autenticação | Descrição |
|---|---|---:|---|
| `GET` | `/lancamentos?mes=4&ano=2026` | Sim | Lista lançamentos de um mês |
| `POST` | `/lancamentos` | Sim | Cria um lançamento |
| `POST` | `/lancamentos/recorrente-mensal` | Sim | Materializa um lançamento recorrente no mês informado |
| `PUT` | `/lancamentos/:id` | Sim | Atualiza um lançamento |
| `DELETE` | `/lancamentos/:id` | Sim | Remove um lançamento |

#### Criar lançamento manual

```json
{
  "tipo": "DESPESA",
  "valor": 50,
  "descricao": "Mercado",
  "observacao": "Compra semanal",
  "data": "2026-04-29T12:00:00.000Z",
  "status": "PENDENTE",
  "categoriaId": 1,
  "origem": "MANUAL"
}
```

Status disponíveis:

```text
PAGO
PENDENTE
```

Origens disponíveis:

```text
MANUAL
WHATSAPP
RECORRENTE
```

#### Criar lançamento por mensagem

```json
{
  "mensagem": "-50 mercado"
}
```

Regras do formato:

- `+` cria uma receita
- `-` cria uma despesa
- o valor pode usar ponto ou vírgula decimal
- a primeira palavra da descrição é usada como categoria

Exemplos:

```text
+2000 salario
-50 mercado
-120,90 energia
+350 pix cliente
```

### Recorrentes

| Método | Rota | Autenticação | Descrição |
|---|---|---:|---|
| `GET` | `/recorrentes` | Sim | Lista lançamentos recorrentes |
| `POST` | `/recorrentes` | Sim | Cria um lançamento recorrente |
| `PUT` | `/recorrentes/:id` | Sim | Atualiza um lançamento recorrente |
| `DELETE` | `/recorrentes/:id` | Sim | Remove um lançamento recorrente |

#### Criar recorrente

```json
{
  "descricao": "Aluguel",
  "valor": 1500,
  "tipo": "DESPESA",
  "categoriaId": 1,
  "dataInicio": "2026-04-01T12:00:00.000Z",
  "dataFim": null,
  "ativo": true
}
```

#### Atualizar recorrente a partir de uma data

Quando o payload contém `aplicarAPartir`, o registro atual é encerrado e um novo recorrente é criado a partir da data informada.

```json
{
  "valor": 1600,
  "aplicarAPartir": "2026-05-01T12:00:00.000Z"
}
```

### Resumo financeiro

| Método | Rota | Autenticação | Descrição |
|---|---|---:|---|
| `GET` | `/resumo?ano=2026&mes=4` | Sim | Retorna resumo financeiro anual limitado até o mês informado |

O resumo retorna os meses disponíveis com:

- receitas pagas
- despesas pagas
- despesas pendentes
- total cadastrado
- saldo
- itens considerados no cálculo

## Modelo de dados

### Categoria

Representa uma categoria financeira vinculada a receitas ou despesas.

Campos principais:

- `id`
- `nome`
- `tipo`
- `criadoEm`
- `atualizadoEm`

Existe uma restrição de unicidade para `nome` e `tipo`.

### Lancamento

Representa uma receita ou despesa.

Campos principais:

- `id`
- `tipo`
- `valor`
- `descricao`
- `observacao`
- `data`
- `status`
- `categoriaId`
- `recorrenteId`
- `origem`
- `criadoEm`
- `atualizadoEm`

### Recorrente

Representa um lançamento recorrente usado para simular ou materializar lançamentos mensais.

Campos principais:

- `id`
- `descricao`
- `valor`
- `tipo`
- `categoriaId`
- `dataInicio`
- `dataFim`
- `ativo`
- `criadoEm`
- `atualizadoEm`

### Usuario

Representa um usuário da aplicação.

Campos principais:

- `id`
- `nome`
- `email`
- `senha`
- `criadoEm`
- `atualizadoEm`

## Boas práticas aplicadas

- Separação entre rotas, controllers e services
- Centralização da conexão com Prisma
- Autenticação JWT em middleware dedicado
- Hash de senha com bcrypt
- Uso de enums no Prisma para padronizar tipos, status e origem dos lançamentos
- Normalização de datas em utilitário próprio
- Conversão de campos decimais antes da resposta da API
- Simulação de recorrentes sem duplicar lançamentos já materializados
- Tratamento de erros por controller com respostas HTTP consistentes
- Configuração de CORS baseada em variável de ambiente
- Scripts separados para desenvolvimento, build e migrations

## Possíveis melhorias futuras

- Adicionar testes automatizados para services e controllers
- Implementar validação de payloads com biblioteca dedicada, como Zod ou Joi
- Adicionar paginação e filtros avançados nas listagens
- Vincular categorias e lançamentos ao usuário autenticado
- Criar webhook real para integração com WhatsApp
- Adicionar logs estruturados
- Criar documentação OpenAPI/Swagger
- Melhorar tratamento global de erros
- Adicionar seed inicial para categorias padrão
- Configurar pipeline de CI/CD
- Implementar controle de permissões por usuário

## Autor

Suélio Santos
