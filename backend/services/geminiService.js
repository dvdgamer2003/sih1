const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generate quiz questions using Gemini AI based on chapter content
 * @param {string} chapterName - Name of the chapter/subchapter
 * @param {string} content - Educational content to generate questions from
 * @param {number} numQuestions - Number of questions to generate (default: 5)
 * @returns {Promise<Array>} Array of question objects
 */
const generateQuizQuestions = async (chapterName, content, numQuestions = 5) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Generate ${numQuestions} multiple-choice quiz questions for the following educational content:

Topic: ${chapterName}
Content: ${content || 'Basic concepts of ' + chapterName}

Requirements:
- Each question should have exactly 4 options
- Questions should test understanding, not just memorization
- Include a mix of difficulty levels (2 easy, 2 medium, 1 hard)
- Provide clear, unambiguous correct answers
- Add brief explanations for correct answers (1-2 sentences)
- Questions should be relevant to the content provided
- Avoid overly complex or trick questions

IMPORTANT: Format your response ONLY as a valid JSON array with this exact structure (no additional text):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct"
  }
]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response (handle markdown code blocks)
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        // Parse the JSON response
        const questions = JSON.parse(jsonText);

        // Validate the structure
        if (!Array.isArray(questions)) {
            throw new Error('Invalid response format: expected array');
        }

        // Validate each question
        const validatedQuestions = questions.map((q, index) => {
            if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 ||
                typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
                throw new Error(`Invalid question format at index ${index}`);
            }
            return {
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation || 'Correct answer based on the content.'
            };
        });

        return validatedQuestions;
    } catch (error) {
        console.error('Gemini AI Error:', error.message);
        throw error;
    }
};

/**
 * Generate fallback questions when AI is unavailable
 * @param {string} chapterName - Name of the chapter
 * @returns {Array} Array of basic question objects
 */
const generateFallbackQuestions = (chapterName) => {
    return [
        {
            question: `What is the main topic of "${chapterName}"?`,
            options: [
                chapterName,
                'General Knowledge',
                'Mathematics',
                'Science'
            ],
            correctIndex: 0,
            explanation: `This chapter focuses on ${chapterName}.`
        },
        {
            question: `Which subject does "${chapterName}" belong to?`,
            options: [
                'Mathematics',
                'Science',
                'Social Studies',
                'Language'
            ],
            correctIndex: 1,
            explanation: 'This is a general question about the subject area.'
        },
        {
            question: `What is the best way to learn about ${chapterName}?`,
            options: [
                'Reading and practice',
                'Ignoring the content',
                'Memorizing without understanding',
                'Skipping lessons'
            ],
            correctIndex: 0,
            explanation: 'Active learning through reading and practice is most effective.'
        }
    ];
};

/**
 * Generate educational content using Gemini AI
 * @param {string} prompt - The prompt for content generation
 * @returns {Promise<string>} Generated content in markdown format
 */
const generateContent = async (prompt) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
    } catch (error) {
        console.error('Gemini AI Content Generation Error:', error.message);
        throw error;
    }
};

module.exports = {
    generateQuizQuestions,
    generateFallbackQuestions,
    generateContent
};
