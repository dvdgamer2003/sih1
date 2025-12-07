const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { seedLessons, seedQuizzes, seedAnatomy } = require('./services/seedService');

dotenv.config();
connectDB();

const seed = async () => {
    try {
        await seedLessons();
        await seedQuizzes();
        await seedAnatomy();
        console.log('Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
