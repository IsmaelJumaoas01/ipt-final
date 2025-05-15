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
      script: 'frontend/node_modules/.bin/serve',
      args: '-s frontend/dist/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 4200
      }
    }
  ]
}; 