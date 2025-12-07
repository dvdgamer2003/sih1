const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@system.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        await User.create({
            name: 'System Admin',
            email: 'admin@system.com',
            password: 'Admin@123',
            role: 'admin',
            status: 'active'
        });

        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
