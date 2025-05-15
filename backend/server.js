require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
const config = require('_helpers/config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        
        // Get allowed origins from config
        const allowedOrigins = [
            config.frontendUrls.development,
            config.frontendUrls.production
        ].filter(Boolean); // Remove any undefined values
        
        // In development or when using fake backend, allow all origins
        if (process.env.NODE_ENV !== 'production' || process.env.USE_FAKE_BACKEND === 'true') {
            return callback(null, true);
        }
        
        // Check if origin is allowed
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// api routes
app.use('/accounts', require('./accounts/accounts.controller'));
app.use('/employees', require('./employees/index'));
app.use('/departments', require('./departments/index'));
app.use('/requests', require('./requests/index'));
app.use('/workflows', require('./workflows/index'));

// root route
app.get('/', (req, res) => {
    res.json({
        name: 'IPT Final API',
        version: '1.0.0',
        status: 'running',
        documentation: '/api-docs',
        endpoints: {
            accounts: '/accounts',
            employees: '/employees',
            departments: '/departments',
            requests: '/requests',
            workflows: '/workflows'
        }
    });
});

// swagger docs route
app.use('/api-docs', require('_helpers/swagger'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));