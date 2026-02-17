import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Evaluation from '@/models/Evaluation';
import mongoose from 'mongoose';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { assessmentId, userId, answers } = body;

        if (!assessmentId || !userId || !answers) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already evaluated
        const existing = await Evaluation.findOne({ assessmentId, userId });
        if (existing) {
            return NextResponse.json({ message: 'You have already evaluated this project' }, { status: 400 });
        }

        const evaluation = await Evaluation.create({
            assessmentId,
            userId,
            answers
        });

        return NextResponse.json({ message: 'Evaluation submitted successfully', data: evaluation }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error submitting evaluation', error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const assessmentId = searchParams.get('assessmentId');

        if (!assessmentId) {
            return NextResponse.json({ message: 'Assessment ID is required' }, { status: 400 });
        }

        const evaluations = await Evaluation.find({ assessmentId });

        if (evaluations.length === 0) {
            return NextResponse.json({
                count: 0,
                averages: {},
                message: 'No evaluations yet'
            }, { status: 200 });
        }

        // Flattening and calculating averages (Anonymized)
        const totals: Record<string, number> = {};
        const counts: Record<string, number> = {};

        evaluations.forEach(ev => {
            // ev.answers is a Map in Mongoose, so we convert it or access it properly
            const answersObj = ev.answers instanceof Map ? Object.fromEntries(ev.answers) : ev.answers;

            Object.entries(answersObj).forEach(([qId, score]) => {
                totals[qId] = (totals[qId] || 0) + (score as number);
                counts[qId] = (counts[qId] || 0) + 1;
            });
        });

        const averages: Record<string, number> = {};
        Object.keys(totals).forEach(qId => {
            averages[qId] = parseFloat((totals[qId] / counts[qId]).toFixed(2));
        });

        return NextResponse.json({
            count: evaluations.length,
            averages,
            // We don't return the raw evaluations to keep it anonymous as requested
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching evaluations', error: error.message }, { status: 500 });
    }
}
