const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const SegmentRule = require('../models/SegmentRule');
const Customer = require('../models/Customer');

const seedData = async () => {
    try {
        // Seed Admin User
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                password: hashedPassword
            });
            console.log('Seeded admin user');
        }

        // Seed Segment Rules
        const rulesExist = await SegmentRule.countDocuments();
        if (rulesExist === 0) {
            await SegmentRule.insertMany([
                { name: 'Normal', minPurchaseAmount: 0, discountRate: 0 },
                { name: 'Gold', minPurchaseAmount: 5000, discountRate: 10 },
                { name: 'Platinum', minPurchaseAmount: 20000, discountRate: 20 }
            ]);
            console.log('Seeded segment rules (Normal, Gold, Platinum)');
        }

        // Seed Mock Customers
        const customersExist = await Customer.countDocuments();
        if (customersExist === 0) {
            const dummyCustomers = [
                {
                    customerId: 'CUST-1001',
                    companyName: 'Acme Corp',
                    email: 'contact@acme.com',
                    phone: '555-0101',
                    totalPurchaseAmount: 25000,
                },
                {
                    customerId: 'CUST-1002',
                    companyName: 'Globex',
                    email: 'info@globex.com',
                    phone: '555-0102',
                    totalPurchaseAmount: 8000,
                },
                {
                    customerId: 'CUST-1003',
                    companyName: 'Soylent Corp',
                    email: 'hello@soylent.com',
                    phone: '555-0103',
                    totalPurchaseAmount: 1500,
                },
                {
                    customerId: 'CUST-1004',
                    companyName: 'Initech',
                    email: 'sales@initech.com',
                    phone: '555-0104',
                    totalPurchaseAmount: 0,
                },
                {
                    customerId: 'CUST-1005',
                    companyName: 'Umbrella Corp',
                    email: 'admin@umbrella.com',
                    phone: '555-0105',
                    totalPurchaseAmount: 45000,
                },
                {
                    customerId: 'CUST-1006',
                    companyName: 'Massive Dynamic',
                    email: 'info@massive.com',
                    phone: '555-0106',
                    totalPurchaseAmount: 7000,
                },
                {
                    customerId: 'CUST-1007',
                    companyName: 'Stark Industries',
                    email: 'tony@stark.com',
                    phone: '555-0107',
                    totalPurchaseAmount: 100000,
                },
                {
                    customerId: 'CUST-1008',
                    companyName: 'Wayne Enterprises',
                    email: 'bruce@wayne.com',
                    phone: '555-0108',
                    totalPurchaseAmount: 85000,
                },
                {
                    customerId: 'CUST-1009',
                    companyName: 'Oscorp',
                    email: 'norman@oscorp.com',
                    phone: '555-0109',
                    totalPurchaseAmount: 12000,
                },
                {
                    customerId: 'CUST-1010',
                    companyName: 'Cyberdyne Systems',
                    email: 'skynet@cyberdyne.com',
                    phone: '555-0110',
                    totalPurchaseAmount: 4000,
                }
            ];
            
            await Customer.insertMany(dummyCustomers);
            console.log('Seeded 10 dummy customers');
        }

    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

module.exports = seedData;
