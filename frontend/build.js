// Custom build script for Angular
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==== STARTING CUSTOM BUILD SCRIPT ====');

// Ensure we're in the frontend directory
const frontendDir = __dirname;
console.log(`Working directory: ${frontendDir}`);

// Function to run commands and log output
function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    const output = execSync(command, { 
      cwd: frontendDir,
      stdio: 'inherit',
      env: { ...process.env, NODE_OPTIONS: '--max_old_space_size=4096' }
    });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Main build process
async function buildAngular() {
  try {
    console.log('Attempting Angular build...');
    
    // Try to install Angular packages
    console.log('Installing Angular packages...');
    const installSuccess = runCommand('npm install @angular/cli@16.2.12 @angular-devkit/build-angular@16.2.12 @angular/compiler-cli@16.2.12 --save-dev --legacy-peer-deps');
    
    if (!installSuccess) {
      console.log('Failed to install Angular packages, falling back to static site...');
      return useFallbackBuild();
    }
    
    // Try direct npx approach
    console.log('Trying direct npx approach...');
    const npxSuccess = runCommand('npx @angular/cli@16.2.12 build --configuration=production');
    
    if (npxSuccess && fs.existsSync(path.join(frontendDir, 'dist', 'frontend'))) {
      console.log('Build successful!');
      return true;
    }
    
    console.log('All Angular build attempts failed, using fallback static site...');
    return useFallbackBuild();
  } catch (error) {
    console.error('Build process failed:', error);
    return useFallbackBuild();
  }
}

// Fallback build function
function useFallbackBuild() {
  console.log('Using fallback static site build...');
  try {
    // Run the fallback build script
    return runCommand('node fallback-build.js');
  } catch (error) {
    console.error('Fallback build failed:', error);
    return false;
  }
}

// Run the build
buildAngular()
  .then(success => {
    if (success) {
      console.log('==== BUILD COMPLETED SUCCESSFULLY ====');
      process.exit(0);
    } else {
      console.error('==== BUILD FAILED ====');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('==== BUILD FAILED WITH ERROR ====', error);
    process.exit(1);
  }); 