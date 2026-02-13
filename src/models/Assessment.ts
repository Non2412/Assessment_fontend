import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Draft'],
    default: 'Open',
  },
  icon: {
    type: String,
    default: '📝',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  totalQuestions: {
    type: Number,
    default: 0,
  },
  estimatedTime: {
    type: Number,
    default: 10,
  },
});

export default mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);
