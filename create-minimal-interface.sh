#!/bin/bash

echo "Creating minimal interface..."

cat > index.html << 'MINIMAL_EOF'
<!DOCTYPE html>
<html>
<head>
    <title>ZUZCOIN Universe</title>
    <style>
        body {
            background: #0a0b0d;
            color: #eaecef;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 2px solid #2a2d3e;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(90deg, #0ea5e9, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .connect-btn {
            background: #00c087;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
        }
        .hero {
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1));
            border-radius: 20px;
            margin: 40px 0;
        }
        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        .card {
            background: #16182c;
            border: 1px solid #2a2d3e;
            border-radius: 12px;
            padding: 24px;
        }
        .card h3 {
            color: #0ea5e9;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">ZUZCOIN Universe</div>
            <button class="connect-btn" onclick="connectWallet()">Connect Wallet</button>
        </div>
        
        <div class="hero">
            <h1 style="font-size: 48px; margin-bottom: 20px;">Trade with Purpose</h1>
            <p style="font-size: 20px; max-width: 800px; margin: 0 auto 30px;">
                Professional blockchain ecosystem with 1% auto-philanthropy.
                Every transaction helps make the world better.
            </p>
            <button style="background: #0ea5e9; color: white; border: none; padding: 15px 30px; 
                    border-radius: 10px; font-size: 18px; cursor: pointer;">
                Start Trading
            </button>
        </div>
        
        <div class="card-grid">
            <div class="card">
                <h3>DEX Trading</h3>
                <p>Swap tokens with 1% auto-donation to charity.</p>
            </div>
            <div class="card">
                <h3>Token Factory</h3>
                <p>Create your own tokens with philanthropy features.</p>
            </div>
            <div class="card">
                <h3>Digital Notary</h3>
                <p>Notarize documents on the blockchain.</p>
            </div>
            <div class="card">
                <h3>KYC Verification</h3>
                <p>Secure identity verification.</p>
            </div>
        </div>
    </div>
    
    <script>
        async function connectWallet() {
            if (!window.ethereum) {
                alert('Please install MetaMask');
                return;
            }
            try {
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                alert('Connected: ' + accounts[0].slice(0,10) + '...');
            } catch (error) {
                alert('Connection failed: ' + error.message);
            }
        }
    </script>
</body>
</html>
MINIMAL_EOF

echo "Minimal interface created successfully!"
