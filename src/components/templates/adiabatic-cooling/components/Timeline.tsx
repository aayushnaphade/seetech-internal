"use client";

import React from 'react';
import { TimelinePhase } from '../types';

interface TimelineProps {
  phases: TimelinePhase[];
  totalDuration: string;
  title?: string;
}

/**
 * ⏱️ Implementation Timeline Component
 * Professional project timeline with phase indicators
 */
export const ImplementationTimeline: React.FC<TimelineProps> = ({
  phases,
  totalDuration,
  title = "Implementation Timeline"
}) => {
  const getPhaseIcon = (phase: number): string => {
    return phase.toString();
  };

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'completed': return 'var(--color-accent)';
      case 'in-progress': return 'var(--color-highlight)';
      case 'upcoming': return 'var(--color-secondary)';
      default: return 'var(--color-secondary)';
    }
  };

  return (
    <div className="timeline-container">
      <div style={{ marginBottom: 'var(--spacing-large)' }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--font-size-h3)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-primary)',
          margin: '0 0 var(--spacing-small) 0'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 'var(--font-size-small)',
          color: 'var(--color-muted-text)',
          margin: 0,
          fontWeight: 'var(--font-weight-medium)'
        }}>
          Total Project Duration: {totalDuration}
        </p>
      </div>

      <div className="timeline-phases">
        {phases.map((phase, index) => (
          <div key={phase.phase} className="timeline-item">
            <div 
              className="timeline-phase"
              style={{ backgroundColor: getStatusColor(phase.status) }}
            >
              {getPhaseIcon(phase.phase)}
            </div>
            <div className="timeline-content">
              <h4 className="timeline-title">
                Phase {phase.phase}: {phase.title}
              </h4>
              <p className="timeline-description">
                {phase.description}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'var(--spacing-small)'
              }}>
                <span style={{
                  fontSize: 'var(--font-size-micro)',
                  color: 'var(--color-muted-text)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  Duration: {phase.duration}
                </span>
                {phase.status && (
                  <span style={{
                    fontSize: 'var(--font-size-micro)',
                    color: getStatusColor(phase.status),
                    fontWeight: 'var(--font-weight-semibold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {phase.status.replace('-', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline summary */}
      <div style={{
        marginTop: 'var(--spacing-large)',
        padding: 'var(--spacing-medium)',
        backgroundColor: 'var(--color-neutral)',
        borderRadius: '8px',
        border: '1px solid var(--color-border)',
        textAlign: 'center'
      }}>
        <h4 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--font-size-h4)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-primary)',
          margin: '0 0 var(--spacing-small) 0'
        }}>
          Project Milestones
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 'var(--spacing-medium)',
          marginTop: 'var(--spacing-medium)'
        }}>
          <div>
            <div style={{
              fontSize: 'var(--font-size-h4)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-accent)'
            }}>
              {phases.length}
            </div>
            <div style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-muted-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Phases
            </div>
          </div>
          <div>
            <div style={{
              fontSize: 'var(--font-size-h4)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-secondary)'
            }}>
              {totalDuration}
            </div>
            <div style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-muted-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Duration
            </div>
          </div>
          <div>
            <div style={{
              fontSize: 'var(--font-size-h4)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-highlight)'
            }}>
              Q{Math.ceil(new Date().getMonth() / 3)}
            </div>
            <div style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-muted-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Start Quarter
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectMilestonesProps {
  milestones: {
    title: string;
    date: string;
    status: 'completed' | 'upcoming' | 'in-progress';
    description?: string;
  }[];
}

/**
 * 🎯 Project Milestones Component
 * Key project milestones and deliverables
 */
export const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({
  milestones
}) => {
  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'upcoming': return '📋';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'var(--color-accent)';
      case 'in-progress': return 'var(--color-highlight)';
      case 'upcoming': return 'var(--color-secondary)';
      default: return 'var(--color-secondary)';
    }
  };

  return (
    <div style={{ marginTop: 'var(--spacing-large)' }}>
      <h4 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--font-size-h4)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-primary)',
        margin: '0 0 var(--spacing-medium) 0'
      }}>
        Key Project Milestones
      </h4>
      
      <div style={{
        display: 'grid',
        gap: 'var(--spacing-small)'
      }}>
        {milestones.map((milestone, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 'var(--spacing-medium)',
              backgroundColor: 'white',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-light)'
            }}
          >
            <div style={{
              fontSize: '20px',
              marginRight: 'var(--spacing-medium)'
            }}>
              {getStatusIcon(milestone.status)}
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-primary)',
                margin: '0 0 var(--spacing-micro) 0'
              }}>
                {milestone.title}
              </h5>
              {milestone.description && (
                <p style={{
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--color-text)',
                  margin: '0 0 var(--spacing-micro) 0',
                  lineHeight: 1.4
                }}>
                  {milestone.description}
                </p>
              )}
              <div style={{
                fontSize: 'var(--font-size-micro)',
                color: 'var(--color-muted-text)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Target Date: {milestone.date}
              </div>
            </div>
            <div style={{
              padding: '4px 8px',
              backgroundColor: getStatusColor(milestone.status),
              color: 'white',
              borderRadius: '12px',
              fontSize: 'var(--font-size-micro)',
              fontWeight: 'var(--font-weight-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {milestone.status.replace('-', ' ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImplementationTimeline;
