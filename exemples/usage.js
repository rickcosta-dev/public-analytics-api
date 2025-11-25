/**
 * Exemplos de uso da Public Analytics API
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// ============================================
// Exemplo 1: Registrar uma visualização
// ============================================
async function registerView() {
  try {
    const response = await axios.post(`${API_URL}/view`, {
      page: '/home',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      ip: '192.168.1.100'
    });

    console.log('✅ View registrada:', response.data);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// ============================================
// Exemplo 2: Obter estatísticas gerais
// ============================================
async function getStats() {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    console.log('📊 Estatísticas:', response.data);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// ============================================
// Exemplo 3: Obter estatísticas de uma página
// ============================================
async function getPageStats(page) {
  try {
    const response = await axios.get(`${API_URL}/stats/${encodeURIComponent(page)}`);
    console.log(`📄 Stats de ${page}:`, response.data);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// ============================================
// Exemplo 4: Obter visualizações recentes
// ============================================
async function getRecentViews(limit = 10) {
  try {
    const response = await axios.get(`${API_URL}/recent?limit=${limit}`);
    console.log('📋 Visualizações recentes:', response.data);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// ============================================
// Exemplo 5: Integração com site HTML
// ============================================
function htmlIntegrationExample() {
  const code = `
<!-- Adicione este código no seu site HTML -->
<script>
  // Função para registrar visualização
  async function trackPageView() {
    try {
      await fetch('http://localhost:3000/api/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          ip: '' // Será capturado automaticamente pela API
        })
      });
      console.log('✅ View registrada');
    } catch (error) {
      console.error('❌ Erro ao registrar view:', error);
    }
  }

  // Registra a visualização quando a página carregar
  window.addEventListener('load', trackPageView);
</script>
  `;

  console.log('🌐 Exemplo de integração HTML:');
  console.log(code);
}

// ============================================
// Exemplo 6: Integração com React
// ============================================
function reactIntegrationExample() {
  const code = `
// Componente React com tracking
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    // Registra visualização quando o componente monta
    const trackView = async () => {
      try {
        await axios.post('http://localhost:3000/api/view', {
          page: window.location.pathname,
          userAgent: navigator.userAgent
        });
      } catch (error) {
        console.error('Erro ao registrar view:', error);
      }
    };

    trackView();
  }, []);

  return (
    <div>
      <h1>Minha Aplicação</h1>
      {/* Seu conteúdo aqui */}
    </div>
  );
}

export default App;
  `;

  console.log('⚛️ Exemplo de integração React:');
  console.log(code);
}

// ============================================
// Executar exemplos
// ============================================
async function runExamples() {
  console.log('🚀 Executando exemplos de uso...\n');

  // Registra algumas views de exemplo
  await registerView();
  
  await axios.post(`${API_URL}/view`, {
    page: '/about',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    ip: '192.168.1.101'
  });

  await axios.post(`${API_URL}/view`, {
    page: '/contact',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    ip: '192.168.1.102'
  });

  console.log('\n');

  // Obtém estatísticas
  await getStats();
  console.log('\n');

  // Obtém stats de página específica
  await getPageStats('/home');
  console.log('\n');

  // Obtém visualizações recentes
  await getRecentViews(5);
  console.log('\n');

  // Mostra exemplos de integração
  htmlIntegrationExample();
  console.log('\n');
  reactIntegrationExample();
}

// Executa se for chamado diretamente
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  registerView,
  getStats,
  getPageStats,
  getRecentViews
};