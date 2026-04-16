const SegmentRule = require('../models/SegmentRule');

const getRules = async (req, res) => {
    try {
        const rules = await SegmentRule.find().sort({ minPurchaseAmount: 1 });
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateRule = async (req, res) => {
    try {
        const { minPurchaseAmount, discountRate } = req.body;
        const rule = await SegmentRule.findById(req.params.id);
        
        if (rule) {
            rule.minPurchaseAmount = minPurchaseAmount !== undefined ? Number(minPurchaseAmount) : rule.minPurchaseAmount;
            rule.discountRate = discountRate !== undefined ? Number(discountRate) : rule.discountRate;
            
            const updatedRule = await rule.save();
            res.json(updatedRule);
        } else {
            res.status(404).json({ message: 'Rule not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getRules, updateRule };
