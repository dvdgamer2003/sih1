# Content Generation & Seeding Scripts

This directory contains scripts for generating and seeding educational content into the database.

## 📁 Files

- **generateContent.js** - Generates educational content using Gemini AI
- **seedContent.js** - Seeds generated JSON content into MongoDB
- **seedAdmin.js** - Creates default admin user

## 🚀 Usage

### Step 1: Generate Content

Generate content for a specific class:

```bash
node scripts/generateContent.js 6
```

Generate content for all classes (6-10):

```bash
node scripts/generateContent.js all
```

**Output:** JSON files will be saved in `backend/data/` directory
- `class6-science-content.json`
- `class7-science-content.json`
- etc.

### Step 2: Seed Content into Database

Seed a specific JSON file:

```bash
node scripts/seedContent.js class6-science-content.json
```

Seed all generated content files:

```bash
node scripts/seedContent.js all
```

### Step 3: Create Admin User (Optional)

```bash
node scripts/seedAdmin.js
```

Default admin credentials:
- Email: admin@rural-learning.com
- Password: Admin@123

## 📋 Content Structure

Each generated JSON file contains:

```json
{
  "class": 6,
  "subject": "Science",
  "chapters": [
    {
      "name": "Chapter Name",
      "subchapters": [
        {
          "name": "Subchapter Name",
          "content": {
            "explanation": "...",
            "definitions": [...],
            "keyPoints": [...],
            "examples": [...],
            "diagramExplanation": "...",
            "formula": "...",
            "activity": "...",
            "misconceptions": [...],
            "summary": "..."
          },
          "quiz": {
            "mcq": [...],
            "short": [...],
            "long": [...],
            "hots": [...]
          }
        }
      ]
    }
  ]
}
```

## ⚙️ Configuration

### Environment Variables

Make sure `.env` file contains:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=mongodb://localhost:27017/rural-learning-app
```

### Rate Limiting

The content generation script includes delays to avoid API rate limits:
- 2 seconds between subchapters
- 3 seconds between chapters

For large content generation (all classes), expect:
- ~15 chapters per class
- ~5 subchapters per chapter
- Total time: 2-3 hours for all classes

## 🔄 Workflow

### Complete Setup (First Time)

```bash
# 1. Generate content for Class 6
node scripts/generateContent.js 6

# 2. Seed the generated content
node scripts/seedContent.js class6-science-content.json

# 3. Create admin user
node scripts/seedAdmin.js

# 4. Start the backend server
npm run dev
```

### Adding More Content Later

```bash
# Generate content for Class 7
node scripts/generateContent.js 7

# Seed it
node scripts/seedContent.js class7-science-content.json
```

### Regenerating Content

If you want to regenerate content:

```bash
# Delete old JSON file
rm data/class6-science-content.json

# Generate fresh content
node scripts/generateContent.js 6

# Seed it (will update existing records)
node scripts/seedContent.js class6-science-content.json
```

## 📊 Syllabus Coverage

### Class 6 (12 chapters)
- Food: Where Does It Come From?
- Components of Food
- Fibre to Fabric
- Sorting Materials into Groups
- Separation of Substances
- Changes Around Us
- Getting to Know Plants
- Body Movements
- The Living Organisms and Their Surroundings
- Motion and Measurement of Distances
- Light, Shadows and Reflections
- Electricity and Circuits

### Class 7 (15 chapters)
### Class 8 (16 chapters)
### Class 9 (15 chapters)
### Class 10 (16 chapters)

## 🎯 Offline Compatibility

**Important:** Content generation requires internet (Gemini API), but the app works offline after seeding:

1. **Online (One-time):** Generate content → Save JSON → Seed database
2. **Offline (Always):** App reads from local MongoDB → Works without internet

The generated JSON files are stored locally and can be version-controlled.

## 🐛 Troubleshooting

### "GEMINI_API_KEY not found"
- Make sure `.env` file exists in backend directory
- Add your Gemini API key to `.env`

### "MongoDB connection failed"
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in `.env`

### "Rate limit exceeded"
- Wait a few minutes and try again
- The script has built-in delays, but API limits may still apply

### "Invalid JSON in response"
- This can happen occasionally with AI responses
- The script will skip failed subchapters and continue
- You can regenerate specific chapters later

## 📝 Notes

- Content is generated in your own words (not copied from textbooks)
- Follows Maharashtra Board + CBSE standards
- Includes MCQs, short/long questions, and HOTS
- Each subchapter has activities and misconceptions
- Content is suitable for rural learning environments
- JSON files can be edited manually if needed

## 🔐 Security

- Never commit `.env` file to version control
- Keep your Gemini API key secure
- Admin credentials should be changed after first login
