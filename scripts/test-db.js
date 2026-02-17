const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/assessment_db';

async function test() {
    try {
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('Connected successfully!');

        // Check users collection count
        const count = await mongoose.connection.collection('users').countDocuments();
        console.log('Number of users:', count);

        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

test();
