const Customer = require('../models/Customer');
const { computeSegment } = require('../services/segmentationService');

const getCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7;
        const search = req.query.search || '';
        
        const query = search ? { companyName: { $regex: search, $options: 'i' } } : {};
        
        const total = await Customer.countDocuments(query);
        const customers = await Customer.find(query)
            .sort({ totalPurchaseAmount: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
            
        // Map through customers and attach computed segment data
        const customerList = await Promise.all(customers.map(async (c) => {
            const segData = await computeSegment(c.totalPurchaseAmount);
            return {
                ...c._doc,
                ...segData
            };
        }));
        
        res.json({
            customers: customerList,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            const segData = await computeSegment(customer.totalPurchaseAmount);
            res.json({
                ...customer._doc,
                ...segData
            });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }
};

const createCustomer = async (req, res) => {
    try {
        const { companyName, email, phone, totalPurchaseAmount } = req.body;
        
        // Auto-generate customerId (e.g. CUST-1001)
        const count = await Customer.countDocuments();
        const customerId = `CUST-${1000 + count + 1}`;
        
        let profileImageUrl = null;
        if (req.file) {
            profileImageUrl = `/uploads/${req.file.filename}`;
        }
        
        const newCustomer = new Customer({
            customerId,
            companyName,
            email,
            phone,
            totalPurchaseAmount: totalPurchaseAmount ? parseFloat(totalPurchaseAmount) : 0,
            profileImageUrl
        });
        
        const createdCustomer = await newCustomer.save();
        res.status(201).json(createdCustomer);
    } catch (error) {
        res.status(500).json({ message: 'Error creating customer', error: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { companyName, email, phone, totalPurchaseAmount } = req.body;
        const customer = await Customer.findById(req.params.id);
        
        if (customer) {
            customer.companyName = companyName || customer.companyName;
            customer.email = email || customer.email;
            customer.phone = phone || customer.phone;
            
            if (totalPurchaseAmount !== undefined) {
                customer.totalPurchaseAmount = parseFloat(totalPurchaseAmount);
            }
            
            if (req.file) {
                customer.profileImageUrl = `/uploads/${req.file.filename}`;
            } else if (req.body.removeImage === 'true') {
                customer.profileImageUrl = null;
            }
            
            const updatedCustomer = await customer.save();
            const segData = await computeSegment(updatedCustomer.totalPurchaseAmount);
            
            res.json({
                ...updatedCustomer._doc,
                ...segData
            });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        
        if (customer) {
            await customer.deleteOne();
            res.json({ message: 'Customer removed' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};

const addPurchase = async (req, res) => {
    try {
        const { amount } = req.body;
        const purchaseAmount = parseFloat(amount);
        
        if (!purchaseAmount || purchaseAmount <= 0) {
            return res.status(400).json({ message: 'Purchase amount must be > 0' });
        }
        
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            customer.totalPurchaseAmount += purchaseAmount;
            await customer.save();
            
            const segData = await computeSegment(customer.totalPurchaseAmount);
            res.json({
                ...customer._doc,
                ...segData
            });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding purchase', error: error.message });
    }
};

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    addPurchase
};
