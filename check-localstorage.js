// This script simulates checking localStorage data
// Note: This is just for demonstration - actual localStorage is browser-only

console.log('Checking for localStorage data...\n');

// Simulate what localStorage might contain
const mockLocalStorage = {
  'fia_app_session_1234567890_step1': JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '555-1234'
  }),
  'fia_app_session_1234567890_product_selection': JSON.stringify({
    product: 'PRODUCT:FIA_PLUS',
    term: 'PRODUCT:TERM_10_YEAR',
    ownershipType: 'PRODUCT:TYPE_OWNERSHIP_NATURAL_PERSON'
  }),
  'sessionId': 'session_1234567890',
  'agentName': 'Demo Agent',
  'agentEmail': 'demo@cereslife.com'
};

const fiaAppKeys = Object.keys(mockLocalStorage).filter(key => key.startsWith('fia_app_'));

if (fiaAppKeys.length > 0) {
  console.log(`Found ${fiaAppKeys.length} FIA app data entries:`);
  fiaAppKeys.forEach(key => {
    console.log(`- ${key}`);
    try {
      const data = JSON.parse(mockLocalStorage[key]);
      console.log(`  Data: ${JSON.stringify(data, null, 2)}`);
    } catch (e) {
      console.log(`  Raw data: ${mockLocalStorage[key]}`);
    }
  });
} else {
  console.log('No FIA app data found in localStorage');
}

console.log('\nTo check real localStorage data:');
console.log('1. Open your app in the browser');
console.log('2. Open Developer Tools (F12)');
console.log('3. Go to Console tab');
console.log('4. Run: Object.keys(localStorage).filter(key => key.startsWith("fia_app_"))'); 