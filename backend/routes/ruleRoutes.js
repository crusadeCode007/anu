const express = require('express');
const router = express.Router();
const { getRules, updateRule } = require('../controllers/ruleController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getRules);
    
router.route('/:id')
    .put(protect, updateRule);

module.exports = router;
