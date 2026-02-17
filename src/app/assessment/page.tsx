"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './style.module.css';

interface Assessment {
  _id: string;
  title: string;
  description: string;
  status: string;
  estimatedTime: number;
}

export default function AssessmentPage() {
    const [assessments, setAssessments] = useState<any[]>([]);

    useEffect(() => {
        const loadAssessments = async () => {
            try {
                const res = await fetch('/api/assessments?isPublished=true', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    console.log("Loaded assessments:", data);
                    setAssessments(data);
                } else {
                    setAssessments([]);
                }
            } catch (error) {
                console.error("Failed to load assessments", error);
                setAssessments([]);
            }
        };

        loadAssessments();
    }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>
        แบบประเมินที่เปิดให้ทำ
      </h1>

            {assessments.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>
                    <p>ยังไม่มีแบบประเมินที่เปิดใช้งานในขณะนี้</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {assessments.map((assessment) => (
                        <Link href={`/assessment/${assessment._id || assessment.id}`} key={assessment._id || assessment.id} style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'white',
                                padding: '24px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e2e8f0',
                                transition: 'transform 0.2s',
                                cursor: 'pointer',
                                height: '100%'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                                    {assessment.icon || '📝'}
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#0f172a' }}>
                                    {assessment.title}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', minHeight: '40px' }}>
                                    {assessment.abstract || assessment.subtitle || assessment.scope || 'ไม่มีรายละเอียด'}
                                </p>
                                <button style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: '#059669',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
                                }}>
                                    ทำแบบประเมิน
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
