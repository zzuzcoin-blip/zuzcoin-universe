// РАБОТАЮЩИЙ КОД ПОДКЛЮЧЕНИЯ ИЗ ИСХОДНОГО index.html

// Конфигурация реального DEX
const DEX_CONFIG = {
    address: "0x09970975aa48c718e17db4a18128ebf6806e1f2c",
    zuzToken: "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3",
    pyusdToken: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",
    tradingFee: 0.3,
    charityFee: 1.0
};

let provider, signer, userAddress;

// Подключение MetaMask
async function connectMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        alert("Please install MetaMask!");
        return;
    }
    
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        // Показываем балансы
        document.getElementById('balanceContainer').style.display = 'flex';
        document.getElementById('connectWalletBtn').innerHTML = '<i class="fas fa-wallet"></i><span>Connected</span>';
        
        // Загружаем балансы
        await loadBalances();
        
        // Инициализируем реальный DEX
        await initRealDEX();
        
        // Показываем баннер DEX
        document.getElementById('realDexBanner').style.display = 'block';
        document.getElementById('dexStatus').style.display = 'flex';
        
        // Проверяем статус пары
        checkPairStatus();
        
    } catch (error) {
        alert("Error connecting wallet: " + error.message);
    }
}

// Загрузка балансов
async function loadBalances() {
    try {
        // ETH баланс
        const ethBalance = await provider.getBalance(userAddress);
        document.getElementById('ethBalance').textContent = 
            ethers.utils.formatEther(ethBalance).substring(0, 8) + ' ETH';
        
        // ZUZ баланс
        const zuzABI = ["function balanceOf(address) view returns (uint256)"];
        const zuzContract = new ethers.Contract(DEX_CONFIG.zuzToken, zuzABI, provider);
        const zuzBalance = await zuzContract.balanceOf(userAddress);
        const zuzDecimals = 18; // или получить из контракта
        
        document.getElementById('zuzBalance').textContent = 
            ethers.utils.formatUnits(zuzBalance, zuzDecimals).split('.')[0] + ' ZUZ';
        
        // Сеть
        const network = await provider.getNetwork();
        document.getElementById('networkName').textContent = 
            network.name.charAt(0).toUpperCase() + network.name.slice(1);
        
    } catch (error) {
        console.error("Error loading balances:", error);
    }
}
