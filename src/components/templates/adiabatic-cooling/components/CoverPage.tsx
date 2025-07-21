import React from 'react';

export interface CoverPageProps {
  logoUrl?: string;
  companyName: string;
  tagline: string;
  title: string;
  capacity: string;
  clientName: string;
  clientLocation: string;
  badgeText: string;
  projectName: string;
  date: string;
  techHighlights: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
    tags: string[];
  }>;
  footerNote: string;
}

const defaultTechHighlights = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#E0F2FE"/><path d="M10 22V10h12v12H10zm2-2h8V12h-8v8z" fill="#0369A1"/></svg>
    ),
    title: 'Digital Twin Technology',
    description: 'Our solution leverages digital twin technology to simulate and optimize system performance before implementation, ensuring maximum efficiency.',
    tags: ['Real-time', 'Predictive'],
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#D1FAE5"/><path d="M16 10a6 6 0 016 6c0 3.314-6 10-6 10s-6-6.686-6-10a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" fill="#059669"/></svg>
    ),
    title: 'IoT-Enabled Monitoring',
    description: 'Real-time data collection and analysis through IoT sensors for performance optimization and predictive maintenance.',
    tags: ['Smart Control', 'Cloud Connected'],
  },
];

export const CoverPage: React.FC<CoverPageProps> = ({
  logoUrl,
  companyName,
  tagline,
  title,
  capacity,
  clientName,
  clientLocation,
  badgeText,
  projectName,
  date,
  techHighlights = defaultTechHighlights,
  footerNote,
}) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      background: 'linear-gradient(135deg, #eaf3f7 0%, #f8fafc 100%)',
      padding: '0',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      {/* Main Card */}
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 32,
        boxShadow: '0 8px 32px 0 rgba(9,66,93,0.10)',
        padding: '56px 40px 40px 40px',
        maxWidth: 700,
        width: '90%',
        margin: '48px 0 32px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" style={{ height: 150, margin: '0 auto 20px', display: 'block', boxShadow: '0 4px 24px 0 rgba(9,66,93,0.10)', borderRadius: 24, background: '#fff', padding: 8 }} />
          ) : (
            <div style={{ fontWeight: 700, fontSize: 40, color: '#0369A1', marginBottom: 8 }}>{companyName}</div>
          )}
          <div style={{ fontSize: 16, color: '#0369A1', fontWeight: 500, letterSpacing: 1 }}>{tagline}</div>
        </div>

        {/* Main Title Section */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: '#09425d', marginBottom: 8, letterSpacing: 0.5 }}>{title}</div>
          <div style={{ width: 60, height: 4, background: '#09425d', borderRadius: 2, margin: '0 auto 16px' }} />
          <div style={{ fontSize: 22, color: '#0284c7', fontWeight: 600, marginBottom: 10 }}>{capacity}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#334155', marginBottom: 2 }}>{clientName}</div>
          <div style={{ fontSize: 16, color: '#64748b', marginBottom: 16 }}>{clientLocation}</div>
          <div style={{ display: 'inline-block', background: '#5eead4', color: '#0f766e', fontWeight: 700, borderRadius: 20, padding: '7px 28px', fontSize: 16, marginBottom: 8, boxShadow: '0 2px 8px 0 rgba(16,185,129,0.10)' }}>{badgeText}</div>
        </div>

        {/* Technology Highlights */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, margin: '0 auto 36px', maxWidth: 700 }}>
          {techHighlights.map((item, idx) => (
            <div key={idx} style={{
              background: '#f8fafc',
              borderRadius: 18,
              boxShadow: '0 4px 16px rgba(9,66,93,0.07)',
              padding: 24,
              flex: 1,
              minWidth: 220,
              maxWidth: 300,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1.5px solid #e0f2fe',
            }}>
              <div style={{ marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>{item.title}</div>
              <div style={{ fontSize: 14, color: '#334155', marginBottom: 12, textAlign: 'center' }}>{item.description}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {item.tags.map((tag, i) => (
                  <span key={i} style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 12, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider above footer */}
        <div style={{ width: '100%', height: 1, background: '#e3e8ee', margin: '16px 0 12px 0' }} />

        {/* Footer */}
        <div style={{ textAlign: 'right', fontSize: 15, color: '#334155', marginTop: 0, marginBottom: 0, paddingRight: 0 }}>
          <div style={{ marginBottom: 2 }}>Prepared for: <span style={{ fontWeight: 600 }}>{projectName}</span></div>
          <div style={{ marginBottom: 2 }}>Date: {date}</div>
          <div style={{ fontStyle: 'italic', color: '#64748b', fontSize: 13, marginTop: 8 }}>{footerNote}</div>
        </div>
      </div>
    </div>
  );
};

export default CoverPage; 