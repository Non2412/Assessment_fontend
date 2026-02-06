import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const all = await Assessment.find({});
        return NextResponse.json({
            count: all.length,
            data: all
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
