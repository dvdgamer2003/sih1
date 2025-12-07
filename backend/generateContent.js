const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../frontend/src/assets/data');
const OUTPUT_MAP_FILE = path.join(__dirname, '../frontend/src/services/generatedContentMap.ts');

// Template for chapter content
const generateContent = (chapter) => ({
    id: chapter.id,
    title: chapter.title,
    lessons: [
        {
            id: 'l1',
            title: 'Introduction',
            readingTime: 5,
            content: `# Introduction to ${chapter.title}\n\nWelcome to this chapter on ${chapter.title}. In this lesson, we will explore the fundamental concepts and importance of this topic.\n\n## Overview\nThis chapter covers key aspects that will help you understand the subject better.`
        },
        {
            id: 'l2',
            title: 'Key Concepts',
            readingTime: 8,
            content: `# Key Concepts\n\nLet's dive deeper into ${chapter.title}.\n\n## Main Points\n- Concept 1: Understanding the basics.\n- Concept 2: Real-world applications.\n- Concept 3: Advanced theories.\n\nRemember to take notes as you go through these concepts.`
        },
        {
            id: 'l3',
            title: 'Summary',
            readingTime: 4,
            content: `# Summary\n\nTo wrap up ${chapter.title}, let's review what we've learned.\n\n## Recap\nWe covered the introduction, key concepts, and their applications. You are now ready to take the quiz!`
        }
    ],
    quiz: {
        id: 'q1',
        title: `Quiz: ${chapter.title}`,
        questions: [
            {
                id: 'q1_1',
                question: `What is the main focus of ${chapter.title}?`,
                options: [
                    'To confuse students',
                    'To learn about the topic',
                    'To waste time',
                    'None of the above'
                ],
                correctAnswer: 1,
                explanation: `The main focus is to learn about ${chapter.title}.`
            },
            {
                id: 'q1_2',
                question: 'Which concept was discussed in the lessons?',
                options: [
                    'Rocket Science',
                    'Key Concepts',
                    'Cooking',
                    'Dancing'
                ],
                correctAnswer: 1,
                explanation: 'We discussed Key Concepts in the second lesson.'
            },
            {
                id: 'q1_3',
                question: 'How many lessons are in this chapter?',
                options: [
                    'One',
                    'Two',
                    'Three',
                    'Four'
                ],
                correctAnswer: 2,
                explanation: 'There are three lessons: Introduction, Key Concepts, and Summary.'
            },
            {
                id: 'q1_4',
                question: 'What should you do while studying?',
                options: [
                    'Sleep',
                    'Take notes',
                    'Play games',
                    'Watch TV'
                ],
                correctAnswer: 1,
                explanation: 'Taking notes helps in retaining information.'
            },
            {
                id: 'q1_5',
                question: 'Are you ready for the next chapter?',
                options: [
                    'No',
                    'Maybe',
                    'Yes',
                    'I don\'t know'
                ],
                correctAnswer: 2,
                explanation: 'Yes, you are ready to move forward!'
            }
        ]
    }
});

const imports = [];
const mapEntries = [];

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (file === 'chapters.json') {
            // Found a chapters list
            const chapters = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            const dirName = path.dirname(fullPath);

            chapters.forEach(chapter => {
                const contentFileName = `chapter-${chapter.id}.json`;
                const contentFilePath = path.join(dirName, contentFileName);

                // Check if content file exists
                if (!fs.existsSync(contentFilePath)) {
                    console.log(`Generating content for ${chapter.id}...`);
                    const content = generateContent(chapter);
                    fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 4));
                } else {
                    console.log(`Content exists for ${chapter.id}, skipping generation.`);
                }

                // Prepare import for map
                // Path relative to generatedContentMap.ts (frontend/src/services)
                // Data is in frontend/src/assets/data/...
                // So we need to go up from services (..) then into assets/data
                const relativePath = path.relative(path.dirname(OUTPUT_MAP_FILE), contentFilePath).replace(/\\/g, '/');

                // Create a valid variable name from the ID (e.g., sci-8-ch1 -> sci_8_ch1)
                const varName = chapter.id.replace(/-/g, '_');

                imports.push(`import ${varName} from '${relativePath}';`);
                mapEntries.push(`    '${chapter.id}': ${varName},`);
            });
        }
    });
}

console.log('Starting content generation...');
scanDirectory(DATA_DIR);

// Generate the map file
const mapFileContent = `// This file is auto-generated. Do not edit manually.
${imports.join('\n')}

export const chapterContentMap: Record<string, any> = {
${mapEntries.join('\n')}
};
`;

fs.writeFileSync(OUTPUT_MAP_FILE, mapFileContent);
console.log(`Generated content map at ${OUTPUT_MAP_FILE}`);
console.log('Done!');
