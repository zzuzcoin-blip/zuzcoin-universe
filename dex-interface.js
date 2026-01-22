// dex-interface.js
const ZUZIM_DEX = {
  // Торговые пары
  tradingPairs: [
    { base: 'ZUZ', quote: 'USER_TOKEN', price: 'auto' },
    { base: 'ETH', quote: 'USER_TOKEN', price: '0.001' },
    { base: 'BNB', quote: 'USER_TOKEN', price: '0.01' }
  ],

  // Авто-донат механизм
  autoDonate: {
    percentage: 1, // 1%
    destination: 'giving_pledge_fund',
    distribution: {
      education: 40,
      health: 30,
      poverty: 30
    }
  },

  // Талмудическая логика
  talmudicRules: {
    maxDailyLoss: 10, // Не более 10% в день (правило защиты)
    charityFirst: true, // Сначала благотворительность, потом прибыль
    transparentFees: true // Все комиссии видны
  }
};// dex-interface.js
const ZUZIM_DEX = {
  // Торговые пары
  tradingPairs: [
    { base: 'ZUZ', quote: 'USER_TOKEN', price: 'auto' },
    { base: 'ETH', quote: 'USER_TOKEN', price: '0.001' },
    { base: 'BNB', quote: 'USER_TOKEN', price: '0.01' }
  ],

  // Авто-донат механизм
  autoDonate: {
    percentage: 1, // 1%
    destination: 'giving_pledge_fund',
    distribution: {
      education: 40,
      health: 30,
      poverty: 30
    }
  },

  // Талмудическая логика
  talmudicRules: {
    maxDailyLoss: 10, // Не более 10% в день (правило защиты)
    charityFirst: true, // Сначала благотворительность, потом прибыль
    transparentFees: true // Все комиссии видны
  }
};