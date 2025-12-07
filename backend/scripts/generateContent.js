const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Class 6-12 Science Syllabus Structure (Maharashtra Board + CBSE)
const syllabus = {
    6: [
        "Food: Where Does It Come From?",
        "Components of Food",
        "Fibre to Fabric",
        "Sorting Materials into Groups",
        "Separation of Substances",
        "Changes Around Us",
        "Getting to Know Plants",
        "Body Movements",
        "The Living Organisms and Their Surroundings",
        "Motion and Measurement of Distances",
        "Light, Shadows and Reflections",
        "Electricity and Circuits"
    ],
    7: [
        "Nutrition in Plants",
        "Nutrition in Animals",
        "Fibre to Fabric",
        "Heat",
        "Acids, Bases and Salts",
        "Physical and Chemical Changes",
        "Weather, Climate and Adaptations",
        "Winds, Storms and Cyclones",
        "Soil",
        "Respiration in Organisms",
        "Transportation in Animals and Plants",
        "Reproduction in Plants",
        "Motion and Time",
        "Electric Current and Its Effects",
        "Light"
    ],
    8: [
        "Crop Production and Management",
        "Microorganisms: Friend and Foe",
        "Synthetic Fibres and Plastics",
        "Materials: Metals and Non-Metals",
        "Coal and Petroleum",
        "Combustion and Flame",
        "Conservation of Plants and Animals",
        "Cell - Structure and Functions",
        "Reproduction in Animals",
        "Reaching the Age of Adolescence",
        "Force and Pressure",
        "Friction",
        "Sound",
        "Chemical Effects of Electric Current",
        "Some Natural Phenomena",
        "Light"
    ],
    9: [
        "Matter in Our Surroundings",
        "Is Matter Around Us Pure",
        "Atoms and Molecules",
        "Structure of the Atom",
        "The Fundamental Unit of Life",
        "Tissues",
        "Diversity in Living Organisms",
        "Motion",
        "Force and Laws of Motion",
        "Gravitation",
        "Work and Energy",
        "Sound",
        "Why Do We Fall Ill",
        "Natural Resources",
        "Improvement in Food Resources"
    ],
    10: [
        "Chemical Reactions and Equations",
        "Acids, Bases and Salts",
        "Metals and Non-metals",
        "Carbon and Its Compounds",
        "Periodic Classification of Elements",
        "Life Processes",
        "Control and Coordination",
        "How Do Organisms Reproduce",
        "Heredity and Evolution",
        "Light - Reflection and Refraction",
        "Human Eye and Colourful World",
        "Electricity",
        "Magnetic Effects of Electric Current",
        "Sources of Energy",
        "Our Environment",
        "Sustainable Management of Natural Resources"
    ]
};

