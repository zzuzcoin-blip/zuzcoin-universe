const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <html>
    <body style="background:black;color:white;text-align:center;padding:50px">
      <h1 style="color:gold">ZUZCOIN PROOFCHAIN</h1>
      <p>Digital Notary • Coin Factory • Philanthropy</p>
      <div style="background:green;padding:20px;margin:20px">
        <h2>For The Giving Pledge</h2>
        <p>1% auto-donate from every transaction</p>
      </div>
    </body>
    </html>
  `);
});
server.listen(8080, () => console.log('Server ready at http://localhost:8080'));
