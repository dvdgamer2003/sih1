# Content Generation System - Complete Guide

## ✅ What's Been Created

### 1. **Content Generation Script** (`scripts/generateContent.js`)
- Uses Gemini API to generate educational content
- Generates content for Classes 6-10 Science
- Follows Maharashtra Board + CBSE standards
- Saves output as JSON files in `data/` directory

### 2. **Database Seeding Script** (`scripts/seedContent.js`)
- Imports generated JSON files into MongoDB
- Creates Class, Subject, Chapter, and Subchapter records
- Handles quiz questions automatically
- Can update existing content or create new

### 3. **Sample Content** (`data/class6-science-content.json`)
- Complete content for 2 chapters of Class 6
- Includes all required components
- Ready to seed into database

## 🎯 How It Works (Offline-Compatible)

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: CONTENT GENERATION (Online - One Time)             │
├─────────────────────────────────────────────────────────────┤
│ Run: node scripts/generateContent.js 6                     │
│ → Calls Gemini API                                          │
│ → Generates educational content                             │
│ → Saves to: data/class6-science-content.json               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: DATABASE SEEDING (Online - One Time)               │
├─────────────────────────────────────────────────────────────┤
│ Run: node scripts/seedContent.js class6-science-content.json│
│ → Reads JSON file                                           │
│ → Imports into MongoDB                                      │
│ → Content now stored locally                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: APP USAGE (Offline - Always)                       │
├─────────────────────────────────────────────────────────────┤
│ App reads from local MongoDB                                │
│ No internet required                                        │
│ All content available offline                               │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Generate Content for Class 6

```bash
cd backend
node scripts/generateContent.js 6
```

**Expected Output:**
- File created: `data/class6-science-content.json`
- Contains ~12 chapters, ~60 subchapters
- Time: ~30-45 minutes

### Seed Content into Database

```bash
node scripts/seedContent.js class6-science-content.json
```

**Expected Output:**
- MongoDB records created
- Content available in app
- Works offline from now on

### Generate All Classes (6-10)

```bash
node scripts/generateContent.js all
```

**Warning:** This will take 2-3 hours and make many API calls!

## 📋 Content Structure

Each subchapter includes:

✅ **Educational Content:**
- Explanation (200-300 words)
- Definitions (3-5 items)
- Key Points (5-7 items)
- Real-world Examples (3-5 items)
- Diagram Description
- Formulas (if applicable)
- Hands-on Activity
- Common Misconceptions
- Summary (50-100 words)

✅ **Assessment:**
- 10 MCQs with answers
- 5 Short answer questions
- 3 Long answer questions
- 2 HOTS (Higher Order Thinking) questions

## 🔧 Configuration

### Required Environment Variables

```env
GEMINI_API_KEY=your_api_key_here
MONGO_URI=mongodb://localhost:27017/rural-learning-app
```

### API Rate Limits

The script includes built-in delays:
- 2 seconds between subchapters
- 3 seconds between chapters

This prevents rate limiting while generating content.

## 📊 Syllabus Coverage

### Class 6 - 12 Chapters
1. Food: Where Does It Come From?
2. Components of Food
3. Fibre to Fabric
4. Sorting Materials into Groups
5. Separation of Substances
6. Changes Around Us
7. Getting to Know Plants
8. Body Movements
9. The Living Organisms
10. Motion and Measurement
11. Light, Shadows and Reflections
12. Electricity and Circuits

### Class 7 - 15 Chapters
### Class 8 - 16 Chapters
### Class 9 - 15 Chapters
### Class 10 - 16 Chapters

**Total:** ~74 chapters, ~370 subchapters across all classes

## 💡 Usage Examples

### Example 1: Generate & Seed Class 6

```bash
# Generate content
node scripts/generateContent.js 6

# Wait for completion (~30 mins)

# Seed into database
node scripts/seedContent.js class6-science-content.json

# Start app
npm run dev
```

### Example 2: Add Class 7 Later

```bash
# Generate Class 7 content
node scripts/generateContent.js 7

# Seed it
node scripts/seedContent.js class7-science-content.json
```

### Example 3: Regenerate Specific Class

```bash
# Delete old file
rm data/class6-science-content.json

# Generate fresh
node scripts/generateContent.js 6

# Seed (will update existing)
node scripts/seedContent.js class6-science-content.json
```

## 🎓 Educational Quality

### Content Standards
- ✅ Original content (not copied from textbooks)
- ✅ Clear, simple language for students
- ✅ Aligned with Maharashtra Board + CBSE
- ✅ Includes practical activities
- ✅ Addresses common misconceptions
- ✅ Exam-oriented questions

### Review Process
1. Generate content
2. Review JSON file manually
3. Edit if needed (it's just JSON!)
4. Seed into database
5. Test in app

## 🔒 Offline Functionality

### Why This Doesn't Interfere with Offline:

1. **Content Generation = One-time Online Task**
   - Done once per class
   - Generates JSON files
   - Stored locally

2. **Database Seeding = One-time Online Task**
   - Imports JSON into MongoDB
   - MongoDB runs locally
   - No internet needed after seeding

3. **App Usage = Always Offline**
   - Reads from local MongoDB
   - No API calls during usage
   - Works completely offline

### Offline Workflow:

```
Teacher/Admin (Online):
→ Generate content using scripts
→ Seed into database
→ Share database backup

Students (Offline):
→ Install app with seeded database
→ Use app completely offline
→ All content available locally
```

## 🐛 Troubleshooting

### Issue: "GEMINI_API_KEY not found"
**Solution:** Add API key to `.env` file

### Issue: "MongoDB connection failed"
**Solution:** Start MongoDB: `mongod`

### Issue: "Rate limit exceeded"
**Solution:** Wait 5 minutes, script will resume

### Issue: "Invalid JSON response"
**Solution:** Script skips failed items, regenerate specific chapters if needed

## 📝 Manual Editing

JSON files can be edited manually:

```json
{
  "name": "Subchapter Name",
  "content": {
    "explanation": "Edit this text...",
    "keyPoints": ["Edit", "these", "points"]
  }
}
```

After editing, re-seed:
```bash
node scripts/seedContent.js class6-science-content.json
```

## 🎯 Next Steps

1. **Test with Class 6:**
   ```bash
   node scripts/generateContent.js 6
   node scripts/seedContent.js class6-science-content.json
   ```

2. **Review in App:**
   - Start backend: `npm run dev`
   - Open app in browser
   - Navigate to Learn → Class 6 → Science

3. **Generate More Classes:**
   ```bash
   node scripts/generateContent.js 7
   node scripts/seedContent.js class7-science-content.json
   ```

4. **Backup Content:**
   - JSON files in `data/` directory
   - Commit to version control
   - Share with team

## 📦 Deliverables

✅ **Scripts Created:**
- `scripts/generateContent.js` - AI content generator
- `scripts/seedContent.js` - Database seeder
- `scripts/README.md` - Documentation

✅ **Sample Content:**
- `data/class6-science-content.json` - 2 complete chapters

✅ **Documentation:**
- Complete usage guide
- Troubleshooting tips
- Offline compatibility explained

## 🎉 Benefits

1. **Scalable:** Generate content for any class
2. **Offline-Compatible:** Works without internet after seeding
3. **Editable:** JSON files can be manually edited
4. **Version-Controlled:** Track content changes in git
5. **Automated:** AI generates comprehensive content
6. **Quality:** Includes quizzes, activities, misconceptions
7. **Fast:** Generate entire class in 30-45 minutes

---

**Ready to use!** Start with Class 6 and expand as needed.
