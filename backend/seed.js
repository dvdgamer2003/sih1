const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edugames', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const User = require('./models/User');
const GameResult = require('./models/GameResult');

const studentNames = [
    'Aarav Sharma', 'Diya Patel', 'Arjun Mehta', 'Ananya Singh',
    'Vihaan Gupta', 'Saanvi Kumar', 'Aditya Reddy', 'Isha Verma',
    'Reyansh Joshi', 'Myra Desai', 'Kabir Khan', 'Aanya Nair',
    'Shaurya Iyer', 'Kiara Shah', 'Dhruv Agarwal'
];

const subjects = ['Math', 'Science', 'English', 'Social'];
const games = ['cell_command', 'label_organ', 'chemistry_balance', 'cell_structure', 'force_play', 'digestive_dash'];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[randomInt(0, arr.length - 1)];

const generateEmail = (name, role) => {
    const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '');
    return `${cleanName}@${role === 'teacher' ? 'school.edu' : 'student.edu'}`;
};

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding (preserving existing teachers)...\n');

        // Clear ONLY students and game results, keep existing teachers
        console.log('🗑️  Clearing students and game results...');
        await User.deleteMany({ role: 'student' });
        await GameResult.deleteMany({});
        console.log('✅ Cleared!\n');

        // Get existing teachers
        const existingTeachers = await User.find({ role: 'teacher', status: 'active' });
        console.log(`📋 Found ${existingTeachers.length} existing teacher(s):`);
        existingTeachers.forEach(t => console.log(`   • ${t.name} (${t.email})`));
        console.log('');

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Students and assign to existing teachers
        console.log('👨‍🎓 Creating 15 students...');
        const students = [];

        if (existingTeachers.length === 0) {
            console.log('❌ No teachers found! Please create a teacher account first.');
            process.exit(1);
        }

        for (let i = 0; i < studentNames.length; i++) {
            const classNumber = randomInt(6, 10);
            const learnerCategory = randomElement(['fast', 'slow', 'neutral', 'neutral']);

            // Assign to existing teachers using round-robin
            const teacherIndex = i % existingTeachers.length;
            const assignedTeacher = existingTeachers[teacherIndex];

            const student = await User.create({
                name: studentNames[i],
                email: generateEmail(studentNames[i], 'student'),
                password: hashedPassword,
                role: 'student',
                status: 'active',
                selectedClass: classNumber,
                teacherId: assignedTeacher._id,
                learnerCategory: learnerCategory,
                xp: randomInt(100, 5000),
                streak: randomInt(0, 50),
            });

            students.push(student);

            // Create game results
            const numGames = randomInt(3, 6);

            for (let j = 0; j < numGames; j++) {
                const game = randomElement(games);
                const score = randomInt(40, 100);
                const timeTaken = randomInt(30, 300);
                const difficulty = randomElement(['easy', 'medium', 'hard']);

                let delta = 0;
                if (score >= 80 && timeTaken < 120) {
                    delta = randomInt(15, 25);
                } else if (score >= 60 && timeTaken < 180) {
                    delta = randomInt(5, 15);
                } else if (score >= 40) {
                    delta = randomInt(-5, 5);
                } else {
                    delta = randomInt(-15, -5);
                }

                let proficiency;
                if (score >= 90) proficiency = 'Expert';
                else if (score >= 75) proficiency = 'Advanced';
                else if (score >= 60) proficiency = 'Intermediate';
                else proficiency = 'Beginner';

                await GameResult.create({
                    userId: student._id,
                    gameType: game,
                    score: score,
                    maxScore: 100,
                    xpEarned: Math.floor(score * 1.5),
                    timeTaken: timeTaken,
                    difficulty: difficulty,
                    subject: randomElement(subjects),
                    classLevel: String(classNumber),
                    delta: delta,
                    proficiency: proficiency,
                    accuracy: score,
                    completedLevel: randomInt(1, 5),
                    attempts: randomInt(1, 3),
                    mistakes: randomInt(0, 10),
                });
            }

            console.log(`   ✓ ${student.name} - Class ${classNumber} - Assigned to: ${assignedTeacher.name} - ${student.xp} XP`);
        }

        console.log(`\n✅ Created ${students.length} students!\n`);

        // Calculate distribution
        const distribution = {};
        existingTeachers.forEach(t => distribution[t.name] = 0);
        students.forEach(s => {
            const teacher = existingTeachers.find(t => t._id.toString() === s.teacherId.toString());
            if (teacher) distribution[teacher.name]++;
        });

        console.log('📊 Student Distribution:');
        Object.keys(distribution).forEach(teacherName => {
            console.log(`   ${teacherName}: ${distribution[teacherName]} students`);
        });

        console.log('\n📌 Login Credentials:');
        console.log('   Password for all students: password123');
        console.log('\n🎉 Database seeded successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedDatabase();
