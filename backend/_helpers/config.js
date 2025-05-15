require('dotenv').config();
const defaultConfig = require('../config.json');

function getConfig() {
    // Helper function to get environment variable or fallback
    const getEnv = (key, fallback) => {
        const value = process.env[key];
        console.log(`Loading ${key}:`, value || fallback); // Debug log
        return value || fallback;
    };

    // Override config with environment variables
    const envConfig = {
        database: {
            host: getEnv('DB_HOST', defaultConfig.database.host),
            port: parseInt(getEnv('DB_PORT', defaultConfig.database.port)),
            user: getEnv('DB_USER', defaultConfig.database.user),
            password: getEnv('DB_PASSWORD', defaultConfig.database.password),
            database: getEnv('DB_NAME', defaultConfig.database.database)
        },
        secret: getEnv('JWT_SECRET', defaultConfig.secret),
        emailFrom: getEnv('EMAIL_FROM', defaultConfig.emailFrom),
        smtpOptions: {
            host: getEnv('SMTP_HOST', defaultConfig.smtpOptions.host),
            port: parseInt(getEnv('SMTP_PORT', defaultConfig.smtpOptions.port)),
            auth: {
                user: getEnv('SMTP_USER', defaultConfig.smtpOptions.auth.user),
                pass: getEnv('SMTP_PASS', defaultConfig.smtpOptions.auth.pass)
            }
        },
        frontendUrls: {
            development: getEnv('FRONTEND_URL', defaultConfig.frontendUrls.development),
            production: getEnv('PRODUCTION_FRONTEND_URL', defaultConfig.frontendUrls.production)
        }
    };

    console.log('Final database config:', {
        host: envConfig.database.host,
        port: envConfig.database.port,
        user: envConfig.database.user,
        database: envConfig.database.database
    });

    return envConfig;
}

module.exports = getConfig(); 