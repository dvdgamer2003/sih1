const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testLeaderboard = async () => {
    try {
        // 1. Connect to DB to get a valid user ID
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ role: 'student' });

        if (!user) {
            console.log('No student user found in DB to test with.');
            process.exit(1);
        }

        // 2. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log(`Generated token for user: ${user.name}`);

        // 3. Call API
        try {
            const response = await fetch('http://localhost:5000/api/xp/leaderboard', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('API Response Status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Leaderboard Data Length:', data.length);
                console.log('First Item:', data[0]);
            } else {
                const text = await response.text();
                console.log('API Error Body:', text);
            }
        } catch (apiError) {
            console.error('API Call Failed:', apiError);
        }

        process.exit();
    } catch (error) {
        console.error('Script Error:', error);
        process.exit(1);
    }
};

testLeaderboard();
