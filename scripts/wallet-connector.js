// ZUZIM Multi-Wallet Connector
// Поддержка: MetaMask, Coinbase, Trust, Phantom, WalletConnect

class ZUZWallet {
    constructor() {
        this.account = null;
        this.chainId = null;
        this.balance = "0";
        this.providerName = null;
        console.log("💰 ZUZ Wallet initialized");
    }

    // Показываем все доступные кошельки
    showWalletButtons() {
        const container = document.getElementById('wallet-buttons');
        if (!container) return;
        
        container.innerHTML = '';
        
        const wallets = [
            { id: 'metamask', name: 'MetaMask', icon: '🦊', color: '#F6851B' },
            { id: 'coinbase', name: 'Coinbase', icon: '📱', color: '#0052FF' },
            { id: 'trust', name: 'Trust Wallet', icon: '🔒', color: '#3375BB' },
            { id: 'phantom', name: 'Phantom', icon: '👻', color: '#AB9FF2' },
            { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', color: '#3B99FC' }
        ];
        
        wallets.forEach(wallet => {
            const btn = document.createElement('button');
            btn.className = 'wallet-btn';
            btn.innerHTML = `
                <span class="wallet-icon">${wallet.icon}</span>
                <span>${wallet.name}</span>
            `;
            btn.style.backgroundColor = wallet.color;
            btn.onclick = () => this.connectWallet(wallet.id);
            container.appendChild(btn);
        });
    }

    // Подключение кошелька
    async connectWallet(walletId) {
        console.log(`Connecting ${walletId}...`);
        
        try {
            let accounts;
            
            switch(walletId) {
                case 'metamask':
                case 'coinbase':
                case 'trust':
                case 'phantom':
                    if (!window.ethereum) {
                        alert(`Please install ${walletId} wallet`);
                        return;
                    }
                    accounts = await window.ethereum.request({ 
                        method: 'eth_requestAccounts' 
                    });
                    this.providerName = walletId;
                    break;
                    
                case 'walletconnect':
                    alert('WalletConnect coming soon');
                    return;
            }
            
            this.account = accounts[0];
            this.chainId = await this.getChainId();
            
            console.log(`✅ Connected: ${this.account}`);
            this.showConnectedWallet();
            
            // Слушаем события
            this.setupListeners();
            
        } catch (error) {
            console.error('Connection failed:', error);
            alert(`Connection error: ${error.message}`);
        }
    }

    async getChainId() {
        if (!window.ethereum) return null;
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        return parseInt(chainId);
    }

    async getBalance() {
        if (!this.account || !window.ethereum) return;
        
        try {
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [this.account, 'latest']
            });
            this.balance = (parseInt(balance) / 1e18).toFixed(4);
            this.updateBalanceDisplay();
        } catch (error) {
            console.error('Balance error:', error);
        }
    }

    showConnectedWallet() {
        const container = document.getElementById('wallet-buttons');
        if (!container) return;
        
        const shortAddr = `${this.account.slice(0,6)}...${this.account.slice(-4)}`;
        
        container.innerHTML = `
            <div class="connected-wallet">
                <div class="wallet-info">
                    <span class="wallet-icon">👛</span>
                    <span class="wallet-address">${shortAddr}</span>
                    <span class="network-badge">${this.getNetworkName()}</span>
                </div>
                <div class="wallet-balance">
                    <span class="balance">${this.balance}</span>
                    <span class="currency">ETH</span>
                </div>
                <div class="wallet-actions">
                    <button class="wallet-btn-small" onclick="window.zuzWallet.copyAddress()">
                        📋 Copy
                    </button>
                    <button class="wallet-btn-small" onclick="window.zuzWallet.disconnect()">
                        🚪 Disconnect
                    </button>
                </div>
            </div>
        `;
        
        this.getBalance();
    }

    getNetworkName() {
        const networks = {
            1: 'Mainnet',
            11155111: 'Sepolia',
            5: 'Goerli',
            137: 'Polygon',
            56: 'BSC'
        };
        return networks[this.chainId] || `Chain ${this.chainId}`;
    }

    setupListeners() {
        if (!window.ethereum) return;
        
        window.ethereum.on('accountsChanged', (accounts) => {
            this.account = accounts[0] || null;
            if (this.account) {
                this.showConnectedWallet();
            } else {
                this.disconnect();
            }
        });
        
        window.ethereum.on('chainChanged', () => {
            location.reload();
        });
    }

    copyAddress() {
        if (!this.account) return;
        navigator.clipboard.writeText(this.account);
        alert('Address copied!');
    }

    disconnect() {
        this.account = null;
        this.chainId = null;
        this.balance = "0";
        this.providerName = null;
        
        const container = document.getElementById('wallet-buttons');
        if (container) {
            container.innerHTML = '';
            this.showWalletButtons();
        }
        
        console.log('🔌 Wallet disconnected');
    }

    // Инициализация
    init() {
        if (window.ethereum && window.ethereum.selectedAddress) {
            this.account = window.ethereum.selectedAddress;
            this.chainId = parseInt(window.ethereum.chainId);
            this.showConnectedWallet();
        } else {
            this.showWalletButtons();
        }
    }
}

// Глобальный доступ
window.zuzWallet = new ZUZWallet();

// Авто-инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.zuzWallet.init();
    });
} else {
    window.zuzWallet.init();
}

console.log('✅ ZUZ Wallet loaded');
