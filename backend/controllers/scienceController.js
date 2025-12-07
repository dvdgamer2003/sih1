const Anatomy = require('../models/Anatomy');

// @desc    Get all anatomy items
// @route   GET /api/science/organs
// @access  Public
const getOrgans = async (req, res) => {
    try {
        const organs = await Anatomy.find({});
        res.json(organs);
    } catch (error) {
        console.error('Error in getOrgans:', error);
        res.status(500).json({ message: 'Failed to fetch organs', error: error.message });
    }
};

// @desc    Get single organ by ID
// @route   GET /api/science/organs/:id
// @access  Public
const getOrganById = async (req, res) => {
    try {
        const organ = await Anatomy.findById(req.params.id);
        if (organ) {
            res.json(organ);
        } else {
            res.status(404).json({ message: 'Organ not found' });
        }
    } catch (error) {
        console.error('Error in getOrganById:', error);
        res.status(500).json({ message: 'Failed to fetch organ', error: error.message });
    }
};

module.exports = { getOrgans, getOrganById };
