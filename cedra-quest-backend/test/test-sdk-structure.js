// Test SDK structure in detail
async function inspectSDK() {
  console.log('🔬 Inspecting Cedra SDK Structure...\n');

  try {
    const CedraSDK = require('@cedra-labs/ts-sdk');
    
    console.log('📦 All SDK Exports:');
    const exports = Object.keys(CedraSDK);
    exports.forEach((exportName, index) => {
      const type = typeof CedraSDK[exportName];
      console.log(`   ${index + 1}. ${exportName} (${type})`);
    });
    
    console.log(`\n📊 Total exports: ${exports.length}`);
    
    // Test Account class
    if (CedraSDK.Account) {
      console.log('\n🔑 Testing Account Class:');
      try {
        // Check static methods
        const accountMethods = Object.getOwnPropertyNames(CedraSDK.Account);
        console.log('   Static methods:', accountMethods.join(', '));
        
        // Try to create account from private key
        if (CedraSDK.Ed25519PrivateKey) {
          console.log('   ✅ Ed25519PrivateKey available');
          
          // Test with a mock private key
          const mockKey = '0x' + '1'.repeat(64);
          try {
            const privateKey = new CedraSDK.Ed25519PrivateKey(mockKey);
            console.log('   ✅ Private key creation works');
            
            if (CedraSDK.Account.fromPrivateKey) {
              const account = CedraSDK.Account.fromPrivateKey({ privateKey });
              console.log('   ✅ Account creation from private key works');
              
              // Check account methods
              const accountInstance = Object.getOwnPropertyNames(Object.getPrototypeOf(account));
              console.log('   Account methods:', accountInstance.slice(0, 5).join(', '));
            }
          } catch (keyError) {
            console.log('   ❌ Private key/account creation failed:', keyError.message);
          }
        }
      } catch (accountError) {
        console.log('   ❌ Account class test failed:', accountError.message);
      }
    }
    
    // Check for client classes
    console.log('\n🌐 Looking for Client Classes:');
    const clientClasses = ['Aptos', 'AptosClient', 'Client', 'CedraClient'];
    clientClasses.forEach(className => {
      if (CedraSDK[className]) {
        console.log(`   ✅ ${className} found`);
        try {
          const methods = Object.getOwnPropertyNames(CedraSDK[className].prototype || CedraSDK[className]);
          console.log(`      Methods: ${methods.slice(0, 5).join(', ')}`);
        } catch (e) {
          console.log(`      Could not inspect methods`);
        }
      } else {
        console.log(`   ❌ ${className} not found`);
      }
    });
    
    // Check for transaction building
    console.log('\n📝 Looking for Transaction Classes:');
    const txClasses = ['Transaction', 'TransactionBuilder', 'RawTransaction'];
    txClasses.forEach(className => {
      if (CedraSDK[className]) {
        console.log(`   ✅ ${className} found`);
      } else {
        console.log(`   ❌ ${className} not found`);
      }
    });
    
    console.log('\n🎯 Recommendations:');
    
    if (CedraSDK.Account && CedraSDK.Ed25519PrivateKey) {
      console.log('   ✅ Basic account management should work');
    } else {
      console.log('   ⚠️ Account management may need different approach');
    }
    
    const hasClient = clientClasses.some(name => CedraSDK[name]);
    if (hasClient) {
      console.log('   ✅ Blockchain client available');
    } else {
      console.log('   ⚠️ May need to find correct client class');
    }
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Check Cedra SDK documentation for correct API usage');
    console.log('   2. Update blockchain.service.ts with correct method calls');
    console.log('   3. Test with real private key and network');
    
  } catch (error) {
    console.error('❌ SDK inspection failed:', error.message);
  }
}

inspectSDK();