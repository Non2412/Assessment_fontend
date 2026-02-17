import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IEvaluation extends Document {
  assessmentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  answers: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluationSchema = new Schema<IEvaluation>(
  {
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    userId: { type: String, required: true }, // Using string to support guest or varied IDs
    answers: { type: Map, of: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent overwriting model if already compiled
const Evaluation: Model<IEvaluation> = mongoose.models.Evaluation || mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);

export default Evaluation;
