// РЕАЛЬНЫЙ DEX ИНТЕГРАЦИЯ ДЛЯ ZUZCOIN UNIVERSE
// Добавить этот код в существующий index.html

const REAL_DEX_CONFIG = {
    address: "0x09970975aa48c718e17db4a18128ebf6806e1f2c",
    zuzToken: "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3",
    pyusdToken: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",
    tradingFee: 0.3, // 0.3%
    charityFee: 1.0  // 1%
};

// Функция для инициализации реального DEX
async function initRealDEX() {
    if (!window.ethereum || !window.provider) {
        console.log("Wallet not connected");
        return;
    }
    
    try {
        // Создаем контракт DEX
        const DEX_ABI = [
            "function getSwapQuote(address tokenIn, address tokenOut, uint256 amountIn) view returns (uint256 amountOut, uint256 charityAmount)",
            "function swap(address tokenIn, address tokenOut, uint256 amountIn) returns (uint256)",
            "function getReserves(address tokenA, address tokenB) view returns (uint256 reserveA, uint256 reserveB)",
            "function charityWallet() view returns (address)",
            "function totalCharityDonated() view returns (uint256)"
        ];
        
        window.realDexContract = new ethers.Contract(
            REAL_DEX_CONFIG.address,
            DEX_ABI,
            window.provider.getSigner()
        );
        
        // Обновляем интерфейс
        updateInterfaceForRealDEX();
        
        console.log("✅ Real DEX initialized");
        
    } catch (error) {
        console.error("Error initializing DEX:", error);
    }
}

// Обновляем интерфейс для реального DEX
function updateInterfaceForRealDEX() {
    // Добавляем баннер реального DEX
    const banner = document.createElement('div');
    banner.innerHTML = `
        <div style="
            background: linear-gradient(90deg, #00d18c, #00b377);
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            border-radius: 10px;
            animation: pulse 2s infinite;
        ">
            <i class="fas fa-rocket"></i>
            <strong>🚀 REAL DEX LIVE!</strong> Trade ZUZ/PYUSD with 1% auto-donation
            <i class="fas fa-rocket"></i>
        </div>
    `;
    
    // Находим торговую панель и добавляем баннер
    const tradePanel = document.querySelector('.trading-panel');
    if (tradePanel) {
        tradePanel.parentNode.insertBefore(banner, tradePanel);
    }
    
    // Обновляем кнопки для реальных свапов
    const buyBtn = document.querySelector('.btn-buy');
    const sellBtn = document.querySelector('.btn-sell');
    
    if (buyBtn && sellBtn) {
        buyBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Buy ZUZ (Real DEX)';
        sellBtn.innerHTML = '<i class="fas fa-arrow-down"></i> Sell ZUZ (Real DEX)';
        
        // Добавляем обработчики для реальных свапов
        buyBtn.onclick = () => executeRealSwap('PYUSDtoZUZ');
        sellBtn.onclick = () => executeRealSwap('ZUZtoPYUSD');
    }
}

// Функция для выполнения реального свапа
async function executeRealSwap(direction) {
    if (!window.realDexContract || !window.userAddress) {
        alert("Connect wallet first!");
        return;
    }
    
    try {
        const amountInput = document.getElementById('amountInput');
        const amount = amountInput.value;
        
        if (!amount || amount <= 0) {
            alert("Enter amount!");
            return;
        }
        
        const tokenIn = direction === 'ZUZtoPYUSD' ? REAL_DEX_CONFIG.zuzToken : REAL_DEX_CONFIG.pyusdToken;
        const tokenOut = direction === 'ZUZtoPYUSD' ? REAL_DEX_CONFIG.pyusdToken : REAL_DEX_CONFIG.zuzToken;
        
        // Получаем decimals
        const tokenContract = new ethers.Contract(tokenIn, 
            ["function decimals() view returns (uint8)"],
            window.provider.getSigner()
        );
        
        const decimals = await tokenContract.decimals();
        const amountIn = ethers.utils.parseUnits(amount, decimals);
        
        // Даем approve
        const approveABI = ["function approve(address spender, uint256 amount) returns (bool)"];
        const approveContract = new ethers.Contract(tokenIn, approveABI, window.provider.getSigner());
        const approveTx = await approveContract.approve(REAL_DEX_CONFIG.address, amountIn);
        await approveTx.wait();
        
        // Выполняем свап
        const swapTx = await window.realDexContract.swap(tokenIn, tokenOut, amountIn);
        
        alert(`Swap sent! Hash: ${swapTx.hash}\n1% will go to charity.`);
        
        await swapTx.wait();
        
        alert("✅ Swap completed successfully!\n1% donated to charity.");
        
        // Обновляем балансы
        if (window.loadBalances) {
            window.loadBalances();
        }
        
    } catch (error) {
        alert(`❌ Swap error: ${error.message}`);
    }
}

// Функция для получения котировки
async function getRealQuote(amount, direction) {
    if (!window.realDexContract) return null;
    
    try {
        const tokenIn = direction === 'ZUZtoPYUSD' ? REAL_DEX_CONFIG.zuzToken : REAL_DEX_CONFIG.pyusdToken;
        const tokenOut = direction === 'ZUZtoPYUSD' ? REAL_DEX_CONFIG.pyusdToken : REAL_DEX_CONFIG.zuzToken;
        
        // Получаем decimals
        const tokenInContract = new ethers.Contract(tokenIn, 
            ["function decimals() view returns (uint8)"],
            window.provider
        );
        
        const decimals = await tokenInContract.decimals();
        const amountIn = ethers.utils.parseUnits(amount.toString(), decimals);
        
        // Получаем котировку
        const [amountOut, charityAmount] = await window.realDexContract.getSwapQuote(
            tokenIn, 
            tokenOut, 
            amountIn
        );
        
        // Форматируем результат
        const tokenOutContract = new ethers.Contract(tokenOut, 
            ["function decimals() view returns (uint8)"],
            window.provider
        );
        
        const outDecimals = await tokenOutContract.decimals();
        
        return {
            output: ethers.utils.formatUnits(amountOut, outDecimals),
            charity: ethers.utils.formatUnits(charityAmount, decimals),
            fee: REAL_DEX_CONFIG.tradingFee
        };
        
    } catch (error) {
        console.error("Quote error:", error);
        return null;
    }
}

// Инициализируем при загрузке и подключении кошелька
document.addEventListener('DOMContentLoaded', function() {
    // Перехватываем подключение кошелька
    const originalConnect = window.connectMetaMask;
    if (originalConnect) {
        window.connectMetaMask = async function() {
            await originalConnect();
            await initRealDEX();
        };
    }
    
    // Если кошелек уже подключен
    if (window.ethereum && window.ethereum.selectedAddress) {
        setTimeout(() => initRealDEX(), 1000);
    }
});
