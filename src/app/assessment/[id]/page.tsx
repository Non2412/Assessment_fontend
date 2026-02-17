"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './assessment.module.css';
import introStyles from './intro.module.css';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
    ssr: false,
    loading: () => <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>กำลังเตรียมตัวอ่านเอกสาร...</div>
});

export default function DoAssessmentPage() {
    const router = useRouter();
    const params = useParams();
    const [assessment, setAssessment] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [userId, setUserId] = useState('guest');
    const [loading, setLoading] = useState(true);
    const [isRedo, setIsRedo] = useState(false); // Track if this is a second time (redo)

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

    useEffect(() => {
        if (!params?.id) return;

        const userStr = localStorage.getItem('user');
        let uid = 'guest';
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                uid = user.id || user.username;
            } catch (e) { }
        }
        setUserId(uid);

        const fetchAssessment = async () => {
            try {
                const id = Array.isArray(params.id) ? params.id[0] : params.id;
                const res = await fetch(`/api/assessments/${id}`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();

                    // Handle PDF Data URL
                    let fileUrl = data.fileData || null;

                    setAssessment({
                        ...data,
                        fileUrl: fileUrl,
                        abstract: data.abstract || 'ไม่มีบทคัดย่อ',
                        scope: data.scope || 'ไม่มีขอบเขตระบุ',
                        author: data.author || 'ผู้จัดทำ'
                    });

                    const idFromParams = Array.isArray(params.id) ? params.id[0] : params.id;
                    const dbId = data._id || data.id;

                    const storageKey = `completed_assessments_${uid}`;
                    const completedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    const lastCompletedAt = localStorage.getItem(`completed_at_${uid}_${dbId}`) || localStorage.getItem(`completed_at_${uid}_${idFromParams}`);

                    // Consider it a redo if ID is in list OR we have a completion timestamp
                    const isInCompletedList = completedList.some((item: any) =>
                        item?.toString() === idFromParams?.toString() ||
                        item?.toString() === dbId?.toString()
                    );

                    if (isInCompletedList || lastCompletedAt) {
                        setIsRedo(true);
                        console.log("✅ Previous evaluation found. Redo mode ACTIVE.");

                        const updatedTime = new Date(data.updatedAt).getTime();
                        const completedTime = lastCompletedAt ? new Date(lastCompletedAt).getTime() : 0;

                        // Allow redo if recently updated OR explicitly requested (if we had a redo button)
                        // For now, if they can see the form and it was completed before, it's a redo
                        if (data.isUpdated && updatedTime > (completedTime + 2000)) {
                            setIsCompleted(false);
                        } else {
                            setIsCompleted(true);
                        }
                    } else {
                        setIsRedo(false);
                        console.log("ℹ️ No previous evaluation found. First time mode.");
                    }
                }
            } catch (error) {
                console.error("Error loading assessment", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessment();
    }, [params?.id]);

    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleConfirmSubmit = async () => {
        setIsConfirmOpen(false);
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        try {
            const res = await fetch('/api/evaluations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId: id,
                    userId,
                    answers
                })
            });

            if (res.ok) {
                const storageKey = `completed_assessments_${userId}`;
                const completedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
                if (!completedList.includes(id)) {
                    completedList.push(id);
                    localStorage.setItem(storageKey, JSON.stringify(completedList));
                }
                localStorage.setItem(`completed_at_${userId}_${id}`, new Date().toISOString());
                setIsCompleted(true);
                router.push('/assessment');
            } else {
                const err = await res.json();
                alert(err.message || 'Error submitting');
            }
        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    if (loading) {
        return <div className={styles.container} style={{ textAlign: 'center', padding: '100px' }}>กำลังโหลดแบบประเมิน...</div>;
    }

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
        return <div className={styles.container} style={{ textAlign: 'center', padding: '100px' }}>ไม่พบข้อมูลแบบประเมิน</div>;
    }

    if (!isStarted) {
        return (
            <div className={introStyles.introLayout} style={{ padding: '40px 0' }}>
                <aside className={introStyles.introSidebar}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ fontSize: '70px', marginBottom: '16px' }}>{assessment.icon}</div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>{assessment.title}</h2>
                        <div style={{
                            fontSize: '14px',
                            color: '#0284c7',
                            background: '#f0f9ff',
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontWeight: '600',
                            border: '1px solid #e0f2fe'
                        }}>
                            กำลังเปิดใช้งาน (Published)
                        </div>
                    </div>

                    <div className={introStyles.sidebarSection}>
                        <div className={introStyles.sidebarLabel}>ผู้จัดทำ</div>
                        <div className={introStyles.sidebarValue} style={{ whiteSpace: 'pre-line' }}>{assessment.author}</div>
                    </div>

                    <div className={introStyles.sidebarSection}>
                        <div className={introStyles.sidebarLabel}>บทคัดย่อ (ABSTRACT)</div>
                        <div className={introStyles.sidebarValue}>{assessment.abstract}</div>
                    </div>

                    <div className={introStyles.sidebarSection}>
                        <div className={introStyles.sidebarLabel}>ขอบเขต (SCOPE)</div>
                        <div className={introStyles.sidebarValue} style={{ whiteSpace: 'pre-line' }}>{assessment.scope}</div>
                    </div>
                </aside>

                <main className={introStyles.introMain}>
                    <div className={introStyles.documentViewer} style={{ padding: '16px', overflow: 'hidden', display: 'flex' }}>
                        {assessment.fileUrl ? (
                            /* Real PDF Viewer */
                            <PDFViewer fileData={assessment.fileUrl} title={assessment.title} />
                        ) : (
                            <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>ไม่มีตัวอย่างเอกสาร</div>
                        )}
                    </div>
                    <div className={introStyles.actionBar}>
                        <div className={introStyles.actionText}>อ่านเอกสารครบถ้วนแล้ว?</div>
                        <div className={introStyles.actionButtons}>
                            <button
                                className={introStyles.downloadBtn}
                                onClick={() => {
                                    if (assessment.fileUrl) {
                                        const link = document.createElement('a');
                                        link.href = assessment.fileUrl;
                                        link.download = `${assessment.title}.pdf`;
                                        link.click();
                                    }
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>📥</span> ดาวน์โหลดเอกสาร
                            </button>
                            <button className={introStyles.startBtn} onClick={() => setIsStarted(true)}>
                                เริ่มทำแบบประเมิน <span>→</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerCard}>
                <div className={styles.iconWrapper}>{assessment.icon || '📝'}</div>
                <h1 className={styles.title}>{assessment.title}</h1>
                <p className={styles.subtitle}>{assessment.subtitle || 'แบบประเมินออนไลน์'}</p>
                {isRedo ? (
                    <div style={{
                        marginTop: '12px',
                        fontSize: '13px',
                        color: '#059669',
                        background: '#ecfdf5',
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: '600',
                        border: '1px solid #d1fae5'
                    }}>
                        🔄 โหมดประเมินรอบที่ 2 (สามารถเลือกคะแนนซ้ำกันได้)
                    </div>
                ) : (
                    <button
                        onClick={() => setIsRedo(true)}
                        style={{
                            marginTop: '12px',
                            fontSize: '11px',
                            color: '#64748b',
                            background: 'transparent',
                            border: '1px dashed #cbd5e1',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        คลิกหากต้องการเลือกคะแนนซ้ำ (ทำซ้ำรอบที่ 2)
                    </button>
                )}
            </div>

            {categories.map((category, index) => (
                <div key={index} className={styles.categoryCard}>
                    <h2 className={styles.categoryTitle}>{category.title}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {category.questions.map((q) => (
                            <div key={q.id} className={styles.questionItem}>
                                <p className={styles.questionText}>{q.text}</p>
                                <div className={styles.ratingGroup}>
                                    {[1, 2, 3, 4, 5].map((score) => {
                                        // Check if this score is already taken in SAME category
                                        // ONLY enforce "no duplicates" if it is the FIRST time (not a redo)
                                        const isScoreTakenInCategory = !isRedo && category.questions.some(
                                            otherQ => otherQ.id !== q.id && answers[otherQ.id] === score
                                        );

                                        return (
                                            <button
                                                key={score}
                                                onClick={() => handleAnswerChange(q.id, score)}
                                                disabled={isScoreTakenInCategory}
                                                className={`${styles.ratingBtn} ${answers[q.id] === score ? styles.ratingBtnActive : ''}`}
                                                style={isScoreTakenInCategory ? { opacity: 0.3, cursor: 'not-allowed', backgroundColor: '#f1f5f9' } : {}}
                                            >
                                                {score}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className={styles.submitSection}>
                <button onClick={() => setIsConfirmOpen(true)} className={styles.submitBtn}>
                    ส่งแบบประเมิน
                </button>
            </div>

            {isConfirmOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsConfirmOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>ยืนยันการส่งแบบประเมิน?</h3>
                        <p>เมื่อส่งแล้วจะไม่สามารถแก้ไขได้</p>
                        <div className={styles.modalButtons}>
                            <button className={styles.modalBtnCancel} onClick={() => setIsConfirmOpen(false)}>ยกเลิก</button>
                            <button className={styles.modalBtnConfirm} onClick={handleConfirmSubmit}>ยืนยัน</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
