"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './assessment.module.css';
import CreateAssessmentModal from './CreateAssessmentModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import PublishConfirmationModal from './PublishConfirmationModal';

interface AssessmentForm {
  _id?: string; // MongoDB ID
  id?: string;  // For compatibility or display
  title: string;
  subtitle?: string;
  icon?: string;
  author?: string;
  scope: string;
  abstract: string;
  file?: File | null;
  fileUrl?: string;
  fileData?: string; // Base64 for API
  isDraft?: boolean;
  isPublished?: boolean;
  status?: string;
  // Fallbacks
  description?: string;
  fullContent?: string | null;
}

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  // State for forms list
  const [recentForms, setRecentForms] = useState<AssessmentForm[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('guest');

  // Load User and Forms
  const fetchForms = async (userId: string) => {
    try {
      const res = await fetch(`/api/assessments?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        // Map _id to id if necessary, or just use _id
        setRecentForms(data);
      }
    } catch (error) {
      console.error("Failed to fetch forms", error);
    } finally {
      setIsLoaded(true);
    }
  };

  React.useEffect(() => {
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

  // Track which form is being edited
  const [editingForm, setEditingForm] = useState<AssessmentForm | null>(null);

  const handleOpenNew = () => {
    setEditingForm(null);
    setIsModalOpen(true);
  };

  const handleOpenDraft = (form: AssessmentForm) => {
    if (form.isDraft) {
      setEditingForm({
        ...form,
        id: form._id as string // Ensure ID is passed for updates
      });
      setIsModalOpen(true);
    }
  };

  const handleSaveOrCreate = async (data: AssessmentForm, isDraft: boolean) => {
    // If updating existing (we have an ID)
    if (data.id || data._id) {
      // UPDATE logic (PUT)
      const id = data.id || data._id;
      try {
        await fetch(`/api/assessments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            isDraft: isDraft,
            subtitle: isDraft ? 'ฉบับร่างล่าสุด' : 'สร้างเสร็จสมบูรณ์',
            icon: isDraft ? '📄' : '✅'
          })
        });
        fetchForms(currentUserId); // Refresh list
      } catch (error) {
        console.error("Update failed", error);
      }
    } else {
      // CREATE logic (POST)
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
      } catch (error) {
        console.error("Create failed", error);
      }
    }
  };

  const handleSaveDraft = (data: AssessmentForm) => {
    handleSaveOrCreate(data, true);
  };

  const handleCreate = (data: AssessmentForm) => {
    handleSaveOrCreate(data, false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await fetch(`/api/assessments/${deletingId}`, { method: 'DELETE' });
        fetchForms(currentUserId);
      } catch (error) {
        console.error("Delete failed", error);
      }
      setDeletingId(null);
    }
  };

  const confirmPublish = async () => {
    if (publishingId) {
      try {
        await fetch(`/api/assessments/${publishingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isPublished: true,
            isDraft: false,
            status: 'Open',
            subtitle: 'กำลังเปิดใช้งาน (Published)',
            icon: '🚀'
          })
        });
        fetchForms(currentUserId);
      } catch (error) {
        console.error("Publish failed", error);
      }
      setPublishingId(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Template Gallery Section (Top) */}
      <section className={styles.templateGallery}>
        <div className={styles.galleryHeader}>
          <h2 className={styles.sectionHeading}>เริ่มแบบฟอร์มใหม่</h2>
          <div className={styles.galleryActions}>
            <button className={styles.iconBtn}>⋮</button>
          </div>
        </div>

        <div className={styles.newFormContainer}>
          <div style={{ width: '180px' }}>
            <div
              className={styles.createCard}
              onClick={handleOpenNew}
            >
              <span className={styles.plusIcon}>+</span>
            </div>
            <div className={styles.cardLabel}>แบบฟอร์มเปล่า</div>
          </div>
        </div>
      </section>

      {/* Recent Forms Section (Bottom) */}
      <section className={styles.recentForms}>
        <div className={styles.recentHeader}>
          <h2 className={styles.sectionHeading}>แบบฟอร์มล่าสุด</h2>
        </div>

        <div className={styles.formsGrid}>
          {recentForms.map((form) => (
            <div
              key={form._id || form.id} // Use MongoDB _id preferably
              className={styles.resultCard}
              onClick={() => handleOpenDraft(form)}
              style={{
                cursor: form.isDraft ? 'pointer' : 'default',
                border: form.isDraft ? '2px dashed #cbd5e1' : '1px solid #e2e8f0',
                position: 'relative'
              }}
            >
              <button
                onClick={(e) => handleDelete(form._id as string, e)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  zIndex: 10,
                  color: '#ef4444',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                title="ลบแบบฟอร์ม"
              >
                🗑️
              </button>

              <div
                className={styles.resultCardImg}
                style={{ background: form.isDraft ? '#f1f5f9' : '#e0f2fe' }}
              ></div>
              <div
                className={styles.resultCardAvatar}
                style={{ background: form.isDraft ? '#94a3b8' : 'white' }}
              >
                {form.isDraft ? (
                  <span style={{ fontSize: '20px' }}>✏️</span>
                ) : (
                  form.icon === '🚀' ? (
                    <span style={{ fontSize: '28px' }}>🚀</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  )
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.resultCardTitle}>
                  {form.title}
                  {form.isDraft && <span style={{
                    fontSize: '10px',
                    background: '#f59e0b',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    marginLeft: '8px',
                    verticalAlign: 'middle'
                  }}>ฉบับร่าง</span>}
                </div>
                <div className={styles.resultCardSubtitle}>{form.subtitle}</div>

                {!form.isDraft && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', width: '100%' }}>
                    <button
                      className={styles.resultCardBtn}
                      style={{ flex: 1, width: 'auto', padding: '0' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/results/summary/${form._id || form.id}`);
                      }}
                    >
                      ดูผลลัพธ์
                    </button>
                    <button
                      className={styles.resultCardBtnFilled}
                      style={{ flex: 1, width: 'auto', padding: '0' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPublishingId(form._id as string);
                      }}
                    >
                      ลงทะเบียน
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CreateAssessmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingForm}
        onSaveDraft={handleSaveDraft}
        onCreate={handleCreate}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
      />

      <PublishConfirmationModal
        isOpen={!!publishingId}
        onClose={() => setPublishingId(null)}
        onConfirm={confirmPublish}
      />
    </div>
  );
}
