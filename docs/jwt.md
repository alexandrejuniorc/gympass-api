# JWT (JSON Web Token)

## Visão Geral

JSON Web Token (JWT) é um padrão aberto (RFC 7519) para transmitir informações de forma segura entre as partes como um objeto JSON. Essas informações podem ser verificadas e confiáveis porque são assinadas digitalmente.

## Como a Autenticação JWT Funciona

1. **Processo de Autenticação**:

   - O usuário envia credenciais (email/senha)
   - O backend valida as credenciais e gera um JWT
   - O token é retornado para o cliente
   - O cliente armazena o token (localStorage, cookies, etc.) e o envia com as solicitações subsequentes

2. **Características do Token**:
   - **Único**: Cada token é específico para o usuário e sessão
   - **À prova de adulteração**: Não pode ser modificado sem invalidar a assinatura
   - **Sem estado**: Não requer armazenamento no lado do servidor

## Estrutura JWT

Um JWT consiste em três partes separadas por pontos:

```
cabeçalho.payload.assinatura
```

### Cabeçalho

Contém metadados sobre o token, como o algoritmo usado para assinatura.

**Exemplo de cabeçalho**:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload

Contém as claims (dados do usuário e metadados):

- Claims padrão (iss, exp, sub, etc.)
- Claims personalizadas (ID do usuário, permissões, etc.)

**Exemplo de payload**:

```json
{
  "sub": "1234567890",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "role": "ADMIN",
  "iat": 1682761200,
  "exp": 1682847600
}
```

Significado das claims no exemplo:

- `sub`: Identificador único do usuário
- `name`: Nome do usuário
- `email`: Email do usuário
- `role`: Função/papel do usuário no sistema
- `iat`: Timestamp de quando o token foi emitido
- `exp`: Timestamp de expiração do token

### Assinatura

Criada combinando:

- Cabeçalho codificado
- Payload codificado
- Chave secreta (conhecida apenas pelo servidor)
- Algoritmo especificado

## Tipos de Cabeçalhos de Autorização HTTP

Ao implementar autenticação em APIs, diferentes esquemas de autorização podem ser usados no cabeçalho HTTP. O cabeçalho de autorização geralmente segue o formato:

```
Authorization: <tipo> <credenciais>
```

### 1. Bearer Authentication (JWT)

O esquema mais comum para enviar JWTs nas requisições. O token é enviado no cabeçalho HTTP:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvYW8gU2lsdmEiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2ODI3NjEyMDAsImV4cCI6MTY4Mjg0NzYwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 2. Basic Authentication

Codifica credenciais do usuário (usuário:senha) em Base64. Menos seguro sem HTTPS:

```
Authorization: Basic dXN1YXJpbzpzZW5oYQ==
```

Onde "dXN1YXJpbzpzZW5oYQ==" é a string "usuario:senha" codificada em Base64.

### 3. Digest Authentication

Mais seguro que Basic Auth porque não transmite a senha em texto simples:

```
Authorization: Digest username="usuario", realm="exemplo.com", nonce="xyz123", uri="/api/recurso", response="7cffhfr5d7f7f7f7f7f7f"
```

### 4. API Key

Geralmente enviada em um cabeçalho personalizado ou como parâmetro de consulta:

```
X-API-Key: sua_chave_api_aqui
```

### 5. OAuth 2.0

Similar ao Bearer para o envio do token:

```
Authorization: Bearer <token_oauth>
```

## Considerações de Segurança

- Mantenha as chaves secretas seguras
- Use HTTPS para evitar interceptação do token
- Defina tempos de expiração adequados
- Considere a rotação de tokens para operações sensíveis

## Notas de Implementação

O backend usa uma chave secreta para assinar e verificar tokens:

```
SECRET_KEY=sua_chave_secreta_segura_aqui
```

**Importante**: Nunca exponha sua chave secreta em código do lado do cliente ou em sistemas de controle de versão.
