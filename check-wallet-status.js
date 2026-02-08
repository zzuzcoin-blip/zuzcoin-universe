// Проверяем текущий статус подключения MetaMask

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🔍 Checking wallet status...');
    
    if (typeof window.ethereum === 'undefined') {
        console.log('❌ MetaMask not installed');
        showStatus('❌ MetaMask not installed', 'red');
        return;
    }
    
    try {
        // Проверяем какие аккаунты уже подключены
        const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
            console.log('✅ Already connected:', accounts[0]);
            showStatus(`✅ Connected: ${accounts[0].substring(0,6)}...${accounts[0].substring(38)}`, 'green');
            
            // Проверяем баланс
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [accounts[0], 'latest']
            });
            const ethBalance = parseInt(balance) / 1e18;
            console.log(`💰 Balance: ${ethBalance} ETH`);
            
            // Добавляем кнопку для подключения другого кошелька
            addSwitchWalletButton();
            
        } else {
            console.log('⚠️ Not connected');
            showStatus('⚠️ Not connected to MetaMask', 'orange');
            addConnectButton();
        }
        
    } catch (error) {
        console.error('Error checking status:', error);
        showStatus(`❌ Error: ${error.message}`, 'red');
    }
});

function showStatus(message, color) {
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: ${color === 'green' ? 'rgba(76, 175, 80, 0.9)' : 
                     color === 'red' ? 'rgba(244, 67, 54, 0.9)' : 
                     'rgba(255, 152, 0, 0.9)'};
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 10000;
    `;
    statusDiv.textContent = message;
    document.body.appendChild(statusDiv);
    
    setTimeout(() => {
        document.body.removeChild(statusDiv);
    }, 5000);
}

function addConnectButton() {
    const button = document.createElement('button');
    button.textContent = '🦊 Connect MetaMask';
    button.style.cssText = `
        position: fixed;
        top: 50px;
        right: 10px;
        background: #F6851B;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 10000;
    `;
    
    button.onclick = async function() {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            if (accounts.length > 0) {
                alert(`✅ Connected: ${accounts[0]}`);
                location.reload();
            }
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
        }
    };
    
    document.body.appendChild(button);
}

function addSwitchWalletButton() {
    const button = document.createElement('button');
    button.textContent = '🔄 Switch Wallet';
    button.style.cssText = `
        position: fixed;
        top: 50px;
        right: 10px;
        background: #2196F3;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 10000;
    `;
    
    button.onclick = async function() {
        try {
            // Отключаем текущий кошелек
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{
                    eth_accounts: {}
                }]
            });
            
            // Запрашиваем подключение снова (покажет окно выбора)
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts.length > 0) {
                alert(`✅ Switched to: ${accounts[0]}`);
                location.reload();
            }
        } catch (error) {
            console.error('Switch error:', error);
            alert(`❌ Error: ${error.message}`);
        }
    };
    
    document.body.appendChild(button);
}

console.log('✅ Wallet status checker loaded');
