const express = require('express');
const router = express.Router();
const { getOrgans, getOrganById } = require('../controllers/scienceController');

router.get('/organs', getOrgans);
router.get('/organs/:id', getOrganById);

module.exports = router;
