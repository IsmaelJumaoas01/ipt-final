// Fallback build script to create a static site
const fs = require('fs');
const path = require('path');

console.log('==== STARTING FALLBACK BUILD SCRIPT ====');

// Ensure we're in the frontend directory
const frontendDir = __dirname;
console.log(`Working directory: ${frontendDir}`);

// Create dist/frontend directory if it doesn't exist
const distDir = path.join(frontendDir, 'dist', 'frontend');
if (!fs.existsSync(distDir)) {
  console.log(`Creating directory: ${distDir}`);
  fs.mkdirSync(distDir, { recursive: true });
}

// Create assets directory
const assetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simple index.html file
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Management System</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .login-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
    .btn-primary {
      width: 100%;
    }
    .alert {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>User Management System</h1>
      <p>Please use the API directly while the frontend is being rebuilt</p>
    </div>
    
    <div class="row">
      <div class="col-md-12">
        <div class="login-container">
          <h2 class="text-center mb-4">API Information</h2>
          
          <div class="alert alert-info">
            <p><strong>API Endpoint:</strong> <a href="/api-docs" target="_blank">/api-docs</a></p>
            <p>The API is fully functional. You can use the Swagger documentation to test all endpoints.</p>
          </div>
          
          <div class="alert alert-warning">
            <p><strong>Note:</strong> The frontend is temporarily under maintenance.</p>
            <p>Please use the API documentation to interact with the system.</p>
          </div>
          
          <a href="/api-docs" class="btn btn-primary mt-3">Go to API Documentation</a>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    // Redirect to API docs after 3 seconds
    setTimeout(() => {
      window.location.href = '/api-docs';
    }, 3000);
  </script>
</body>
</html>
`;

// Write the index.html file
fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
console.log('Created index.html');

console.log('==== FALLBACK BUILD COMPLETED SUCCESSFULLY ====');
console.log(`Static files have been created in ${distDir}`); 