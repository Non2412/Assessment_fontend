"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './assessment.module.css';

export default function DoAssessmentPage() {
    const router = useRouter();
    const params = useParams();
    const [assessment, setAssessment] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});

    const categories = [
        {
            title: "หมวดที่ 1 ความชัดเจนและวัตถุประสงค์ของโครงงาน",
            questions: [
                { id: "1_1", text: "โครงงานมีวัตถุประสงค์ชัดเจนและสอดคล้องกับหัวข้อหรือไม่" },
                { id: "1_2", text: "ปัญหาหรือความต้องการที่โครงงานต้องการแก้ไขมีความเหมาะสมและชัดเจนหรือไม่" },
                { id: "1_3", text: "ขอบเขตของโครงงานมีความชัดเจนและสามารถดำเนินการได้จริงหรือไม่" },
                { id: "1_4", text: "แนวคิดของโครงงานมีความน่าสนใจและทันสมัยเพียงใด" }
            ]
        },
        {
            title: "หมวดที่ 2 การออกแบบและกระบวนการพัฒนา",
            questions: [
                { id: "2_1", text: "การออกแบบระบบ/โครงงานมีความเหมาะสมกับวัตถุประสงค์หรือไม่" },
                { id: "2_2", text: "ขั้นตอนการพัฒนาโครงงานมีความเป็นระบบและมีเหตุผลหรือไม่" },
                { id: "2_3", text: "เครื่องมือ เทคโนโลยี หรือวิธีการที่เลือกใช้มีความเหมาะสมหรือไม่" },
                { id: "2_4", text: "มีการวางแผนการทำงานและบริหารเวลาได้ดีเพียงใด" }
            ]
        },
        {
            title: "หมวดที่ 3 การดำเนินงานและผลลัพธ์",
            questions: [
                { id: "3_1", text: "โครงงานสามารถทำงานได้ตามที่ออกแบบไว้หรือไม่" },
                { id: "3_2", text: "ผลลัพธ์ที่ได้ตรงตามวัตถุประสงค์ของโครงงานหรือไม่" },
                { id: "3_3", text: "โครงงานมีความเสถียรและสามารถใช้งานได้จริงหรือไม่" },
                { id: "3_4", text: "มีการทดสอบระบบ/โครงงานอย่างเหมาะสมหรือไม่" }
            ]
        },
        {
            title: "หมวดที่ 4 ประโยชน์และการนำไปใช้",
            questions: [
                { id: "4_1", text: "โครงงานมีประโยชน์ต่อผู้ใช้หรือกลุ่มเป้าหมายเพียงใด" },
                { id: "4_2", text: "โครงงานสามารถนำไปประยุกต์ใช้จริงได้หรือไม่" },
                { id: "4_3", text: "โครงงานมีศักยภาพในการพัฒนาต่อยอดในอนาคตหรือไม่" }
            ]
        },
        {
            title: "หมวดที่ 5 การนำเสนอและเอกสาร",
            questions: [
                { id: "5_1", text: "การนำเสนอผลงานมีความชัดเจน เข้าใจง่าย และเป็นระบบหรือไม่" },
                { id: "5_2", text: "เอกสารรายงานมีความถูกต้อง ครบถ้วน และเป็นระเบียบหรือไม่" },
                { id: "5_3", text: "สามารถอธิบายแนวคิด กระบวนการ และผลลัพธ์ของโครงงานได้ชัดเจนหรือไม่" }
            ]
        },
        {
            title: "หมวดที่ 6 ภาพรวมและความประทับใจ",
            questions: [
                { id: "6_1", text: "โครงงานแสดงให้เห็นถึงความรู้ ความสามารถ และความตั้งใจของผู้จัดทำหรือไม่" },
                { id: "6_2", text: "ภาพรวมของโครงงานมีคุณภาพและเหมาะสมกับการเป็นโครงงานจบหรือไม่" }
            ]
        }
    ];

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (!params?.id) return;

        // Get current user ID
        const userStr = localStorage.getItem('user');
        let userId = 'guest';
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                userId = user.id || user.username;
            } catch (e) { }
        }

        // Check completion status using user-specific key
        const storageKey = `completed_assessments_${userId}`;
        const completedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (completedList.includes(params.id)) {
            setIsCompleted(true);
        }

        // Form loading logic...
        const formsKey = `assessment_forms_${userId}`;
        let saved = localStorage.getItem(formsKey);

        let found = null;

        // 1. Try user specific forms
        if (saved) {
            try {
                const forms = JSON.parse(saved);
                if (Array.isArray(forms)) {
                    found = forms.find((f: any) => f.id.toString() === params.id);
                }
            } catch (e) { console.error(e); }
        }

        // 2. Fallback to global forms if needed
        if (!found) {
            const globalSaved = localStorage.getItem('assessment_forms');
            if (globalSaved) {
                try {
                    const forms = JSON.parse(globalSaved);
                    if (Array.isArray(forms)) {
                        found = forms.find((f: any) => f.id.toString() === params.id);
                    }
                } catch (e) { console.error(e); }
            }
        }

        // 3. Set or Mock
        if (found) {
            setAssessment(found);
        } else {
            // Mock default data for demo if nothing found
            if (params.id === '1') {
                setAssessment({
                    id: 1, title: 'แบบประเมินความพึงพอใจ', subtitle: 'Web Development', icon: '📝'
                });
            } else {
                // Explicit fallback for ANY id to prevent infinite loading
                setAssessment({
                    id: params.id,
                    title: 'แบบประเมินทั่วไป',
                    subtitle: 'แบบฟอร์มมาตรฐาน',
                    icon: '📄'
                });
            }
        }
    }, [params?.id]);

    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = () => {
        if (!assessment) return;
        setIsConfirmOpen(true);
    };

    const handleConfirmSubmit = () => {
        setIsConfirmOpen(false);

        // Save completion status
        if (params?.id) {
            // Get current user ID
            const userStr = localStorage.getItem('user');
            let userId = 'guest';
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    userId = user.id || user.username;
                } catch (e) { }
            }

            const storageKey = `completed_assessments_${userId}`;
            const completedList = JSON.parse(localStorage.getItem(storageKey) || '[]');

            if (!completedList.includes(params.id)) {
                completedList.push(params.id);
                localStorage.setItem(storageKey, JSON.stringify(completedList));
            }
        }

        // Mock submission
        router.push('/assessment');
    };

    if (isCompleted) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', paddingTop: '100px' }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
                <h1 style={{ color: '#10b981', marginBottom: '16px' }}>คุณได้ทำการประเมินไปแล้ว</h1>
                <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '32px' }}>
                    ขอบคุณที่ให้ความร่วมมือในการตอบแบบประเมิน
                </p>
                <button
                    onClick={() => router.push('/assessment')}
                    className={styles.submitBtn}
                    style={{ padding: '12px 32px', fontSize: '16px' }}
                >
                    กลับไปหน้าแบบประเมิน
                </button>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', color: '#64748b' }}>
                <div className={styles.iconWrapper}>⏳</div>
                <p>กำลังโหลดแบบประเมิน...</p>
            </div>
        );
    }

    return (
        <>
            {/* Floating Sidebar (Desktop Only) */}
            <div className={styles.floatingSide}>
                <div className={styles.floatingCard}>
                    <div className={styles.floatingIcon}>📈</div>
                    <h3 className={styles.cardTitle}>พัฒนาตนเอง</h3>
                    <p className={styles.cardDesc}>เห็นจุดแข็งและจุดที่ต้องปรับปรุงของตัวเองได้อย่างชัดเจน</p>
                </div>
                <div className={styles.floatingCard}>
                    <div className={styles.floatingIcon}>🏫</div>
                    <h3 className={styles.cardTitle}>พัฒนาหลักสูตร</h3>
                    <p className={styles.cardDesc}>ช่วยให้ทางโรงเรียนปรับปรุงการเรียนการสอนให้ดียิ่งขึ้น</p>
                </div>
                <div className={styles.floatingCard}>
                    <div className={styles.floatingIcon}>🎁</div>
                    <h3 className={styles.cardTitle}>รับสิทธิพิเศษ</h3>
                    <p className={styles.cardDesc}>สะสมแต้มจากการประเมินเพื่อแลกของรางวัลมากมาย</p>
                </div>
            </div>

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.headerCard}>
                    <div className={styles.iconWrapper}>{assessment.icon || '📝'}</div>
                    <h1 className={styles.title}>
                        {assessment.title}
                    </h1>
                    <p className={styles.subtitle}>{assessment.subtitle || 'แบบประเมินออนไลน์'}</p>
                </div>

                {/* Assessment Form */}
                {categories.map((category, index) => (
                    <div key={index} className={styles.categoryCard}>
                        <h2 className={styles.categoryTitle}>
                            {category.title}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {category.questions.map((q) => (
                                <div key={q.id} className={styles.questionItem}>
                                    <p className={styles.questionText}>
                                        {q.text}
                                    </p>
                                    <div className={styles.ratingGroup}>
                                        {[1, 2, 3, 4, 5].map((score) => {
                                            // Check if this score is already taken by another question in this category
                                            const isTaken = category.questions.some(otherQ =>
                                                otherQ.id !== q.id && answers[otherQ.id] === score
                                            );

                                            // If taken by another question, it should be disabled (unless it's THIS question's current answer)
                                            const disabled = isTaken;

                                            return (
                                                <button
                                                    key={score}
                                                    onClick={() => !disabled && handleAnswerChange(q.id, score)}
                                                    disabled={disabled}
                                                    className={`
                                                        ${styles.ratingBtn} 
                                                        ${answers[q.id] === score ? styles.ratingBtnActive : ''}
                                                    `}
                                                    style={{
                                                        opacity: disabled ? 0.3 : 1,
                                                        cursor: disabled ? 'not-allowed' : 'pointer',
                                                        background: disabled ? '#f1f5f9' : undefined
                                                    }}
                                                    title={disabled ? 'คะแนนนี้ถูกเลือกไปแล้วในหมวดหมู่นี้' : ''}
                                                >
                                                    {score}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className={styles.labels}>
                                        <span>ปรับปรุง</span>
                                        <span>ดีมาก</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Submit Button */}
                <div className={styles.submitSection}>
                    <button
                        onClick={handleSubmit}
                        className={styles.submitBtn}
                    >
                        ส่งแบบประเมิน
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isConfirmOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsConfirmOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <span className={styles.modalIcon}>🤔</span>
                        <h3 className={styles.modalTitle}>ยืนยันการส่งแบบประเมิน?</h3>
                        <p className={styles.modalDesc}>
                            คุณตรวจสอบข้อมูลครบถ้วนแล้วใช่หรือไม่?<br />
                            เมื่อส่งแล้วจะไม่สามารถแก้ไขได้
                        </p>
                        <div className={styles.modalButtons}>
                            <button
                                className={styles.modalBtnCancel}
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className={styles.modalBtnConfirm}
                                onClick={handleConfirmSubmit}
                            >
                                ยืนยัน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
