const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`Total users: ${users.length}`);

        users.forEach(user => {
            console.log(`- ${user.name} (${user.email}): Role=${user.role}, XP=${user.xp}`);
        });

        const students = await User.find({ role: 'student' });
        console.log(`Total students: ${students.length}`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