// Generate content for a single subchapter
async function generateSubchapterContent(className, chapterName, subchapterName) {
    const prompt = `Generate educational content for Class ${className} Science.

Chapter: ${chapterName}
Subchapter: ${subchapterName}

IMPORTANT: Write in your own words, do not copy textbook content. Make it clear, simple, and suitable for students.

Generate a JSON object with the following structure:
{
  "name": "${subchapterName}",
  "content": {
    "explanation": "Clear, detailed explanation (200-300 words)",
    "definitions": ["Definition 1", "Definition 2", "Definition 3"],
    "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
    "examples": ["Example 1", "Example 2", "Example 3"],
    "diagramExplanation": "Text description of a helpful diagram",
    "formula": "Any relevant formula or leave empty",
    "activity": "A simple hands-on activity students can do",
    "misconceptions": ["Misconception 1 and reality", "Misconception 2 and reality"],
    "summary": "Brief summary (50-100 words)"
  },
  "quiz": {
    "mcq": [
      {"q": "Question 1?", "options": ["A", "B", "C", "D"], "answer": "A"},
      {"q": "Question 2?", "options": ["A", "B", "C", "D"], "answer": "B"}
      // ... 10 MCQs total
    ],
    "short": ["Short question 1?", "Short question 2?", "Short question 3?", "Short question 4?", "Short question 5?"],
    "long": ["Long question 1?", "Long question 2?", "Long question 3?"],
    "hots": ["HOTS question 1?", "HOTS question 2?"]
  }
}

Return ONLY valid JSON, no additional text.`;

    try {
        console.log(`  Generating: ${subchapterName}...`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const content = JSON.parse(jsonText);
        console.log(`  ✓ Generated: ${subchapterName}`);
        return content;
    } catch (error) {
        console.error(`  ✗ Error generating ${subchapterName}:`, error.message);
        return null;
    }
}

// Generate subchapter list for a chapter
async function generateSubchapterList(className, chapterName) {
    const prompt = `For Class ${className} Science, Chapter "${chapterName}", list 4-6 important subtopics/subchapters following Maharashtra Board + CBSE syllabus.

Return ONLY a JSON array of subchapter names:
["Subchapter 1", "Subchapter 2", "Subchapter 3", ...]

No additional text, just the JSON array.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Extract JSON from response
        if (text.startsWith('```json')) {
            text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/```\n?/g, '');
        }

        const subchapters = JSON.parse(text);
        return subchapters;
    } catch (error) {
        console.error(`Error generating subchapter list for ${chapterName}:`, error.message);
        return [];
    }
}

// Generate content for a complete class
async function generateClassContent(className) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Generating Content for Class ${className} Science`);
    console.log(`${'='.repeat(60)}\n`);

    const chapters = syllabus[className];
    if (!chapters) {
        console.error(`No syllabus found for Class ${className}`);
        return;
    }

    const classData = {
        class: className,
        subject: "Science",
        chapters: []
    };

    for (let i = 0; i < chapters.length; i++) {
        const chapterName = chapters[i];
        console.log(`\nChapter ${i + 1}/${chapters.length}: ${chapterName}`);
        console.log('-'.repeat(60));

        // Generate subchapter list
        console.log('  Generating subchapter list...');
        const subchapterNames = await generateSubchapterList(className, chapterName);

        if (subchapterNames.length === 0) {
            console.log('  ✗ Failed to generate subchapters, skipping chapter');
            continue;
        }

        console.log(`  ✓ Found ${subchapterNames.length} subchapters`);

        const chapterData = {
            name: chapterName,
            subchapters: []
        };

        // Generate content for each subchapter
        for (let j = 0; j < subchapterNames.length; j++) {
            const subchapterName = subchapterNames[j];
            const subchapterContent = await generateSubchapterContent(className, chapterName, subchapterName);

            if (subchapterContent) {
                chapterData.subchapters.push(subchapterContent);
            }

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        classData.chapters.push(chapterData);

        // Save progress after each chapter
        const outputDir = path.join(__dirname, '../data');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFile = path.join(outputDir, `class${className}-science-content.json`);
        fs.writeFileSync(outputFile, JSON.stringify(classData, null, 2));
        console.log(`\n  ✓ Progress saved to: ${outputFile}`);

        // Add delay between chapters
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✓ Completed Class ${className} Science Content Generation`);
    console.log(`${'='.repeat(60)}\n`);

    return classData;
}

// Main function
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node generateContent.js <class_number>');
        console.log('Example: node generateContent.js 6');
        console.log('Or: node generateContent.js all (to generate for all classes 6-10)');
        return;
    }

    const classArg = args[0];

    if (classArg === 'all') {
        // Generate for all classes
        for (let className = 6; className <= 10; className++) {
            await generateClassContent(className);
        }
    } else {
        // Generate for specific class
        const className = parseInt(classArg);
        if (className < 6 || className > 12) {
            console.error('Please provide a class number between 6 and 12');
            return;
        }

        await generateClassContent(className);
    }

    console.log('\n✓ Content generation complete!');
    console.log('Generated files are saved in backend/data/ directory');
    console.log('You can now use the seedContent.js script to import them into MongoDB');
}

// Run the script
main().catch(console.error);
