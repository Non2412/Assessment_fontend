import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';

// GET Single Assessment (Includes File Data)
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const { id } = params;

        const assessment = await Assessment.findById(id);

        if (!assessment) {
            return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
        }

        return NextResponse.json(assessment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching assessment', error: error.message }, { status: 500 });
    }
}

// PUT/PATCH Update Assessment
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const { id } = params;
        const body = await request.json();

        // Update logic
        const updatedAssessment = await Assessment.findByIdAndUpdate(
            id,
            { ...body, updatedAt: new Date() }, // Force update timestamp
            { new: true }
        );

        if (!updatedAssessment) {
            return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Updated successfully', data: updatedAssessment }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating assessment', error: error.message }, { status: 500 });
    }
}

// DELETE Assessment
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const { id } = params;

        const deleted = await Assessment.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting assessment', error: error.message }, { status: 500 });
    }
}
