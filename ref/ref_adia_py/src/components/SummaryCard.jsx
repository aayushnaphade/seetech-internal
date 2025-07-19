/**
 * Summary card components for displaying key metrics
 */

import React from 'react';
import { COLORS } from '../utils/constants.js';

/**
 * Individual summary card component
 */
export function SummaryCard({ title, value, icon, description, color = COLORS.primary }) {
  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <div 
          className="summary-card-icon" 
          style={{ backgroundColor: color }}
        >
          <i className={`fas ${icon}`}></i>
        </div>
        <h3 className="summary-card-title">{title}</h3>
      </div>
      <div className="summary-card-value">{value}</div>
      {description && (
        <p className="summary-card-description">{description}</p>
      )}
    </div>
  );
}

/**
 * Grid of summary cards
 */
export function SummaryCardsGrid({ data }) {
  const getCardColor = (index) => {
    const colors = [
      COLORS.primary,
      COLORS.secondary,
      COLORS.accent,
      COLORS.highlight,
      COLORS.secondary,
      COLORS.accent
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {data.map((item, index) => (
        <SummaryCard
          key={index}
          title={item.label}
          value={item.value}
          icon={item.icon}
          color={getCardColor(index)}
        />
      ))}
    </div>
  );
}

/**
 * Technology cards for the cover page
 */
export function TechnologyCard({ title, description, icon, gradient }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-card border border-gray-200">
      <div className="text-center mb-4">
        <div 
          className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center transform rotate-45"
          style={{ 
            background: gradient,
            boxShadow: '0 4px 10px rgba(10, 67, 92, 0.25)'
          }}
        >
          <i 
            className={`fas ${icon} text-white text-xl transform -rotate-45`}
          ></i>
        </div>
        <h4 className="text-lg font-semibold text-primary mb-2">{title}</h4>
      </div>
      <p className="text-sm text-mutedText leading-relaxed">{description}</p>
    </div>
  );
}

/**
 * Benefits list component
 */
export function BenefitsList({ benefits, title }) {
  return (
    <div className="bg-neutral rounded-lg p-6 shadow-card border border-gray-200">
      <h4 className="text-lg font-semibold text-primary mb-4 pb-2 border-b-2 border-accent">
        {title}
      </h4>
      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start">
            <i className="fas fa-check-circle text-accent text-sm mt-1 mr-3 flex-shrink-0"></i>
            <span className="text-sm text-text">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Timeline component for project phases
 */
export function Timeline({ phases }) {
  return (
    <div className="timeline-container">
      {phases.map((phase, index) => (
        <div key={index} className="timeline-item">
          <p className="timeline-phase">Phase {phase.phase}</p>
          <p className="timeline-title">{phase.title}</p>
          <p className="timeline-period">{phase.period}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Table component for displaying tabular data
 */
export function DataTable({ data, headers, title }) {
  return (
    <div className="mb-8">
      {title && (
        <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          <thead>
            <tr style={{ backgroundColor: COLORS.tableHeader }}>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-3 py-2 text-white text-left font-semibold text-sm"
                  style={{ border: `1px solid ${COLORS.border}` }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                style={{ 
                  backgroundColor: rowIndex % 2 === 0 ? COLORS.tableEven : COLORS.tableOdd 
                }}
              >
                {Object.values(row).map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className="px-3 py-2 text-sm text-text"
                    style={{ border: `1px solid ${COLORS.border}` }}
                  >
                    {typeof cell === 'number' ? cell.toLocaleString('en-IN') : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}