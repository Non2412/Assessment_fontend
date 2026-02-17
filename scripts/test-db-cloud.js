const mongoose = require('mongoose');

// The cloud URI provided by user
const uri = 'mongodb+srv://admin:efKjifEYsRgKgM9D@cluster0.kcllz2s.mongodb.net/assessment_db?retryWrites=true&w=majority';

async function testCloudConnection() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(uri);
        console.log('✅ Connected successfully to MongoDB Atlas!');

        // Check users collection count
        const count = await mongoose.connection.collection('users').countDocuments();
        console.log('Number of users in cloud DB:', count);

        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

testCloudConnection();
