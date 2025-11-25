const database = require('../database');
const discordService = require('./discordService');

/**
 * Registra uma visualização
 */
async function recordView({ page, userAgent, ip }) {
  try {
    // Insere no banco de dados
    const view = await database.insertView(page, userAgent, ip);

    // Obtém total de visualizações
    const totalViews = await database.getTotalViews();

    // Envia notificação para o Discord (não aguarda para não bloquear)
    discordService.sendViewNotification(view, totalViews)
      .catch(err => console.error('Discord notification error:', err));

    return {
      view,
      totalViews
    };

  } catch (error) {
    console.error('Error recording view:', error);
    throw error;
  }
}

/**
 * Retorna estatísticas gerais
 */
async function getStats() {
  try {
    const totalViews = await database.getTotalViews();
    const pages = await database.getViewsByPage();

    return {
      totalViews,
      pages
    };

  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

/**
 * Retorna estatísticas de uma página específica
 */
async function getPageStats(page) {
  try {
    const stats = await database.getPageStats(page);
    return stats;

  } catch (error) {
    console.error('Error fetching page stats:', error);
    throw error;
  }
}

/**
 * Retorna visualizações recentes
 */
async function getRecentViews(limit = 10) {
  try {
    const views = await database.getRecentViews(limit);
    return views;

  } catch (error) {
    console.error('Error fetching recent views:', error);
    throw error;
  }
}

module.exports = {
  recordView,
  getStats,
  getPageStats,
  getRecentViews
};