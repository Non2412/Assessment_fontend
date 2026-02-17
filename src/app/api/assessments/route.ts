import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import Evaluation from '@/models/Evaluation'; // Import Evaluation
import mongoose from 'mongoose';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds

export async function POST(request: Request) {
    try {
        console.log("━━━ POST /api/assessments ━━━");
        const { bucket } = await dbConnect();
        console.log("✅ DB connected & Bucket ready");

        const body = await request.json();
        const { title, subtitle, author, scope, abstract, fileData, fileName, mimeType, userId, isDraft } = body;

        if (!title) {
            console.warn("⚠️ Title missing");
            return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
        }

        let fileId: mongoose.Types.ObjectId | undefined;

        if (fileData && typeof fileData === 'string') {
            const base64Content = fileData.split(',')[1] || fileData;
            const buffer = Buffer.from(base64Content, 'base64');

            // Upload to GridFS
            const uploadStream = bucket.openUploadStream(fileName || 'assessment.pdf', {
                contentType: mimeType || 'application/pdf',
                metadata: { userId, title }
            });

            const readableStream = new Readable();
            readableStream.push(buffer);
            readableStream.push(null);

            await new Promise((resolve, reject) => {
                readableStream.pipe(uploadStream)
                    .on('error', reject)
                    .on('finish', () => {
                        fileId = uploadStream.id as mongoose.Types.ObjectId;
                        resolve(null);
                    });
            });
            console.log("✅ File uploaded to GridFS:", fileId);
        }

        const assessment = await Assessment.create({
            title,
            subtitle: subtitle || '',
            author: author || '',
            scope: scope || '',
            abstract: abstract || '',
            fileId: fileId,
            fileName: fileName || undefined,
            mimeType: mimeType || undefined,
            isDraft: isDraft !== undefined ? isDraft : true,
            isPublished: false,
            createdBy: userId || 'anonymous',
            status: 'Draft'
        });

        console.log("✅ Created Assessment:", assessment._id);
        return NextResponse.json({
            success: true,
            message: 'Assessment created successfully',
            data: assessment
        }, { status: 201 });

    } catch (error: any) {
        console.error("❌ Error:", error.message);
        return NextResponse.json({
            success: false,
            message: 'Error creating assessment',
            error: error.message
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        console.log("━━━ GET /api/assessments ━━━");
        await dbConnect();
        console.log("✅ DB connected");

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const isPublished = searchParams.get('isPublished');

        console.log("🔍 Query:", { userId, isPublished });

        let query: any = {};

        if (userId) {
            query.createdBy = userId;
        }

        if (isPublished === 'true') {
            query.isPublished = true;
        }

        const assessments = await Assessment.find(query)
            .select('-fileId')
            .sort({ createdAt: -1 })
            .lean(); // Use lean for performance and easy modification

        // Fetch evaluation count for each assessment
        const assessmentsWithCounts = await Promise.all(
            assessments.map(async (a: any) => {
                const count = await Evaluation.countDocuments({ assessmentId: a._id });
                return { ...a, evaluationCount: count };
            })
        );

        console.log(`✅ Found ${assessmentsWithCounts.length} assessments with evaluation counts`);
        return NextResponse.json(assessmentsWithCounts, { status: 200 });

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        return NextResponse.json({
            success: false,
            message: 'Error fetching assessments',
            error: error.message
        }, { status: 500 });
    }
}
