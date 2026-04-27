const bcrypt = require('bcrypt');
const User = require('../models/User');
const SegmentRule = require('../models/SegmentRule');
const Customer = require('../models/Customer');

const seedData = async () => {
    try {
        // ── Drop all collections for deterministic demo state ──
        await User.deleteMany({});
        await SegmentRule.deleteMany({});
        await Customer.deleteMany({});
        console.log('Cleared existing data for fresh seed');

        // ── Seed Users ──
        const hashedAdmin = await bcrypt.hash('admin123', 10);
        const hashedSales = await bcrypt.hash('sales123', 10);

        await User.create([
            { username: 'admin', password: hashedAdmin, role: 'admin' },
            { username: 'sales', password: hashedSales, role: 'sales' }
        ]);
        console.log('Seeded users: admin (admin/admin123), sales (sales/sales123)');

        // ── Seed Segment Rules ──
        // Normal: [0, 5000)  |  Gold: [5000, 20000)  |  Platinum: [20000, ∞)
        await SegmentRule.insertMany([
            { name: 'Normal', minPurchase: 0, maxPurchase: 5000, discountRate: 0 },
            { name: 'Gold', minPurchase: 5000, maxPurchase: 20000, discountRate: 10 },
            { name: 'Platinum', minPurchase: 20000, maxPurchase: 999999999, discountRate: 20 }
        ]);
        console.log('Seeded segment rules: Normal [0-5000), Gold [5000-20000), Platinum [20000+)');

        // ── Seed Demo Customers (12 total: 4 Normal, 4 Gold, 4 Platinum) ──
        const customers = [
            // 4 Normal segment (totalPurchaseAmount < 5000)
            { customerId: 'CUST-1001', companyName: 'Initech Solutions',      email: 'sales@initech.com',       phone: '555-0101', country: 'USA',         totalPurchaseAmount: 0 },
            { customerId: 'CUST-1002', companyName: 'Soylent Corp',           email: 'hello@soylent.com',       phone: '555-0102', country: 'Canada',      totalPurchaseAmount: 1500 },
            { customerId: 'CUST-1003', companyName: 'Prestige Worldwide',     email: 'dale@prestige.com',       phone: '555-0103', country: 'Australia',   totalPurchaseAmount: 3200 },
            { customerId: 'CUST-1004', companyName: 'Cyberdyne Systems',      email: 'skynet@cyberdyne.com',    phone: '555-0104', country: 'USA',         totalPurchaseAmount: 4000 },

            // 4 Gold segment (5000 <= totalPurchaseAmount < 20000)
            { customerId: 'CUST-1005', companyName: 'Massive Dynamic',        email: 'info@massive.com',        phone: '555-0105', country: 'Germany',     totalPurchaseAmount: 7000 },
            { customerId: 'CUST-1006', companyName: 'Globex International',   email: 'info@globex.com',         phone: '555-0106', country: 'United Kingdom', totalPurchaseAmount: 8000 },
            { customerId: 'CUST-1007', companyName: 'Oscorp Industries',      email: 'norman@oscorp.com',       phone: '555-0107', country: 'USA',         totalPurchaseAmount: 12000 },
            { customerId: 'CUST-1008', companyName: 'Wonka Industries',       email: 'willy@wonka.com',         phone: '555-0108', country: 'Switzerland', totalPurchaseAmount: 18500 },

            // 4 Platinum segment (totalPurchaseAmount >= 20000)
            { customerId: 'CUST-1009', companyName: 'Acme Corp',              email: 'contact@acme.com',        phone: '555-0109', country: 'USA',         totalPurchaseAmount: 25000 },
            { customerId: 'CUST-1010', companyName: 'Umbrella Corp',          email: 'admin@umbrella.com',      phone: '555-0110', country: 'Japan',       totalPurchaseAmount: 45000 },
            { customerId: 'CUST-1011', companyName: 'Wayne Enterprises',      email: 'bruce@wayne.com',         phone: '555-0111', country: 'USA',         totalPurchaseAmount: 85000 },
            { customerId: 'CUST-1012', companyName: 'Stark Industries',       email: 'tony@stark.com',          phone: '555-0112', country: 'USA',         totalPurchaseAmount: 100000 }
        ];

        await Customer.insertMany(customers);
        console.log(`Seeded ${customers.length} demo customers (4 Normal, 4 Gold, 4 Platinum)`);

    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

module.exports = seedData;
