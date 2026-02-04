"use client";
import React from 'react';
import modalStyles from './modal.module.css';

interface PublishConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
}

export default function PublishConfirmationModal({ isOpen, onClose, onConfirm, title = "ยืนยันการลงทะเบียนแบบฟอร์ม?" }: PublishConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className={modalStyles.modalOverlay} onClick={onClose} style={{ zIndex: 1100 }}>
            <div
                className={modalStyles.modalContent}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '400px', padding: '0' }}
            >
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '30px',
                    textAlign: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
                    <h3 style={{
                        margin: '0 0 10px 0',
                        color: '#065f46',
                        fontSize: '1.2rem',
                        fontWeight: '600'
                    }}>
                        ยืนยันการลงทะเบียน
                    </h3>
                    <p style={{
                        color: '#64748b',
                        marginBottom: '30px',
                        fontSize: '0.95rem'
                    }}>
                        {title} <br /> ระบบจะเปิดให้ผู้ใช้งานเริ่มทำแบบประเมินได้ทันที
                    </p>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: '1px solid #cbd5e1',
                                background: 'white',
                                color: '#475569',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: '#10b981',
                                color: 'white',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 15px rgba(16, 185, 129, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.2)';
                            }}
                        >
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
