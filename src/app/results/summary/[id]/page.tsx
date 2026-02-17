"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../summary.module.css';
import { categories } from '@/lib/assessmentData';

export default function AssessmentSummaryPage() {
    const params = useParams();
    const router = useRouter();
    const [assessment, setAssessment] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params?.id) return;

        const fetchData = async () => {
            try {
                // Fetch assessment details
                const assessmentRes = await fetch(`/api/assessments/${params.id}`);
                const assessmentData = await assessmentRes.json();
                setAssessment(assessmentData);

                // Fetch evaluation stats
                const statsRes = await fetch(`/api/evaluations?assessmentId=${params.id}`);
                const statsData = await statsRes.json();
                setStats(statsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params?.id]);

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingIcon}>⏳</div>
                <p>กำลังประมวลผลสรุปผลการประเมิน...</p>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className={styles.noData}>
                <h2>ไม่พบข้อมูลแบบประเมิน</h2>
                <button onClick={() => router.push('/results')}>กลับหน้าจัดการ</button>
            </div>
        );
    }

    const totalEvaluations = stats?.count || 0;
    const averages = stats?.averages || {};

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className={styles.title}>{assessment.title}</h1>
                        <p className={styles.subtitle}>{assessment.subtitle || 'สรุปผลการประเมินโดยรวม (Anonymous)'}</p>
                    </div>
                    <button
                        onClick={() => router.push('/results')}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}
                    >
                        ย้อนกลับ
                    </button>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>จำนวนผู้ประเมินทั้งหมด</div>
                        <div className={styles.statValue}>{totalEvaluations} <span style={{ fontSize: '14px', fontWeight: 400 }}>คน</span></div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>สถานะ</div>
                        <div className={styles.statValue}>
                            {assessment.status === 'Open' ? '🟢 เปิดรับข้อมูล' : '🔴 ปิดรับข้อมูล'}
                        </div>
                    </div>
                </div>
            </header>

            {totalEvaluations === 0 ? (
                <div className={styles.noData}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                    <h3>ยังไม่มีข้อมูลการประเมินในขณะนี้</h3>
                    <p>เมื่อมีการส่งแบบประเมิน ข้อมูลสรุปผลจะปรากฏขึ้นที่นี่อัตโนมัติ</p>
                </div>
            ) : (
                <main>
                    {categories.map((category, catIdx) => {
                        // Calculate category average
                        const categoryScores = category.questions.map(q => averages[q.id] || 0).filter(s => s > 0);
                        const categoryAvg = categoryScores.length > 0
                            ? (categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length).toFixed(2)
                            : "0.00";

                        return (
                            <section key={catIdx} className={styles.categorySection}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h2 className={styles.categoryTitle}>{category.title}</h2>
                                    <div className={styles.scoreBadge} style={{ background: '#6366f1', color: 'white' }}>
                                        คะแนนเฉลี่ยหมวด: {categoryAvg}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                    {category.questions.map((q) => {
                                        const score = averages[q.id] || 0;
                                        const percentage = (score / 5) * 100;

                                        return (
                                            <div key={q.id} className={styles.questionItem}>
                                                <div className={styles.questionHeader}>
                                                    <p className={styles.questionText}>{q.text}</p>
                                                    <span className={styles.scoreBadge}>
                                                        {score > 0 ? `${score} / 5.00` : 'ไม่มีข้อมูล'}
                                                    </span>
                                                </div>
                                                <div className={styles.progressBarContainer}>
                                                    <div
                                                        className={styles.progressBar}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </main>
            )}
        </div>
    );
}
