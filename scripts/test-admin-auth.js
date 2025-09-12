const { verifyAdminUser } = require('../lib/neon')

async function testAdminAuth() {
  console.log('🧪 Testing Admin Authentication...')
  
  try {
    // Test with correct credentials
    console.log('\n1. Testing with correct credentials (ismile / ismile@8866):')
    const result1 = await verifyAdminUser('ismile', 'ismile@8866')
    console.log('Result:', result1)
    
    // Test with incorrect username
    console.log('\n2. Testing with incorrect username:')
    const result2 = await verifyAdminUser('wronguser', 'ismile@8866')
    console.log('Result:', result2)
    
    // Test with incorrect password
    console.log('\n3. Testing with incorrect password:')
    const result3 = await verifyAdminUser('ismile', 'wrongpassword')
    console.log('Result:', result3)
    
    console.log('\n✅ Admin authentication test completed!')
    
  } catch (error) {
    console.error('❌ Error testing admin auth:', error)
  }
}

testAdminAuth()
