import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connect';
import Assessment from '@/models/Assessment';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = {};
    if (status) {
      query = { status };
    }

    const assessments = await Assessment.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: assessments,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, description, abstract, totalQuestions, estimatedTime } = body;

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title and description are required',
        },
        { status: 400 }
      );
    }

    const assessment = new Assessment({
      title,
      description,
      abstract: abstract || '',
      totalQuestions: totalQuestions || 0,
      estimatedTime: estimatedTime || 10,
    });

    const savedAssessment = await assessment.save();

    return NextResponse.json(
      {
        success: true,
        data: savedAssessment,
        message: 'Assessment created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
