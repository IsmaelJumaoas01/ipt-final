const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

router.post('/', authorize(), create);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/employee/:employeeId', authorize(), getByEmployeeId);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(Role.Admin), _delete);

async function create(req, res, next) {
    try {
        // Create the request with items
        const request = await db.Request.create({
            type: req.body.type,
            status: req.body.status || 'Pending',
            employeeId: req.body.employeeId || req.user.employeeId,
            details: req.body.details || {}
        });

        // Create request items if provided
        if (req.body.items && Array.isArray(req.body.items)) {
            await db.RequestItem.bulkCreate(
                req.body.items.map(item => ({
                    ...item,
                    requestId: request.id
                }))
            );
        }

        // Return the created request with items
        const createdRequest = await db.Request.findByPk(request.id, {
            include: [{ model: db.RequestItem }, { model: db.Employee }]
        });

        res.status(201).json(createdRequest);
    } catch (err) {
        console.error('Error creating request:', err);
        next(err);
    }
}

async function getAll(req, res, next) {
    try {
        const requests = await db.Request.findAll({
            include: [{ model: db.RequestItem }, { model: db.Employee }]
        });
        res.json(requests);
    } catch (err) { next(err); }
}

async function getById(req, res, next) {
    try {
        const request = await db.Request.findByPk(req.params.id, {
            include: [{ model: db.RequestItem }, { model: db.Employee }]
        });
        if (!request) throw new Error('Request not found');
        if (req.user.role !== Role.Admin && request.employeeId !== req.user.employeeId) {
            throw new Error('Unauthorized');
        }
        res.json(request);
    } catch (err) { next(err); }
}

async function getByEmployeeId(req, res, next) {
    try {
        const requests = await db.Request.findAll({
            where: { employeeId: req.params.employeeId },
            include: [{ model: db.RequestItem }]
        });
        res.json(requests);
    } catch (err) { next(err); }
}

async function update(req, res, next) {
    try {
        const request = await db.Request.findByPk(req.params.id);
        if (!request) throw new Error('Request not found');
        
        // Allow users to update only their own requests
        if (req.user.role !== Role.Admin && request.employeeId !== req.user.employeeId) {
            throw new Error('Unauthorized - You can only update your own requests');
        }
        
        // Update request fields
        await request.update({
            type: req.body.type,
            status: req.user.role === Role.Admin ? req.body.status : request.status,
            employeeId: req.body.employeeId,
            details: req.body.details || {}
        });
        
        // Update request items if provided
        if (req.body.items && Array.isArray(req.body.items)) {
            // Delete existing items
            await db.RequestItem.destroy({ where: { requestId: request.id } });
            
            // Create new items
            await db.RequestItem.bulkCreate(
                req.body.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    requestId: request.id
                }))
            );
        }
        
        // Return the updated request with items
        const updatedRequest = await db.Request.findByPk(request.id, {
            include: [{ model: db.RequestItem }, { model: db.Employee }]
        });
        
        res.json(updatedRequest);
    } catch (err) {
        console.error('Error updating request:', err);
        next(err);
    }
}

async function _delete(req, res, next) {
    try {
        const request = await db.Request.findByPk(req.params.id);
        if (!request) throw new Error('Request not found');
        await request.destroy();
        res.json({ message: 'Request deleted' });
    } catch (err) { next(err); }
}

module.exports = router; 