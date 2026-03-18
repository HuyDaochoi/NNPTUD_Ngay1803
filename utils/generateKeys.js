const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate RSA key pair (2048 bytes)
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// Save keys to files
const keysDir = path.join(__dirname, '../keys');

// Create keys directory if it doesn't exist
if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
}

fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey);
fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey);

console.log('RSA keys generated successfully!');
console.log('Private key: keys/private.pem');
console.log('Public key: keys/public.pem');
