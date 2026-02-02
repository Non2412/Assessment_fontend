"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    // Display current date
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    setDateString(now.toLocaleDateString('th-TH', options));

    // Animate numbers on stat cards
    const animateNumber = (element: Element, target: number) => {
      let current = 0;
      const increment = Math.max(target / 50, 1);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target + (element.textContent?.includes('%') ? '%' : '');
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + (element.textContent?.includes('%') ? '%' : '');
        }
      }, 30);
    };

    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      const text = stat.getAttribute('data-target') || '0';
      const target = parseInt(text);
      if (!isNaN(target)) {
        // Reset text content to 0 before animating, preserving % if needed
        const hasPercent = stat.textContent?.includes('%');
        stat.textContent = '0' + (hasPercent ? '%' : '');
        animateNumber(stat, target);
      }
    });

    // Add sparkle effects randomly
    const createSparkle = () => {
      const cards = document.querySelectorAll('.assessment-card, .stat-card');
      cards.forEach(card => {
        if (Math.random() > 0.7) {
          const sparkle = document.createElement('div');
          sparkle.className = 'sparkle';
          sparkle.style.left = Math.random() * 100 + '%';
          sparkle.style.top = Math.random() * 100 + '%';
          sparkle.style.animationDelay = Math.random() * 2 + 's';
          card.appendChild(sparkle);

          setTimeout(() => sparkle.remove(), 2000);
        }
      });
    };

    const sparkleInterval = setInterval(createSparkle, 3000);

    return () => clearInterval(sparkleInterval);
  }, []);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();

    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.width = ripple.style.height = '100px';
    // Calculate position relative to the button
    ripple.style.left = e.clientX - rect.left - 50 + 'px';
    ripple.style.top = e.clientY - rect.top - 50 + 'px';
    ripple.style.animation = 'ripple 0.6s ease-out';

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <>
      {/* Animated Background */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="greeting">สวัสดี! นักเรียน 👋</h1>
          <p className="welcome-text">พร้อมที่จะเริ่มการประเมินวันนี้แล้วหรือยัง? มาดูกันว่ามีอะไรรออยู่บ้าง</p>
          <div className="date-time">
            <span>📅</span>
            <span id="currentDate">{dateString}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number" data-target="12">12</div>
          <div className="stat-label">การประเมินที่เสร็จแล้ว</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-number" data-target="2">2</div>
          <div className="stat-label">รอดำเนินการ</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-number" data-target="85">85%</div>
          <div className="stat-label">คะแนนเฉลี่ย</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-number" data-target="5">5</div>
          <div className="stat-label">วันต่อเนื่อง</div>
        </div>
      </div>

      {/* Assessment Section */}
      <h2 className="section-title">🚀 การประเมินที่พร้อมให้ทำ</h2>
      <div className="assessment-grid">
        {/* Assessment Card 1 */}
        <div className="assessment-card">
          <div className="card-header">
            <div className="card-icon">📚</div>
            <div>
              <h3 className="card-title">แบบประเมินความพึงพอใจ</h3>
              <span className="status-badge status-new">✨ ใหม่</span>
            </div>
          </div>
          <p className="card-description">
            ประเมินความพึงพอใจต่อการเรียนการสอนในภาคเรียนนี้ เพื่อช่วยให้เราพัฒนาคุณภาพการศึกษาให้ดีขึ้น
          </p>
          <div className="card-meta">
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span>5-7 นาที</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📋</span>
              <span>15 คำถาม</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span>ครบกำหนด 3 ก.พ. 2026</span>
            </div>
          </div>
          <button className="btn-start" onClick={handleRipple}>
            <span className="btn-text">
              <span>เริ่มประเมินเลย</span>
              <span>🚀</span>
            </span>
          </button>
        </div>

        {/* Assessment Card 2 */}
        <div className="assessment-card">
          <div className="card-header">
            <div className="card-icon">💡</div>
            <div>
              <h3 className="card-title">ประเมินตนเอง</h3>
              <span className="status-badge status-pending">⏳ ดำเนินการ</span>
            </div>
          </div>
          <p className="card-description">
            ประเมินทักษะและความสามารถของตัวเอง เพื่อรับคำแนะนำในการพัฒนาตนเองให้ก้าวหน้ายิ่งขึ้น
          </p>
          <div className="card-meta">
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span>10-12 นาที</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📋</span>
              <span>20 คำถาม</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📊</span>
              <span>50% เสร็จแล้ว</span>
            </div>
          </div>
          <button className="btn-start" onClick={handleRipple}>
            <span className="btn-text">
              <span>ทำต่อ</span>
              <span>▶️</span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
