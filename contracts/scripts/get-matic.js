const https = require('https');

async function requestFromFaucet(address) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_sendTransaction',
      params: [{
        to: address,
        value: '0x16345785D8A0000', // 0.1 MATIC in hex
        gas: '0x5208',
        gasPrice: '0x5D21DBA000' // 25 gwei
      }],
      id: 1
    });

    const options = {
      hostname: 'rpc-amoy.polygon.technology',
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function getMaticFromFaucet() {
  const address = process.env.PRIVATE_KEY ? 
    new (require('ethers')).Wallet(process.env.PRIVATE_KEY).address : 
    '0xF9c3F6011C6C9036b99fa67Fb3ea4A7EBdcC76cB';
  
  console.log(`💰 Requesting MATIC for address: ${address}`);
  
  try {
    // Try multiple faucets
    const faucets = [
      'https://faucet.polygon.technology/',
      'https://www.alchemy.com/faucets/polygon-amoy',
      'https://faucets.chain.link/amoy'
    ];
    
    console.log('🔗 Available faucets:');
    faucets.forEach((faucet, i) => {
      console.log(`  ${i + 1}. ${faucet}`);
    });
    
    console.log('\n📝 Manual steps:');
    console.log('1. Go to one of the faucets above');
    console.log(`2. Enter your address: ${address}`);
    console.log('3. Select Amoy Testnet');
    console.log('4. Request 0.1 MATIC');
    console.log('5. Wait for confirmation');
    
    console.log('\n⏳ After getting MATIC, run:');
    console.log('npx hardhat run scripts/check-balance.js --network amoy');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getMaticFromFaucet();
