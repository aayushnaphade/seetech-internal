"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, Building2, Calculator, Download, Eye, Save, Share2, Printer, FileDown } from "lucide-react";
import Link from "next/link";
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

// Enhanced modern professional styles matching the Python version
const proposalStyles = `
  .proposal-container {
    font-family: 'Arial', sans-serif;
    max-width: 21cm;
    margin: 0 auto;
    background: white;
    color: #2D3B45;
    line-height: 1.6;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
  }
  
  .a4-page-container {
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto 20px;
    padding: 20mm;
    background: white;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    page-break-after: always;
  }
  
  .cover-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 25cm;
    text-align: center;
    background: linear-gradient(135deg, #0A435C 0%, #1D7AA3 100%);
    color: white;
    position: relative;
    overflow: hidden;
  }
  
  .cover-page::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
  
  .cover-content {
    position: relative;
    z-index: 1;
  }
  
  .company-logo {
    margin-bottom: 40px;
    filter: brightness(0) invert(1);
  }
  
  .main-title {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 15px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    letter-spacing: -0.02em;
  }
  
  .subtitle {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 30px;
    opacity: 0.9;
  }
  
  .gradient-bar {
    width: 100px;
    height: 4px;
    background: linear-gradient(to right, #2E936E, #7CDBD5);
    margin: 20px auto;
    border-radius: 2px;
  }
  
  .client-info {
    font-size: 22px;
    font-weight: 600;
    margin: 20px 0;
  }
  
  .client-location {
    font-size: 18px;
    font-weight: 400;
    opacity: 0.8;
  }
  
  .tech-badge {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    margin: 10px 5px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
  }
  
  .section-header {
    font-size: 24px;
    color: #0A435C;
    margin-bottom: 20px;
    font-weight: 600;
    border-bottom: 2px solid #1D7AA3;
    padding-bottom: 8px;
  }
  
  .executive-summary {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 20px;
    color: #2D3B45;
  }
  
  .key-benefits {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }
  
  .benefit-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    border-left: 4px solid #2E936E;
  }
  
  .benefit-icon {
    font-size: 24px;
    color: #2E936E;
    margin-bottom: 10px;
  }
  
  .benefit-title {
    font-size: 18px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 8px;
  }
  
  .benefit-description {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 30px 0;
  }
  
  .stat-card {
    background: linear-gradient(135deg, #0A435C, #1D7AA3);
    color: white;
    padding: 25px;
    border-radius: 10px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 5px;
    position: relative;
    z-index: 1;
  }
  
  .stat-label {
    font-size: 14px;
    opacity: 0.9;
    position: relative;
    z-index: 1;
  }
  
  .professional-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .professional-table th {
    background: linear-gradient(135deg, #0A435C, #1D7AA3);
    color: white;
    padding: 15px;
    font-weight: 600;
    text-align: left;
    font-size: 14px;
    letter-spacing: 0.5px;
  }
  
  .professional-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #E5E7EB;
    color: #2D3B45;
  }
  
  .professional-table tr:nth-child(even) {
    background: #F8FAFC;
  }
  
  .professional-table tr:hover {
    background: #EBF8FF;
  }
  
  .timeline-section {
    margin: 30px 0;
  }
  
  .timeline-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .timeline-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #2E936E, #7CDBD5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    margin-right: 15px;
    font-size: 14px;
  }
  
  .timeline-content {
    flex: 1;
  }
  
  .timeline-title {
    font-size: 16px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 5px;
  }
  
  .timeline-description {
    font-size: 14px;
    color: #666;
  }
  
  .print-controls {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    gap: 10px;
  }
  
  .print-button {
    background: linear-gradient(135deg, #0A435C, #1D7AA3);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(10, 67, 92, 0.3);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .print-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(10, 67, 92, 0.4);
  }
  
  .document-footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #E5E7EB;
    text-align: center;
    color: #666;
    font-size: 12px;
  }
  
  @media print {
    .print-controls {
      display: none;
    }
    
    .a4-page-container {
      box-shadow: none;
      margin: 0;
      page-break-after: always;
    }
    
    .cover-page {
      page-break-after: always;
    }
    
    body {
      margin: 0;
      padding: 0;
      background: white;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      print-color-adjust: exact;
    }
  }
  
  @page {
    size: A4;
    margin: 0;
  }
`;

