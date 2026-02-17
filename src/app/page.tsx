"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './home.module.css';

interface UserData {
  id: string;
  username: string;
  role: string;
}

interface AssessmentForm {
  id: number;
  title: string;
  subtitle: string;
  isDraft: boolean;
  icon?: string;
  [key: string]: any;
}

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState({
    completed: 0,
    drafts: 0,
    score: 0
  });
  const [recentActivity, setRecentActivity] = useState<AssessmentForm[]>([]);

  useEffect(() => {
    // Check User
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData: UserData = JSON.parse(storedUser);
        setUser(userData);

        // Load Stats
        const userId = userData.id || userData.username;
        const completedKey = `completed_assessments_${userId}`;
        const formsKey = `assessment_forms_${userId}`;

        const completed = JSON.parse(localStorage.getItem(completedKey) || '[]');
        const forms = JSON.parse(localStorage.getItem(formsKey) || '[]');

        const drafts = forms.filter((f: AssessmentForm) => f.isDraft).length;

        // Mock Score calculation
        const mockScore = completed.length > 0 ? 85 : 0;

        setStats({
          completed: completed.length,
          drafts: drafts,
          score: mockScore
        });

        // Set Recent Activity
        const sortedForms = [...forms].sort((a: AssessmentForm, b: AssessmentForm) => b.id - a.id).slice(0, 3);
        setRecentActivity(sortedForms);

      } catch (e) {
        console.error(e);
      }
    }
    setIsLoading(false);
  }, []);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();

    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.width = ripple.style.height = '100px';
    ripple.style.left = e.clientX - rect.left - 50 + 'px';
    ripple.style.top = e.clientY - rect.top - 50 + 'px';
    ripple.style.animation = 'ripple 0.6s ease-out';

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    // Redirect if not logged in
    if (!user) {
      router.push('/register');
    }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>กำลังโหลด...</div>;
  }

  // DASHBOARD VIEW
  if (user) {
    return (
      <div className={styles.dashboardContainer}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeText}>
            <h1>สวัสดีตอนเช้า, {user.username || 'นักเรียน'}! 👋</h1>
            <p>พร้อมที่จะพัฒนาตัวเองในวันนี้หรือยัง?</p>
          </div>
          <div className={styles.dateBadge}>
            📅 {new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

          {/* Decorative Elements */}
          <div className={`${styles.miniFloat} ${styles.float1}`}>💡</div>
          <div className={`${styles.miniFloat} ${styles.float2}`}>🎯</div>
          <div className={`${styles.miniFloat} ${styles.float3}`}>✨</div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.greenIcon}`}>📝</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>ประเมินเสร็จแล้ว</div>
              <div className={styles.statValue}>{stats.completed}</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.orangeIcon}`}>⏳</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>แบบร่าง (รอส่ง)</div>
              <div className={styles.statValue}>{stats.drafts}</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.purpleIcon}`}>🏆</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>คะแนนเฉลี่ย</div>
              <div className={styles.statValue}>{stats.score}%</div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <h2 className={styles.sectionTitle}>เมนูด่วน</h2>
        <div className={styles.actionGrid}>
          <button className={`${styles.actionCard} ${styles.newAssessmentCard}`} onClick={() => router.push('/assessment')}>
            <span className={styles.actionIcon}>🚀</span>
            <span className={styles.actionTitle}>ทำแบบประเมินใหม่</span>
            <span className={styles.actionDesc}>เริ่มการประเมินเพื่อวิเคราะห์จุดแข็งและพัฒนาตนเอง</span>
          </button>

          <button className={`${styles.actionCard} ${styles.historyCard}`} onClick={() => router.push('/results')}>
            <span className={styles.actionIcon}>📊</span>
            <span className={styles.actionTitle}>ดูผลลัพธ์ย้อนหลัง</span>
            <span className={styles.actionDesc}>ตรวจสอบประวัติและพัฒนาการของคุณ</span>
          </button>
        </div>

        {/* Recent Activity */}
        <h2 className={styles.sectionTitle}>กิจกรรมล่าสุด</h2>
        <div className={styles.recentList}>
          {recentActivity.length > 0 ? (
            recentActivity.map((item, index) => (
              <div key={index} className={styles.recentItem}>
                <div className={styles.itemIcon}>{item.icon || '📄'}</div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemMeta}>{item.subtitle}</div>
                </div>
                <div className={`${styles.itemStatus} ${item.isDraft ? styles.statusDraft : styles.statusCompleted}`}>
                  {item.isDraft ? 'แบบร่าง' : 'เสร็จสมบูรณ์'}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              ยังไม่มีกิจกรรมล่าสุด เริ่มต้นทำแบบประเมินได้เลย!
            </div>
          )}
        </div>
      </div>
    );
  }

  // PUBLIC LANDING VIEW
  return (
    <>
      {/* Animated Background */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Hero Banner Section */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">“การมีคนเข้าใจเป็นอะไรที่รู้สึกดีมากเลย”</h1>
          <p className="hero-subtitle">
            เพียง 10 นาทีในการรู้ถึงคำอธิบายเกี่ยวกับตัวตนของคุณและเหตุผลที่คุณทำสิ่งต่าง ๆ <br />
            “ที่แม่นยำจนคุณต้องแปลกใจ”
          </p>
          <button className="hero-btn" onClick={handleRipple}>
            เริ่มใช้งานฟรี <span>→</span>
          </button>
        </div>

        {/* Floating Visuals (Right Side) */}
        <div className="hero-visuals">
          <div className="floating-card float-1">
            <span className="float-icon icon-yellow">💡</span>
            <div className="float-text">
              <strong>ค้นหาจุดแข็ง</strong>
              <span>รู้ศักยภาพที่ซ่อนอยู่</span>
            </div>
          </div>
          <div className="floating-card float-2">
            <span className="float-icon icon-red">🎯</span>
            <div className="float-text">
              <strong>เป้าหมายชัดเจน</strong>
              <span>วางแผนอนาคตได้ชัดเจน</span>
            </div>
          </div>
          <div className="floating-card float-3">
            <span className="float-icon icon-pink">🧠</span>
            <div className="float-text">
              <strong>วิเคราะห์ตนเอง</strong>
              <span>เข้าใจตัวเองอย่างถ่องแท้</span>
            </div>
          </div>

          <div className="floating-card float-left-1">
            <span className="float-icon icon-yellow">📈</span>
            <div className="float-text">
              <strong>พัฒนาตนเอง</strong>
              <span>ปรับปรุงตัวเองได้ชัดเจน</span>
            </div>
          </div>
          <div className="floating-card float-left-2">
            <span className="float-icon icon-red">🏫</span>
            <div className="float-text">
              <strong>พัฒนาหลักสูตร</strong>
              <span>ช่วยปรับปรุงการเรียนการสอน</span>
            </div>
          </div>
          <div className="floating-card float-left-3">
            <span className="float-icon icon-pink">🎁</span>
            <div className="float-text">
              <strong>รับสิทธิพิเศษ</strong>
              <span>แลกของรางวัลมากมาย</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
