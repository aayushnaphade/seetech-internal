"use client";

import React, { useState } from 'react';
import { AdiabaticCoolingTemplate } from './index';
import { sampleProposalData, sampleProposalData2, sampleProposalData3 } from './sample-data';
import { AdiabaticCoolingProposalData } from './types';

/**
 * 🧪 Adiabatic Cooling Template Demo
 * Interactive demonstration of the new professional proposal template
 */
export const AdiabaticCoolingDemo: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'screen' | 'print'>('screen');
  
  const sampleOptions = [
    { id: 1, name: "Office Complex", data: sampleProposalData },
    { id: 2, name: "Manufacturing Facility", data: sampleProposalData2 },
    { id: 3, name: "Hospital HVAC", data: sampleProposalData3 }
  ];

  const currentData = sampleOptions.find(option => option.id === selectedSample)?.data || sampleProposalData;

  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Demo Controls */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(10, 67, 92, 0.15)',
        border: '1px solid #D9E2EC',
        minWidth: '250px'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: 600,
          color: '#0A435C'
        }}>
          🎨 Template Demo
        </h3>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#2D3B45',
            marginBottom: '8px'
          }}>
            Sample Data:
          </label>
          <select
            value={selectedSample}
            onChange={(e) => setSelectedSample(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #D9E2EC',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            {sampleOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#2D3B45',
            marginBottom: '8px'
          }}>
            View Mode:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewMode('screen')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: viewMode === 'screen' ? '2px solid #1D7AA3' : '1px solid #D9E2EC',
                backgroundColor: viewMode === 'screen' ? '#1D7AA3' : 'white',
                color: viewMode === 'screen' ? 'white' : '#2D3B45',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Screen
            </button>
            <button
              onClick={() => setViewMode('print')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: viewMode === 'print' ? '2px solid #1D7AA3' : '1px solid #D9E2EC',
                backgroundColor: viewMode === 'print' ? '#1D7AA3' : 'white',
                color: viewMode === 'print' ? 'white' : '#2D3B45',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Print
            </button>
          </div>
        </div>

        <div style={{
          padding: '12px',
          backgroundColor: 'rgba(46, 147, 110, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(46, 147, 110, 0.2)'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#2E936E',
            fontWeight: 600,
            marginBottom: '4px'
          }}>
            ✅ New Features:
          </div>
          <ul style={{
            fontSize: '11px',
            color: '#2D3B45',
            margin: 0,
            paddingLeft: '16px',
            lineHeight: 1.4
          }}>
            <li>Modular architecture</li>
            <li>Professional design system</li>
            <li>Print/PDF optimized</li>
            <li>Responsive layouts</li>
            <li>TypeScript support</li>
          </ul>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '10px',
            backgroundColor: '#2E936E',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          📄 Generate PDF
        </button>
      </div>

      {/* Template Display */}
      <div style={{ 
        marginLeft: viewMode === 'screen' ? '290px' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        <AdiabaticCoolingTemplate
          data={currentData}
          viewMode={viewMode}
        />
      </div>

      {/* Demo Information */}
      {viewMode === 'screen' && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(10, 67, 92, 0.15)',
          border: '1px solid #D9E2EC',
          maxWidth: '300px'
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#0A435C'
          }}>
            💡 Template Info
          </h4>
          <div style={{
            fontSize: '12px',
            color: '#64748B',
            lineHeight: 1.4
          }}>
            <strong>Current Sample:</strong> {sampleOptions.find(o => o.id === selectedSample)?.name}<br/>
            <strong>System Capacity:</strong> {currentData.systemCapacity} TR<br/>
            <strong>Expected Savings:</strong> {currentData.expectedSaving}%<br/>
            <strong>Investment:</strong> ₹{Number(currentData.investmentCost).toLocaleString('en-IN')}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdiabaticCoolingDemo;
