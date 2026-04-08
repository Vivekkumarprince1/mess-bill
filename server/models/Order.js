import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, required: true },
    priceAtTimeOfOrder: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Rejected', 'Disputed'], 
    default: 'Pending' 
  },
  disputeReason: { type: String },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
