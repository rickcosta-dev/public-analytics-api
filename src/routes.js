const express = require('express');
const router = express.Router();
const analyticsService = require('./services/analyticsService');

/**
 * POST /api/view
 * Registra uma visualização de página
 */
router.post('/view', async (req, res) => {
  try {
    const { page, userAgent, ip } = req.body;

    // Validação
    if (!page) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Field "page" is required' 
      });
    }

    // Captura IP real se não fornecido
    const clientIp = ip || 
                     req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     'unknown';

    // Captura User-Agent se não fornecido
    const clientUserAgent = userAgent || req.headers['user-agent'] || 'unknown';

    // Registra a visualização
    const result = await analyticsService.recordView({
      page,
      userAgent: clientUserAgent,
      ip: clientIp
    });

    res.status(201).json({
      success: true,
      message: 'View recorded successfully',
      data: result
    });

  } catch (error) {
    console.error('Error recording view:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

/**
 * GET /api/stats
 * Retorna estatísticas de visualizações
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await analyticsService.getStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

/**
 * GET /api/stats/:page
 * Retorna estatísticas de uma página específica
 */
router.get('/stats/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const pageStats = await analyticsService.getPageStats(page);
    
    res.json({
      success: true,
      data: pageStats
    });

  } catch (error) {
    console.error('Error fetching page stats:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

/**
 * GET /api/recent
 * Retorna visualizações recentes
 */
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recentViews = await analyticsService.getRecentViews(limit);
    
    res.json({
      success: true,
      data: recentViews
    });

  } catch (error) {
    console.error('Error fetching recent views:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

module.exports = router;