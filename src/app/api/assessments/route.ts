import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        console.log("POST /api/assessments called");
        await dbConnect();

        // Expecting JSON with base64 file data or just standard fields
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

        // Validation
        if (!title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        // Create new assessment
        const assessment = await Assessment.create({
            title,
            subtitle,
            author,
            scope,
            abstract,
            // Only save file data if provided
            fileData: fileData || undefined,
            fileName: fileName || undefined,
            mimeType: mimeType || undefined,

            isDraft: isDraft !== undefined ? isDraft : true,
            isPublished: false, // Default to false
            createdBy: mongoose.Types.ObjectId.isValid(userId) ? userId : undefined, // safely handle non-object-id users
            status: 'Draft'
        });

        return NextResponse.json({
            message: 'Assessment created successfully',
            data: assessment
        }, { status: 201 });

    } catch (error: any) {
        console.error('Create Assessment Error:', error);
        return NextResponse.json(
            { message: 'Error creating assessment', error: error.message },
            { status: 500 }
        );
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
