require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes } = require('discord.js');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Cria o cliente do bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Comando /stats
const statsCommand = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('Exibe estatísticas do Analytics API');

// Comando /recent
const recentCommand = new SlashCommandBuilder()
  .setName('recent')
  .setDescription('Exibe visualizações recentes')
  .addIntegerOption(option =>
    option
      .setName('limit')
      .setDescription('Número de visualizações a exibir (padrão: 10)')
      .setMinValue(1)
      .setMaxValue(25)
  );

// Comando /page
const pageCommand = new SlashCommandBuilder()
  .setName('page')
  .setDescription('Exibe estatísticas de uma página específica')
  .addStringOption(option =>
    option
      .setName('path')
      .setDescription('Caminho da página (ex: /home)')
      .setRequired(true)
  );

// Quando o bot estiver pronto
client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  console.log(`📊 Bot pronto para responder comandos!`);
});

// Handler de comandos
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    if (commandName === 'stats') {
      await handleStatsCommand(interaction);
    } else if (commandName === 'recent') {
      await handleRecentCommand(interaction);
    } else if (commandName === 'page') {
      await handlePageCommand(interaction);
    }
  } catch (error) {
    console.error('Error handling command:', error);
    
    const errorMessage = interaction.replied || interaction.deferred
      ? { content: '❌ Erro ao executar comando!', ephemeral: true }
      : { content: '❌ Erro ao executar comando!', ephemeral: true };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

/**
 * Handler do comando /stats
 */
async function handleStatsCommand(interaction) {
  await interaction.deferReply();

  try {
    const response = await axios.get(`${API_URL}/api/stats`);
    const stats = response.data.data;

    // Formata páginas mais acessadas
    const topPages = Object.entries(stats.pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, views], index) => `${index + 1}. \`${page}\` - **${views}** views`)
      .join('\n') || 'Nenhuma página registrada';

    const embed = new EmbedBuilder()
      .setTitle('📊 Estatísticas do Analytics')
      .setColor(0x5865F2)
      .addFields(
        {
          name: '📈 Total de Visualizações',
          value: `**${stats.totalViews}** visualizações`,
          inline: false
        },
        {
          name: '🏆 Top 10 Páginas Mais Acessadas',
          value: topPages,
          inline: false
        }
      )
      .setFooter({ text: 'Public Analytics API' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    console.error('Error fetching stats:', error);
    await interaction.editReply('❌ Erro ao buscar estatísticas!');
  }
}

/**
 * Handler do comando /recent
 */
async function handleRecentCommand(interaction) {
  await interaction.deferReply();

  try {
    const limit = interaction.options.getInteger('limit') || 10;
    const response = await axios.get(`${API_URL}/api/recent?limit=${limit}`);
    const views = response.data.data;

    if (views.length === 0) {
      await interaction.editReply('📭 Nenhuma visualização registrada ainda!');
      return;
    }

    const viewsList = views
      .map((view, index) => {
        const date = new Date(view.timestamp);
        const timestamp = Math.floor(date.getTime() / 1000);
        return `${index + 1}. \`${view.page}\` - <t:${timestamp}:R>`;
      })
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle(`📋 Últimas ${views.length} Visualizações`)
      .setDescription(viewsList)
      .setColor(0x57F287)
      .setFooter({ text: 'Public Analytics API' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    console.error('Error fetching recent views:', error);
    await interaction.editReply('❌ Erro ao buscar visualizações recentes!');
  }
}

/**
 * Handler do comando /page
 */
async function handlePageCommand(interaction) {
  await interaction.deferReply();

  try {
    const page = interaction.options.getString('path');
    const response = await axios.get(`${API_URL}/api/stats/${encodeURIComponent(page)}`);
    const stats = response.data.data;

    const embed = new EmbedBuilder()
      .setTitle('📄 Estatísticas da Página')
      .setColor(0xFEE75C)
      .addFields(
        {
          name: '🔗 Página',
          value: `\`${stats.page}\``,
          inline: false
        },
        {
          name: '👁️ Visualizações',
          value: `**${stats.views}** views`,
          inline: true
        }
      )
      .setFooter({ text: 'Public Analytics API' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    console.error('Error fetching page stats:', error);
    await interaction.editReply('❌ Erro ao buscar estatísticas da página!');
  }
}

/**
 * Registra comandos slash
 */
async function registerCommands() {
  if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN não configurado!');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

  try {
    console.log('🔄 Registrando comandos slash...');

    const commands = [
      statsCommand.toJSON(),
      recentCommand.toJSON(),
      pageCommand.toJSON()
    ];

    // Registra comandos globalmente
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log('✅ Comandos registrados com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
}

// Inicia o bot
if (BOT_TOKEN) {
  client.login(BOT_TOKEN)
    .then(() => {
      // Aguarda o bot estar pronto antes de registrar comandos
      client.once('ready', registerCommands);
    })
    .catch(err => {
      console.error('❌ Erro ao iniciar bot:', err);
    });
} else {
  console.error('❌ BOT_TOKEN não configurado! O bot não será iniciado.');
  console.log('💡 Configure BOT_TOKEN no arquivo .env para habilitar o bot.');
}

module.exports = client;