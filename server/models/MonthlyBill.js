import mongoose from 'mongoose';

const monthlyBillSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true }, // e.g., 1 for Jan
  year: { type: Number, required: true },
  items: [{
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    total: { type: Number }
  }],
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Locked', 'Paid'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('MonthlyBill', monthlyBillSchema);
