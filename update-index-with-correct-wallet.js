const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Удаляем старые wallet скрипты
html = html.replace(/<script src="wallet-connector\.js"><\/script>/g, '');
html = html.replace(/<script src="https:\/\/cdn\.ethers\.io\/lib\/ethers-5\.7\.umd\.min\.js"><\/script>/g, '');

// Добавляем ethers и правильный коннектор
const correctScripts = `
  <!-- Ethers.js -->
  <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
  
  <!-- Correct Wallet Connector -->
  <script src="correct-wallet-connector.js"></script>
  
  <style>
    #metaMaskConnectBtn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(246, 133, 27, 0.4);
    }
    #metaMaskConnectBtn:active {
      transform: translateY(0);
    }
  </style>
`;

if (!html.includes('correct-wallet-connector.js')) {
  html = html.replace('</body>', correctScripts + '</body>');
  fs.writeFileSync('index.html', html);
  console.log('✅ Correct wallet connector added!');
}

// Также создаем простой тест
fs.writeFileSync('simple-test.html', `
<!DOCTYPE html>
<html>
<head>
  <title>Simple MetaMask Test</title>
  <script>
  async function connectSimple() {
    console.log('Trying to connect...');
    
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }
    
    try {
      // ЭТО ДОЛЖНО ВЫЗВАТЬ ВСПЛЫВАЮЩЕЕ ОКНО META MASK!
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      alert('Connected: ' + accounts[0]);
      document.getElementById('result').innerHTML = 
        '✅ Connected: ' + accounts[0].substring(0, 6) + '...' + accounts[0].substring(38);
        
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
  </script>
</head>
<body style="background: #222; color: white; padding: 50px; text-align: center;">
  <h1>🦊 Simple MetaMask Test</h1>
  <p>This should open MetaMask popup when you click the button:</p>
  
  <button onclick="connectSimple()" style="
    background: #F6851B;
    color: white;
    border: none;
    padding: 20px 40px;
    font-size: 20px;
    border-radius: 10px;
    cursor: pointer;
    margin: 20px;
  ">
    🔗 Connect MetaMask
  </button>
  
  <div id="result" style="margin-top: 30px; font-size: 18px;"></div>
  
  <p style="margin-top: 50px; color: #aaa;">
    If popup doesn't appear, check:<br>
    1. MetaMask is installed<br>
    2. You're not already connected<br>
    3. Check browser console (F12)
  </p>
</body>
</html>
`);

console.log('✅ Simple test page created: simple-test.html');
