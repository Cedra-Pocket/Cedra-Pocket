#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Pre-build: Generating Prisma client...');

try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}