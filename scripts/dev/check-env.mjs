import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';

const rootDir = process.cwd();
const envPath = resolve(rootDir, '.env');
const envLocalPath = resolve(rootDir, '.env.local');

if (existsSync(envPath)) {
    config({ path: envPath });
}

if (existsSync(envLocalPath)) {
    config({ path: envLocalPath, override: true });
}

const required = [
    'SECURITY_EXPIRES_IN',
    'SECURITY_BCRYPT_SALT',
    'JWT_REFRESH_SECRET',
    'JWT_ACCESS_SECRET',
    'SECURITY_REFRESH_IN',
    'API_BASE_URL',
];

const recommended = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_PASS',
    'DB_DATABASE',
    'MAIL_INFRA',
    'MAIL_HOST',
    'MAIL_PORT',
    'FILES_INFRA',
    'FILES_MINIO_ENDPOINT',
    'FILES_MINIO_PORT',
    'FILES_MINIO_ACCESSKEY',
    'FILES_MINIO_SECRETKEY',
    'FILES_MINIO_BUCKETNAME',
];

const isMissing = (key) => {
    const value = process.env[key];
    return value === undefined || value.trim() === '';
};

const missingRequired = required.filter(isMissing);
const missingRecommended = recommended.filter(isMissing);

if (missingRequired.length > 0) {
    if (!existsSync(envPath)) {
        console.error('Missing .env file. Run `pnpm dev:setup` first.');
    }

    console.error('Missing required environment variables:');
    for (const key of missingRequired) {
        console.error(`- ${key}`);
    }
    process.exit(1);
}

if (missingRecommended.length > 0) {
    console.warn('Missing recommended environment variables:');
    for (const key of missingRecommended) {
        console.warn(`- ${key}`);
    }
}

console.log('Environment validation passed.');
