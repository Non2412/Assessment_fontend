"use client";
import { useState } from 'react';
import styles from './assessment.module.css';

export default function CreateAssessmentPage() {
  const [filter, setFilter] = useState('owned-me');



  // ข้อมูลจำลองสำหรับ Recent Forms
  const recentForms: any[] = [];

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
          <div style={{ width: '160px' }}>
            <div className={styles.createCard}>
              <svg width="60" height="60" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Custom SVG path for Google Plus Icon */}
                <path fillRule="evenodd" clipRule="evenodd" d="M28 20V4H20V20H4V28H20V44H28V28H44V20H28Z" fill="white" /> {/* Mask/Guideline */}
                <rect x="20" y="4" width="8" height="20" fill="#4285F4" /> {/* Top Blue */}
                <rect x="20" y="24" width="8" height="20" fill="#34A853" /> {/* Bottom Green */}
                <rect x="4" y="20" width="20" height="8" fill="#FBBC05" /> {/* Left Yellow */}
                <rect x="24" y="20" width="20" height="8" fill="#EA4335" /> {/* Right Red */}
                {/* Center overlap fix if needed, but rects cover it */}
              </svg>
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
            <div key={form.id} className={styles.formCard}>
              <div className={styles.formPreview}>
                <div className={styles.mockFormContent}>
                  <div className={styles.mockRow} style={{ height: '8px', marginBottom: '4px' }}></div>
                  <div className={styles.mockRow}></div>
                  <div className={`${styles.mockRow} ${styles.mockRowShort}`}></div>

                  <div className={styles.mockRow} style={{ marginTop: 'auto' }}></div>
                </div>
              </div>
              <div className={styles.formInfo}>
                <div className={styles.formTitle}>{form.title}</div>
                <div className={styles.formMeta}>
                  <div className={styles.formIcon}>📝</div>
                  <span className={styles.lastOpened}>{form.lastOpened}</span>
                  <button className={styles.moreOptions}>⋮</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
