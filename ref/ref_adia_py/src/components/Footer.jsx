/**
 * Footer component for the proposal
 */

import React from 'react';
import { COLORS, REPORT_DATE, PREPARED_BY } from '../utils/constants.js';

export function Footer() {
  return (
    <div className="mt-12 pt-8 border-t-2 border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div>
          <h4 className="text-lg font-semibold text-primary mb-4">
            Contact Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <i className="fas fa-building text-secondary mr-3"></i>
              <span className="text-sm text-text">
                SEE-Tech Solutions Pvt. Ltd.
              </span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-map-marker-alt text-secondary mr-3"></i>
              <span className="text-sm text-text">
                Bangalore, Karnataka, India
              </span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-envelope text-secondary mr-3"></i>
              <span className="text-sm text-text">
                info@seetech.solutions
              </span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-phone text-secondary mr-3"></i>
              <span className="text-sm text-text">
                +91 XXX XXX XXXX
              </span>
            </div>
          </div>
        </div>

        {/* Report Information */}
        <div>
          <h4 className="text-lg font-semibold text-primary mb-4">
            Report Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <i className="fas fa-calendar text-secondary mr-3"></i>
              <span className="text-sm text-text">
                Report Date: {REPORT_DATE}
              </span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-user text-secondary mr-3"></i>
              <span className="text-sm text-text">
                Prepared By: {PREPARED_BY}
              </span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-file-alt text-secondary mr-3"></i>
              <span className="text-sm text-text">
                Document Type: Technical Proposal
              </span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-secondary mr-3"></i>
              <span className="text-sm text-text">
                Confidential & Proprietary
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-neutral rounded-lg p-4">
          <h5 className="text-sm font-semibold text-primary mb-2">
            <i className="fas fa-info-circle mr-2"></i>
            Important Notice
          </h5>
          <p className="text-xs text-mutedText leading-relaxed">
            This proposal is based on the information provided and current market conditions. 
            Actual performance may vary based on site-specific conditions, installation quality, 
            and operational practices. SEE-Tech Solutions reserves the right to modify specifications 
            and pricing without prior notice. All savings calculations are estimates based on 
            industry standards and actual usage patterns.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center">
        <p className="text-xs text-mutedText">
          © {new Date().getFullYear()} SEE-Tech Solutions Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
}

/**
 * Maintenance and Service Section
 */
export function MaintenanceSection({ 
  powerSavingPct, 
  annualMonetarySaving, 
  roiPeriod, 
  annualGhgSavingTonnes, 
  clientName 
}) {
  const serviceBenefits = [
    "Regular system inspection and monitoring",
    "Preventive maintenance to avoid breakdowns", 
    "Continuous optimization of system efficiency",
    "Early detection of potential issues",
    "Extended equipment lifespan",
    "Guaranteed energy savings"
  ];

  const serviceComponents = [
    "Visual inspection of all components",
    "Performance data analysis via IoT sensors",
    "Water quality testing (TDS < 200 ppm)",
    "Media condition assessment",
    "Control system verification",
    "Comprehensive reporting and documentation"
  ];

  const phases = [
    { phase: "1", title: "Assessment & Design", period: "2-3 weeks" },
    { phase: "2", title: "Procurement & Fabrication", period: "4-6 weeks" },
    { phase: "3", title: "Installation & Testing", period: "2-3 weeks" },
    { phase: "4", title: "Commissioning & Training", period: "1 week" },
    { phase: "5", title: "Performance Monitoring", period: "Ongoing" }
  ];

  return (
    <div className="document-section">
      <h2 className="section-header text-2xl font-bold mb-6">
        7. Monthly Maintenance Service & Conclusion
      </h2>
      
      {/* Introduction */}
      <div className="flex items-center mb-6">
        <i className="fas fa-tools text-secondary text-xl mr-3"></i>
        <p className="text-base leading-relaxed">
          Our commitment to your system's performance extends beyond installation with our comprehensive service program.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-primary mb-4">
        7.1 SEE-Tech Professional Maintenance Program
      </h3>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ServiceCard
          title="Service Benefits"
          icon="fa-star"
          iconColor={COLORS.primary}
          items={serviceBenefits}
        />
        <ServiceCard
          title="Service Components"
          icon="fa-cogs"
          iconColor={COLORS.secondary}
          items={serviceComponents}
        />
      </div>

      {/* Project Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-primary mb-4">
          7.2 Project Implementation Timeline
        </h3>
        <Timeline phases={phases} />
      </div>

      {/* Conclusion */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-primary mb-4">
          7.3 Project Conclusion
        </h3>
        <p className="text-text leading-relaxed mb-4">
          The proposed adiabatic cooling system for {clientName} represents a strategic investment 
          in energy efficiency and operational excellence. With a projected {powerSavingPct.toFixed(1)}% 
          reduction in power consumption and annual savings of {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
          }).format(annualMonetarySaving)}, this system will deliver significant financial benefits 
          while reducing environmental impact by {annualGhgSavingTonnes.toFixed(1)} tonnes of CO₂ annually.
        </p>
        <p className="text-text leading-relaxed">
          The simple payback period of {Math.floor(roiPeriod / 12)} years and {roiPeriod % 12} months, 
          combined with our comprehensive maintenance program, ensures long-term value creation and 
          operational reliability for your facility.
        </p>
      </div>
    </div>
  );
}

function ServiceCard({ title, icon, iconColor, items }) {
  return (
    <div className="bg-neutral rounded-lg p-6 shadow-card border border-gray-200">
      <div className="text-center mb-4">
        <div 
          className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          <i className={`fas ${icon} text-white text-lg`}></i>
        </div>
        <h4 className="text-base font-semibold text-primary border-b-2 border-accent pb-2">
          {title}
        </h4>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start">
            <i className="fas fa-check-circle text-accent text-xs mt-1 mr-2 flex-shrink-0"></i>
            <span className="text-sm text-text">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ phases }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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