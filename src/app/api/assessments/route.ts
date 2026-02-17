import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        console.log("━━━ POST /api/assessments ━━━");
        await dbConnect();
        console.log("✅ DB connected");

        const body = await request.json();
        console.log("📝 Body:", body);

        const { title, subtitle, author, scope, abstract, fileData, fileName, mimeType, userId, isDraft } = body;

        if (!title) {
            console.warn("⚠️ Title missing");
            return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
        }

        const assessment = await Assessment.create({
            title,
            subtitle: subtitle || '',
            author: author || '',
            scope: scope || '',
            abstract: abstract || '',
            fileData: fileData || undefined,
            fileName: fileName || undefined,
            mimeType: mimeType || undefined,
            isDraft: isDraft !== undefined ? isDraft : true,
            isPublished: false,
            createdBy: userId || 'anonymous',
            status: 'Draft'
        });

        console.log("✅ Created:", assessment._id);
        return NextResponse.json({
            success: true,
            message: 'Assessment created successfully',
            data: assessment
        }, { status: 201 });

    } catch (error: any) {
        console.error("❌ Error:", error.message);
        console.error("Stack:", error.stack);
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
            .select('-fileData')
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${assessments.length} assessments`);
        return NextResponse.json(assessments, { status: 200 });

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        return NextResponse.json({
            success: false,
            message: 'Error fetching assessments',
            error: error.message
        }, { status: 500 });
    }
}
