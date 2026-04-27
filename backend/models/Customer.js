const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: null
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    totalPurchaseAmount: {
        type: Number,
        default: 0
    },
    profileImageUrl: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
