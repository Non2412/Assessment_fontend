import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAssessment extends Document {
    title: string;
    subtitle?: string;
    icon?: string;
    author?: string;
    scope: string;
    abstract: string;
    description?: string;
    fullContent?: string; // For text content if extracted

    // File handling (Base64)
    fileData?: string; // Base64 string of the PDF
    fileName?: string;
    mimeType?: string;

    // Status
    isDraft: boolean;
    isPublished: boolean;
    status: 'Draft' | 'Open' | 'Closed';

    // Ownership
    createdBy: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
    {
        title: { type: String, required: [true, 'Please provide a title'] },
        subtitle: { type: String, default: 'Web Application Development' }, // Default subtitle
        icon: { type: String, default: '📝' },
        author: { type: String },
        scope: { type: String },
        abstract: { type: String },
        description: { type: String },
        fullContent: { type: String },

        fileData: { type: String }, // Consider excluding this from default queries if too large
        fileName: { type: String },
        mimeType: { type: String },

        isDraft: { type: Boolean, default: true },
        isPublished: { type: Boolean, default: false },
        status: { type: String, enum: ['Draft', 'Open', 'Closed'], default: 'Draft' },

        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
    }
);

// Prevent overwriting model if already compiled
const Assessment: Model<IAssessment> = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);

export default Assessment;
