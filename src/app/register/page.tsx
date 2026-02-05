"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './register.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!formData.username || !formData.password) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'เกิดข้อผิดพลาด');
            }

            // Success
            alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
            router.push('/login'); // Redirect to login page

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>สมัครสมาชิก</h1>
                <p className={styles.subtitle}>สร้างบัญชีของคุณเพื่อเริ่มทำแบบประเมิน</p>

                {error && (
                    <div className={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>ชื่อผู้ใช้ (Username)</label>
                        <input
                            type="text"
                            name="username"
                            className={styles.input}
                            placeholder="ระบุชื่อผู้ใช้"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>รหัสผ่าน (Password)</label>
                        <input
                            type="password"
                            name="password"
                            className={styles.input}
                            placeholder="ระบุรหัสผ่าน"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>ยืนยันรหัสผ่าน (Confirm Password)</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className={styles.input}
                            placeholder="ระบุรหัสผ่านอีกครั้ง"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'กำลังลงทะเบียน...' : 'สมัครสมาชิก'}
                    </button>
                </form>

                <div className={styles.loginLink}>
                    มีบัญชีอยู่แล้ว? <Link href="/login" className={styles.link}>เข้าสู่ระบบ</Link>
                </div>
            </div>
        </div>
    );
}
