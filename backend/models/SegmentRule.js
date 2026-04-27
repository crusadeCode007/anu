const mongoose = require('mongoose');

const segmentRuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    minPurchase: {
        type: Number,
        required: true
    },
    maxPurchase: {
        type: Number,
        required: true
    },
    discountRate: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('SegmentRule', segmentRuleSchema);
