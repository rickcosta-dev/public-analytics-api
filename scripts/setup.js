const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando projeto Public Analytics API...\n');

// Cria diretório data se não existir
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Diretório data/ criado');
}

// Cria arquivo .env se não existir
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env criado a partir do .env.example');
  } else {
    const defaultEnv = `PORT=3000
API_URL=http://localhost:3000
DISCORD_WEBHOOK_URL=
BOT_TOKEN=
DISCORD_CHANNEL_ID=
`;
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Arquivo .env criado com valores padrão');
  }
} else {
  console.log('ℹ️  Arquivo .env já existe');
}

console.log('\n📋 Próximos passos:');
console.log('1. Configure as variáveis no arquivo .env');
console.log('2. Execute "npm install" para instalar dependências');
console.log('3. Execute "npm start" para iniciar a API');
console.log('4. Execute "npm run bot" para iniciar o bot Discord');
console.log('5. Ou execute "npm run all" para iniciar ambos\n');

console.log('✨ Setup concluído!');