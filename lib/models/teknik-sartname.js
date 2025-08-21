import mongoose from 'mongoose';

const teknikSartnameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  content: {
    type: String,
    required: false,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const TeknikSartname = mongoose.models.TeknikSartname || mongoose.model('TeknikSartname', teknikSartnameSchema);

export default TeknikSartname;