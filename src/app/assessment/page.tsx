"use client";
import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

interface Assessment {
  _id: string;
  title: string;
  description: string;
  status: string;
  estimatedTime: number;
}

export default function AssessmentPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/assessments`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }
        
        const result = await response.json();
        setAssessments(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>
          แบบประเมินที่เปิดให้ทำ
        </h1>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>
          แบบประเมินที่เปิดให้ทำ
        </h1>
        <div style={{ 
          background: '#fee2e2', 
          padding: '16px', 
          borderRadius: '8px', 
          color: '#991b1b',
          border: '1px solid #fecaca'
        }}>
          ⚠️ เกิดข้อผิดพลาด: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>
        แบบประเมินที่เปิดให้ทำ
      </h1>

      {assessments.length === 0 ? (
        <div style={{ 
          background: '#f0fdf4', 
          padding: '24px', 
          borderRadius: '8px', 
          color: '#166534',
          border: '1px solid #bbf7d0'
        }}>
          ยังไม่มีแบบประเมินที่เปิดให้ทำในขณะนี้
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {assessments.map((assessment) => (
            <div key={assessment._id} style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#0f172a' }}>
                {assessment.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>
                {assessment.description}
              </p>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '20px' }}>
                ⏱️ เวลาโดยประมาณ: {assessment.estimatedTime} นาที
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
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
              onClick={() => {
                // TODO: Navigate to assessment page
                alert(`เริ่มแบบประเมิน: ${assessment.title}`);
              }}>
                ทำแบบประเมิน
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
