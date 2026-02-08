// WORKING WALLET CONNECTOR FROM ORIGINAL PROJECT
// This is the proven working version

let isWalletConnected = false;
let currentAccount = null;

async function connectWallet() {
    console.log("🦊 Attempting to connect wallet...");
    
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed! Please install it to use this DApp.');
        return;
    }
    
    try {
        console.log("Requesting accounts from MetaMask...");
        
        // THIS SHOULD TRIGGER METAMASK POPUP
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        if (accounts.length === 0) {
            console.log("No accounts found");
            return;
        }
        
        currentAccount = accounts[0];
        isWalletConnected = true;
        
        console.log("✅ Connected account:", currentAccount);
        
        // Update UI
        updateWalletUI();
        
        // Update balances
        updateBalances();
        
        alert("✅ Wallet connected successfully!\nAddress: " + 
              currentAccount.substring(0, 6) + "..." + 
              currentAccount.substring(38));
        
    } catch (error) {
        console.error("❌ Wallet connection error:", error);
        
        if (error.code === 4001) {
            alert("❌ Connection rejected by user");
        } else if (error.code === -32002) {
            alert("⚠️ MetaMask is already processing a request. Please check your MetaMask.");
        } else {
            alert("❌ Error: " + error.message);
        }
    }
}

function updateWalletUI() {
    const connectBtn = document.getElementById('connectWalletBtn');
    const walletInfo = document.getElementById('walletInfo');
    
    if (!connectBtn) {
        // Create button if it doesn't exist
        createWalletButton();
        return;
    }
    
    if (isWalletConnected && currentAccount) {
        connectBtn.innerHTML = `✅ ${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
        connectBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
        
        if (walletInfo) {
            walletInfo.style.display = 'block';
            document.getElementById('connectedAddress').textContent = currentAccount;
        }
    } else {
        connectBtn.innerHTML = '🦊 Connect Wallet';
        connectBtn.style.background = 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)';
        
        if (walletInfo) {
            walletInfo.style.display = 'none';
        }
    }
}

function createWalletButton() {
    const walletDiv = document.createElement('div');
    walletDiv.innerHTML = `
        <div style="position: absolute; top: 20px; right: 20px; z-index: 1000;">
            <button id="connectWalletBtn" style="
                background: linear-gradient(135deg, #F6851B 0%, #E2761B 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            ">
                🦊 Connect Wallet
            </button>
            
            <div id="walletInfo" style="
                margin-top: 15px;
                background: rgba(255,255,255,0.1);
                padding: 15px;
                border-radius: 10px;
                font-size: 12px;
                display: none;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            ">
                <div style="margin-bottom: 5px;">📍 <strong>Connected:</strong> <span id="connectedAddress"></span></div>
                <div style="margin-bottom: 5px;">📊 <strong>ETH:</strong> <span id="ethBalance">Loading...</span></div>
                <div style="margin-bottom: 5px;">🪙 <strong>ZUZ:</strong> <span id="zuzBalance">Loading...</span></div>
                <button onclick="disconnectWallet()" style="
                    background: #ff4444;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 10px;
                    margin-top: 5px;
                    cursor: pointer;
                ">
                    Disconnect
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(walletDiv.firstChild);
    
    // Add event listener
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
}

function disconnectWallet() {
    isWalletConnected = false;
    currentAccount = null;
    updateWalletUI();
    alert("Wallet disconnected");
}

async function updateBalances() {
    if (!isWalletConnected || !currentAccount) return;
    
    try {
        // Get ETH balance
        const ethBalance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [currentAccount, 'latest']
        });
        
        const ethInEth = parseInt(ethBalance) / 1e18;
        document.getElementById('ethBalance').textContent = ethInEth.toFixed(4) + ' ETH';
        
        // Get ZUZ balance
        if (typeof ethers !== 'undefined') {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const zuzContract = new ethers.Contract(
                '0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3',
                [
                    "function balanceOf(address) view returns (uint256)",
                    "function decimals() view returns (uint8)"
                ],
                provider
            );
            
            const zuzBalance = await zuzContract.balanceOf(currentAccount);
            const decimals = await zuzContract.decimals();
            const zuzInTokens = parseInt(zuzBalance) / (10 ** decimals);
            
            document.getElementById('zuzBalance').textContent = zuzInTokens.toFixed(0) + ' ZUZ';
        }
        
    } catch (error) {
        console.error('Balance update error:', error);
        document.getElementById('ethBalance').textContent = 'Error';
        document.getElementById('zuzBalance').textContent = 'Error';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Wallet connector initialized');
    
    // Create wallet button
    createWalletButton();
    
    // Check if already connected
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
                if (accounts.length > 0) {
                    currentAccount = accounts[0];
                    isWalletConnected = true;
                    updateWalletUI();
                    updateBalances();
                }
            })
            .catch(console.error);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                currentAccount = accounts[0];
                isWalletConnected = true;
            } else {
                currentAccount = null;
                isWalletConnected = false;
            }
            updateWalletUI();
            updateBalances();
        });
    }
});

// Add styles
const style = document.createElement('style');
style.textContent = `
    #connectWalletBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(246, 133, 27, 0.4);
    }
    #connectWalletBtn:active {
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

console.log('✅ Working wallet connector loaded');
