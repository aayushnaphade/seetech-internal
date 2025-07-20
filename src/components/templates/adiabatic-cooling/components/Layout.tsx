"use client";

import React from 'react';
import { AdiabaticCoolingTemplateProps, ViewMode } from '../types';
import '../styles/design-tokens.css';
import '../styles/layout.css';
import '../styles/components.css';

interface A4PageContainerProps {
  children: React.ReactNode;
  viewMode?: ViewMode;
  className?: string;
}

/**
 * 📄 A4 Page Container - Professional Document Layout
 * Optimized for screen viewing and PDF generation
 */
export const A4PageContainer: React.FC<A4PageContainerProps> = ({
  children,
  viewMode = 'screen',
  className = ''
}) => {
  const containerClasses = [
    'a4-page-container',
    viewMode === 'print' ? 'print-mode' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

interface ProposalHeaderProps {
  projectName: string;
  clientName: string;
  date: string;
  proposalNumber: string;
  engineerName: string;
}

/**
 * 🎨 Professional Proposal Header
 * Gradient header with company branding and project details
 */
export const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  projectName,
  clientName,
  date,
  proposalNumber,
  engineerName
}) => {
  return (
    <header className="proposal-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <img 
            src="/seetech_logo.jpeg" 
            alt="SeeTech Logo" 
            style={{ height: '60px', width: 'auto' }}
          />
        </div>
        <div style={{ textAlign: 'right', fontSize: '14px', opacity: 0.9 }}>
          <div><strong>Proposal #:</strong> {proposalNumber}</div>
          <div><strong>Date:</strong> {new Date(date).toLocaleDateString('en-IN')}</div>
          <div><strong>Engineer:</strong> {engineerName}</div>
        </div>
      </div>
      
      <h1 className="proposal-title">
        Adiabatic Cooling Solution
      </h1>
      <h2 className="proposal-subtitle">
        Energy Efficiency Proposal for {clientName}
      </h2>
      <div style={{ 
        marginTop: '16px', 
        fontSize: '18px', 
        fontWeight: 600,
        opacity: 0.95 
      }}>
        Project: {projectName}
      </div>
    </header>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * 📋 Section Header Component
 * Consistent section styling with accent underline
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  className = ''
}) => {
  return (
    <div className={`section-header ${className}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon && (
          <div className="icon-circle" style={{ width: '32px', height: '32px' }}>
            {icon}
          </div>
        )}
        <div>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-h2)' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-muted-text)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * 📐 Responsive Grid System
 * Flexible grid for components with automatic mobile stacking
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = 2,
  gap = 'medium',
  className = ''
}) => {
  const gapSizes = {
    small: 'var(--spacing-small)',
    medium: 'var(--spacing-medium)',
    large: 'var(--spacing-large)'
  };

  const gridStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: gapSizes[gap],
    width: '100%'
  };

  // Apply responsive styles for larger screens
  if (columns === 2) {
    gridStyle.flexDirection = 'row';
    gridStyle.flexWrap = 'wrap';
  }

  return (
    <div className={`responsive-grid ${className}`} style={gridStyle}>
      {React.Children.map(children, (child, index) => (
        <div 
          className={columns === 2 ? 'grid-item' : 'grid-item-full'}
          key={index}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'positive' | 'negative' | 'neutral' | 'highlight';
  size?: 'small' | 'medium';
}

/**
 * 🏷️ Professional Badge Component
 * Color-coded badges for status and categories
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'medium'
}) => {
  const variantClasses = {
    positive: 'badge-positive',
    negative: 'badge-negative',
    neutral: 'badge-neutral',
    highlight: 'badge-highlight'
  };

  const sizeStyles = {
    small: { fontSize: '10px', padding: '2px 8px' },
    medium: { fontSize: '12px', padding: '4px 12px' }
  };

  return (
    <span 
      className={`badge ${variantClasses[variant]}`}
      style={sizeStyles[size]}
    >
      {children}
    </span>
  );
};

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  hoverable?: boolean;
}

/**
 * 🃏 Professional Card Component
 * Consistent card styling with shadow and hover effects
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  hoverable = true
}) => {
  const cardClasses = [
    'card',
    hoverable ? 'interactive-element' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

interface ValueDisplayProps {
  value: string | number;
  unit?: string;
  label: string;
  variant?: 'positive' | 'negative' | 'neutral';
  size?: 'small' | 'medium' | 'large';
}

/**
 * 💯 Value Display Component
 * Prominent display for key metrics and values
 */
export const ValueDisplay: React.FC<ValueDisplayProps> = ({
  value,
  unit,
  label,
  variant = 'neutral',
  size = 'medium'
}) => {
  const colorClasses = {
    positive: 'color-positive',
    negative: 'color-negative',
    neutral: 'color-neutral'
  };

  const sizes = {
    small: { fontSize: '18px', marginBottom: '4px' },
    medium: { fontSize: '24px', marginBottom: '8px' },
    large: { fontSize: '32px', marginBottom: '12px' }
  };

  return (
    <div style={{ textAlign: 'center', padding: 'var(--spacing-medium)' }}>
      <div 
        className={colorClasses[variant]}
        style={{
          ...sizes[size],
          fontWeight: 'var(--font-weight-bold)',
          fontFamily: 'var(--font-heading)'
        }}
      >
        {value}
        {unit && (
          <span style={{ 
            fontSize: '0.6em', 
            marginLeft: '4px',
            color: 'var(--color-muted-text)' 
          }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{
        fontSize: 'var(--font-size-small)',
        color: 'var(--color-muted-text)',
        fontWeight: 'var(--font-weight-medium)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label}
      </div>
    </div>
  );
};

/**
 * 📱 Print Button Component
 * Utility button for triggering print/PDF generation
 */
export const PrintButton: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'var(--gradient-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: 'var(--font-size-small)',
        fontWeight: 'var(--font-weight-semibold)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-medium)',
        transition: 'var(--transition-smooth)',
        zIndex: 1000
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-strong)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
      }}
    >
      📄 Generate PDF
    </button>
  );
};

export default A4PageContainer;
