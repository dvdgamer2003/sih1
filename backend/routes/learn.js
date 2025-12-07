const express = require('express');
const router = express.Router();
const {
    getClasses,
    getSubjects,
    getChapters,
    getSubchapters,
    getSubchapter,
    getQuiz,
    getChapterWithContent,
    regenerateQuiz,
    getVisuals,
    generateReadingMaterial
} = require('../controllers/learnController');

router.get('/classes', getClasses);
router.get('/classes/:classId/subjects', getSubjects);
router.get('/subjects/:subjectId/chapters', getChapters);
router.get('/chapters/:chapterId/subchapters', getSubchapters);
router.get('/chapters/:chapterId/content', getChapterWithContent);
router.get('/subchapters/:id', getSubchapter);
router.get('/subchapters/:id/quiz', getQuiz);
router.get('/subchapters/:id/visuals', getVisuals);
router.post('/subchapters/:id/quiz/regenerate', regenerateQuiz);
router.post('/subchapters/:id/generate-content', generateReadingMaterial);

module.exports = router;
