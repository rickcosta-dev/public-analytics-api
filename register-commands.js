require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // Adicione isso no .env

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN não encontrado no .env');
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error('❌ CLIENT_ID não encontrado no .env');
  console.log('💡 Adicione CLIENT_ID=seu_application_id no arquivo .env');
  console.log('💡 Encontre em: https://discord.com/developers/applications');
  process.exit(1);
}

// Define os comandos
const commands = [
  new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Exibe estatísticas do Analytics API'),
  
  new SlashCommandBuilder()
    .setName('recent')
    .setDescription('Exibe visualizações recentes')
    .addIntegerOption(option =>
      option
        .setName('limit')
        .setDescription('Número de visualizações a exibir (padrão: 10)')
        .setMinValue(1)
        .setMaxValue(25)
    ),
  
  new SlashCommandBuilder()
    .setName('page')
    .setDescription('Exibe estatísticas de uma página específica')
    .addStringOption(option =>
      option
        .setName('path')
        .setDescription('Caminho da página (ex: /home)')
        .setRequired(true)
    ),
  
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Verifica se o bot está respondendo')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log('🔄 Iniciando registro de comandos slash...');
    console.log(`📝 Total de comandos: ${commands.length}`);
    
    // Registra comandos GLOBALMENTE (pode levar até 1 hora)
    console.log('\n1️⃣ Registrando comandos globalmente...');
    const globalData = await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log(`✅ ${globalData.length} comandos globais registrados!`);
    console.log('⏰ Comandos globais podem levar até 1 hora para aparecer');

    // Se você quiser registro INSTANTÂNEO em um servidor específico:
    const GUILD_ID = process.env.GUILD_ID; // Opcional
    
    if (GUILD_ID) {
      console.log('\n2️⃣ Registrando comandos no servidor específico...');
      const guildData = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      );
      console.log(`✅ ${guildData.length} comandos registrados no servidor!`);
      console.log('⚡ Comandos do servidor aparecem INSTANTANEAMENTE');
    } else {
      console.log('\n💡 DICA: Para registro instantâneo, adicione GUILD_ID no .env');
      console.log('   Para pegar o GUILD_ID: Ative "Modo Desenvolvedor" no Discord');
      console.log('   Clique com botão direito no servidor > Copiar ID');
    }

    console.log('\n✨ Registro concluído com sucesso!');
    console.log('\n📋 Comandos registrados:');
    commands.forEach((cmd, i) => {
      console.log(`   ${i + 1}. /${cmd.name} - ${cmd.description}`);
    });

    console.log('\n🎉 Tudo pronto! Use os comandos no Discord.');
    
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
    
    if (error.code === 50001) {
      console.error('\n⚠️  ERRO: Bot sem permissão');
      console.error('💡 Solução: Readicione o bot ao servidor com o link correto');
    } else if (error.code === 0) {
      console.error('\n⚠️  ERRO: TOKEN inválido');
      console.error('💡 Solução: Verifique o BOT_TOKEN no arquivo .env');
    }
  }
})();