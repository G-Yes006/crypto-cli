#!/usr/bin/env node

const { Command } = require('commander');
const { encryptEnv, decryptEnv } = require('../src/encryptor');
const fs = require('node:fs');
const path = require('node:path');
const program = new Command();

const ENV_FILE = path.resolve(process.cwd(), '.env');
const ENCRYPTED_FILE = path.resolve(process.cwd(), '.env.enc');

program
    .command('encrypt')
    .description('Encrypt .env file content')
    .requiredOption('-p, --password <password>', 'Password to encrypt the file')
    .action((options) => {
        if (!fs.existsSync(ENV_FILE)) {
            console.error('.env file not found!');
            process.exit(1);
        }
        const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
        const encrypted = encryptEnv(envContent, options.password);
        fs.writeFileSync(ENCRYPTED_FILE, encrypted);
        console.log('Encrypted content saved to .env.enc');
    });

program
    .command('decrypt')
    .description('Decrypt .env file content')
    .requiredOption('-p, --password <password>', 'Password to decrypt the file')
    .action((options) => {
        if (!fs.existsSync(ENCRYPTED_FILE)) {
            console.error('.env.enc file not found!');
            process.exit(1);
        }
        const encryptedContent = fs.readFileSync(ENCRYPTED_FILE, 'utf-8');
        const decrypted = decryptEnv(encryptedContent, options.password);
        fs.writeFileSync(ENV_FILE, decrypted);
        console.log('Decrypted content saved to .env');
    });

program.parse(process.argv);
