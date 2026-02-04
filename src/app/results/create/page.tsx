"use client";
import React, { useState } from 'react';
import styles from './style.module.css';
import Link from 'next/link';

export default function CreateFormPage() {
    const [title, setTitle] = useState('แบบประเมินไม่มีชื่อ');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { id: 1, text: 'คำถามข้อที่ 1', type: 'radio', options: ['ตัวเลือก 1'] }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, {
            id: questions.length + 1,
            text: '',
            type: 'radio',
            options: ['ตัวเลือก 1']
        }]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainActions}>
                <Link href="/results" style={{ textDecoration: 'none', color: '#5f6368', display: 'flex', alignItems: 'center' }}>
                    ← กลับ
                </Link>
                <button className={styles.saveButton}>บันทึก</button>
            </div>

            {/* Title Card */}
            <div className={styles.titleCard}>
                <input
                    type="text"
                    className={styles.formTitleInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ชื่อแบบประเมิน"
                />
                <textarea
                    className={styles.formDescInput}
                    placeholder="คำอธิบายแบบฟอร์ม"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                />
            </div>

            {/* Questions List */}
            {questions.map((q, index) => (
                <div key={q.id} className={styles.questionCard}>
                    <input
                        type="text"
                        className={styles.questionInput}
                        placeholder="คำถาม"
                        defaultValue={q.text}
                    />

                    <div className={styles.optionsList}>
                        {q.options.map((opt, i) => (
                            <div key={i} className={styles.optionRow}>
                                <div className={styles.radioCircle}></div>
                                <input
                                    type="text"
                                    className={styles.optionInput}
                                    defaultValue={opt}
                                    placeholder="เพิ่มตัวเลือก"
                                />
                            </div>
                        ))}
                        <div className={styles.addOptionBtn} onClick={() => {
                            // Logic to add option would go here
                        }}>
                            เพิ่มตัวเลือก หรือ เพิ่ม &quot;อื่นๆ&quot;
                        </div>
                    </div>

                    <div className={styles.actionBar}>
                        <button className={styles.iconButton}>🗑️</button>
                        <button className={styles.iconButton} onClick={addQuestion}>➕</button>
                    </div>
                </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className={styles.iconButton} onClick={addQuestion} style={{ background: '#fff', padding: '15px', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                    ➕
                </button>
            </div>
        </div>
    );
}
