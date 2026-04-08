import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  metadata: { type: Object }, // Store what actually changed
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
