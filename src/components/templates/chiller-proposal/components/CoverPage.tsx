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
      justifyContent: 'space-between',
      fontFamily: 'Inter, Arial, sans-serif',
      background: '#fff',
      padding: '40px 0',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Company Logo" style={{ height: 100, margin: '0 auto 16px', display: 'block' }} />
        ) : (
          <div style={{ fontWeight: 700, fontSize: 32, color: '#0369A1', marginBottom: 4 }}>{companyName}</div>
        )}
        <div style={{ fontSize: 14, color: '#0369A1', fontWeight: 500 }}>{tagline}</div>
      </div>

      {/* Main Title Section */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 20, color: '#0284c7', fontWeight: 500, marginBottom: 8 }}>{capacity}</div>
        <div style={{ height: 4 }} />
        <div style={{ fontSize: 22, fontWeight: 600, color: '#334155', marginBottom: 2 }}>{clientName}</div>
        <div style={{ fontSize: 16, color: '#64748b', marginBottom: 12 }}>{clientLocation}</div>
        <div style={{ display: 'inline-block', background: '#5eead4', color: '#0f766e', fontWeight: 600, borderRadius: 20, padding: '6px 20px', fontSize: 15, marginBottom: 8 }}>{badgeText}</div>
      </div>

      {/* Technology Highlights */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, margin: '0 auto 32px', maxWidth: 700 }}>
        {techHighlights.map((item, idx) => (
          <div key={idx} style={{
            background: '#f8fafc',
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            padding: 20,
            flex: 1,
            minWidth: 260,
            maxWidth: 320,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{ marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', marginBottom: 6, textAlign: 'center' }}>{item.title}</div>
            <div style={{ fontSize: 14, color: '#334155', marginBottom: 10, textAlign: 'center' }}>{item.description}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {item.tags.map((tag, i) => (
                <span key={i} style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 12, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'right', fontSize: 14, color: '#334155', marginTop: 'auto', marginBottom: 0, paddingRight: 40 }}>
        <div style={{ marginBottom: 2 }}>Prepared for: <span style={{ fontWeight: 600 }}>{projectName}</span></div>
        <div style={{ marginBottom: 2 }}>Date: {date}</div>
        <div style={{ fontStyle: 'italic', color: '#64748b', fontSize: 13, marginTop: 8 }}>{footerNote}</div>
      </div>
    </div>
  );
};

export default CoverPage; 