// Конфигурация API для фронтенда
const API_CONFIG = {
  // Базовый URL API
  BASE_URL: window.location.origin + '/api',
  
  // Или если фронтенд на другом домене
  // BASE_URL: 'https://workspace.alekseev2508.repl.co/api',
  
  // Эндпоинты
  ENDPOINTS: {
    STATUS: '/status',
    BLOCKCHAIN_STATUS: '/blockchain/status',
    REGISTER: '/register',
    CREATE_COIN: '/create-coin',
    GET_TRANSACTION: '/transaction'
  },
  
  // Полный URL для эндпоинта
  getUrl(endpoint) {
    return this.BASE_URL + this.ENDPOINTS[endpoint];
  },
  
  // Утилиты для запросов
  async fetchBlockchainStatus() {
    try {
      const response = await fetch(this.getUrl('BLOCKCHAIN_STATUS'));
      return await response.json();
    } catch (error) {
      return { connected: false, error: error.message };
    }
  },
  
  async registerWork(workTitle) {
    try {
      const response = await fetch(this.getUrl('REGISTER'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ work: workTitle })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Для использования в браузере
if (typeof window !== 'undefined') {
  window.ZUZCOIN_API = API_CONFIG;
}

// Для использования в Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
