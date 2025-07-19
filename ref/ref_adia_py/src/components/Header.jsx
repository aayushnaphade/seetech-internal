/**
 * Header component for the proposal
 */

import React from 'react';
import { COLORS, CLIENT_NAME, CLIENT_LOCATION, CHILLER_CAPACITY_TR } from '../utils/constants.js';

export function Header({ onPrint }) {
  return (
    <div className="text-center mb-8 pt-4">
      {/* Logo and Print Button */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-shrink-0">
          <img 
            src="/seetech_logo.jpeg" 
            alt="SEE-Tech Logo" 
            className="h-32 object-contain"
          />
        </div>
        <button 
          onClick={onPrint}
          className="print-control px-6 py-3 text-white rounded-lg font-medium text-sm shadow-lg transition-all duration-300 hover:shadow-xl"
          style={{
            backgroundColor: COLORS.primary,
            boxShadow: '0 2px 8px rgba(26, 82, 118, 0.3)'
          }}
        >
          Print Report
        </button>
      </div>

      {/* Title Section */}
      <div className="mb-8">
        <h1 
          className="text-4xl font-bold mb-3"
          style={{
            color: COLORS.primary,
            letterSpacing: '-0.02em',
            textShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          Adiabatic Cooling System
        </h1>
        <h2 
          className="text-2xl font-medium mb-4"
          style={{
            color: COLORS.secondary,
            letterSpacing: '-0.01em'
          }}
        >
          for {CHILLER_CAPACITY_TR} TR
        </h2>
        
        {/* Gradient Bar */}
        <div 
          className="w-20 h-1 mx-auto mb-4 rounded-full"
          style={{
            background: `linear-gradient(to right, ${COLORS.accentGradientStart}, ${COLORS.accentGradientEnd})`
          }}
        ></div>
        
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: COLORS.text }}
        >
          {CLIENT_NAME}
        </h3>
        <h3 
          className="text-lg font-normal"
          style={{ color: COLORS.mutedText }}
        >
          {CLIENT_LOCATION}
        </h3>
      </div>

      {/* Technology Section */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <div 
            className="inline-block px-3 py-1 rounded-full mb-3"
            style={{
              background: `linear-gradient(135deg, ${COLORS.accentGradientStart}, ${COLORS.accentGradientEnd})`,
              boxShadow: '0 2px 6px rgba(46, 147, 110, 0.2)'
            }}
          >
            <span className="text-white text-xs font-semibold tracking-wide">
              INTELLIGENT SOLUTION
            </span>
          </div>
          <h4 
            className="text-xl font-semibold mb-2"
            style={{ color: COLORS.primary }}
          >
            Powered by Advanced Technology
          </h4>
          <p 
            className="text-sm max-w-lg mx-auto leading-relaxed"
            style={{ color: COLORS.mutedText }}
          >
            Harnessing cutting-edge engineering and smart systems to optimize efficiency
          </p>
        </div>

        {/* Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TechnologyCard 
            title="Digital Twin Technology"
            description="Real-time virtual replica of your cooling system enabling predictive maintenance, performance optimization, and continuous monitoring for maximum efficiency."
            icon="fa-project-diagram"
            gradient={`linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`}
          />
          <TechnologyCard 
            title="IoT-Enabled Monitoring"
            description="Smart sensors and connectivity providing 24/7 system monitoring, automated alerts, and data-driven insights for proactive maintenance and optimal performance."
            icon="fa-wifi"
            gradient={`linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.accent})`}
          />
        </div>
      </div>
    </div>
  );
}

function TechnologyCard({ title, description, icon, gradient }) {
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