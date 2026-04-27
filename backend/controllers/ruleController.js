const SegmentRule = require('../models/SegmentRule');

const getRules = async (req, res) => {
    try {
        const rules = await SegmentRule.find().sort({ minPurchase: 1 });
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateRule = async (req, res) => {
    try {
        const { minPurchase, maxPurchase, discountRate } = req.body;
        const rule = await SegmentRule.findById(req.params.id);
        
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        const newMin = minPurchase !== undefined ? Number(minPurchase) : rule.minPurchase;
        const newMax = maxPurchase !== undefined ? Number(maxPurchase) : rule.maxPurchase;
        const newDiscount = discountRate !== undefined ? Number(discountRate) : rule.discountRate;

        // Validate min < max
        if (newMin >= newMax) {
            return res.status(400).json({ message: 'Min Purchase must be less than Max Purchase' });
        }

        // Validate discount range
        if (newDiscount < 0 || newDiscount > 100) {
            return res.status(400).json({ message: 'Discount rate must be between 0 and 100' });
        }

        // Check overlap with other rules
        const otherRules = await SegmentRule.find({ _id: { $ne: rule._id } });
        for (const other of otherRules) {
            if (newMin < other.maxPurchase && newMax > other.minPurchase) {
                return res.status(400).json({ 
                    message: `Range overlaps with ${other.name} segment [${other.minPurchase} - ${other.maxPurchase})` 
                });
            }
        }

        rule.minPurchase = newMin;
        rule.maxPurchase = newMax;
        rule.discountRate = newDiscount;
        
        const updatedRule = await rule.save();
        res.json(updatedRule);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getRules, updateRule };
