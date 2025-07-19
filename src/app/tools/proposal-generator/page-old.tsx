"use client";

import React, { useState, useRef, useCallback } from 'react';
import ChillerProposalTemplate from '@/components/templates/chiller-proposal-template-redesigned';

interface ProposalData {
  clientName: string;
  clientLocation: string;
  currentPower: string;
  optimizedPower: string;
  expectedSaving: string;
  monthlyBill: string;
  projectedBill: string;
  annualSavings: string;
  roiMonths: string;
  currentTemp: string;
  optimizedTemp: string;
  tempReduction: string;
  currentCOP: string;
  optimizedCOP: string;
  copImprovement: string;
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  Save, 
  Calculator, 
  Eye, 
  Share2, 
  Printer, 
  FileDown, 
  Building2,
  ArrowLeft 
} from 'lucide-react';
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

export default function ProposalGeneratorPage() {
  const [activeTab, setActiveTab] = useState("inputs");
  const proposalRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<ProposalData>({
    clientName: "Ashirwad Pipes",
    clientLocation: "Plot 26, Attibele Industrial Area",
    currentPower: "210.0",
    optimizedPower: "168.0",
    expectedSaving: "20",
    monthlyBill: "1,68,000",
    projectedBill: "1,34,400",
    annualSavings: "4,03,200",
    roiMonths: "18",
    currentTemp: "47.7",
    optimizedTemp: "36.0",
    tempReduction: "11.7",
    currentCOP: "2.60",
    optimizedCOP: "4.30",
    copImprovement: "1.70"
  });
    electricityRate: "6.5",
    waterCost: "45",
    projectCost: "20,30,000",
    contactPerson: "Ayush Naphade",
    contactEmail: "ayush@seetech.co.in",
    contactPhone: "+91 99999 99999"
  });
  
  // Demo data for quick testing
  const loadDemoData = () => {
    setFormData({
      clientName: "SeeTech Demo Client",
      clientLocation: "Bangalore Technology Park",
      projectDate: new Date().toLocaleDateString('en-IN'),
      chillerCapacity: "300",
      chillerType: "Air-Cooled",
      currentPower: "250.0",
      expectedSaving: "25",
      electricityRate: "7.0",
      waterCost: "50",
      projectCost: "25,00,000",
      contactPerson: "Demo Contact",
      contactEmail: "demo@seetech.co.in",
      contactPhone: "+91 88888 88888"
    });
  };

  // Extended form data for detailed inputs
  const [extendedFormData, setExtendedFormData] = useState({
    projectName: "Adiabatic Cooling System Implementation",
    systemCapacity: "255",
    proposedPower: "168.0",
    condTempBefore: "47.7",
    condTempAfter: "36.0",
    copBefore: "2.60",
    copAfter: "4.30",
    savingsPercent: "20",
    annualEnergySavings: "322,560",
    annualCostSavings: "20,96,640",
    investmentCost: "11,50,000",
    paybackPeriod: "7",
    npvValue: "1,96,69,670",
    waterConsumption: "4,915.2",
    co2Reduction: "264.5",
    description: "Implementation of adiabatic cooling system to improve chiller efficiency and reduce energy consumption."
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

  const handleExtendedInputChange = (field: string, value: string) => {
    setExtendedFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateProposal = () => {
    console.log("Generating proposal with data:", formData);
    setActiveTab("proposal");
  };

  // Function to generate PDF using jsPDF
  const generatePDF = useCallback(async () => {
    if (proposalRef.current) {
      const proposalElement = proposalRef.current;
      
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        
        // Create canvas from HTML element
        const canvas = await html2canvas(proposalElement, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          removeContainer: true,
          foreignObjectRendering: false,
          windowWidth: proposalElement.scrollWidth,
          windowHeight: proposalElement.scrollHeight
        });
        
        const imgWidth = pdfWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/png', 0.8);
        
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - (margin * 2));
        position = heightLeft - imgHeight;
        
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          heightLeft -= (pdfHeight - (margin * 2));
          position -= (pdfHeight - (margin * 2));
        }
        
        pdf.save(`${formData.clientName}_Adiabatic_Cooling_Proposal.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("PDF generation failed. Please try using the Print button instead.");
      }
    }
  }, [formData.clientName]);

  return (
    <div className="min-h-screen bg-background">
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
                      <Label htmlFor="clientLocation">Location</Label>
                      <Textarea
                        id="clientLocation"
                        value={formData.clientLocation}
                        onChange={(e) => handleInputChange("clientLocation", e.target.value)}
                        placeholder="Enter client location"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        value={extendedFormData.projectName}
                        onChange={(e) => handleExtendedInputChange("projectName", e.target.value)}
                        placeholder="e.g., Adiabatic Cooling System Implementation"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectDate">Project Date</Label>
                      <Input
                        id="projectDate"
                        type="date"
                        value={formData.projectDate}
                        onChange={(e) => handleInputChange("projectDate", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Parameters</CardTitle>
                    <CardDescription>
                      Enter the technical and performance data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="systemCapacity">Chiller Capacity (TR)</Label>
                        <Input
                          id="systemCapacity"
                          value={formData.chillerCapacity}
                          onChange={(e) => handleInputChange("chillerCapacity", e.target.value)}
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
                            <SelectItem value="Air-Cooled">Air-cooled</SelectItem>
                            <SelectItem value="Water-Cooled">Water-cooled</SelectItem>
                            <SelectItem value="Screw">Screw</SelectItem>
                            <SelectItem value="Centrifugal">Centrifugal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
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
                          value={extendedFormData.proposedPower}
                          onChange={(e) => handleExtendedInputChange("proposedPower", e.target.value)}
                          placeholder="e.g., 168.0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="condTempBefore">Condenser Temp Before (°C)</Label>
                        <Input
                          id="condTempBefore"
                          value={extendedFormData.condTempBefore}
                          onChange={(e) => handleExtendedInputChange("condTempBefore", e.target.value)}
                          placeholder="e.g., 47.7"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="condTempAfter">Condenser Temp After (°C)</Label>
                        <Input
                          id="condTempAfter"
                          value={extendedFormData.condTempAfter}
                          onChange={(e) => handleExtendedInputChange("condTempAfter", e.target.value)}
                          placeholder="e.g., 36.0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="copBefore">COP Before</Label>
                        <Input
                          id="copBefore"
                          value={extendedFormData.copBefore}
                          onChange={(e) => handleExtendedInputChange("copBefore", e.target.value)}
                          placeholder="e.g., 2.60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="copAfter">COP After</Label>
                        <Input
                          id="copAfter"
                          value={extendedFormData.copAfter}
                          onChange={(e) => handleExtendedInputChange("copAfter", e.target.value)}
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
                        <Label htmlFor="expectedSaving">Energy Savings (%)</Label>
                        <Input
                          id="expectedSaving"
                          value={formData.expectedSaving}
                          onChange={(e) => handleInputChange("expectedSaving", e.target.value)}
                          placeholder="e.g., 20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annualEnergySavings">Annual Energy Savings (kWh)</Label>
                        <Input
                          id="annualEnergySavings"
                          value={extendedFormData.annualEnergySavings}
                          onChange={(e) => handleExtendedInputChange("annualEnergySavings", e.target.value)}
                          placeholder="e.g., 322,560"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="electricityRate">Electricity Rate (₹/kWh)</Label>
                        <Input
                          id="electricityRate"
                          value={formData.electricityRate}
                          onChange={(e) => handleInputChange("electricityRate", e.target.value)}
                          placeholder="e.g., 6.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectCost">Project Cost (₹)</Label>
                        <Input
                          id="projectCost"
                          value={formData.projectCost}
                          onChange={(e) => handleInputChange("projectCost", e.target.value)}
                          placeholder="e.g., 11,50,000"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="waterCost">Water Cost (₹/1000L)</Label>
                        <Input
                          id="waterCost"
                          value={formData.waterCost}
                          onChange={(e) => handleInputChange("waterCost", e.target.value)}
                          placeholder="e.g., 45.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paybackPeriod">Simple Payback (months)</Label>
                        <Input
                          id="paybackPeriod"
                          value={extendedFormData.paybackPeriod}
                          onChange={(e) => handleExtendedInputChange("paybackPeriod", e.target.value)}
                          placeholder="e.g., 7"
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
                          value={extendedFormData.waterConsumption}
                          onChange={(e) => handleExtendedInputChange("waterConsumption", e.target.value)}
                          placeholder="e.g., 4,915.2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="co2Reduction">CO₂ Reduction (tonnes/year)</Label>
                        <Input
                          id="co2Reduction"
                          value={extendedFormData.co2Reduction}
                          onChange={(e) => handleExtendedInputChange("co2Reduction", e.target.value)}
                          placeholder="e.g., 264.5"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea
                        id="description"
                        value={extendedFormData.description}
                        onChange={(e) => handleExtendedInputChange("description", e.target.value)}
                        placeholder="Describe the adiabatic cooling system implementation and expected benefits..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                          placeholder="Enter contact person"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                          placeholder="Enter email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                          placeholder="Enter phone"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="proposal" className="space-y-6">
              <div ref={proposalRef}>
                <ChillerProposalTemplate data={formData} />
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <Button onClick={() => setActiveTab("inputs")} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
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
            <Button onClick={loadDemoData} variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Load Demo Data
            </Button>
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

          {/* Quick Stats Preview */}
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Annual Savings</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{(parseFloat(formData.currentPower || "0") * parseFloat(formData.expectedSaving || "0") / 100 * 8760 * parseFloat(formData.electricityRate || "0") / 100000).toFixed(2)}L
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Energy Savings</p>
                    <p className="text-2xl font-bold text-orange-600">{formData.expectedSaving || "0"}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Payback Period</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {extendedFormData.paybackPeriod} Months
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Save className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">CO₂ Reduction</p>
                    <p className="text-2xl font-bold text-green-600">
                      {extendedFormData.co2Reduction} Tons
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Templates */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Other Proposal Templates</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Adiabatic Cooling</CardTitle>
                  <CardDescription className="text-sm">Standard template for adiabatic cooling systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
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
                    <Download className="h-4 w-4 mr-2" />
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
                    <Download className="h-4 w-4 mr-2" />
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
