// Quick API connection test
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testConnection() {
    console.log('Testing connection to:', API_URL);

    try {
        // Test root endpoint
        const rootResponse = await axios.get('http://localhost:5000/');
        console.log('✅ Root endpoint:', rootResponse.status, rootResponse.data);

        // Test registration
        const registerData = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'test123',
            language: 'en'
        };

        console.log('\nTrying registration with:', registerData.email);
        const regResponse = await axios.post(`${API_URL}/auth/register`, registerData);
        console.log('✅ Registration:', regResponse.status);
        console.log('Response data:', regResponse.data);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testConnection();
