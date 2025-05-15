module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'backend/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 10000
      }
    },
    {
      name: 'frontend',
      script: 'frontend/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4200
      }
    }
  ]
}; 