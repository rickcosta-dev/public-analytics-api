const axios = require('axios');

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

/**
 * Envia notificação para o Discord via Webhook
 */
async function sendViewNotification(viewData, totalViews) {
  if (!WEBHOOK_URL) {
    console.warn('⚠️ Discord webhook URL not configured');
    return;
  }

  try {
    const embed = {
      title: '📊 Nova Visualização Registrada',
      color: 0x5865F2, // Cor azul Discord
      fields: [
        {
          name: '📄 Página',
          value: `\`${viewData.page}\``,
          inline: true
        },
        {
          name: '🌐 IP',
          value: `\`${viewData.ip}\``,
          inline: true
        },
        {
          name: '📱 User-Agent',
          value: `\`\`\`${viewData.userAgent.substring(0, 100)}${viewData.userAgent.length > 100 ? '...' : ''}\`\`\``,
          inline: false
        },
        {
          name: '📈 Total de Views',
          value: `**${totalViews}** visualizações`,
          inline: true
        },
        {
          name: '🕐 Timestamp',
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: true
        }
      ],
      footer: {
        text: 'Public Analytics API',
        icon_url: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png'
      },
      timestamp: new Date().toISOString()
    };

    const payload = {
      username: 'Analytics Bot',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png',
      embeds: [embed]
    };

    await axios.post(WEBHOOK_URL, payload);
    console.log('✅ Discord notification sent');

  } catch (error) {
    console.error('❌ Error sending Discord notification:', error.message);
  }
}

/**
 * Envia estatísticas para o Discord
 */
async function sendStatsNotification(stats) {
  if (!WEBHOOK_URL) {
    console.warn('⚠️ Discord webhook URL not configured');
    return;
  }

  try {
    // Formata páginas mais acessadas
    const topPages = Object.entries(stats.pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, views], index) => `${index + 1}. \`${page}\` - ${views} views`)
      .join('\n') || 'Nenhuma página registrada';

    const embed = {
      title: '📊 Estatísticas do Analytics',
      color: 0x57F287, // Verde
      fields: [
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
      ],
      footer: {
        text: 'Public Analytics API',
        icon_url: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png'
      },
      timestamp: new Date().toISOString()
    };

    const payload = {
      username: 'Analytics Bot',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png',
      embeds: [embed]
    };

    await axios.post(WEBHOOK_URL, payload);
    console.log('✅ Stats notification sent to Discord');

  } catch (error) {
    console.error('❌ Error sending stats to Discord:', error.message);
  }
}

module.exports = {
  sendViewNotification,
  sendStatsNotification
};