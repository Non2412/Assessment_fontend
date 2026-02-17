"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './assessment.module.css';
import introStyles from './intro.module.css';

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
    const [isStarted, setIsStarted] = useState(false);

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

        const fetchAssessment = async () => {
            try {
                const res = await fetch(`/api/assessments/${params.id}`);
                if (res.ok) {
                    const data = await res.json();

                    // Handle PDF Data URL
                    let fileUrl = null;
                    if (data.fileData) {
                        // Check if it already has header, if not add it (assuming PDF)
                        // Actually my API saves just the string usually, I need to check how I implemented save
                        // In CreateAssessmentModal, I saved filtered result of FileReader which usually includes "data:application/pdf;base64,..."
                        // So I can use it directly.
                        fileUrl = data.fileData;
                    }

                    setAssessment({
                        ...data,
                        fileUrl: fileUrl,
                        // Ensure defaults
                        abstract: data.abstract || 'ไม่มีบทคัดย่อ',
                        scope: data.scope || 'ไม่มีขอบเขตระบุ',
                        author: data.author || 'ผู้จัดทำ'
                    });
                } else {
                    // Fallback to Mock ONLY if strictly ID=1 and not found in DB
                    if (params.id === '1') {
                        setAssessment({
                            id: 1,
                            title: 'ระบบบริหารจัดการการเรียนรู้ (LMS)',
                            subtitle: 'Web Application Development',
                            icon: '💻',
                            author: 'นายศรราม เทพพิทักษ์ (รหัสนักศึกษา 640101)\nนางสาวสมหญิง จริงใจ (รหัสนักศึกษา 640102)',
                            abstract: 'โครงงานนี้จัดทำขึ้นเพื่อศึกษาระบบการจัดการเรียนการสอน (LMS) โดยมีวัตถุประสงค์เพื่ออำนวยความสะดวกให้กับผู้สอนและผู้เรียนในการเข้าถึงเนื้อหาการเรียนรู้ การส่งงาน และการวัดผลประเมินผล ผ่านระบบเครือข่ายอินเทอร์เน็ต',
                            scope: '1. ระบบจัดการสมาชิก (Authentication)\n2. ระบบจัดการรายวิชา (Course Management)\n3. ระบบแบบทดสอบออนไลน์ (Quiz System)\n4. ระบบส่งงานและตรวจงาน (Assignment Submission)',
                            description: 'โปรดอ่านเอกสารโครงการฉบับย่อด้านขวามือก่อนเริ่มทำแบบประเมิน',
                            fullContent: `(Mock Content)...`
                        });
                    }
                }
            } catch (error) {
                console.error("Error loading assessment", error);
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

    // Intro/Description View (Document Reader)
    if (!isStarted) {
        return (
            <div className={introStyles.introLayout} style={{ padding: '40px 20px', minHeight: '100vh', background: '#f8fafc' }}>
                {/* Left: Metadata Sidebar */}
                <aside className={introStyles.introSidebar}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ fontSize: '60px', marginBottom: '10px' }}>{assessment.icon}</div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>{assessment.title}</h2>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>{assessment.subtitle}</p>
                    </div>

                    <div className={introStyles.sidebarSection}>
                        <div className={introStyles.sidebarLabel}>ผู้จัดทำ</div>
                        <div className={introStyles.sidebarValue} style={{ whiteSpace: 'pre-line' }}>{assessment.author}</div>
                    </div>

                    <div className={introStyles.sidebarSection}>
                        <div className={introStyles.sidebarLabel}>บทคัดย่อ (Abstract)</div>
                        <div className={introStyles.sidebarValue} style={{ fontSize: '14px', textAlign: 'justify' }}>
                            {assessment.abstract}
                        </div>
                    </div>

                    <div className={introStyles.sidebarSection}>
                        <div className={introStyles.sidebarLabel}>ขอบเขต (Scope)</div>
                        <div className={introStyles.sidebarValue} style={{ whiteSpace: 'pre-line', fontSize: '14px' }}>
                            {assessment.scope}
                        </div>
                    </div>
                </aside>

                {/* Right: Document Viewer */}
                <main className={introStyles.introMain}>
                    <div className={introStyles.documentViewer} style={{ padding: assessment.fileUrl ? '0' : '40px', overflow: 'hidden' }}>
                        {assessment.fileUrl ? (
                            /* Real PDF Viewer */
                            <iframe
                                src={assessment.fileUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 'none', display: 'block' }}
                                title="Project Document"
                            />
                        ) : (
                            /* Mock Text Content (Fallback) */
                            <>
                                <div className={introStyles.paperPage}>
                                    <h1 className={introStyles.paperTitle}>{assessment.title}</h1>
                                    <div className={introStyles.paperContent} style={{ whiteSpace: 'pre-wrap' }}>
                                        {assessment.fullContent || assessment.description}
                                        {`
                                            
------------------------------------------------
(จำลองเอกสาร PDF หน้า 1)
------------------------------------------------

รายวิชา: 
โครงงานคอมพิวเตอร์ (Computer Project)

อาจารย์ที่ปรึกษา:
ผศ.ดร. ใจดี มีสุข

ปีการศึกษา:
2568
                                            `}
                                    </div>
                                </div>

                                <div className={introStyles.paperPage}>
                                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>เนื้อหาเพิ่มเติม (หน้า 2)</h2>
                                    <p>
                                        2.1 ทฤษฎีที่เกี่ยวข้อง
                                        ในการพัฒนาโครงงานนี้ ผู้จัดทำได้ศึกษาทฤษฎีและเทคโนโลยีต่าง ๆ ดังนี้...
                                    </p>
                                    <p>
                                        (พื้นที่สำหรับเนื้อหาเพิ่มเติมที่สามารถเลื่อนอ่านได้...)
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className={introStyles.actionBar}>
                        <div style={{ marginRight: 'auto', fontSize: '14px', color: '#64748b' }}>
                            อ่านเอกสารครบถ้วนแล้ว?
                        </div>
                        <a
                            href={assessment.fileUrl || '#'}
                            download={assessment.fileUrl ? "project_document.pdf" : undefined}
                            className={introStyles.downloadBtn}
                            style={{ textDecoration: 'none' }}
                            onClick={(e) => !assessment.fileUrl && e.preventDefault()}
                        >
                            📥 ดาวน์โหลดเอกสาร
                        </a>
                        <button className={introStyles.startBtn} onClick={() => setIsStarted(true)}>
                            เริ่มทำแบบประเมิน <span>→</span>
                        </button>
                    </div>
                </main>
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
