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

    // File handling
    fileId?: mongoose.Types.ObjectId; // Reference to GridFS file
    fileName?: string;
    mimeType?: string;

    // Status
    isDraft: boolean;
    isPublished: boolean;
    isUpdated: boolean;
    status: 'Draft' | 'Open' | 'Closed';

    // Ownership
    createdBy?: string; // User ID (can be string, not ObjectId)

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

        fileId: { type: Schema.Types.ObjectId }, // Store reference to GridFS object
        fileName: { type: String },
        mimeType: { type: String },

        isDraft: { type: Boolean, default: true },
        isPublished: { type: Boolean, default: false },
        isUpdated: { type: Boolean, default: false },
        status: { type: String, enum: ['Draft', 'Open', 'Closed'], default: 'Draft' },

        createdBy: { type: String }, // User ID as string
    },
    {
        timestamps: true,
    }
);

// Prevent overwriting model if already compiled
const Assessment: Model<IAssessment> = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);

export default Assessment;
