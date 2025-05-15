const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure we're in the frontend directory
process.chdir(__dirname);

// Function to run commands and log output
function runCommand(command) {
    console.log(`Running: ${command}`);
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Failed to execute command: ${command}`);
        console.error(error);
        process.exit(1);
    }
}

// Main build process
async function build() {
    console.log('Starting build process...');
    
    // Clean dist directory if it exists
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
        console.log('Cleaning dist directory...');
        fs.rmSync(distPath, { recursive: true, force: true });
    }

    // Install dependencies if node_modules doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
        console.log('Installing dependencies...');
        runCommand('npm install --legacy-peer-deps');
    }

    // Install specific Angular packages
    console.log('Installing Angular packages...');
    const angularPackages = [
        '@angular/animations@16.2.12',
        '@angular/common@16.2.12',
        '@angular/compiler@16.2.12',
        '@angular/core@16.2.12',
        '@angular/forms@16.2.12',
        '@angular/platform-browser@16.2.12',
        '@angular/platform-browser-dynamic@16.2.12',
        '@angular/router@16.2.12',
        '@angular-devkit/build-angular@16.2.12',
        '@angular/cli@16.2.12',
        '@angular/compiler-cli@16.2.12',
        '@angular-devkit/core@16.2.12',
        '@angular-devkit/schematics@16.2.12',
        '@schematics/angular@16.2.12'
    ];
    
    runCommand(`npm install --save-exact --legacy-peer-deps ${angularPackages.join(' ')}`);

    // Run the build
    console.log('Building application...');
    runCommand('npx ng build --configuration production');

    console.log('Build completed successfully!');
}

build().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
}); 