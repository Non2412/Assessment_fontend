"use client";
import Link from 'next/link';
import { useState } from 'react';
import styles from './assessment.module.css';

export default function CreateAssessmentPage() {
  const [filter, setFilter] = useState('owned-me');

  // Mock data for Created Forms (Results)
  const recentForms = [
    { id: 1, title: 'แบบประเมินความพึงพอใจ', subtitle: 'Web Development', icon: '📝' }
  ];

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
            <Link href="/results/create" style={{ textDecoration: 'none' }}>
              <div className={styles.createCard}>
                <span className={styles.plusIcon}>+</span>
              </div>
            </Link>
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
            <div key={form.id} className={styles.resultCard}>
              <div className={styles.resultCardImg}></div>
              <div className={styles.resultCardAvatar}>
                {/* Icon SVG (Clipboard/Form) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.resultCardTitle}>{form.title}</div>
                <div className={styles.resultCardSubtitle}>{form.subtitle}</div>
                <button className={styles.resultCardBtn}>ดูผลลัพธ์</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
