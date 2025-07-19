import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/db/prisma';

// Import PDF components
import CoverPage from '../../components/pdf/CoverPage';
import ExecutiveSummary from '../../components/pdf/ExecutiveSummary';
import SystemDescription from '../../components/pdf/SystemDescription';
import ChartSection from '../../components/pdf/ChartSection';
import PHChartBlock from '../../components/pdf/PHChartBlock';
import MaintenanceAndROI from '../../components/pdf/MaintenanceAndROI';
import ProposalFooter from '../../components/pdf/ProposalFooter';

// Import types
import { ProjectConstants, CalculationResults } from '../../lib/calc/businessLogic';

// Styles are imported in _app.tsx

interface PDFPreviewProps {
  project: any;
  client: any;
  constants: any;
  results: CalculationResults | null;
}

export default function PDFPreview({ project, client, constants, results }: PDFPreviewProps) {
  const router = useRouter();
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(results);
  const [phChartData, setPhChartData] = useState<any>(null);
  const [loading, setLoading] = useState(!results);

  useEffect(() => {
    async function fetchData() {
      if (!results) {
        setLoading(true);
        
        // Fetch calculation results
        const calculationRes = await fetch(`/api/tools/adiabatic`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: project.id })
        });
        
        if (calculationRes.ok) {
          const data = await calculationRes.json();
          setCalculationResults(data);
        } else {
          console.error('Failed to fetch calculation results');
        }
      }
      
      // Fetch PH chart data
      const phChartRes = await fetch('/api/tools/ph-chart');
      if (phChartRes.ok) {
        const data = await phChartRes.json();
        setPhChartData(data);
      } else {
        console.error('Failed to fetch PH chart data');
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, [project.id, results]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold">Loading PDF Preview...</h2>
          <p>Calculating results and preparing document.</p>
        </div>
      </div>
    );
  }

  if (!calculationResults) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p>Failed to generate calculation results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-preview">
      {/* Controls for PDF export - only visible on screen */}
      <div className="print-controls">
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Print / Save as PDF
        </button>
        
        <button 
          onClick={() => router.back()}
          className="ml-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>
      
      {/* PDF Content */}
      <div className="pdf-document">
        {/* Cover Page */}
        <div className="a4-page-container">
          <CoverPage
            clientName={constants.clientName}
            projectLocation={constants.clientLocation}
            date={new Date(constants.reportDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            logoUrl="/public/seetech_logo.jpeg"
          />
        </div>
        
        {/* Executive Summary */}
        <div className="a4-page-container">
          <ExecutiveSummary
            summaryText={`This proposal outlines a comprehensive solution for optimizing the air-cooled chiller system at ${constants.clientName}. By implementing an adiabatic cooling system, we aim to reduce condenser temperature by ${calculationResults.tempReductionText}, improving COP and delivering significant energy savings.`}
            keySavings={{
              annual: calculationResults.annualMonerarySaving,
              energy: calculationResults.annualEnergySavingKWh,
              roi: calculationResults.roiPeriod
            }}
            copComparisons={{
              actual: constants.copActual || 2.6,
              optimized: constants.copOptimized || 4.3
            }}
          />
        </div>
        
        {/* System Description */}
        <div className="a4-page-container">
          <SystemDescription
            initialPower={constants.initialPowerKW}
            operatingHours={constants.operatingHours}
            chillerType={constants.chillerType}
            problemAreas={{
              efficiency: `The ${constants.chillerCapacityTR} TR ${constants.chillerType} chiller system is currently operating at a reduced efficiency with COP of ${constants.copActual || 2.6} compared to the OEM designed COP of ${constants.copOem || 2.87}.`,
              temperature: `High condenser temperatures are reducing system efficiency and increasing power consumption by approximately ${calculationResults.powerSavingPct}%.`,
              maintenance: "Elevated condensing temperatures increase wear on system components and reduce equipment lifespan."
            }}
          />
        </div>
        
        {/* Chart Section */}
        <div className="a4-page-container">
          <ChartSection
            powerData={{
              before: constants.actualPowerKW,
              after: constants.actualPowerKW * (1 - calculationResults.powerSavingPct/100),
              savings: constants.actualPowerKW * (calculationResults.powerSavingPct/100)
            }}
            tempData={{
              before: constants.tempReductionC ? (constants.tempReductionC + 36.0) : 44.1,
              after: 36.0
            }}
          />
        </div>
        
        {/* P-H Chart Block */}
        {phChartData && (
          <div className="a4-page-container">
            <PHChartBlock
              phChartData={phChartData}
            />
          </div>
        )}
        
        {/* Maintenance and ROI */}
        <div className="a4-page-container">
          <MaintenanceAndROI
            maintenanceItems={{
              water: "Regular monitoring and maintenance of water quality and TDS levels",
              inspection: "Quarterly inspection of media pads and water distribution system",
              cleaning: "Semi-annual cleaning of water nozzles and filters"
            }}
            annualSaving={calculationResults.netAnnualSavings}
            roiYears={calculationResults.roiPeriod}
            ghgSavings={calculationResults.annualGhgSavingTonnes}
          />
        </div>
        
        {/* Footer on last page */}
        <div className="a4-page-container">
          <ProposalFooter
            footerText="This proposal is valid for 60 days from the date of issue. All values presented are based on measured data and industry-standard calculation methodologies."
            preparedBy={constants.preparedBy}
          />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  
  if (!id || Array.isArray(id)) {
    return {
      notFound: true
    };
  }
  
  try {
    const projectId = parseInt(id, 10);
    
    // Get project, client and constants
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      return { notFound: true };
    }
    
    const client = await prisma.client.findUnique({
      where: { id: project.clientId }
    });
    
    const constants = await prisma.projectConstants.findUnique({
      where: { projectId }
    });
    
    // Get latest tool result if available
    const latestResult = await prisma.toolResult.findFirst({
      where: { 
        projectId,
        toolType: 'adiabatic_cooling'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    let results = null;
    if (latestResult) {
      results = JSON.parse(latestResult.outputs);
    }
    
    return {
      props: {
        project: JSON.parse(JSON.stringify(project)),
        client: JSON.parse(JSON.stringify(client)),
        constants: JSON.parse(JSON.stringify(constants)),
        results
      }
    };
  } catch (error) {
    console.error('Error fetching project data:', error);
    return {
      notFound: true
    };
  }
};
