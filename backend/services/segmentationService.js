const SegmentRule = require('../models/SegmentRule');

const computeSegment = async (totalPurchaseAmount) => {
    const rules = await SegmentRule.find().sort({ minPurchase: 1 });
    
    // Default fallback if no rules match or exist
    let assignedSegment = 'Normal';
    let assignedDiscountRate = 0;

    for (let rule of rules) {
        if (totalPurchaseAmount >= rule.minPurchase && totalPurchaseAmount < rule.maxPurchase) {
            assignedSegment = rule.name;
            assignedDiscountRate = rule.discountRate;
            break;
        }
    }
    
    return {
        segment: assignedSegment,
        discountRate: assignedDiscountRate
    };
};

module.exports = {
    computeSegment
};
