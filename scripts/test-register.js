const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/assessment_db';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function testRegisterAndLogin() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(uri);

        const testUsername = 'test_register_user';
        const testPassword = 'password123';

        // 1. Cleanup old test user
        await User.deleteOne({ username: testUsername });
        console.log('Cleaned up old test user.');

        // 2. Register
        console.log('Registering new user:', testUsername);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testPassword, salt);

        const newUser = await User.create({
            username: testUsername,
            password: hashedPassword,
            role: 'student'
        });
        console.log('User created successfully:', newUser._id);

        // 3. Login (Verify Password)
        console.log('Attempting login...');
        const foundUser = await User.findOne({ username: testUsername });
        const isMatch = await bcrypt.compare(testPassword, foundUser.password);

        if (isMatch) {
            console.log('✅ LOGIN SUCCESS: Password matches!');
        } else {
            console.error('❌ LOGIN FAILED: Password does not match.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testRegisterAndLogin();
