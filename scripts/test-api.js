async function testApi() {
    const url = 'http://127.0.0.1:3000/api/login'; // Try explicit IPv4
    console.log('Testing URL:', url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'test_register_user',
                password: 'password123'
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', data);

    } catch (error) {
        console.error('API Test Failed:', error.cause || error);
    }
}

testApi();
