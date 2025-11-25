# 📊 Public Analytics API

API completa de analytics com integração Discord para rastreamento de visualizações em tempo real.

## 🚀 Recursos

- ✅ API REST completa com Express.js
- ✅ Banco de dados SQLite para persistência
- ✅ Notificações em tempo real no Discord via Webhook
- ✅ Bot Discord com comandos interativos
- ✅ Estatísticas detalhadas por página
- ✅ Histórico de visualizações recentes
- ✅ CORS habilitado para uso público

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Conta no Discord
- Servidor Discord (para o bot)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/rickcosta-dev/public-analytics-api.git
cd public-analytics-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute o setup

```bash
npm run setup
```

### 4. Configure o Discord

#### Criar Webhook:
1. Acesse seu servidor Discord
2. Vá em **Configurações do Servidor** > **Integrações** > **Webhooks**
3. Clique em **Novo Webhook**
4. Copie a URL do webhook

#### Criar Bot:
1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em **New Application**
3. Vá em **Bot** > **Add Bot**
4. Copie o **Token**
5. Em **OAuth2** > **URL Generator**, selecione:
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Send Messages`, `Embed Links`, `Use Slash Commands`
6. Copie a URL gerada e adicione o bot ao seu servidor

### 5. Configure as variáveis de ambiente

Edite o arquivo `.env`:

```env
PORT=3000
API_URL=http://localhost:3000
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/SEU_WEBHOOK_AQUI
BOT_TOKEN=SEU_TOKEN_DO_BOT_AQUI
DISCORD_CHANNEL_ID=ID_DO_CANAL (opcional)
```

## 🎯 Uso

### Iniciar apenas a API

```bash
npm start
```

### Iniciar apenas o Bot

```bash
npm run bot
```

### Iniciar API + Bot simultaneamente

```bash
npm run all
```

### Modo desenvolvimento (com hot reload)

```bash
npm run dev      # Apenas API
npm run dev:bot  # Apenas Bot
npm run all      # API + Bot
```

## 📡 Endpoints da API

### POST /api/view
Registra uma nova visualização

**Request:**
```json
{
  "page": "/home",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "View recorded successfully",
  "data": {
    "view": {
      "id": 1,
      "page": "/home",
      "userAgent": "Mozilla/5.0...",
      "ip": "192.168.1.1",
      "timestamp": "2024-01-15T10:30:00.000Z"
    },
    "totalViews": 42
  }
}
```

### GET /api/stats
Retorna estatísticas gerais

**Response:**
```json
{
  "success": true,
  "data": {
    "totalViews": 150,
    "pages": {
      "/home": 100,
      "/about": 30,
      "/contact": 20
    }
  }
}
```

### GET /api/stats/:page
Retorna estatísticas de uma página específica

**Response:**
```json
{
  "success": true,
  "data": {
    "page": "/home",
    "views": 100
  }
}
```

### GET /api/recent?limit=10
Retorna visualizações recentes

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 150,
      "page": "/home",
      "user_agent": "Mozilla/5.0...",
      "ip": "192.168.1.1",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## 🤖 Comandos do Bot Discord

### `/stats`
Exibe estatísticas completas do analytics
- Total de visualizações
- Top 10 páginas mais acessadas

### `/recent [limit]`
Exibe visualizações recentes
- `limit`: Número de visualizações (1-25, padrão: 10)

### `/page [path]`
Exibe estatísticas de uma página específica
- `path`: Caminho da página (ex: /home)

## 📦 Estrutura do Projeto

```
public-analytics-api/
├── src/
│   ├── index.js                 # Entrada principal da API
│   ├── routes.js                # Definição das rotas
│   ├── database.js              # Configuração do SQLite
│   └── services/
│       ├── analyticsService.js  # Lógica de negócio
│       └── discordService.js    # Integração Discord
├── bot/
│   └── bot.js                   # Bot Discord com comandos
├── scripts/
│   └── setup.js                 # Script de configuração inicial
├── data/
│   └── analytics.db             # Banco de dados (criado automaticamente)
├── .env                         # Variáveis de ambiente
├── .env.example                 # Exemplo de configuração
├── .gitignore                   # Arquivos ignorados pelo Git
├── package.json                 # Dependências e scripts
└── README.md                    # Documentação
```

## Imagem

[Exemplo](imgs/image.png)


## 🔒 Segurança

- ✅ Não exponha seu `.env` no Git
- ✅ Use HTTPS em produção
- ✅ Configure rate limiting se necessário
- ✅ Valide todos os inputs do usuário
- ✅ Considere adicionar autenticação para endpoints sensíveis

## 🌐 Deploy

### Heroku

```bash
heroku create seu-app
heroku config:set DISCORD_WEBHOOK_URL=sua_url
heroku config:set BOT_TOKEN=seu_token
git push heroku main
```

### Railway

```bash
railway login
railway init
railway add
railway up
```

### Render

1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- 🐛 Encontrou um bug? [Abra uma issue](https://github.com/seu-usuario/public-analytics-api/issues)
- 💡 Tem uma sugestão? [Abra uma discussion](https://github.com/seu-usuario/public-analytics-api/discussions)
- 📧 Email: rickdev0021@gmail.com
- Discord: rickzin02

## 🎉 Agradecimentos

- [Express.js](https://expressjs.com/)
- [Discord.js](https://discord.js.org/)
- [SQLite](https://www.sqlite.org/)

---

<<<<<<< HEAD
Feito com ❤️ por [RickZin](https://github.com/rickcosta-dev)
=======
Feito com ❤️ por [RickZin](https://github.com/rickcosta-dev)
>>>>>>> b30b0ae942b1f2abb8550f6c8c44eaec1472937a
