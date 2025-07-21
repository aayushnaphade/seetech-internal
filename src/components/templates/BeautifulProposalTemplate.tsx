import React from 'react';
import { AdiabaticCoolingProposalData } from './adiabatic-cooling/types/index';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

interface BeautifulProposalTemplateProps {
  data: AdiabaticCoolingProposalData;
}

export default function BeautifulProposalTemplate({ data }: { data: AdiabaticCoolingProposalData }) {
  // Generate sample data for charts
  const energyConsumptionData = [
    { month: 'Jan', existing: 450, proposed: 290 },
    { month: 'Feb', existing: 420, proposed: 275 },
    { month: 'Mar', existing: 380, proposed: 250 },
    { month: 'Apr', existing: 340, proposed: 220 },
    { month: 'May', existing: 480, proposed: 310 },
    { month: 'Jun', existing: 620, proposed: 390 },
    { month: 'Jul', existing: 680, proposed: 430 },
    { month: 'Aug', existing: 660, proposed: 420 },
    { month: 'Sep', existing: 580, proposed: 370 },
    { month: 'Oct', existing: 440, proposed: 285 },
    { month: 'Nov', existing: 380, proposed: 250 },
    { month: 'Dec', existing: 420, proposed: 275 }
  ];

  const savingsBreakdown = [
    { name: 'Energy Savings', value: 40, color: '#0EA5E9' },
    { name: 'Maintenance Reduction', value: 25, color: '#06B6D4' },
    { name: 'Efficiency Gains', value: 20, color: '#14B8A6' },
    { name: 'Other Benefits', value: 15, color: '#10B981' }
  ];

  const performanceMetrics = [
    { parameter: 'Temperature', current: 85, target: 70, unit: '°F' },
    { parameter: 'Efficiency', current: 75, target: 92, unit: '%' },
    { parameter: 'Energy Use', current: 100, target: 65, unit: 'kW' },
    { parameter: 'Maintenance', current: 100, target: 40, unit: 'hrs/month' }
  ];

  const temperatureProfile = [
    { time: '00:00', ambient: 78, cooled: 65 },
    { time: '06:00', ambient: 75, cooled: 62 },
    { time: '12:00', ambient: 88, cooled: 68 },
    { time: '18:00', ambient: 85, cooled: 66 },
    { time: '24:00', ambient: 80, cooled: 64 }
  ];

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .beautiful-proposal {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          background: white;
          color: #1a202c;
          line-height: 1.6;
        }
        
        /* Title Page */
        .title-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          color: white;
          text-align: center;
          padding: 2rem;
        }
        
        .header-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(90deg, #0EA5E9 0%, #06B6D4 50%, #14B8A6 100%);
          display: flex;
          align-items: center;
          padding: 0 3rem;
        }
        
        .company-logo {
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }
        
        .main-title {
          font-size: 4rem;
          font-weight: 700;
          margin: 2rem 0;
          text-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .title-highlight {
          display: block;
          background: linear-gradient(90deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .proposal-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-top: 3rem;
          max-width: 800px;
        }
        
        .detail-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .detail-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #FFD700;
        }
        
        .title-footer {
          position: absolute;
          bottom: 2rem;
          left: 0;
          right: 0;
          text-align: center;
        }
        
        /* Section Styling */
        .section {
          padding: 4rem 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-header {
          position: relative;
          margin-bottom: 3rem;
        }
        
        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 1rem;
          position: relative;
          z-index: 2;
        }
        
        .section-gradient {
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
          height: 8px;
          background: linear-gradient(90deg, #0EA5E9 0%, #06B6D4 50%, #14B8A6 100%);
          border-radius: 4px;
          max-width: 200px;
        }
        
        /* Executive Summary */
        .executive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .summary-card {
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .summary-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .summary-card.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .summary-card.secondary {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }
        
        .summary-card.tertiary {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }
        
        .card-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .summary-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        /* Analysis Grid */
        .analysis-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        
        .chart-container {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid #f0f0f0;
        }
        
        .chart-container h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1a202c;
          text-align: center;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        /* Performance Metrics */
        .performance-metrics {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 3rem;
          border-radius: 20px;
          margin-top: 3rem;
        }
        
        .performance-metrics h3 {
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 2rem;
          text-align: center;
          color: #1a202c;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .metric-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .metric-card h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
          color: #1a202c;
        }
        
        .metric-bars {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .metric-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .metric-label {
          font-size: 0.875rem;
          font-weight: 500;
          min-width: 60px;
          color: #4a5568;
        }
        
        .bar-container {
          flex: 1;
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .bar-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.3s ease;
        }
        
        .current-fill {
          background: linear-gradient(90deg, #ef4444, #dc2626);
        }
        
        .target-fill {
          background: linear-gradient(90deg, #06b6d4, #0ea5e9);
        }
        
        .metric-value {
          font-size: 0.875rem;
          font-weight: 600;
          min-width: 80px;
          text-align: right;
          color: #1a202c;
        }
        
        /* Financial Grid */
        .financial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .financial-card {
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .financial-card.highlight {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .financial-card.success {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        
        .financial-card.primary {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .financial-card.secondary {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
        
        .financial-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .financial-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .financial-amount {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .roi-chart {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .roi-chart h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-align: center;
          color: #1a202c;
        }
        
        /* Timeline */
        .timeline {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to bottom, #0EA5E9, #06B6D4, #14B8A6, #10B981);
          transform: translateX(-50%);
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 4rem;
          display: flex;
          align-items: center;
        }
        
        .timeline-item:nth-child(odd) {
          flex-direction: row;
        }
        
        .timeline-item:nth-child(even) {
          flex-direction: row-reverse;
        }
        
        .timeline-marker {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          z-index: 2;
        }
        
        .timeline-marker.phase1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .timeline-marker.phase2 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .timeline-marker.phase3 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .timeline-marker.phase4 { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        
        .timeline-marker::before {
          content: '1';
        }
        
        .timeline-item:nth-child(2) .timeline-marker::before { content: '2'; }
        .timeline-item:nth-child(3) .timeline-marker::before { content: '3'; }
        .timeline-item:nth-child(4) .timeline-marker::before { content: '4'; }
        
        .timeline-content {
          flex: 1;
          max-width: 45%;
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid #f0f0f0;
        }
        
        .timeline-item:nth-child(odd) .timeline-content {
          margin-right: auto;
          margin-left: 0;
        }
        
        .timeline-item:nth-child(even) .timeline-content {
          margin-left: auto;
          margin-right: 0;
        }
        
        .timeline-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a202c;
        }
        
        .timeline-content ul {
          margin-top: 1rem;
          padding-left: 1.5rem;
        }
        
        .timeline-content li {
          margin-bottom: 0.5rem;
          color: #4a5568;
        }
        
        /* Environmental Section */
        .environmental-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 30px;
          margin: 3rem 0;
        }
        
        .environmental-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .environmental-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .env-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .env-value {
          font-size: 2rem;
          font-weight: 700;
          margin: 1rem 0;
          color: #FFD700;
        }
        
        /* Conclusion Section */
        .conclusion-section {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 30px;
          margin: 3rem 0;
        }
        
        .conclusion-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        
        .conclusion-text h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a202c;
        }
        
        .next-steps {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .next-steps h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a202c;
        }
        
        .next-steps ol {
          padding-left: 1.5rem;
        }
        
        .next-steps li {
          margin-bottom: 0.5rem;
          color: #4a5568;
        }
        
        .contact-cta {
          text-align: center;
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .contact-cta h3 {
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a202c;
        }
        
        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
        }
        
        .btn-secondary {
          background: transparent;
          color: #667eea;
          padding: 1rem 2rem;
          border: 2px solid #667eea;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .main-title {
            font-size: 2.5rem;
          }
          
          .proposal-details {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .analysis-grid {
            grid-template-columns: 1fr;
          }
          
          .timeline::before {
            left: 30px;
          }
          
          .timeline-item {
            flex-direction: row !important;
            padding-left: 60px;
          }
          
          .timeline-marker {
            left: 30px !important;
            transform: none !important;
          }
          
          .timeline-content {
            max-width: none !important;
            margin: 0 !important;
          }
          
          .conclusion-content {
            grid-template-columns: 1fr;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      <div className="beautiful-proposal">
        {/* Title Page */}
        <div className="title-page">
          <div className="header-gradient">
            <div className="company-logo">SeeTech</div>
          </div>
          
          <h1 className="main-title">
            Adiabatic Cooling System
            <span className="title-highlight">Proposal</span>
          </h1>
          
          <div className="proposal-details">
            <div className="detail-card">
              <h3>Project Details</h3>
              <p><strong>Client:</strong> {data.clientName}</p>
              <p><strong>Location:</strong> {data.location}</p>
              <p><strong>Date:</strong> {data.date}</p>
              <p><strong>Contact:</strong> {data.contactPerson}</p>
            </div>
            
            <div className="detail-card">
              <h3>System Overview</h3>
              <p><strong>Cooling Capacity:</strong> {data.systemCapacity} tons</p>
              <p><strong>Expected Savings:</strong> {data.expectedSaving}%</p>
              <p><strong>Payback Period:</strong> {data.paybackPeriod} years</p>
            </div>
          </div>
          
          <div className="title-footer">
            <div className="contact-info">
              <p>📧 {data.contactEmail}</p>
              <p>📞 {data.contactPhone}</p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="section">
          <div className="section-header">
            <h2>Executive Summary</h2>
            <div className="section-gradient"></div>
          </div>
          
          <div className="executive-grid">
            <div className="summary-card primary">
              <div className="card-icon">💡</div>
              <h3>Energy Efficiency Solution</h3>
              <p>Advanced adiabatic cooling technology designed to reduce energy consumption by up to 40% while maintaining optimal performance.</p>
            </div>
            
            <div className="summary-card secondary">
              <div className="card-icon">💰</div>
              <h3>Financial Benefits</h3>
              <p>Expected savings of {data.expectedSaving}% with a payback period of {data.paybackPeriod} years, providing excellent ROI of {data.roi}%.</p>
            </div>
            
            <div className="summary-card tertiary">
              <div className="card-icon">🌱</div>
              <h3>Environmental Impact</h3>
              <p>Significant reduction in carbon footprint through improved efficiency and reduced energy consumption.</p>
            </div>
          </div>
        </div>

        {/* Technical Analysis */}
        <div className="section">
          <div className="section-header">
            <h2>Technical Analysis</h2>
            <div className="section-gradient"></div>
          </div>
          
          <div className="analysis-grid">
            <div className="chart-container">
              <h3>Energy Consumption Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={energyConsumptionData}>
                  <defs>
                    <linearGradient id="colorExisting" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorProposed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="existing"
                    stroke="#EF4444"
                    fillOpacity={1}
                    fill="url(#colorExisting)"
                    strokeWidth={3}
                    name="Existing System (kW)"
                  />
                  <Area
                    type="monotone"
                    dataKey="proposed"
                    stroke="#06B6D4"
                    fillOpacity={1}
                    fill="url(#colorProposed)"
                    strokeWidth={3}
                    name="Proposed System (kW)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <h3>Savings Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={savingsBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {savingsBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="performance-metrics">
            <h3>Performance Comparison</h3>
            <div className="metrics-grid">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="metric-card">
                  <h4>{metric.parameter}</h4>
                  <div className="metric-bars">
                    <div className="metric-bar current">
                      <span className="metric-label">Current</span>
                      <div className="bar-container">
                        <div 
                          className="bar-fill current-fill" 
                          style={{ width: `${(metric.current / Math.max(metric.current, metric.target)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="metric-value">{metric.current} {metric.unit}</span>
                    </div>
                    <div className="metric-bar target">
                      <span className="metric-label">Target</span>
                      <div className="bar-container">
                        <div 
                          className="bar-fill target-fill" 
                          style={{ width: `${(metric.target / Math.max(metric.current, metric.target)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="metric-value">{metric.target} {metric.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Temperature Profile */}
        <div className="section">
          <div className="section-header">
            <h2>Temperature Performance Profile</h2>
            <div className="section-gradient"></div>
          </div>
          
          <div className="chart-container full-width">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={temperatureProfile}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#6B7280" />
                <YAxis stroke="#6B7280" label={{ value: 'Temperature (°F)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ambient" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                  name="Ambient Temperature"
                />
                <Line 
                  type="monotone" 
                  dataKey="cooled" 
                  stroke="url(#temperatureGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
                  name="Adiabatic Cooled Temperature"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Analysis */}
        <div className="section">
          <div className="section-header">
            <h2>Financial Analysis</h2>
            <div className="section-gradient"></div>
          </div>
          
          <div className="financial-grid">
            <div className="financial-card highlight">
              <div className="financial-icon">💵</div>
              <h3>Total Investment</h3>
              <div className="financial-amount">{data.investmentCost}</div>
              <p>Complete system implementation</p>
            </div>
            
            <div className="financial-card success">
              <div className="financial-icon">📈</div>
              <h3>Expected Savings</h3>
              <div className="financial-amount">{data.expectedSaving}%</div>
              <p>Energy efficiency improvement</p>
            </div>
            
            <div className="financial-card primary">
              <div className="financial-icon">⏱️</div>
              <h3>Payback Period</h3>
              <div className="financial-amount">{data.paybackPeriod} years</div>
              <p>Return on investment</p>
            </div>
            
            <div className="financial-card secondary">
              <div className="financial-icon">💰</div>
              <h3>ROI</h3>
              <div className="financial-amount">{data.roi}%</div>
              <p>Total projected savings</p>
            </div>
          </div>
          
          <div className="roi-chart">
            <h3>Return on Investment Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { year: 'Year 1', investment: parseFloat(data.investmentCost.replace(/[^\d.-]/g, '')) || 100000, efficiency: 75 },
                { year: 'Year 2', investment: 0, efficiency: 85 },
                { year: 'Year 3', investment: 0, efficiency: 90 },
                { year: 'Year 4', investment: 0, efficiency: 92 },
                { year: 'Year 5', investment: 0, efficiency: 95 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="efficiency" fill="url(#efficiencyGradient)" name="System Efficiency %" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Implementation Plan */}
        <div className="section">
          <div className="section-header">
            <h2>Implementation Plan</h2>
            <div className="section-gradient"></div>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker phase1"></div>
              <div className="timeline-content">
                <h3>Phase 1: Assessment & Design</h3>
                <p>Complete site assessment and detailed system design (2-3 weeks)</p>
                <ul>
                  <li>Site survey and measurements</li>
                  <li>Engineering calculations</li>
                  <li>Custom system design</li>
                </ul>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker phase2"></div>
              <div className="timeline-content">
                <h3>Phase 2: Procurement & Preparation</h3>
                <p>Equipment procurement and preparation (3-4 weeks)</p>
                <ul>
                  <li>Equipment ordering</li>
                  <li>Permits and approvals</li>
                  <li>Pre-installation setup</li>
                </ul>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker phase3"></div>
              <div className="timeline-content">
                <h3>Phase 3: Installation</h3>
                <p>System installation and integration (1-2 weeks)</p>
                <ul>
                  <li>Equipment installation</li>
                  <li>System integration</li>
                  <li>Testing and commissioning</li>
                </ul>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker phase4"></div>
              <div className="timeline-content">
                <h3>Phase 4: Optimization & Training</h3>
                <p>System optimization and staff training (1 week)</p>
                <ul>
                  <li>Performance optimization</li>
                  <li>Staff training</li>
                  <li>Documentation handover</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="section environmental-section">
          <div className="section-header">
            <h2>Environmental Impact</h2>
            <div className="section-gradient"></div>
          </div>
          
          <div className="environmental-grid">
            <div className="environmental-card">
              <div className="env-icon">🌍</div>
              <h3>CO₂ Reduction</h3>
              <div className="env-value">2,400 tons/year</div>
              <p>Equivalent to removing 520 cars from the road</p>
            </div>
            
            <div className="environmental-card">
              <div className="env-icon">⚡</div>
              <h3>Energy Savings</h3>
              <div className="env-value">40% reduction</div>
              <p>Significant decrease in energy consumption</p>
            </div>
            
            <div className="environmental-card">
              <div className="env-icon">💧</div>
              <h3>Water Efficiency</h3>
              <div className="env-value">25% less usage</div>
              <p>Optimized water consumption through advanced controls</p>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="section conclusion-section">
          <div className="section-header">
            <h2>Conclusion & Next Steps</h2>
            <div className="section-gradient"></div>
          </div>
          
          <div className="conclusion-content">
            <div className="conclusion-text">
              <h3>Investment Summary</h3>
              <p>
                The proposed adiabatic cooling system represents an excellent opportunity to achieve significant 
                energy savings while improving overall system performance. With a payback period of just 
                {data.paybackPeriod} years and annual savings of ₹{data.expectedSaving?.toLocaleString()}, 
                this investment will provide substantial financial returns and environmental benefits.
              </p>
              
              <h3>Recommended Action</h3>
              <p>
                We recommend proceeding with the implementation of this adiabatic cooling solution to realize 
                immediate energy savings and long-term operational benefits. Our team is ready to begin the 
                implementation process and ensure a smooth transition to the new system.
              </p>
            </div>
            
            <div className="next-steps">
              <h3>Next Steps</h3>
              <ol>
                <li>Review and approve the proposal</li>
                <li>Schedule detailed site assessment</li>
                <li>Finalize system specifications</li>
                <li>Begin procurement process</li>
                <li>Schedule installation timeline</li>
              </ol>
            </div>
          </div>
          
          <div className="contact-cta">
            <h3>Ready to Get Started?</h3>
            <p>Contact us today to discuss your adiabatic cooling project</p>
            <div className="cta-buttons">
              <button className="btn-primary">Schedule Consultation</button>
              <button className="btn-secondary">Request Quote</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
