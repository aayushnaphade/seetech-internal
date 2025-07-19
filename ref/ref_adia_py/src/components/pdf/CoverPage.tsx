import React from 'react';
import { COLORS } from '../../lib/constants/seedData';

interface CoverPageProps {
  clientName: string;
  projectLocation: string;
  date: string;
  logoUrl: string;
}

/**
 * Cover page for the proposal PDF
 * Displays project title, client name, location, date, and logo
 */
const CoverPage: React.FC<CoverPageProps> = ({
  clientName,
  projectLocation,
  date,
  logoUrl
}) => {
  return (
    <div className="avoid-break a4-section flex flex-col h-full">
      {/* Logo */}
      <div className="flex justify-end">
        <img
          src={logoUrl}
          alt="Company Logo"
          className="w-48 h-auto"
        />
      </div>

      {/* Main content - centered */}
      <div className="flex flex-col justify-center items-center flex-grow text-center">
        <h1 
          className="text-4xl font-bold mb-10 text-center" 
          style={{ color: COLORS.primary }}
        >
          Adiabatic Cooling System Proposal
        </h1>
        
        <div className="mb-8 mt-8">
          <h2 className="text-3xl font-bold" style={{ color: COLORS.secondary }}>
            {clientName}
          </h2>
          <p className="text-xl mt-2">{projectLocation}</p>
        </div>
        
        <div 
          className="p-8 rounded-lg w-2/3 mt-8" 
          style={{ 
            backgroundColor: COLORS.neutral,
            border: COLORS.pdf_friendly.card_border 
          }}
        >
          <p className="text-lg mb-2">Prepared For:</p>
          <p className="text-xl font-bold">{clientName}</p>
          <p className="text-lg">{projectLocation}</p>
        </div>
      </div>
      
      {/* Footer with date */}
      <div className="text-center mt-16">
        <p className="text-lg">{date}</p>
      </div>
    </div>
  );
};

export default CoverPage;
