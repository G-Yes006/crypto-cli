const crypto = require('node:crypto');
const algorithm = 'aes-256-cbc'; // Algorithm to use

// Function to encrypt
function encryptEnv(envContent, password) {
  const iv = crypto.randomBytes(16); // Initialization vector
  const key = crypto.scryptSync(password, 'salt', 32); // Derive key
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(envContent, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`; // Return iv and encrypted content
}

// Function to decrypt
function decryptEnv(encryptedContent, password) {
  const [ivHex, encryptedText] = encryptedContent.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = crypto.scryptSync(password, 'salt', 32); // Derive key
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encryptEnv, decryptEnv };
