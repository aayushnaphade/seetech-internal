"use client";

import React from 'react';
import { ProfessionalTableProps, TableColumn, TableRow } from '../types';

/**
 * 📊 Professional Table Component
 * High-quality table with semantic color coding and perfect typography
 */
export const ProfessionalTable: React.FC<ProfessionalTableProps> = ({
  columns,
  data,
  title,
  subtitle,
  className = ''
}) => {
  const formatCellValue = (value: string | number, column: TableColumn): string => {
    if (typeof value !== 'number') {
      return String(value);
    }

    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(value);
      
      case 'percentage':
        return `${value.toFixed(1)}%`;
      
      case 'number':
        return new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: column.format ? parseInt(column.format) : 1
        }).format(value);
      
      default:
        return String(value);
    }
  };

  const getCellAlignment = (column: TableColumn): string => {
    if (column.align) return column.align;
    if (column.type === 'number' || column.type === 'currency' || column.type === 'percentage') {
      return 'right';
    }
    return 'left';
  };

  const getCellColorClass = (value: string | number, column: TableColumn): string => {
    if (column.type === 'percentage' && typeof value === 'number') {
      return value > 0 ? 'table-positive' : value < 0 ? 'table-negative' : 'table-neutral';
    }
    if (column.key.includes('saving') || column.key.includes('reduction')) {
      return 'table-positive';
    }
    if (column.key.includes('cost') || column.key.includes('investment')) {
      return 'table-negative';
    }
    return '';
  };

  return (
    <div className={`table-container ${className}`}>
      {(title || subtitle) && (
        <div style={{ marginBottom: 'var(--spacing-medium)' }}>
          {title && (
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-h4)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-primary)',
              margin: '0 0 var(--spacing-micro) 0'
            }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-muted-text)',
              margin: 0,
              fontWeight: 'var(--font-weight-medium)'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <table className="professional-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={column.key}
                style={{ 
                  textAlign: getCellAlignment(column) as any,
                  minWidth: column.type === 'currency' ? '120px' : 'auto'
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => {
                const value = row[column.key];
                const formattedValue = formatCellValue(value, column);
                const colorClass = getCellColorClass(value, column);
                
                return (
                  <td 
                    key={column.key}
                    className={`${column.type === 'number' || column.type === 'currency' || column.type === 'percentage' ? 'numeric' : ''} ${colorClass}`}
                    style={{ textAlign: getCellAlignment(column) as any }}
                  >
                    {formattedValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface ComparisonTableProps {
  data: {
    metric: string;
    current: string | number;
    proposed: string | number;
    improvement: string | number;
    unit?: string;
  }[];
  title?: string;
}

/**
 * 📈 Comparison Table Component
 * Specialized table for before/after comparisons with semantic coloring
 */
export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  data,
  title = "Performance Comparison"
}) => {
  const columns: TableColumn[] = [
    { header: 'Metric', key: 'metric', type: 'text', align: 'left' },
    { header: 'Current', key: 'current', type: 'text', align: 'right' },
    { header: 'Proposed', key: 'proposed', type: 'text', align: 'right' },
    { header: 'Improvement', key: 'improvement', type: 'text', align: 'right' }
  ];

  const tableData = data.map(row => ({
    metric: row.metric,
    current: typeof row.current === 'number' 
      ? `${row.current.toFixed(1)}${row.unit || ''}` 
      : row.current,
    proposed: typeof row.proposed === 'number' 
      ? `${row.proposed.toFixed(1)}${row.unit || ''}` 
      : row.proposed,
    improvement: typeof row.improvement === 'number' 
      ? `+${row.improvement.toFixed(1)}%` 
      : row.improvement
  }));

  return (
    <div className="comparison-table-container">
      <style jsx>{`
        .comparison-table-container .professional-table td:nth-child(2) {
          color: var(--color-warning);
          font-weight: var(--font-weight-medium);
        }
        .comparison-table-container .professional-table td:nth-child(3) {
          color: var(--color-accent);
          font-weight: var(--font-weight-semibold);
        }
        .comparison-table-container .professional-table td:nth-child(4) {
          color: var(--color-accent);
          font-weight: var(--font-weight-semibold);
        }
      `}</style>
      <ProfessionalTable
        columns={columns}
        data={tableData}
        title={title}
        subtitle="Current vs. Proposed System Performance"
      />
    </div>
  );
};

interface FinancialTableProps {
  data: {
    year: number;
    savings: number;
    cumulative: number;
    investment?: number;
    netBenefit: number;
  }[];
  title?: string;
}

/**
 * 💰 Financial Projection Table
 * Specialized table for financial data with currency formatting
 */
export const FinancialTable: React.FC<FinancialTableProps> = ({
  data,
  title = "Financial Projections"
}) => {
  const columns: TableColumn[] = [
    { header: 'Year', key: 'year', type: 'number', align: 'center' },
    { header: 'Annual Savings', key: 'savings', type: 'currency', align: 'right' },
    { header: 'Cumulative Savings', key: 'cumulative', type: 'currency', align: 'right' },
    { header: 'Investment', key: 'investment', type: 'currency', align: 'right' },
    { header: 'Net Benefit', key: 'netBenefit', type: 'currency', align: 'right' }
  ];

  return (
    <div className="financial-table-container">
      <style jsx>{`
        .financial-table-container .professional-table td:nth-child(2),
        .financial-table-container .professional-table td:nth-child(3) {
          color: var(--color-accent);
          font-weight: var(--font-weight-semibold);
        }
        .financial-table-container .professional-table td:nth-child(4) {
          color: var(--color-warning);
          font-weight: var(--font-weight-medium);
        }
        .financial-table-container .professional-table td:nth-child(5) {
          font-weight: var(--font-weight-bold);
        }
        .financial-table-container .professional-table td:nth-child(5)[data-positive="true"] {
          color: var(--color-accent);
        }
        .financial-table-container .professional-table td:nth-child(5)[data-positive="false"] {
          color: var(--color-warning);
        }
      `}</style>
      <ProfessionalTable
        columns={columns}
        data={data.map(row => ({
          ...row,
          investment: row.investment || 0
        }))}
        title={title}
        subtitle="10-Year Financial Impact Analysis"
      />
    </div>
  );
};

interface SpecificationTableProps {
  specifications: {
    parameter: string;
    current: string;
    proposed: string;
    unit?: string;
    improvement?: boolean;
  }[];
  title?: string;
}

/**
 * ⚙️ Technical Specification Table
 * Clean table for technical parameters and specifications
 */
export const SpecificationTable: React.FC<SpecificationTableProps> = ({
  specifications,
  title = "Technical Specifications"
}) => {
  const columns: TableColumn[] = [
    { header: 'Parameter', key: 'parameter', type: 'text', align: 'left' },
    { header: 'Current System', key: 'current', type: 'text', align: 'right' },
    { header: 'Proposed System', key: 'proposed', type: 'text', align: 'right' }
  ];

  const tableData = specifications.map(spec => ({
    parameter: spec.parameter,
    current: `${spec.current}${spec.unit ? ` ${spec.unit}` : ''}`,
    proposed: `${spec.proposed}${spec.unit ? ` ${spec.unit}` : ''}`
  }));

  return (
    <div className="specification-table-container">
      <style jsx>{`
        .specification-table-container .professional-table td:nth-child(2) {
          color: var(--color-text);
          font-weight: var(--font-weight-medium);
        }
        .specification-table-container .professional-table td:nth-child(3) {
          color: var(--color-secondary);
          font-weight: var(--font-weight-semibold);
        }
      `}</style>
      <ProfessionalTable
        columns={columns}
        data={tableData}
        title={title}
        subtitle="Detailed System Parameters and Performance Metrics"
      />
    </div>
  );
};

export default ProfessionalTable;
