const mongoose = require('mongoose');

const segmentRuleSchema = new mongoose.Schema({
    name: {
        type: String, // 'Normal', 'Gold', 'Platinum'
        required: true,
        unique: true
    },
    minPurchaseAmount: {
        type: Number,
        required: true
    },
    discountRate: {
        type: Number, // Percentage 0-100
        required: true
    }
});

module.exports = mongoose.model('SegmentRule', segmentRuleSchema);
