"use client";
import React, { useState } from 'react';
import formStyles from './create/style.module.css';
import modalStyles from './modal.module.css';

interface FormData {
    id?: number | string;
    title: string;
    author?: string;
    scope: string;
    abstract: string;
    file: File | null;
    fileUrl?: string;
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

    // Notification State
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

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

    const handleCreate = async () => {
        // VALIDATION: Check if file is uploaded
        if (!file) {
            setNotificationMessage("กรุณาอัปโหลดไฟล์ PDF โครงงาน\nก่อนสร้างแบบประเมิน");
            setShowNotification(true);
            return;
        }

        // Convert file to Base64 for Database Storage
        const toBase64 = (file: File) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        let base64String: string | undefined;
        try {
            const result = await toBase64(file);
            console.log("File converted length:", result?.toString().length);
            if (typeof result === 'string') {
                base64String = result;
            }
        } catch (error) {
            console.error("Error converting file to base64", error);
            setNotificationMessage("เกิดข้อผิดพลาดในการแปลงไฟล์");
            setShowNotification(true);
            return;
        }

        // Create a URL for local preview (immediate feedback)
        const fileUrl = URL.createObjectURL(file);

        onCreate({
            id: initialData?.id,
            title,
            author,
            scope,
            abstract,
            file,
            fileUrl,
            // Pass the base64 data to the parent handler
            // @ts-ignore - Adding dynamic property for backend
            fileData: base64String,
            fileName: file.name,
            mimeType: file.type
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

            {/* Custom Notification Modal */}
            {showNotification && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(5px)',
                    animation: 'fadeIn 0.2s ease-out'
                }} onClick={() => setShowNotification(false)}>
                    <div style={{
                        background: 'white',
                        padding: '30px 40px',
                        borderRadius: '24px',
                        textAlign: 'center',
                        maxWidth: '400px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                        transform: 'scale(0.95)',
                        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>แจ้งเตือน</h3>
                        <p style={{ color: '#64748b', whiteSpace: 'pre-line', marginBottom: '30px', lineHeight: '1.6' }}>
                            {notificationMessage}
                        </p>
                        <button
                            onClick={() => setShowNotification(false)}
                            style={{
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
