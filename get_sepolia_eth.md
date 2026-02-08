# 🆓 КАК ПОЛУЧИТЬ БЕСПЛАТНЫЕ Sepolia ETH и API КЛЮЧИ:

## 1. SEPOLIA ETH (для газа):
- Перейдите на: https://sepoliafaucet.com
- Вставьте адрес вашего MetaMask кошелька
- Получите 0.5 Sepolia ETH бесплатно
- Альтернатива: https://faucet.quicknode.com/ethereum/sepolia

## 2. ALCHEMY API KEY (для RPC):
- Зарегистрируйтесь на: https://alchemy.com
- Создайте новый App → Выберите Ethereum → Sepolia network
- Скопируйте HTTPS URL (будет типа: https://eth-sepolia.g.alchemy.com/v2/ВАШ_КЛЮЧ)

## 3. ETHERSCAN API KEY (для верификации):
- Зарегистрируйтесь на: https://etherscan.io
- Перейдите в My Account → API Keys → Add
- Скопируйте ваш API ключ

## 4. PRIVATE KEY из MetaMask:
- Откройте MetaMask → Account Details → Export Private Key
- ОСТОРОЖНО: Никому не показывайте этот ключ!
- Скопируйте ключ (начинается с 0x)

## 📝 ОБНОВИТЕ ФАЙЛ .env:
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/ВАШ_ALCHEMY_KEY
PRIVATE_KEY=0xВАШ_ПРИВАТНЫЙ_КЛЮЧ
ETHERSCAN_API_KEY=ВАШ_ETHERSCAN_API
