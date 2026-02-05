import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, password, role } = await request.json();

    // 1. Validation
    if (!username || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' },
        { status: 400 }
      );
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' },
        { status: 400 }
      );
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || 'student', // Default to student
    });

    return NextResponse.json(
      { message: 'สมัครสมาชิกสำเร็จ', userId: user._id },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก', error: error.message },
      { status: 500 }
    );
  }
}
