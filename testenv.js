// Simple test script to verify the backend is working
// Run this with: node testenv.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Environment Check for AI Vision Caption Studio');
console.log('================================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('✅ .env file found');
    
    // Read and check .env content
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasHfToken = envContent.includes('HF_API_TOKEN=');
    
    if (hasHfToken) {
        console.log('✅ HF_API_TOKEN found in .env');
        
        // Check if token has content
        const tokenMatch = envContent.match(/HF_API_TOKEN=(.+)/);
        if (tokenMatch && tokenMatch[1].trim() && tokenMatch[1].trim() !== '') {
            console.log('✅ HF_API_TOKEN has a value');
        } else {
            console.log('❌ HF_API_TOKEN is empty or invalid');
        }
    } else {
        console.log('❌ HF_API_TOKEN not found in .env');
    }
} else {
    console.log('❌ .env file not found');
}

// Check package.json dependencies
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
    console.log('\n📦 Package dependencies check:');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredDeps = ['express', 'cors', 'axios', 'form-data'];
    const requiredDevDeps = ['nodemon'];
    
    console.log('\nRequired dependencies:');
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`❌ ${dep}: missing`);
        }
    });
    
    console.log('\nRequired dev dependencies:');
    requiredDevDeps.forEach(dep => {
        if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
            console.log(`✅ ${dep}: ${packageJson.devDependencies[dep]}`);
        } else {
            console.log(`❌ ${dep}: missing`);
        }
    });
} else {
    console.log('❌ package.json not found');
}

// Check if server.js exists
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
    console.log('\n✅ server.js found');
} else {
    console.log('\n❌ server.js not found');
}

console.log('\n🚀 To start the server:');
console.log('   npm run dev  (if you have the script)');
console.log('   or');
console.log('   npx nodemon server.js');
console.log('   or');
console.log('   node server.js');

console.log('\n🌐 Server will run on: http://localhost:3000');
console.log('📱 Frontend will be available at: http://localhost:3000');
console.log('🔗 API endpoint: http://localhost:3000/api/caption');

console.log('\n💡 Tips:');
console.log('   - Make sure your .env file has HF_API_TOKEN=your_token_here');
console.log('   - The token should have "Read" permissions on Hugging Face');
console.log('   - Visit https://huggingface.co/settings/tokens to manage your tokens');
console.log('   - If you get 403 errors, try accepting terms for the model first'); 