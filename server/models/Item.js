import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  approved: { type: Boolean, default: false }, // Requires Admin approval
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
