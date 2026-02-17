import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: 'นักเรียน',
  },
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  score: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Submitted'],
    default: 'In Progress',
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  duration: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Result || mongoose.model('Result', resultSchema);
