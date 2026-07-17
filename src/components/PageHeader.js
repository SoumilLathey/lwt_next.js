import React from 'react';

export default function PageHeader({ title, description, badge, image = "/hero-bg.png", imagePosition = "center" }) {
  return (
    <div className="page-header">
      <div className="page-header-bg">
        <img 
          src={image} 
          alt={title} 
          className="page-header-img" 
          style={{ objectPosition: imagePosition }} 
        />
        <div className="page-header-overlay" />
      </div>
      <div className="page-header-content">
        {badge && (
          <div 
            className="page-header-badge" 
            style={{ 
              display: 'inline-block', 
              padding: '8px 16px', 
              background: 'rgba(245, 158, 11, 0.1)', 
              border: '1px solid rgba(245, 158, 11, 0.3)', 
              borderRadius: '8px', 
              color: '#F59E0B', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '16px', 
              letterSpacing: '0.5px' 
            }}
          >
            {badge}
          </div>
        )}
        <h1 className="page-header-title">{title}</h1>
        {description && <p className="page-header-desc">{description}</p>}
      </div>
    </div>
  );
}
