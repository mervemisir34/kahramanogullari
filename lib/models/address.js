import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'Firma Adresi' },
  street: { type: String, required: true },
  neighborhood: { type: String, required: true },
  buildingInfo: { type: String, required: false },
  district: { type: String, required: true },
  city: { type: String, required: true },
  fullAddress: { type: String, required: true },
  phone: { type: String, required: false },
  email: { type: String, required: false },
  workingHours: { type: String, required: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Address || mongoose.model('Address', AddressSchema);