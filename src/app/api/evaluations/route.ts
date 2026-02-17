import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Evaluation from '@/models/Evaluation';
import Assessment from '@/models/Assessment';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { assessmentId, userId, answers } = body;

        if (!assessmentId || !userId || !answers) {
            return NextResponse.json({ message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
        }

        // Get the assessment to check current update status
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return NextResponse.json({ message: 'ไม่พบแบบประเมิน' }, { status: 404 });
        }

        // Optional: In a real system, we'd check if the user already evaluated *this specific version*
        // For now, let's just create a new record. 
        // We'll manage "can evaluate again" logic on the frontend by checking the local storage list
        // and matching it with the assessment's updatedAt or isUpdated flag.

        const evaluation = await Evaluation.create({
            assessmentId,
            userId,
            answers
        });

        // หลังจากประเมินเสร็จ ให้รีเซ็ตสถานะ isUpdated ของแบบประเมินนั้น
        await Assessment.findByIdAndUpdate(assessmentId, { isUpdated: false });

        return NextResponse.json({ message: 'ส่งผลการประเมินสำเร็จ', evaluation }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'เกิดข้อผิดพลาด', error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const assessmentId = searchParams.get('assessmentId');

        if (!assessmentId) {
            return NextResponse.json({ message: 'ต้องระบุ Assessment ID' }, { status: 400 });
        }

        const evaluations = await Evaluation.find({ assessmentId });

        // Calculate averages for summary (Anonymous)
        const totalCount = evaluations.length;
        if (totalCount === 0) {
            return NextResponse.json({ count: 0, averages: {} }, { status: 200 });
        }

        const questionTotals: Record<string, number> = {};
        const questionCounts: Record<string, number> = {};

        evaluations.forEach(ev => {
            const answers = ev.answers instanceof Map ? Object.fromEntries(ev.answers) : ev.answers;
            Object.entries(answers).forEach(([qId, score]) => {
                questionTotals[qId] = (questionTotals[qId] || 0) + (score as number);
                questionCounts[qId] = (questionCounts[qId] || 0) + 1;
            });
        });

        const averages: Record<string, number> = {};
        Object.keys(questionTotals).forEach(qId => {
            averages[qId] = parseFloat((questionTotals[qId] / questionCounts[qId]).toFixed(2));
        });

        return NextResponse.json({
            count: totalCount,
            averages
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'เกิดข้อผิดพลาด', error: error.message }, { status: 500 });
    }
}
