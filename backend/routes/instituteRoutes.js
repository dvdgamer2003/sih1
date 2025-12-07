const express = require('express');
const router = express.Router();
const {
    createTeacher,
    getTeachers,
    updateTeacher,
    deleteTeacher,
    getInstituteAnalytics,
    uploadContent,
    listContent
} = require('../controllers/instituteController');
const { protect, instituteOnly } = require('../middleware/auth');

router.use(protect, instituteOnly);

router.route('/teacher')
    .post(createTeacher);

router.route('/teachers')
    .get(getTeachers);

router.route('/teacher/:id')
    .put(updateTeacher)
    .delete(deleteTeacher);

router.route('/analytics')
    .get(getInstituteAnalytics);

router.route('/content')
    .post(uploadContent)
    .get(listContent);

module.exports = router;
