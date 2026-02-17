import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connect';
import Result from '@/models/Result';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const result = await Result.findById(id).populate('assessmentId');

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Result not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
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
    const { responses, score, percentage, status, duration } = body;

    const result = await Result.findByIdAndUpdate(
      id,
      {
        responses,
        score,
        percentage,
        status,
        duration,
        completedAt: status === 'Completed' || status === 'Submitted' ? Date.now() : null,
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Result not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Result updated successfully',
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

    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Result not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Result deleted successfully',
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
