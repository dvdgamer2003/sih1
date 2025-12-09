const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');
const {
    createClass,
    updateClass,
    deleteClass,
    createSubject,
    updateSubject,
    deleteSubject,
    createChapter,
    updateChapter,
    deleteChapter,
    createSubchapter,
    updateSubchapter,
    deleteSubchapter,
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getInstitutes,
    createInstitute,
    updateInstitute,
    deleteInstitute,
    getGlobalAnalytics,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUsersByCity,
    getUniqueCities
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(protect, adminOnly);

// User Management Routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Class routes
router.post('/classes', createClass);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);

// Subject routes
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

// Chapter routes
router.post('/chapters', createChapter);
router.put('/chapters/:id', updateChapter);
router.delete('/chapters/:id', deleteChapter);

// Subchapter routes
router.post('/subchapters', createSubchapter);
router.put('/subchapters/:id', updateSubchapter);
router.delete('/subchapters/:id', deleteSubchapter);

// Teacher routes (Legacy)
router.get('/teachers', getTeachers);
router.post('/teachers', createTeacher);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

// Institute routes
router.get('/institutes', getInstitutes);
router.post('/institutes', createInstitute);
router.put('/institutes/:id', updateInstitute);
router.delete('/institutes/:id', deleteInstitute);

// Analytics route
router.get('/analytics', getGlobalAnalytics);

// City/Location routes
router.get('/users/by-city', getUsersByCity);
router.get('/cities', getUniqueCities);

module.exports = router;
