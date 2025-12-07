const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Subchapter = require('../models/Subchapter');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ MongoDB Connected');
    } catch (error) {
        console.error('✗ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Seed content from JSON file
async function seedContentFromFile(filePath) {
    try {
        console.log(`\nReading file: ${filePath}`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        console.log(`\nSeeding Class ${data.class} ${data.subject} content...`);
        console.log(`Total chapters: ${data.chapters.length}`);

        // Find or create Class
        let classDoc = await Class.findOne({ classNumber: data.class });
        if (!classDoc) {
            classDoc = await Class.create({
                classNumber: data.class
            });
            console.log(`✓ Created Class ${data.class}`);
        }

        // Find or create Subject
        let subjectDoc = await Subject.findOne({
            name: data.subject,
            classId: classDoc._id
        });
        if (!subjectDoc) {
            subjectDoc = await Subject.create({
                name: data.subject,
                classId: classDoc._id,
                description: `${data.subject} for Class ${data.class}`
            });
            console.log(`✓ Created Subject: ${data.subject}`);
        }

        // Process each chapter
        for (let i = 0; i < data.chapters.length; i++) {
            const chapterData = data.chapters[i];
            console.log(`\nChapter ${i + 1}/${data.chapters.length}: ${chapterData.name}`);

            // Find or create Chapter
            let chapterDoc = await Chapter.findOne({
                name: chapterData.name,
                subjectId: subjectDoc._id
            });

            if (!chapterDoc) {
                chapterDoc = await Chapter.create({
                    name: chapterData.name,
                    subjectId: subjectDoc._id,
                    description: `Chapter on ${chapterData.name}`,
                    index: i + 1
                });
                console.log(`  ✓ Created chapter: ${chapterData.name}`);
            }

            // Process each subchapter
            if (chapterData.subchapters && chapterData.subchapters.length > 0) {
                for (let j = 0; j < chapterData.subchapters.length; j++) {
                    const subchapterData = chapterData.subchapters[j];

                    // Check if subchapter already exists
                    let subchapterDoc = await Subchapter.findOne({
                        name: subchapterData.name,
                        chapterId: chapterDoc._id
                    });

                    if (subchapterDoc) {
                        // Update existing subchapter
                        subchapterDoc.lessonContent = subchapterData.content.explanation || '';
                        subchapterDoc.index = j + 1;

                        // Add quiz questions if they exist
                        if (subchapterData.quiz) {
                            const questions = [];

                            // Add MCQs
                            if (subchapterData.quiz.mcq) {
                                subchapterData.quiz.mcq.forEach(mcq => {
                                    questions.push({
                                        question: mcq.q,
                                        options: mcq.options,
                                        correctAnswer: mcq.answer,
                                        type: 'mcq',
                                        explanation: ''
                                    });
                                });
                            }

                            subchapterDoc.questions = questions;
                        }

                        await subchapterDoc.save();
                        console.log(`    ✓ Updated: ${subchapterData.name}`);
                    } else {
                        // Create new subchapter
                        const questions = [];

                        // Add quiz questions
                        if (subchapterData.quiz && subchapterData.quiz.mcq) {
                            subchapterData.quiz.mcq.forEach(mcq => {
                                questions.push({
                                    question: mcq.q,
                                    options: mcq.options,
                                    correctAnswer: mcq.answer,
                                    type: 'mcq',
                                    explanation: ''
                                });
                            });
                        }

                        await Subchapter.create({
                            name: subchapterData.name,
                            chapterId: chapterDoc._id,
                            lessonContent: subchapterData.content.explanation || '',
                            index: j + 1,
                            questions: questions,
                            visuals: [] // Can be populated later with PhET simulations
                        });
                        console.log(`    ✓ Created: ${subchapterData.name}`);
                    }
                }
            }
        }

        console.log(`\n✓ Successfully seeded Class ${data.class} ${data.subject} content`);
    } catch (error) {
        console.error('✗ Error seeding content:', error.message);
        throw error;
    }
}

// Main function
async function main() {
    await connectDB();

    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node seedContent.js <json_file>');
        console.log('Example: node seedContent.js class6-science-content.json');
        console.log('Or: node seedContent.js all (to seed all JSON files in data directory)');
        return;
    }

    const fileArg = args[0];
    const dataDir = path.join(__dirname, '../data');

    try {
        if (fileArg === 'all') {
            // Seed all JSON files in data directory
            const files = fs.readdirSync(dataDir)
                .filter(file => file.endsWith('-content.json'));

            console.log(`Found ${files.length} content files to seed`);

            for (const file of files) {
                const filePath = path.join(dataDir, file);
                await seedContentFromFile(filePath);
            }
        } else {
            // Seed specific file
            const filePath = path.join(dataDir, fileArg);

            if (!fs.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                process.exit(1);
            }

            await seedContentFromFile(filePath);
        }

        console.log('\n✓ Content seeding complete!');
    } catch (error) {
        console.error('✗ Seeding failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');
    }
}

// Run the script
main().catch(console.error);
