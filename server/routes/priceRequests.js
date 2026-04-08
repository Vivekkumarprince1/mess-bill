import express from 'express';
import PriceRequest from '../models/PriceRequest.js';
import Item from '../models/Item.js';
import AuditLog from '../models/AuditLog.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all price requests (Admin sees all, Vendor sees own)
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Vendor') filter.vendorId = req.user._id;

    const requests = await PriceRequest.find(filter)
      .populate('itemId', 'name price')
      .populate('vendorId', 'name')
      .populate('adminId', 'name')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit a new price request (Vendor)
router.post('/', protect, authorize('Vendor'), async (req, res) => {
  try {
    const { itemId, newPrice, reason } = req.body;
    
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const request = new PriceRequest({
      itemId,
      vendorId: req.user._id,
      oldPrice: item.price,
      newPrice,
      reason,
      status: 'Pending'
    });

    await request.save();

    await AuditLog.create({
      userId: req.user._id,
      action: 'SUBMIT_PRICE_REQUEST',
      metadata: { itemId, oldPrice: item.price, newPrice }
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/Reject price request (Admin)
router.put('/:id', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const request = await PriceRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Price request not found' });
    if (request.status !== 'Pending') return res.status(400).json({ message: 'Request already processed' });

    request.status = status;
    request.adminId = req.user._id;
    await request.save();

    if (status === 'Approved') {
      // Actually change the price on the item
      const item = await Item.findById(request.itemId);
      item.price = request.newPrice;
      await item.save();

      await AuditLog.create({
        userId: req.user._id,
        action: 'APPROVE_PRICE_CHANGE',
        metadata: { itemId: item._id, newPrice: request.newPrice }
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
