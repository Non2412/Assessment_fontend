"use client";
import React, { useState } from 'react';
import formStyles from './create/style.module.css';
import modalStyles from './modal.module.css';

interface FormData {
    id?: number;
    title: string;
    author?: string;
    scope: string;
    abstract: string;
    file: File | null;
}

interface CreateAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: FormData | null;
    onSaveDraft: (data: FormData) => void;
    onCreate: (data: FormData) => void;
}

export default function CreateAssessmentModal({ isOpen, onClose, initialData, onSaveDraft, onCreate }: CreateAssessmentModalProps) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [scope, setScope] = useState('');
    const [abstract, setAbstract] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // Effect to load initial data when modal opens
    React.useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title);
            setAuthor(initialData.author || '');
            setScope(initialData.scope);
            setAbstract(initialData.abstract);
            setFile(initialData.file);
        } else if (isOpen && !initialData) {
            // Reset if opening as new
            setTitle('');
            setAuthor('');
            setScope('');
            setAbstract('');
            setFile(null);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleClose = () => {
        // Save as draft before closing
        onSaveDraft({
            id: initialData?.id, // Preserve ID if editing
            title,
            author,
            scope,
            abstract,
            file
        });
        onClose();
    };

    const handleCreate = () => {
        onCreate({
            id: initialData?.id,
            title,
            author,
            scope,
            abstract,
            file
        });
        onClose();
    };

    return (
        <div className={modalStyles.modalOverlay} onClick={handleClose}>
            <div className={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={formStyles.container} style={{ margin: 0, minHeight: '550px', paddingTop: '80px' }}>

                    {/* Back Button (Top Left) */}
                    <button
                        onClick={handleClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#1a2e05',
                            zIndex: 10,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <span>←</span> Back
                    </button>

                    {/* Left Column: Form Inputs */}
                    <div className={formStyles.leftColumn}>
                        <div className={formStyles.fieldGroup}>
                            <label className={formStyles.label}>หัวข้อโครงงาน</label>
                            <input
                                type="text"
                                className={formStyles.inputField}
                                placeholder="รายละเอียด"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className={formStyles.fieldGroup}>
                            <label className={formStyles.label}>ผู้จัดทำ (คนละบรรทัด)</label>
                            <textarea
                                className={`${formStyles.textArea}`}
                                style={{ minHeight: '80px', height: 'auto' }}
                                placeholder="นาย ก (64xxxx)&#10;นางสาว ข (64xxxx)"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className={formStyles.fieldGroup}>
                            <label className={formStyles.label}>ขอบเขตโครงงาน</label>
                            <textarea
                                className={formStyles.textArea}
                                placeholder="รายละเอียด"
                                value={scope}
                                onChange={(e) => setScope(e.target.value)}
                                rows={5}
                            />
                        </div>

                        <div className={formStyles.fieldGroup}>
                            <label className={formStyles.label}>บทคัดย่อ</label>
                            <textarea
                                className={formStyles.textArea}
                                placeholder="รายละเอียด"
                                value={abstract}
                                onChange={(e) => setAbstract(e.target.value)}
                                rows={5}
                            />
                        </div>
                    </div>

                    {/* Right Column: PDF Upload */}
                    <div className={formStyles.rightColumn}>
                        <div className={formStyles.uploadCard}>
                            {!file ? (
                                <>
                                    <div className={formStyles.uploadCircle}>
                                        <span style={{ fontSize: '32px', marginBottom: '8px' }}>📄</span>
                                        <span className={formStyles.uploadText}>อัปไฟล์ PDF</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className={formStyles.fileInput}
                                        onChange={handleFileChange}
                                    />
                                </>
                            ) : (
                                <div className={formStyles.previewArea}>
                                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                                    <p style={{ fontWeight: 'bold', color: '#334155' }}>อัปโหลดสำเร็จ</p>
                                    <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', wordBreak: 'break-all' }}>
                                        {file.name}
                                    </p>
                                    <button
                                        onClick={() => setFile(null)}
                                        style={{
                                            marginTop: '20px',
                                            padding: '8px 16px',
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            zIndex: 20, /* Ensure clickable */
                                            position: 'relative'
                                        }}
                                    >
                                        ลบไฟล์
                                    </button>
                                </div>
                            )}

                            {/* Create Button inside Upload Card (Removed) */}
                        </div>

                        {/* Create Button (Stacked below Upload Card) */}
                        <button className={formStyles.createButton} onClick={handleCreate}>
                            ยืนยันการสร้าง
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
