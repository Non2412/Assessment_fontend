import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import mongoose from 'mongoose';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds

export async function POST(request: Request) {
    try {
        console.log("POST /api/assessments called");
        const { bucket } = await dbConnect();

        const body = await request.json();

        const {
            title,
            subtitle,
            author,
            scope,
            abstract,
            fileData,
            fileName,
            mimeType,
            userId,
            isDraft
        } = body;

        if (!title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
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
        }

        const assessment = await Assessment.create({
            title,
            subtitle,
            author,
            scope,
            abstract,
            fileId,
            fileName: fileName || undefined,
            mimeType: mimeType || undefined,
            isDraft: isDraft !== undefined ? isDraft : true,
            isPublished: false,
            createdBy: mongoose.Types.ObjectId.isValid(userId) ? userId : undefined,
            status: 'Draft'
        });

        return NextResponse.json({
            message: 'Assessment created successfully',
            data: assessment
        }, { status: 201 });

    } catch (error: any) {
        console.error('Create Assessment Error:', error);
        return NextResponse.json({ message: 'Error creating assessment', error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const isPublished = searchParams.get('isPublished');

        console.log("GET /api/assessments query:", { userId, isPublished });

        let query: any = {};

        // Filter scenarios:
        // 1. Get My Drafts/All (needs userId)
        if (userId) {
            query.createdBy = userId;
        }

        // 2. Get Public/Published (for Assessment Page)
        if (isPublished === 'true') {
            // Include user-specific ones too? Or just strictly published?
            // Usually public view should see ALL published assessments
            // If we filter by createdBy AND published, we see "My Published".
            // If we just filter by published, we see "All Published".

            if (userId) {
                // User wants to see THEIR published maps? Or just standard filter mix?
                // Let's assume strict AND if both present
                query.isPublished = true;
            } else {
                // No user specified, so get ALL published
                query = { isPublished: true };
            }
        }

        // Performance: Exclude heavy fileData from list view
        const assessments = await Assessment.find(query)
            .select('-fileData') // Exclude file content
            .sort({ createdAt: -1 });

        return NextResponse.json(assessments, { status: 200 });

    } catch (error: any) {
        console.error('Fetch Assessments Error:', error);
        return NextResponse.json(
            { message: 'Error fetching assessments', error: error.message },
            { status: 500 }
        );
    }
}
