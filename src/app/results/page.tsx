"use client";
import React, { useState } from 'react';
import styles from './assessment.module.css';
import CreateAssessmentModal from './CreateAssessmentModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function CreateAssessmentPage() {
  const [filter, setFilter] = useState('owned-me');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // State for forms list to support adding new drafts
  const [recentForms, setRecentForms] = useState([
    { id: 1, title: 'แบบประเมินความพึงพอใจ', subtitle: 'Web Development', icon: '📝', isDraft: false }
  ]);

  // Track which form is being edited (if any)
  const [editingForm, setEditingForm] = useState<any>(null);

  const handleOpenNew = () => {
    setEditingForm(null); // Reset editing state
    setIsModalOpen(true);
  };

  const handleOpenDraft = (form: any) => {
    // Only open if it's a draft
    if (form.isDraft) {
      setEditingForm({
        id: form.id,
        title: form.title,
        scope: '', // Mock data doesn't have scope yet
        abstract: '',
        file: null
      });
      setIsModalOpen(true);
    }
  };

  const handleSaveDraft = (data: any) => {
    // Check if empty - don't save empty drafts
    if (!data.title && !data.scope && !data.abstract && !data.file) return;

    if (data.id) {
      // Update existing draft
      setRecentForms(prev => prev.map(f =>
        f.id === data.id ? { ...f, title: data.title || 'แบบร่าง (ไม่มีชื่อ)', subtitle: 'ฉบับร่างล่าสุด', isDraft: true } : f
      ));
    } else {
      // Create new draft
      const newId = Math.max(...recentForms.map(f => f.id), 0) + 1;
      setRecentForms(prev => [{
        id: newId,
        title: data.title || 'แบบร่าง (ไม่มีชื่อ)',
        subtitle: 'ฉบับร่างล่าสุด',
        icon: '📄',
        isDraft: true
      }, ...prev]);
    }
  };

  const handleCreate = (data: any) => {
    const newId = data.id || Math.max(...recentForms.map(f => f.id), 0) + 1;

    if (data.id) {
      setRecentForms(prev => prev.map(f =>
        f.id === data.id ? { ...f, title: data.title, subtitle: 'สร้างเสร็จสมบูรณ์', isDraft: false } : f
      ));
    } else {
      setRecentForms(prev => [{
        id: newId,
        title: data.title,
        subtitle: 'สร้างเสร็จสมบูรณ์',
        icon: '✅',
        isDraft: false
      }, ...prev]);
    }
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setRecentForms(prev => prev.filter(f => f.id !== deletingId));
      setDeletingId(null);
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
            {/* Click to open modal instead of Link */}
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

          <div className={styles.recentActions}>
            <select
              className={styles.ownerFilter}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="owned-me">ของทุกคน</option>
              <option value="owned-anyone">ฉันเป็นเจ้าของ</option>
              <option value="not-owned-me">ไม่ได้เป็นเจ้าของ</option>
            </select>

            <div className={styles.displayOptions}>
              <button className={styles.iconBtn}>▦</button>
              <button className={styles.iconBtn}>AZ</button>
              <button className={styles.iconBtn}>📁</button>
            </div>
          </div>
        </div>

        <div className={styles.formsGrid}>
          {recentForms.map((form) => (
            <div
              key={form.id}
              className={styles.resultCard}
              onClick={() => handleOpenDraft(form)}
              style={{
                cursor: form.isDraft ? 'pointer' : 'default',
                border: form.isDraft ? '2px dashed #cbd5e1' : '1px solid #e2e8f0',
                position: 'relative'
              }}
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(form.id, e)}
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
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                  e.currentTarget.style.transform = 'scale(1)';
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
                {/* Icon SVG (Clipboard/Form) */}
                {form.isDraft ? (
                  <span style={{ fontSize: '20px' }}>✏️</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
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
                {!form.isDraft && <button className={styles.resultCardBtn}>ดูผลลัพธ์</button>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Integration */}
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
    </div>
  );
}
