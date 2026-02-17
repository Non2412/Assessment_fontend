import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import { Readable } from 'stream';

export const maxDuration = 60; // 60 seconds

// GET Single Assessment (Includes File Data)
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const { bucket } = await dbConnect();
        const { id } = params;

        const assessment = await Assessment.findById(id);

        if (!assessment) {
            return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
        }

        const assessmentObj = assessment.toObject();

        // If has fileId, fetch from GridFS
        if (assessmentObj.fileId) {
            try {
                const downloadStream = bucket.openDownloadStream(assessmentObj.fileId);
                const chunks: any[] = [];

                await new Promise((resolve, reject) => {
                    downloadStream.on('data', (chunk: Buffer) => chunks.push(chunk));
                    downloadStream.on('error', reject);
                    downloadStream.on('end', resolve);
                });

                const buffer = Buffer.concat(chunks);
                const mimeType = assessmentObj.mimeType || 'application/pdf';
                assessmentObj.fileData = `data:${mimeType};base64,${buffer.toString('base64')}`;
            } catch (err) {
                console.error("Error reading from GridFS:", err);
            }
        }

        return NextResponse.json(assessmentObj, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching assessment', error: error.message }, { status: 500 });
    }
}

// PUT/PATCH Update Assessment
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const { bucket } = await dbConnect();
        const { id } = params;
        const body = await request.json();

        // Handle file update in GridFS
        if (body.fileData && typeof body.fileData === 'string' && body.fileData.startsWith('data:')) {
            // Delete old file if exists
            const existing = await Assessment.findById(id);
            if (existing?.fileId) {
                try {
                    await bucket.delete(existing.fileId);
                } catch (err) { console.error("Could not delete old file", err); }
            }

            // Upload new file
            const base64Content = body.fileData.split(',')[1] || body.fileData;
            const buffer = Buffer.from(base64Content, 'base64');

            const uploadStream = bucket.openUploadStream(body.fileName || 'updated.pdf', {
                contentType: body.mimeType || 'application/pdf'
            });

            const readableStream = new Readable();
            readableStream.push(buffer);
            readableStream.push(null);

            await new Promise((resolve, reject) => {
                readableStream.pipe(uploadStream)
                    .on('error', reject)
                    .on('finish', () => {
                        body.fileId = uploadStream.id;
                        resolve(null);
                    });
            });

            // Remove fileData from body so it doesn't try to save it in document
            delete body.fileData;
        }

        const updatedAssessment = await Assessment.findByIdAndUpdate(
            id,
            { ...body, updatedAt: new Date() },
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
        const { bucket } = await dbConnect();
        const { id } = params;

        const assessment = await Assessment.findById(id);
        if (assessment?.fileId) {
            try {
                await bucket.delete(assessment.fileId);
            } catch (err) { console.error("Could not delete file from GridFS", err); }
        }

        const deleted = await Assessment.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting assessment', error: error.message }, { status: 500 });
    }
}
