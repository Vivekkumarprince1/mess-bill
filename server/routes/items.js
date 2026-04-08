import express from 'express';
import Item from '../models/Item.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get approved items (for students and vendors)
router.get('/approved', async (req, res) => {
  try {
    const items = await Item.find({ approved: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new item (Vendor)
router.post('/', protect, authorize('Vendor', 'Admin', 'Super Admin'), async (req, res) => {
  try {
    const { name, price } = req.body;
    const item = new Item({
      name,
      price,
      createdBy: req.user._id,
      approved: req.user.role === 'Admin' || req.user.role === 'Super Admin' // Auto-approve if Admin
    });
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all items (Admin/Super Admin)
router.get('/', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const items = await Item.find({}).populate('createdBy', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/Reject item (Admin)
router.put('/:id/approve', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    item.approved = req.body.approved; // true or false
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
