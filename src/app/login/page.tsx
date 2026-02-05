"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'เกิดข้อผิดพลาด');
            }

            // Success - Store mock token or handle auth state
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to home
            router.push('/');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>เข้าสู่ระบบ</h1>
                <p className={styles.subtitle}>ยินดีต้อนรับกลับสู่ระบบประเมิน</p>

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
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                <div className={styles.registerLink}>
                    ยังไม่มีบัญชี? <Link href="/register" className={styles.link}>สมัครสมาชิก</Link>
                </div>
            </div>
        </div>
    );
}
