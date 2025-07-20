"use client";

import React from 'react';
import '../styles/layout.css';

/**
 * 🎯 Metric Display Component - Compact Report Style
 * For displaying key numbers with proper visual hierarchy
 */
interface MetricCardProps {
  value: string;
  label: string;
  variant?: 'default' | 'positive' | 'warning' | 'danger';
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  value, 
  label, 
  variant = 'default',
  icon 
}) => (
  <div className={`chiller-metric-card ${variant}`}>
    {icon && (
      <div className={`chiller-icon-container ${variant}`}>
        {icon}
      </div>
    )}
    <div className="chiller-metric-value">{value}</div>
    <div className="chiller-metric-label">{label}</div>
  </div>
);

/**
 * 📋 Section Container with Professional Headers
 */
interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => (
  <section className={`chiller-section ${className}`}>
    <h2 className="chiller-section-header">{title}</h2>
    {children}
  </section>
);

/**
 * 🎨 Highlight Box for Important Information
 */
interface HighlightBoxProps {
  title: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning';
}

export const HighlightBox: React.FC<HighlightBoxProps> = ({ 
  title, 
  children, 
  variant = 'info' 
}) => (
  <div className={`chiller-highlight-box ${variant}`}>
    <h4>{title}</h4>
    {children}
  </div>
);

/**
 * 📊 Grid Layouts
 */
export const TwoColumnGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="chiller-two-column">{children}</div>
);

export const ThreeColumnGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="chiller-three-column">{children}</div>
);

/**
 * 📋 Professional List Component
 */
interface ProListProps {
  items: string[];
}

export const ProList: React.FC<ProListProps> = ({ items }) => (
  <ul className="chiller-pro-list">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

/**
 * 🎯 Value Display with Icon
 */
interface ValueDisplayProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  description?: string;
}

export const ValueDisplay: React.FC<ValueDisplayProps> = ({ 
  icon, 
  value, 
  label, 
  description 
}) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
    <div className="chiller-icon-container primary">
      {icon}
    </div>
    <div>
      <div style={{ 
        fontSize: 'var(--chiller-fs-h3)', 
        fontWeight: 'bold',
        color: 'var(--chiller-primary)'
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: 'var(--chiller-fs-small)', 
        color: 'var(--chiller-muted)',
        fontWeight: 500
      }}>
        {label}
      </div>
      {description && (
        <div style={{ 
          fontSize: 'var(--chiller-fs-micro)', 
          color: 'var(--chiller-muted)',
          marginTop: '2px'
        }}>
          {description}
        </div>
      )}
    </div>
  </div>
);
