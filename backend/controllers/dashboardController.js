const Customer = require('../models/Customer');
const SegmentRule = require('../models/SegmentRule');
const { computeSegment } = require('../services/segmentationService');

const getDashboardData = async (req, res) => {
    try {
        const customers = await Customer.find();
        const rules = await SegmentRule.find().sort({ minPurchase: 1 });
        
        // Initialize segment counts dynamically from rules
        const segmentCounts = {};
        const segmentColors = { Normal: '#3b82f6', Gold: '#fbbf24', Platinum: '#a855f7' };
        
        for (const rule of rules) {
            segmentCounts[rule.name] = 0;
        }
        
        for (let c of customers) {
            const { segment } = await computeSegment(c.totalPurchaseAmount);
            if (segmentCounts[segment] !== undefined) {
                segmentCounts[segment]++;
            } else {
                segmentCounts[segment] = 1;
            }
        }
        
        const pieChartData = Object.keys(segmentCounts).map((key) => {
            return {
                name: key,
                count: segmentCounts[key],
                color: segmentColors[key] || '#9ca3af',
                legendFontColor: "#7F7F7F",
                legendFontSize: 12
            };
        });

        res.json({
            totalCustomers: customers.length,
            pieChartData
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
};

module.exports = { getDashboardData };
