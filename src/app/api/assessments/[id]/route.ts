import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connect';
import Assessment from '@/models/Assessment';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Assessment not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: assessment,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { title, description, abstract, status, totalQuestions, estimatedTime } = body;

    const assessment = await Assessment.findByIdAndUpdate(
      id,
      {
        title,
        description,
        abstract,
        status,
        totalQuestions,
        estimatedTime,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!assessment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Assessment not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: assessment,
      message: 'Assessment updated successfully',
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const assessment = await Assessment.findByIdAndDelete(id);

    if (!assessment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Assessment not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment deleted successfully',
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
