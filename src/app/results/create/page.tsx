"use client";
import React, { useState } from 'react';
import styles from './style.module.css';
import Link from 'next/link';

export default function CreateFormPage() {
    const [title, setTitle] = useState('');
    const [scope, setScope] = useState('');
    const [abstract, setAbstract] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div style={{ paddingBottom: '60px' }}>
            <div className={styles.container}>
                <Link href="/results" className={styles.backButton}>
                    ← กลับ
                </Link>

                {/* Left Column: Form Inputs */}
                <div className={styles.leftColumn}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>หัวข้อโครงงาน</label>
                        <input
                            type="text"
                            className={styles.inputField}
                            placeholder="รายละเอียด"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>ขอบเขตโครงงาน</label>
                        <textarea
                            className={styles.textArea}
                            placeholder="รายละเอียด"
                            value={scope}
                            onChange={(e) => setScope(e.target.value)}
                            rows={5}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>บทคัดย่อ</label>
                        <textarea
                            className={styles.textArea}
                            placeholder="รายละเอียด"
                            value={abstract}
                            onChange={(e) => setAbstract(e.target.value)}
                            rows={5}
                        />
                    </div>
                </div>

                {/* Right Column: PDF Upload */}
                <div className={styles.rightColumn}>
                    <div className={styles.uploadCard}>
                        {!file ? (
                            <>
                                <div className={styles.uploadCircle}>
                                    <span style={{ fontSize: '24px' }}>📄</span>
                                    <span className={styles.uploadText}>อัปไฟล์ PDF</span>
                                </div>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className={styles.fileInput}
                                    onChange={handleFileChange}
                                />
                            </>
                        ) : (
                            <div className={styles.previewArea}>
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
                                        cursor: 'pointer'
                                    }}
                                >
                                    ลบไฟล์
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
