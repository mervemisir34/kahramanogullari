import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ['COMPLETED', 'ONGOING'],
    required: true,
  },
  images: [{ type: String, required: true }],
  
  // Proje detayları
  apartmentInfo: { type: String, required: false },
  duplexInfo: { type: String, required: false },
  
  // Tarih bilgileri
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false }, // Sadece COMPLETED projelerde zorunlu
}, { timestamps: true, strict: false });

// Clear the cached model to ensure schema changes are applied
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.model('Project', ProjectSchema);