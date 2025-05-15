const config = require('config.json');
require('dotenv').config();

function getConfig() {
    // Helper function to get environment variable or fallback
    const getEnv = (key, fallback) => {
        return process.env[key] || fallback;
    };

    // Override config with environment variables
    const envConfig = {
        database: {
            host: getEnv('DB_HOST', config.database.host),
            port: parseInt(getEnv('DB_PORT', config.database.port)),
            user: getEnv('DB_USER', config.database.user),
            password: getEnv('DB_PASSWORD', config.database.password),
            database: getEnv('DB_NAME', config.database.database)
        },
        secret: getEnv('JWT_SECRET', config.secret),
        emailFrom: getEnv('EMAIL_FROM', config.emailFrom),
        smtpOptions: {
            host: getEnv('SMTP_HOST', config.smtpOptions.host),
            port: parseInt(getEnv('SMTP_PORT', config.smtpOptions.port)),
            auth: {
                user: getEnv('SMTP_USER', config.smtpOptions.auth.user),
                pass: getEnv('SMTP_PASS', config.smtpOptions.auth.pass)
            }
        },
        frontendUrls: {
            development: getEnv('FRONTEND_URL', config.frontendUrls.development),
            production: getEnv('PRODUCTION_FRONTEND_URL', config.frontendUrls.production)
        }
    };

    return envConfig;
}

module.exports = getConfig(); 