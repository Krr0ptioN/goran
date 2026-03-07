import axios from 'axios';

module.exports = async function () {
    process.env.SECURITY_EXPIRES_IN = process.env.SECURITY_EXPIRES_IN ?? '3600';
    process.env.SECURITY_BCRYPT_SALT = process.env.SECURITY_BCRYPT_SALT ?? '10';
    process.env.JWT_REFRESH_SECRET =
        process.env.JWT_REFRESH_SECRET ?? 'test-refresh';
    process.env.JWT_ACCESS_SECRET =
        process.env.JWT_ACCESS_SECRET ?? 'test-access';
    process.env.SECURITY_REFRESH_IN = process.env.SECURITY_REFRESH_IN ?? '7d';
    process.env.API_BASE_URL =
        process.env.API_BASE_URL ?? 'http://localhost:3000';

    // Configure axios for tests to use.
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT ?? '3000';
    axios.defaults.baseURL = `http://${host}:${port}`;
};
