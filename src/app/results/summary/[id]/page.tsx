"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './summary.module.css';

export default function AssessmentSummaryPage() {
    const router = useRouter();
    const params = useParams();
    const [assessment, setAssessment] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const categories = [
        {
            title: "หมวดที่ 1 ความชัดเจนและวัตถุประสงค์",
            questions: [
                { id: "1_1", text: "โครงงานมีวัตถุประสงค์ชัดเจนและสอดคล้องกับหัวข้อหรือไม่" },
                { id: "1_2", text: "ปัญหาหรือความต้องการมีความเหมาะสมและชัดเจนหรือไม่" },
                { id: "1_3", text: "ขอบเขตมีความชัดเจนและสามารถดำเนินการได้จริงหรือไม่" },
                { id: "1_4", text: "แนวคิดของโครงงานมีความน่าสนใจและทันสมัยเพียงใด" }
            ]
        },
        {
            title: "หมวดที่ 2 การออกแบบและกระบวนการพัฒนา",
            questions: [
                { id: "2_1", text: "การออกแบบระบบมีความเหมาะสมกับวัตถุประสงค์หรือไม่" },
                { id: "2_2", text: "ขั้นตอนการพัฒนาโครงงานมีความเป็นระบบและมีเหตุผลหรือไม่" },
                { id: "2_3", text: "เครื่องมือหรือเทคนิคที่ใช้มีความเหมาะสมหรือไม่" },
                { id: "2_4", text: "มีการวางแผนการทำงานและบริหารเวลาได้ดีเพียงใด" }
            ]
        },
        // ... adding others or dynamic mapping if needed
    ];

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

    if (loading) return <div className={styles.loading}>กำลังโหลดผลลัพธ์...</div>;
    if (!assessment) return <div className={styles.error}>ไม่พบข้อมูลแบบประเมิน</div>;

    const getAverage = (qId: string) => {
        return stats?.averages?.[qId] || 0;
    };

    const getCategoryAverage = (questions: any[]) => {
        const total = questions.reduce((sum, q) => sum + getAverage(q.id), 0);
        return parseFloat((total / questions.length).toFixed(2));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>← กลับ</button>
                <div className={styles.headerContent}>
                    <div className={styles.titleGroup}>
                        <span className={styles.icon}>{assessment.icon || '📝'}</span>
                        <div>
                            <h1>{assessment.title}</h1>
                            <p>{assessment.subtitle}</p>
                        </div>
                    </div>
                    <div className={styles.statsBadge}>
                        <span className={styles.count}>{stats?.count || 0}</span>
                        <span className={styles.label}>ผู้ประเมินทั้งหมด</span>
                    </div>
                </div>
            </header>

            <div className={styles.summaryGrid}>
                {/* Overall Score Card */}
                <div className={styles.scoreCard}>
                    <h2>คะแนนเฉลี่ยรวม</h2>
                    <div className={styles.totalScore}>
                        {Object.keys(stats?.averages || {}).length > 0
                            ? (Object.values(stats.averages as Record<string, number>).reduce((a, b) => a + b, 0) / Object.keys(stats.averages).length).toFixed(2)
                            : "0.00"}
                    </div>
                    <p>เต็ม 5.00 คะแนน</p>
                </div>

                {/* Categories Summary */}
                <div className={styles.categoriesList}>
                    {categories.map((cat, idx) => (
                        <div key={idx} className={styles.categoryResult}>
                            <div className={styles.categoryHeader}>
                                <h3>{cat.title}</h3>
                                <span className={styles.catScore}>{getCategoryAverage(cat.questions)} / 5</span>
                            </div>
                            <div className={styles.questionsGrid}>
                                {cat.questions.map(q => (
                                    <div key={q.id} className={styles.questionResult}>
                                        <p>{q.text}</p>
                                        <div className={styles.progressContainer}>
                                            <div
                                                className={styles.progressBar}
                                                style={{ width: `${(getAverage(q.id) / 5) * 100}%` }}
                                            ></div>
                                            <span className={styles.qScore}>{getAverage(q.id)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className={styles.footer}>
                <p>* ข้อมูลนี้เป็นผลสรุปจากการประเมินแบบไม่ระบุตัวตน (Anonymized)</p>
            </footer>
        </div>
    );
}
