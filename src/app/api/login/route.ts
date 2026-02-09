import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' },
                { status: 400 }
            );
        }

        // Find User
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // Return User Data (excluding password)
        const userData = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        return NextResponse.json(
            {
                message: 'เข้าสู่ระบบสำเร็จ',
                user: userData
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message },
            { status: 500 }
        );
    }
}
