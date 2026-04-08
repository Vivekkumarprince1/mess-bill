import mongoose from 'mongoose';

const priceRequestSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who approved/rejected it
}, { timestamps: true });

export default mongoose.model('PriceRequest', priceRequestSchema);
