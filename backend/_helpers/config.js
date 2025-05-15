const config = require('config.json');
require('dotenv').config();

function getConfig() {
    const env = process.env.NODE_ENV || 'development';
    
    // Helper function to get environment variable or fallback
    const getEnv = (key, fallback) => {
        const value = process.env[key];
        return value !== undefined ? value : fallback;
    };

    // Parse config values that might be environment variables
    const parseConfigValue = (value) => {
        if (typeof value === 'string' && value.startsWith('process.env.')) {
            const envKey = value.split('||')[0].trim().replace('process.env.', '');
            const fallback = value.split('||')[1]?.trim().replace(/['"]/g, '');
            return getEnv(envKey, fallback);
        }
        return value;
    };

    // Deep parse config object
    const parseConfig = (obj) => {
        const result = {};
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result[key] = parseConfig(obj[key]);
            } else {
                result[key] = parseConfigValue(obj[key]);
            }
        }
        return result;
    };

    return parseConfig(config);
}

module.exports = getConfig(); 