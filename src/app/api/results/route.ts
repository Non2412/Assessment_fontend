import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connect';
import Result from '@/models/Result';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const results = await Result.find()
      .populate('assessmentId')
      .sort({ startedAt: -1 });

    return NextResponse.json({
      success: true,
      data: results,
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
    const { assessmentId, userId, userName } = body;

    if (!assessmentId || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Assessment ID and User ID are required',
        },
        { status: 400 }
      );
    }

    const result = new Result({
      assessmentId,
      userId,
      userName: userName || 'นักเรียน',
      status: 'In Progress',
    });

    const savedResult = await result.save();

    return NextResponse.json(
      {
        success: true,
        data: savedResult,
        message: 'Result created successfully',
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
