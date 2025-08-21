import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  order: { type: Number, default: 0 }
});

const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true, default: 'Kahramanoğulları İnşaat' },
  
  // Contact Information
  phone: { type: String, required: false },
  mobile1: { type: String, required: false },
  mobile2: { type: String, required: false },
  email: { type: String, required: false },
  
  // Working Hours
  workingHours: { type: String, required: false },
  
  // About Section
  about: { type: String, required: false },
  
  // Team Members
  teamMembers: [TeamMemberSchema],
  
  // Address Reference
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  
  // Status
  isActive: { type: Boolean, default: true },
  
  // Statistics
  foundedYear: { type: Number, required: false },
  totalProjects: { type: Number, required: false, default: 0 }
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);