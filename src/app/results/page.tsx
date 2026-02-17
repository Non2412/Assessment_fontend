"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './assessment.module.css';
import CreateAssessmentModal from './CreateAssessmentModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import PublishConfirmationModal from './PublishConfirmationModal';

interface AssessmentForm {
    _id?: string;
    id?: string;
    title: string;
    subtitle?: string;
    icon?: string;
    author?: string;
    scope: string;
    abstract: string;
    fileData?: string;
    isDraft?: boolean;
    isPublished?: boolean;
    isUpdated?: boolean;
    status?: string;
    evaluationCount?: number;
}

export default function CreateAssessmentPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditPdfMode, setIsEditPdfMode] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [publishingId, setPublishingId] = useState<string | null>(null);
    const [recentForms, setRecentForms] = useState<AssessmentForm[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>('guest');
    const [editingForm, setEditingForm] = useState<AssessmentForm | null>(null);

    const fetchForms = async (userId: string) => {
        try {
            const res = await fetch(`/api/assessments?userId=${userId}&t=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setRecentForms(data);
            }
        } catch (error) {
            console.error("Failed to fetch forms", error);
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        let userId = 'guest';
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                userId = user.id || user.username;
            } catch (e) { }
        }
        setCurrentUserId(userId);
        fetchForms(userId);
    }, []);

    const handleOpenNew = () => {
        setEditingForm(null);
        setIsEditPdfMode(false);
        setIsModalOpen(true);
    };

    const handleOpenDraft = (form: AssessmentForm) => {
        if (form.isDraft) {
            setEditingForm({ ...form, id: form._id });
            setIsEditPdfMode(false);
            setIsModalOpen(true);
        }
    };

    const handleEditPdf = (form: AssessmentForm, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingForm({ ...form, id: form._id });
        setIsEditPdfMode(true);
        setIsModalOpen(true);
    };

    const handleSaveOrCreate = async (data: AssessmentForm, isDraft: boolean) => {
        const id = data.id || data._id;
        if (id) {
            try {
                await fetch(`/api/assessments/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        isDraft: isDraft,
                        isUpdated: false, // Reset update flag during edit - wait for Register
                        subtitle: isEditPdfMode ? 'รอการลงทะเบียนเพื่ออัปเดต' : (isDraft ? 'ฉบับร่างล่าสุด' : 'สร้างเสร็จสมบูรณ์'),
                        icon: isEditPdfMode ? '📝' : (isDraft ? '📄' : '✅')
                    })
                });
                fetchForms(currentUserId);
                window.dispatchEvent(new Event('forms-updated'));
                setIsModalOpen(false);
            } catch (error) {
                console.error("Update failed", error);
            }
        } else {
            try {
                await fetch('/api/assessments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        userId: currentUserId,
                        isDraft: isDraft,
                        subtitle: isDraft ? 'ฉบับร่างล่าสุด' : 'สร้างเสร็จสมบูรณ์',
                        icon: isDraft ? '📄' : '✅'
                    })
                });
                fetchForms(currentUserId);
                window.dispatchEvent(new Event('forms-updated'));
                setIsModalOpen(false);
            } catch (error) {
                console.error("Create failed", error);
            }
        }
    };

    const confirmDelete = async () => {
        if (deletingId) {
            try {
                await fetch(`/api/assessments/${deletingId}`, { method: 'DELETE' });
                fetchForms(currentUserId);
                window.dispatchEvent(new Event('forms-updated'));
            } catch (error) {
                console.error("Delete failed", error);
            }
            setDeletingId(null);
        }
    };

    const confirmPublish = async () => {
        if (publishingId) {
            const targetForm = recentForms.find(f => (f._id || f.id) === publishingId);
            const alreadyOpen = targetForm?.status === 'Open' || targetForm?.isPublished === true;

            const payload = {
                isPublished: true,
                isDraft: false,
                isUpdated: alreadyOpen, // Mark as Updated only if it was already public
                status: 'Open',
                subtitle: 'กำลังเปิดใช้งาน (Published)',
                icon: '🚀'
            };

            try {
                const res = await fetch(`/api/assessments/${publishingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    // Clear current admin's completion records to allow testing
                    localStorage.removeItem(`completed_at_${currentUserId}_${publishingId}`);
                    const storageKey = `completed_assessments_${currentUserId}`;
                    const currentList = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    localStorage.setItem(storageKey, JSON.stringify(currentList.filter((id: any) => id !== publishingId)));

                    fetchForms(currentUserId);
                    window.dispatchEvent(new Event('forms-updated'));
                }
            } catch (error) {
                console.error("Publish failed", error);
            }
            setPublishingId(null);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <section className={styles.templateGallery}>
                <div className={styles.galleryHeader}>
                    <h2 className={styles.sectionHeading}>เริ่มแบบฟอร์มใหม่</h2>
                </div>
                <div className={styles.newFormContainer}>
                    <div style={{ width: '180px' }}>
                        <div className={styles.createCard} onClick={handleOpenNew}>
                            <span className={styles.plusIcon}>+</span>
                        </div>
                        <div className={styles.cardLabel}>แบบฟอร์มเปล่า</div>
                    </div>
                </div>
            </section>

            <section className={styles.recentForms}>
                <div className={styles.recentHeader}>
                    <h2 className={styles.sectionHeading}>แบบฟอร์มล่าสุด</h2>
                </div>
                <div className={styles.formsGrid}>
                    {recentForms.map((form) => (
                        <div key={form._id} className={styles.resultCard} onClick={() => handleOpenDraft(form)}
                            style={{ cursor: form.isDraft ? 'pointer' : 'default', border: form.isDraft ? '2px dashed #cbd5e1' : '1px solid #e2e8f0', position: 'relative' }}>

                            <button onClick={(e) => { e.stopPropagation(); setDeletingId(form._id!); }} className={styles.topActionBtn} style={{ right: '12px', color: '#ef4444' }}>🗑️</button>
                            <button onClick={(e) => handleEditPdf(form, e)} className={styles.topActionBtn} style={{ right: '52px', background: '#facc15' }}>✏️</button>

                            {form.isUpdated && <div className={styles.updatedBadge}>อัปเดตแล้ว</div>}

                            <div className={styles.resultCardImg} style={{ background: form.isDraft ? '#f1f5f9' : '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            </div>
                            <div className={styles.resultCardAvatar}>
                                {form.isDraft ? '✏️' : (form.icon === '🚀' ? '🚀' : '📄')}
                                {!form.isDraft && (() => {
                                    const lastSeen = parseInt(localStorage.getItem(`last_seen_count_${currentUserId}_${form._id}`) || '0');
                                    const newCount = Math.max(0, (form.evaluationCount || 0) - lastSeen);
                                    return newCount > 0 ? (
                                        <div className={styles.notificationBadge}>
                                            {newCount}
                                        </div>
                                    ) : null;
                                })()}
                            </div>

                            <div className={styles.cardContent}>
                                <div className={styles.resultCardTitle}>
                                    {form.title}
                                    {form.isDraft && <span className={styles.draftBadge}>ฉบับร่าง</span>}
                                </div>
                                <div className={styles.resultCardSubtitle}>{form.subtitle}</div>
                                {!form.isDraft && (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                        <button
                                            className={styles.resultCardBtn}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Reset count for this assessment
                                                localStorage.setItem(`last_seen_count_${currentUserId}_${form._id}`, (form.evaluationCount || 0).toString());
                                                window.dispatchEvent(new Event('forms-updated'));
                                                router.push(`/results/summary/${form._id}`);
                                            }}
                                        >
                                            ดูผลลัพธ์
                                        </button>
                                        <button className={styles.resultCardBtnFilled} onClick={(e) => { e.stopPropagation(); setPublishingId(form._id!); }}>ลงทะเบียน</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <CreateAssessmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={editingForm} onSaveDraft={(d) => handleSaveOrCreate(d, true)} onCreate={(d) => handleSaveOrCreate(d, false)} isEditPdfOnly={isEditPdfMode} />
            <DeleteConfirmationModal isOpen={!!deletingId} onClose={() => setDeletingId(null)} onConfirm={confirmDelete} />
            <PublishConfirmationModal isOpen={!!publishingId} onClose={() => setPublishingId(null)} onConfirm={confirmPublish} />
        </div>
    );
}
