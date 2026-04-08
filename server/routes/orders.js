import express from 'express';
import Order from '../models/Order.js';
import Item from '../models/Item.js';
import AuditLog from '../models/AuditLog.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all orders (Student sees their own, Vendor/Admin/Super Admin see all or filtered)
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Student') {
      filter.studentId = req.user._id;
    } else if (req.user.role === 'Vendor') {
      filter.vendorId = req.user._id;
    }

    const orders = await Order.find(filter)
      .populate('studentId', 'name email')
      .populate('vendorId', 'name')
      .populate('items.itemId', 'name price')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Order (Student: "Submit Request")
router.post('/', protect, authorize('Student'), async (req, res) => {
  try {
    const { items, vendorId } = req.body; 
    // items should be array of { itemId, quantity }
    
    let total = 0;
    const orderItems = [];

    // Fetch item prices to prevent client-side manipulation
    for (const reqItem of items) {
      const item = await Item.findById(reqItem.itemId);
      if (!item) return res.status(404).json({ message: `Item ${reqItem.itemId} not found` });
      if (!item.approved) return res.status(400).json({ message: `Item ${item.name} is not approved for sale yet` });
      
      const itemTotal = item.price * reqItem.quantity;
      total += itemTotal;
      orderItems.push({
        itemId: item._id,
        quantity: reqItem.quantity,
        priceAtTimeOfOrder: item.price
      });
    }

    const order = new Order({
      studentId: req.user._id,
      vendorId: vendorId, // Option: vendor ID is passed if multiple vendors exist
      items: orderItems,
      total,
      status: 'Pending'
    });

    const createdOrder = await order.save();

    // Log the action
    await AuditLog.create({
      userId: req.user._id,
      action: 'CREATE_ORDER',
      metadata: { orderId: createdOrder._id, total }
    });

    // Alert vendors via socket
    req.app.get('io').emit('newOrder', createdOrder);

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Order (Vendor: "Approve & Dispense" or Student: "Dispute")
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, disputeReason } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order found' });

    // Vendor approving to Dispense
    if (req.user.role === 'Vendor' && status === 'Completed') {
      order.status = 'Completed';
      order.vendorId = req.user._id; // Locking in which vendor completed it
      await order.save();

      // Log the transaction
      await AuditLog.create({
        userId: req.user._id,
        action: 'DISPENSE_ORDER',
        metadata: { orderId: order._id, status }
      });

      // Update student via socket
      req.app.get('io').emit('orderStatusChanged', order);
      return res.json(order);
    }
    
    // Student raising a dispute
    if (req.user.role === 'Student' && status === 'Disputed') {
      // Can only dispute if they own it
      if (order.studentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to dispute this order' });
      }
      
      order.status = 'Disputed';
      if (disputeReason) order.disputeReason = disputeReason;
      await order.save();

      await AuditLog.create({
        userId: req.user._id,
        action: 'DISPUTE_ORDER',
        metadata: { orderId: order._id, reason: disputeReason }
      });

      // Alert admins via socket
      req.app.get('io').emit('orderDisputed', order);
      return res.json(order);
    }

    res.status(400).json({ message: 'Invalid action combination for this role' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