// Component state and form data
interface FormData {
  clientName: string;
  clientLocation: string;
  projectDate: string;
  chillerCapacity: string;
  chillerType: string;
  currentPower: string;
  expectedSaving: string;
  electricityRate: string;
  waterCost: string;
  projectCost: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export default function ProposalGenerator() {
  const [activeTab, setActiveTab] = useState("inputs");
  const proposalRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    clientName: "Ashirwad Pipes",
    clientLocation: "Plot 26, Attibele Industrial Area",
    projectDate: "July 18, 2025",
    chillerCapacity: "255",
    chillerType: "Air-Cooled",
    currentPower: "210.0",
    expectedSaving: "20",
    electricityRate: "6.5",
    waterCost: "45.0",
    projectCost: "11,50,000",
    contactPerson: "Project Manager",
    contactEmail: "contact@seetech.com",
    contactPhone: "+91 9876543210"
  });
  
  // Using react-to-print hook for reliable printing
  const handlePrint = useReactToPrint({
    contentRef: proposalRef,
    documentTitle: `${formData.clientName}_Adiabatic_Cooling_Proposal`,
    onAfterPrint: () => {
      console.log("Print completed successfully");
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateProposal = () => {
    console.log("Generating proposal with data:", formData);
    setActiveTab("proposal");
    // Here you would implement the actual proposal generation logic
  };
  
  // Function to generate PDF using jsPDF
  const generatePDF = useCallback(async () => {
    if (proposalRef.current) {
      const proposalElement = proposalRef.current;
      
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10; // Margin in mm
        
        // Create a canvas from the HTML element with better configuration
        const canvas = await html2canvas(proposalElement, {
          scale: 1.5, // Reduced scale for better compatibility
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          removeContainer: true,
          foreignObjectRendering: false, // Disable for better compatibility
          windowWidth: proposalElement.scrollWidth,
          windowHeight: proposalElement.scrollHeight
        });
        
        // Calculate the number of pages needed
        const imgWidth = pdfWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/png', 0.8); // Reduced quality for smaller file size
        
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - (margin * 2));
        position = heightLeft - imgHeight; // Negative value
        
        // Add additional pages if content doesn't fit on one page
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          heightLeft -= (pdfHeight - (margin * 2));
          position -= (pdfHeight - (margin * 2)); // Move upward for next page
        }
        
        pdf.save(`${formData.clientName}_Adiabatic_Cooling_Proposal.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        // Fallback to browser print
        alert("PDF generation failed. Please try using the Print button instead.");
      }
    }
  }, [formData.clientName]);

  return (
    <div className="min-h-screen bg-background">
      <style dangerouslySetInnerHTML={{ __html: proposalStyles }} />
      {/* Header */}
      <header className="border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Adiabatic Cooling Proposal Generator</h1>
              <Badge variant="outline">v1.0</Badge>
            </div>
          </div>
          <div className="mt-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/tools">Engineering Tools</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Adiabatic Cooling Proposal</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Adiabatic Cooling System Proposal Generator</h2>
            <p className="text-muted-foreground">
              Create professional proposals for adiabatic cooling system implementations
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-[400px] mb-6">
              <TabsTrigger value="inputs">Input Parameters</TabsTrigger>
              <TabsTrigger value="proposal">Generated Proposal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inputs" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                    <CardDescription>
                      Enter the client and project details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                        placeholder="e.g., Ashirwad Pipes"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        value={formData.projectName}
                        onChange={(e) => handleInputChange("projectName", e.target.value)}
                        placeholder="e.g., Adiabatic Cooling System Implementation"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="systemCapacity">Chiller Capacity (TR)</Label>
                        <Input
                          id="systemCapacity"
                          value={formData.systemCapacity}
                          onChange={(e) => handleInputChange("systemCapacity", e.target.value)}
                          placeholder="e.g., 255"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chillerType">Chiller Type</Label>
                        <Select 
                          value={formData.chillerType} 
                          onValueChange={(value) => handleInputChange("chillerType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select chiller type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="air-cooled">Air-cooled</SelectItem>
                            <SelectItem value="water-cooled">Water-cooled</SelectItem>
                            <SelectItem value="screw">Screw</SelectItem>
                            <SelectItem value="centrifugal">Centrifugal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technical Parameters</CardTitle>
                    <CardDescription>
                      Enter the technical and performance data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPower">Current Power (kW)</Label>
                        <Input
                          id="currentPower"
                          value={formData.currentPower}
                          onChange={(e) => handleInputChange("currentPower", e.target.value)}
                          placeholder="e.g., 210.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proposedPower">Proposed Power (kW)</Label>
                        <Input
                          id="proposedPower"
                          value={formData.proposedPower}
                          onChange={(e) => handleInputChange("proposedPower", e.target.value)}
                          placeholder="e.g., 168.0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="condTempBefore">Condenser Temp Before (°C)</Label>
                        <Input
                          id="condTempBefore"
                          value={formData.condTempBefore}
                          onChange={(e) => handleInputChange("condTempBefore", e.target.value)}
                          placeholder="e.g., 47.7"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="condTempAfter">Condenser Temp After (°C)</Label>
                        <Input
                          id="condTempAfter"
                          value={formData.condTempAfter}
                          onChange={(e) => handleInputChange("condTempAfter", e.target.value)}
                          placeholder="e.g., 36.0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="copBefore">COP Before</Label>
                        <Input
                          id="copBefore"
                          value={formData.copBefore}
                          onChange={(e) => handleInputChange("copBefore", e.target.value)}
                          placeholder="e.g., 2.60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="copAfter">COP After</Label>
                        <Input
                          id="copAfter"
                          value={formData.copAfter}
                          onChange={(e) => handleInputChange("copAfter", e.target.value)}
                          placeholder="e.g., 4.30"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Impact</CardTitle>
                    <CardDescription>
                      Enter the financial metrics and savings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="savingsPercent">Energy Savings (%)</Label>
                        <Input
                          id="savingsPercent"
                          value={formData.savingsPercent}
                          onChange={(e) => handleInputChange("savingsPercent", e.target.value)}
                          placeholder="e.g., 20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annualEnergySavings">Annual Energy Savings (kWh)</Label>
                        <Input
                          id="annualEnergySavings"
                          value={formData.annualEnergySavings}
                          onChange={(e) => handleInputChange("annualEnergySavings", e.target.value)}
                          placeholder="e.g., 322,560"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="annualCostSavings">Annual Cost Savings (₹)</Label>
                        <Input
                          id="annualCostSavings"
                          value={formData.annualCostSavings}
                          onChange={(e) => handleInputChange("annualCostSavings", e.target.value)}
                          placeholder="e.g., 20,96,640"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="investmentCost">Project Cost (₹)</Label>
                        <Input
                          id="investmentCost"
                          value={formData.investmentCost}
                          onChange={(e) => handleInputChange("investmentCost", e.target.value)}
                          placeholder="e.g., 11,50,000"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paybackPeriod">Simple Payback (months)</Label>
                        <Input
                          id="paybackPeriod"
                          value={formData.paybackPeriod}
                          onChange={(e) => handleInputChange("paybackPeriod", e.target.value)}
                          placeholder="e.g., 7"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="npvValue">NPV (15 Years) (₹)</Label>
                        <Input
                          id="npvValue"
                          value={formData.npvValue}
                          onChange={(e) => handleInputChange("npvValue", e.target.value)}
                          placeholder="e.g., 1,96,69,670"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Environmental Impact</CardTitle>
                    <CardDescription>
                      Enter the environmental impact metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="waterConsumption">Water Consumption (m³/year)</Label>
                        <Input
                          id="waterConsumption"
                          value={formData.waterConsumption}
                          onChange={(e) => handleInputChange("waterConsumption", e.target.value)}
                          placeholder="e.g., 4,915.2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="co2Reduction">CO₂ Reduction (tonnes/year)</Label>
                        <Input
                          id="co2Reduction"
                          value={formData.co2Reduction}
                          onChange={(e) => handleInputChange("co2Reduction", e.target.value)}
                          placeholder="e.g., 264.5"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe the adiabatic cooling system implementation and expected benefits..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
            <TabsContent value="proposal" className="space-y-6">
              <div ref={proposalRef} className="proposal-container">
                <style dangerouslySetInnerHTML={{ __html: proposalStyles }} />
                
                {/* Cover Page */}
                <div className="a4-page-container">
                  <div className="cover-page">
                    <div className="cover-content">
                      <div className="company-logo">
                        <Building2 size={60} />
                      </div>
                      <h1 className="main-title">Adiabatic Cooling System</h1>
                      <h2 className="subtitle">for {formData.chillerCapacity} TR Air-Cooled Chiller</h2>
                      <div className="gradient-bar"></div>
                      <div className="client-info">{formData.clientName}</div>
                      <div className="client-location">{formData.clientLocation}</div>
                      
                      <div style={{ margin: '40px 0' }}>
                        <span className="tech-badge">Digital Twin Technology</span>
                        <span className="tech-badge">IoT Enabled</span>
                        <span className="tech-badge">Energy Efficient</span>
                      </div>
                      
                      <div style={{ marginTop: '60px', fontSize: '14px', opacity: '0.8' }}>
                        <p>Prepared for: {formData.clientName}</p>
                        <p>Date: {formData.projectDate}</p>
                        <p>Prepared by: SEE-Tech Solutions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Executive Summary Page */}
                <div className="a4-page-container">
                  <h2 className="section-header">1. Executive Summary</h2>
                  
                  <div className="executive-summary">
                    <p>
                      <strong>{formData.clientName}'s {formData.chillerCapacity} TR {formData.chillerType} chiller</strong> currently operates with an average power consumption of <strong>{formData.currentPower} kW</strong>. Our analysis using digital twin technology reveals an opportunity to substantially reduce energy consumption through <strong>adiabatic cooling</strong> technology.
                    </p>
                    
                    <p>
                      Our proposal recommends installing an SEE-Tech Adiabatic Cooling System to achieve <strong>{formData.expectedSaving}% power reduction</strong>. Our digital twin technology has validated these projections through detailed simulation of your specific system, and our IoT-enabled monitoring will ensure continuous optimization and verification of savings.
                    </p>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-value">{formData.expectedSaving}%</div>
                      <div className="stat-label">Power Reduction</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">₹{(parseFloat(formData.currentPower) * 8760 * 0.2 * parseFloat(formData.electricityRate) / 100000).toFixed(1)}L</div>
                      <div className="stat-label">Annual Savings</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{Math.round(parseFloat(formData.projectCost.replace(/,/g, '')) / (parseFloat(formData.currentPower) * 8760 * 0.2 * parseFloat(formData.electricityRate) / 100000) / 12)}</div>
                      <div className="stat-label">Payback (Months)</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{(parseFloat(formData.currentPower) * 8760 * 0.2 * 0.82 / 1000).toFixed(1)}</div>
                      <div className="stat-label">CO₂ Reduction (Tonnes)</div>
                    </div>
                  </div>

                  <div className="key-benefits">
                    <div className="benefit-card">
                      <div className="benefit-icon">💡</div>
                      <div className="benefit-title">Energy Efficiency</div>
                      <div className="benefit-description">
                        Reduce condenser temperature through evaporative cooling, improving COP by 15-25%
                      </div>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">🌱</div>
                      <div className="benefit-title">Environmental Impact</div>
                      <div className="benefit-description">
                        Significant reduction in carbon footprint and greenhouse gas emissions
                      </div>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">📊</div>
                      <div className="benefit-title">Smart Monitoring</div>
                      <div className="benefit-description">
                        IoT-enabled system with real-time performance tracking and optimization
                      </div>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">💰</div>
                      <div className="benefit-title">Cost Savings</div>
                      <div className="benefit-description">
                        Attractive payback period with substantial long-term operational savings
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications Page */}
                <div className="a4-page-container">
                  <h2 className="section-header">2. Technical Specifications</h2>
                  
                  <h3 style={{ color: '#1D7AA3', marginBottom: '15px' }}>2.1 System Overview</h3>
                  <p>
                    Adiabatic cooling is an energy-efficient method that leverages evaporative cooling principles to reduce the temperature of air entering the condenser. This technology works on the principle that when water evaporates, it absorbs heat from the surrounding air, effectively lowering its temperature.
                  </p>

                  <table className="professional-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Current Status</th>
                        <th>With Adiabatic Cooling</th>
                        <th>Improvement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Power Consumption</td>
                        <td>{formData.currentPower} kW</td>
                        <td>{(parseFloat(formData.currentPower) * (1 - parseFloat(formData.expectedSaving)/100)).toFixed(1)} kW</td>
                        <td style={{ color: '#2E936E', fontWeight: '600' }}>-{formData.expectedSaving}%</td>
                      </tr>
                      <tr>
                        <td>Condenser Temperature</td>
                        <td>45°C (estimated)</td>
                        <td>35°C (estimated)</td>
                        <td style={{ color: '#2E936E', fontWeight: '600' }}>-10°C</td>
                      </tr>
                      <tr>
                        <td>COP (Coefficient of Performance)</td>
                        <td>3.2 (estimated)</td>
                        <td>4.0 (estimated)</td>
                        <td style={{ color: '#2E936E', fontWeight: '600' }}>+25%</td>
                      </tr>
                      <tr>
                        <td>Annual Energy Consumption</td>
                        <td>{(parseFloat(formData.currentPower) * 8760).toLocaleString()} kWh</td>
                        <td>{(parseFloat(formData.currentPower) * 8760 * (1 - parseFloat(formData.expectedSaving)/100)).toLocaleString()} kWh</td>
                        <td style={{ color: '#2E936E', fontWeight: '600' }}>-{(parseFloat(formData.currentPower) * 8760 * parseFloat(formData.expectedSaving)/100).toLocaleString()} kWh</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3 style={{ color: '#1D7AA3', marginBottom: '15px', marginTop: '30px' }}>2.2 System Components</h3>
                  <div className="key-benefits">
                    <div className="benefit-card">
                      <div className="benefit-icon">🌊</div>
                      <div className="benefit-title">Pre-Cooling Pads</div>
                      <div className="benefit-description">
                        High-efficiency cellulose media with optimal thickness for maximum cooling effect
                      </div>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">💧</div>
                      <div className="benefit-title">Water Distribution System</div>
                      <div className="benefit-description">
                        Precision-engineered nozzles ensuring uniform water distribution across cooling pads
                      </div>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">🎛️</div>
                      <div className="benefit-title">Control System</div>
                      <div className="benefit-description">
                        Advanced PLC-based control with temperature and humidity sensors for optimal operation
                      </div>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">🔧</div>
                      <div className="benefit-title">Maintenance System</div>
                      <div className="benefit-description">
                        Automated flushing and cleaning cycles to prevent scaling and maintain efficiency
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Analysis Page */}
                <div className="a4-page-container">
                  <h2 className="section-header">3. Financial Analysis</h2>
                  
                  <h3 style={{ color: '#1D7AA3', marginBottom: '15px' }}>3.1 Investment Summary</h3>
                  <table className="professional-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount (₹)</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>System Cost</td>
                        <td>{formData.projectCost}</td>
                        <td>Complete adiabatic cooling system</td>
                      </tr>
                      <tr>
                        <td>Installation & Commissioning</td>
                        <td>Included</td>
                        <td>Professional installation and testing</td>
                      </tr>
                      <tr>
                        <td>Training & Documentation</td>
                        <td>Included</td>
                        <td>Operator training and technical manuals</td>
                      </tr>
                      <tr style={{ backgroundColor: '#EBF8FF', fontWeight: '600' }}>
                        <td>Total Investment</td>
                        <td>{formData.projectCost}</td>
                        <td>All-inclusive package</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3 style={{ color: '#1D7AA3', marginBottom: '15px', marginTop: '30px' }}>3.2 Savings Analysis</h3>
                  <table className="professional-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Annual Amount</th>
                        <th>Calculation Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Energy Savings</td>
                        <td>{(parseFloat(formData.currentPower) * 8760 * parseFloat(formData.expectedSaving)/100).toLocaleString()} kWh</td>
                        <td>{formData.currentPower} kW × 8760 hrs × {formData.expectedSaving}%</td>
                      </tr>
                      <tr>
                        <td>Cost Savings</td>
                        <td>₹{(parseFloat(formData.currentPower) * 8760 * parseFloat(formData.expectedSaving)/100 * parseFloat(formData.electricityRate)).toLocaleString()}</td>
                        <td>Energy savings × ₹{formData.electricityRate}/kWh</td>
                      </tr>
                      <tr>
                        <td>Water Cost</td>
                        <td>₹{(parseFloat(formData.chillerCapacity) * 4 * 8760 * parseFloat(formData.waterCost) / 1000).toLocaleString()}</td>
                        <td>Estimated water consumption</td>
                      </tr>
                      <tr>
                        <td>Maintenance Cost</td>
                        <td>₹{(parseFloat(formData.projectCost.replace(/,/g, '')) * 0.02).toLocaleString()}</td>
                        <td>2% of system cost annually</td>
                      </tr>
                      <tr style={{ backgroundColor: '#F0FDF4', fontWeight: '600' }}>
                        <td>Net Annual Savings</td>
                        <td>₹{(parseFloat(formData.currentPower) * 8760 * parseFloat(formData.expectedSaving)/100 * parseFloat(formData.electricityRate) - (parseFloat(formData.chillerCapacity) * 4 * 8760 * parseFloat(formData.waterCost) / 1000) - (parseFloat(formData.projectCost.replace(/,/g, '')) * 0.02)).toLocaleString()}</td>
                        <td>Cost savings minus operating costs</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="stats-grid" style={{ marginTop: '30px' }}>
                    <div className="stat-card">
                      <div className="stat-value">{Math.round(parseFloat(formData.projectCost.replace(/,/g, '')) / (parseFloat(formData.currentPower) * 8760 * parseFloat(formData.expectedSaving)/100 * parseFloat(formData.electricityRate) - (parseFloat(formData.chillerCapacity) * 4 * 8760 * parseFloat(formData.waterCost) / 1000) - (parseFloat(formData.projectCost.replace(/,/g, '')) * 0.02)) * 12)}</div>
                      <div className="stat-label">Payback Period (Months)</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{((parseFloat(formData.currentPower) * 8760 * parseFloat(formData.expectedSaving)/100 * parseFloat(formData.electricityRate) - (parseFloat(formData.chillerCapacity) * 4 * 8760 * parseFloat(formData.waterCost) / 1000) - (parseFloat(formData.projectCost.replace(/,/g, '')) * 0.02)) / parseFloat(formData.projectCost.replace(/,/g, '')) * 100).toFixed(1)}%</div>
                      <div className="stat-label">Annual ROI</div>
                    </div>
                  </div>
                </div>

                {/* Implementation Timeline Page */}
                <div className="a4-page-container">
                  <h2 className="section-header">4. Implementation Timeline</h2>
                  
                  <div className="timeline-section">
                    <div className="timeline-item">
                      <div className="timeline-icon">1</div>
                      <div className="timeline-content">
                        <div className="timeline-title">Project Approval & Planning</div>
                        <div className="timeline-description">
                          Contract finalization, site survey, and detailed engineering drawings preparation
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>Duration: 1-2 weeks</div>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-icon">2</div>
                      <div className="timeline-content">
                        <div className="timeline-title">Procurement & Manufacturing</div>
                        <div className="timeline-description">
                          Material procurement, system fabrication, and quality testing
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>Duration: 2-3 weeks</div>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-icon">3</div>
                      <div className="timeline-content">
                        <div className="timeline-title">Installation & Integration</div>
                        <div className="timeline-description">
                          On-site installation, system integration with existing chiller, and electrical connections
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>Duration: 1-2 weeks</div>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-icon">4</div>
                      <div className="timeline-content">
                        <div className="timeline-title">Testing & Commissioning</div>
                        <div className="timeline-description">
                          System testing, calibration, performance verification, and operator training
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>Duration: 1 week</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#F0FDF4', borderRadius: '8px', borderLeft: '4px solid #2E936E' }}>
                    <h3 style={{ color: '#0A435C', marginBottom: '10px' }}>Total Project Duration: 5-8 weeks</h3>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      Timeline may vary based on site conditions and client requirements. We ensure minimal disruption to your operations during installation.
                    </p>
                  </div>

                  <h3 style={{ color: '#1D7AA3', marginBottom: '15px', marginTop: '30px' }}>4.1 Maintenance & Support</h3>
                  <div className="key-benefits">
                    <div className="benefit-card">
                      <div className="benefit-icon">🔧</div>
                      <div className="benefit-title">Preventive Maintenance</div>
                      <div className="benefit-description">
                        Regular inspection, cleaning, and calibration services to ensure optimal performance
                      </div>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">🚨</div>
                      <div className="benefit-title">Remote Monitoring</div>
                      <div className="benefit-description">
                        24/7 IoT-based monitoring with instant alerts for any system anomalies
                      </div>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">📞</div>
                      <div className="benefit-title">Technical Support</div>
                      <div className="benefit-description">
                        Dedicated technical support team available for troubleshooting and guidance
                      </div>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">📈</div>
                      <div className="benefit-title">Performance Optimization</div>
                      <div className="benefit-description">
                        Continuous system optimization based on actual performance data and seasonal variations
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conclusion Page */}
                <div className="a4-page-container">
                  <h2 className="section-header">5. Conclusion</h2>
                  
                  <div className="executive-summary">
                    <p>
                      The implementation of our adiabatic cooling system for your <strong>{formData.chillerCapacity} TR {formData.chillerType} chiller</strong> represents a strategic investment in energy efficiency and operational excellence. With a projected <strong>{formData.expectedSaving}% reduction in power consumption</strong>, this system will deliver substantial cost savings while contributing to your sustainability goals.
                    </p>
                    
                    <p>
                      Our comprehensive solution includes not only the hardware installation but also advanced IoT monitoring, predictive maintenance, and continuous optimization services. This ensures that you achieve and maintain the projected savings throughout the system's operational life.
                    </p>
                    
                    <p>
                      We are committed to your success and stand ready to support you in implementing this energy-efficient solution. Our team of experts will work closely with you to ensure seamless integration and optimal performance.
                    </p>
                  </div>

                  <div style={{ marginTop: '40px', padding: '25px', backgroundColor: '#0A435C', color: 'white', borderRadius: '10px' }}>
                    <h3 style={{ color: 'white', marginBottom: '15px' }}>Contact Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                      <div>
                        <strong>Project Manager:</strong><br />
                        {formData.contactPerson}<br />
                        📧 {formData.contactEmail}<br />
                        📞 {formData.contactPhone}
                      </div>
                      <div>
                        <strong>SEE-Tech Solutions</strong><br />
                        Energy Efficiency Specialists<br />
                        📧 info@seetechsolutions.com<br />
                        🌐 www.seetechsolutions.com
                      </div>
                    </div>
                  </div>

                  <div className="document-footer">
                    <p>This proposal is valid for 30 days from the date of issue.</p>
                    <p>© 2025 SEE-Tech Solutions. All rights reserved.</p>
                  </div>
                </div>
              </div>
              
              {/* Print Controls */}
              <div className="print-controls">
                <Button onClick={handlePrint} className="print-button">
                  <Printer size={16} />
                  Print Proposal
                </Button>
                <Button onClick={generatePDF} className="print-button">
                  <FileDown size={16} />
                  Download PDF
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
                        
                        <div className="component-card">
                          <h4>Water Distribution System</h4>
                          <p>Precision-engineered water delivery with efficient distribution headers and flow control mechanisms</p>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Uniform water distribution</li>
                            <li>Stainless steel construction</li>
                            <li>Low-pressure operation</li>
                          </ul>
                        </div>
                        
                        <div className="component-card">
                          <h4>Control System</h4>
                          <p>Advanced IoT-enabled controls for intelligent operation based on ambient conditions and system demand</p>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Remote monitoring capability</li>
                            <li>Adaptive control algorithms</li>
                            <li>Predictive maintenance alerts</li>
                          </ul>
                        </div>
                        
                        <div className="component-card">
                          <h4>Water Treatment</h4>
                          <p>Integrated water conditioning system to maintain optimal TDS levels and prevent scaling</p>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Automatic bleed-off system</li>
                            <li>Anti-scaling technology</li>
                            <li>Water quality monitoring</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Technical Analysis Section */}
                    <div>
                      <h2>3. Technical Analysis</h2>
                      <h3>3.1 Performance Parameters</h3>
                      <p>
                        The following table outlines the key system parameters before and after adiabatic cooling implementation,
                        highlighting the significant improvements in operating conditions:
                      </p>
                      
                      <table className="professional-table">
                        <thead>
                          <tr>
                            <th>PARAMETER</th>
                            <th>BEFORE</th>
                            <th>AFTER</th>
                            <th>CHANGE</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Condenser Temperature</td>
                            <td>{formData.condTempBefore}°C</td>
                            <td>{formData.condTempAfter}°C</td>
                            <td className="text-green-600">-{parseFloat(formData.condTempBefore) - parseFloat(formData.condTempAfter)}°C</td>
                          </tr>
                          <tr>
                            <td>System COP</td>
                            <td>{formData.copBefore}</td>
                            <td>{formData.copAfter}</td>
                            <td className="text-green-600">+{(parseFloat(formData.copAfter) - parseFloat(formData.copBefore)).toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>Power Consumption</td>
                            <td>{formData.currentPower} kW</td>
                            <td>{formData.proposedPower} kW</td>
                            <td className="text-green-600">-{formData.savingsPercent}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Financial Analysis Section */}
                    <div>
                      <h2>4. Financial Analysis</h2>
                      <h3>4.1 Cost Benefit Summary</h3>
                      
                      <table className="proposal-table">
                        <thead>
                          <tr>
                            <th>ITEM</th>
                            <th>VALUE</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Project Cost</td>
                            <td>₹{formData.investmentCost}</td>
                          </tr>
                          <tr>
                            <td>Annual Electricity Savings</td>
                            <td>₹{formData.annualCostSavings}</td>
                          </tr>
                          <tr>
                            <td>Annual Water Cost</td>
                            <td>₹2,21,184</td>
                          </tr>
                          <tr>
                            <td>Annual Maintenance Cost</td>
                            <td>₹23,000</td>
                          </tr>
                          <tr>
                            <td>Net Annual Savings</td>
                            <td>₹18,52,456</td>
                          </tr>
                          <tr>
                            <td>Simple Payback Period</td>
                            <td>{formData.paybackPeriod} months</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Environmental Impact Section */}
                    <div>
                      <h2>5. Environmental Impact</h2>
                      <p>
                        Implementation of the adiabatic cooling system will significantly reduce the facility's carbon footprint
                        through reduced electricity consumption.
                      </p>
                      
                      <table className="proposal-table">
                        <thead>
                          <tr>
                            <th>IMPACT</th>
                            <th>VALUE</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Annual Energy Savings</td>
                            <td>{formData.annualEnergySavings} kWh/year</td>
                          </tr>
                          <tr>
                            <td>Grid Emission Factor</td>
                            <td>0.82 kg CO2e/kWh</td>
                          </tr>
                          <tr>
                            <td>Annual CO2e Reduction</td>
                            <td>{formData.co2Reduction} tonnes CO2e/year</td>
                          </tr>
                          <tr>
                            <td>Equivalent to Trees Planted</td>
                            <td>4,364 trees</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button onClick={() => setActiveTab("inputs")} variant="outline">
                  Edit Parameters
                </Button>
                <div className="flex gap-3">
                  <Button onClick={handlePrint} variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Proposal
                  </Button>
                  <Button onClick={generatePDF}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <Button onClick={generateProposal} className="flex-1">
              <Calculator className="h-4 w-4 mr-2" />
              Generate Full Proposal
            </Button>
            <Button variant="outline" onClick={() => {
              setActiveTab("proposal");
              setTimeout(generatePDF, 500);
            }} className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview & Download PDF
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* Additional Templates */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Proposal Templates</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Adiabatic Cooling</CardTitle>
                  <CardDescription className="text-sm">Standard template for adiabatic cooling systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Chiller Replacement</CardTitle>
                  <CardDescription className="text-sm">Template for chiller replacement projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">HVAC Optimization</CardTitle>
                  <CardDescription className="text-sm">Template for HVAC efficiency projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
