const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Добавляем скрытый переключатель кошельков (появляется при наведении на правый верхний угол)
const hiddenSwitcher = `
<!-- Hidden Wallet Switcher - appears on hover -->
<div id="walletSwitcher" style="
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    opacity: 0.1;
    transition: opacity 0.3s;
    z-index: 1000;
">
    <div style="
        position: relative;
        width: 100%;
        height: 100%;
    ">
        <button onclick="showWalletManager()" style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 68, 68, 0.8);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0.7;
            transition: all 0.3s;
        " title="Switch Wallet">
            🔄
        </button>
        
        <div id="walletStatusBadge" style="
            position: absolute;
            top: -5px;
            right: -5px;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #4CAF50;
            border: 2px solid white;
            display: none;
        "></div>
    </div>
    
    <div id="walletTooltip" style="
        position: absolute;
        top: 50px;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        width: 200px;
        display: none;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    ">
        <div style="margin-bottom: 5px;"><strong>Wallet Status:</strong></div>
        <div id="tooltipAccount">Checking...</div>
        <div id="tooltipBalance" style="margin-top: 5px;"></div>
        <button onclick="showWalletManager()" style="
            background: #F6851B;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 10px;
            margin-top: 10px;
            width: 100%;
            cursor: pointer;
        ">
            Switch Wallet
        </button>
    </div>
</div>

<script>
// Wallet Manager functions
function showWalletManager() {
    window.open('/wallet-manager.html', '_blank', 'width=600,height=800');
}

// Update wallet status
async function updateWalletStatus() {
    const badge = document.getElementById('walletStatusBadge');
    const tooltipAccount = document.getElementById('tooltipAccount');
    const tooltipBalance = document.getElementById('tooltipBalance');
    
    if (typeof window.ethereum === 'undefined') {
        badge.style.display = 'none';
        tooltipAccount.textContent = 'No wallet detected';
        return;
    }
    
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
            // Show connected badge
            badge.style.display = 'block';
            
            // Update tooltip
            const account = accounts[0];
            tooltipAccount.textContent = account.substring(0, 6) + '...' + account.substring(38);
            
            // Get ETH balance
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest']
            });
            const ethBalance = parseInt(balance) / 1e18;
            tooltipBalance.textContent = 'ETH: ' + ethBalance.toFixed(4);
            
        } else {
            badge.style.display = 'none';
            tooltipAccount.textContent = 'Not connected';
        }
    } catch (error) {
        badge.style.display = 'none';
        tooltipAccount.textContent = 'Error checking';
    }
}

// Show tooltip on hover
document.addEventListener('DOMContentLoaded', function() {
    const switcher = document.getElementById('walletSwitcher');
    const tooltip = document.getElementById('walletTooltip');
    
    switcher.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
        tooltip.style.display = 'block';
        updateWalletStatus();
    });
    
    switcher.addEventListener('mouseleave', function() {
        this.style.opacity = '0.1';
        tooltip.style.display = 'none';
    });
    
    // Initial check
    updateWalletStatus();
    setInterval(updateWalletStatus, 10000);
});
</script>
`;

// Добавляем только если ещё нет
if (!html.includes('id="walletSwitcher"')) {
    html = html.replace('<body>', '<body>' + hiddenSwitcher);
    fs.writeFileSync('index.html', html);
    console.log('✅ Hidden wallet switcher added (hover top-right corner)');
} else {
    console.log('⚠️ Wallet switcher already exists');
}
