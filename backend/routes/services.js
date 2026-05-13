const express = require('express');
const Service = require('../models/Service');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get service by type
router.get('/:type', async (req, res) => {
  try {
    const services = await Service.find({ type: req.params.type });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add service (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, type, plans } = req.body;
    const service = new Service({ name, type, plans });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;