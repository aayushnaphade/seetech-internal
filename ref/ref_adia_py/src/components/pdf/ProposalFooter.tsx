import React from 'react';

interface ProposalFooterProps {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
}

/**
 * ProposalFooter component for the PDF report
 * Displays contact information and closing notes
 */
const ProposalFooter: React.FC<ProposalFooterProps> = ({
  companyName,
  contactEmail,
  contactPhone,
  logoUrl
}) => {
  return (
    <div className="avoid-break a4-section">
      <h2 className="text-2xl font-bold mb-6 text-primary">Next Steps</h2>
      
      <p className="mb-4">
        Thank you for considering our proposal for implementing an adiabatic cooling solution at your facility.
        We believe this solution offers significant benefits in terms of energy efficiency, cost savings, and 
        environmental sustainability.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4 text-secondary">Implementation Timeline</h3>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="w-1/4 font-medium">Week 1-2:</div>
            <div className="w-3/4">Detailed site assessment and final design approval</div>
          </div>
          
          <div className="flex">
            <div className="w-1/4 font-medium">Week 3-4:</div>
            <div className="w-3/4">Equipment procurement and pre-installation preparation</div>
          </div>
          
          <div className="flex">
            <div className="w-1/4 font-medium">Week 5-6:</div>
            <div className="w-3/4">Installation and integration with existing systems</div>
          </div>
          
          <div className="flex">
            <div className="w-1/4 font-medium">Week 7:</div>
            <div className="w-3/4">System commissioning and performance testing</div>
          </div>
          
          <div className="flex">
            <div className="w-1/4 font-medium">Week 8:</div>
            <div className="w-3/4">Training and handover</div>
          </div>
          
          <div className="flex">
            <div className="w-1/4 font-medium">Ongoing:</div>
            <div className="w-3/4">Periodic maintenance and performance monitoring</div>
          </div>
        </div>
      </div>
      
      <p className="mb-8">
        To proceed with this project, please contact us to schedule a detailed site assessment and finalize 
        the implementation plan. We look forward to partnering with you to enhance your facility's energy 
        efficiency and sustainability.
      </p>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-2">{companyName}</h3>
          <p className="text-gray-700">Email: {contactEmail}</p>
          <p className="text-gray-700">Phone: {contactPhone}</p>
        </div>
        
        <img 
          src={logoUrl} 
          alt={`${companyName} Logo`} 
          className="w-32 h-auto"
        />
      </div>
    </div>
  );
};

export default ProposalFooter;
