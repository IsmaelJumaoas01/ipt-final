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
    // Install required packages first
    console.log('Installing Angular packages...');
    runCommand('npm install @angular/cli@16.2.12 @angular-devkit/build-angular@16.2.12 @angular/compiler-cli@16.2.12 --save-dev --legacy-peer-deps');
    
    // Create a temporary build script
    const buildCommand = `
      const { execSync } = require('child_process');
      
      try {
        // Run Angular build programmatically
        require('@angular/cli/lib/init');
        const { default: run } = require('@angular/cli/lib/cli');
        
        run({
          cliArgs: ['build', '--configuration=production']
        }).then(result => {
          console.log('Build completed with result:', result);
          process.exit(result ? 1 : 0);
        }).catch(err => {
          console.error('Build failed:', err);
          process.exit(1);
        });
      } catch (error) {
        console.error('Error running Angular CLI:', error);
        
        // Fallback to direct command execution if the programmatic approach fails
        try {
          execSync('npx --no-install @angular/cli@16.2.12 build --configuration=production', {
            stdio: 'inherit',
            env: { ...process.env, NODE_OPTIONS: '--max_old_space_size=4096' }
          });
        } catch (fallbackError) {
          console.error('Fallback build also failed:', fallbackError);
          process.exit(1);
        }
      }
    `;
    
    fs.writeFileSync(path.join(frontendDir, 'angular-build.js'), buildCommand);
    
    // Execute the build script
    console.log('Executing Angular build...');
    runCommand('node angular-build.js');
    
    // Check if build was successful by verifying dist folder
    if (fs.existsSync(path.join(frontendDir, 'dist', 'frontend'))) {
      console.log('Build successful! Output directory exists.');
      return true;
    } else {
      console.error('Build may have failed. Output directory not found.');
      
      // Last resort: try npx
      console.log('Trying one last approach...');
      runCommand('npx --no-install @angular/cli@16.2.12 build --configuration=production');
      
      if (fs.existsSync(path.join(frontendDir, 'dist', 'frontend'))) {
        console.log('Final build attempt successful!');
        return true;
      } else {
        console.error('All build attempts failed.');
        return false;
      }
    }
  } catch (error) {
    console.error('Build process failed:', error);
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