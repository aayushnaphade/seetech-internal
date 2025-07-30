"use client";

import React, { useState, useRef, useCallback } from 'react';
import ChillerReportTemplate from '@/components/templates/chiller-proposal/ChillerReportTemplate';
import { ChillerProposalData, sampleChillerData } from '@/components/templates/chiller-proposal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
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
// import html2canvas from 'html2canvas'; // removed due to unsupported lab() color functions
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

  const [chillerData, setChillerData] = useState<ChillerProposalData>(sampleChillerData);


  // Demo data for quick testing
  const loadDemoData = () => {
    setChillerData({
      ...sampleChillerData,
      clientName: "SeeTech Demo Client",
      location: "Bangalore Technology Park, Karnataka",
      date: new Date().toISOString().split('T')[0],
      systemCapacity: "300 TR",
      currentPowerConsumption: "250 kW",
      proposedPowerConsumption: "187.5 kW",
      expectedSaving: "25%",
      proposalNumber: "ST-CHL-DEMO-001",
      contactPerson: "SeeTech Demo Engineer"
    });
  };

  // Using react-to-print hook for reliable printing
  const handlePrint = useReactToPrint({
    contentRef: proposalRef,
    documentTitle: `${chillerData.clientName}_Chiller_Proposal`,
    onAfterPrint: () => {
      console.log("Print completed successfully");
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setChillerData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const generateProposal = () => {
    console.log("Generating proposal with data:", chillerData);
    setActiveTab("proposal");
  };

  // Function to generate PDF using jsPDF
  // PDF generation via html2canvas is disabled due to unsupported CSS functions
  const generatePDF = useCallback(() => {
    // Fallback to browser print
    handlePrint?.();
  }, [handlePrint]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Chiller Proposal Generator</h1>
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
                  <BreadcrumbPage>Chiller Proposal</BreadcrumbPage>
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
            <h2 className="text-2xl font-bold tracking-tight mb-2">Chiller System Proposal Generator</h2>
            <p className="text-muted-foreground">
              Create professional proposals for chiller optimization and efficiency projects
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
                        value={chillerData.clientName}
                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                        placeholder="e.g., Ashirwad Pipes"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientLocation">Location</Label>
                      <Textarea
                        id="clientLocation"
                        value={chillerData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Enter client location"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        value={chillerData.projectName}
                        onChange={(e) => handleInputChange("projectName", e.target.value)}
                        placeholder="e.g., Chiller Optimization Project"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectDate">Project Date</Label>
                      <Input
                        id="projectDate"
                        type="date"
                        value={chillerData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
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
                          value={chillerData.systemCapacity}
                          onChange={(e) => handleInputChange("systemCapacity", e.target.value)}
                          placeholder="e.g., 255 TR"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proposalNumber">Proposal Number</Label>
                        <Input
                          id="proposalNumber"
                          value={chillerData.proposalNumber}
                          onChange={(e) => handleInputChange("proposalNumber", e.target.value)}
                          placeholder="e.g., SEE-CHL-2025-001"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPowerConsumption">Current Power Consumption</Label>
                        <Input
                          id="currentPowerConsumption"
                          value={chillerData.currentPowerConsumption}
                          onChange={(e) => handleInputChange("currentPowerConsumption", e.target.value)}
                          placeholder="e.g., 425 kW"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proposedPowerConsumption">Proposed Power Consumption</Label>
                        <Input
                          id="proposedPowerConsumption"
                          value={chillerData.proposedPowerConsumption}
                          onChange={(e) => handleInputChange("proposedPowerConsumption", e.target.value)}
                          placeholder="e.g., 310 kW"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentEfficiency">Current Efficiency</Label>
                        <Input
                          id="currentEfficiency"
                          value={chillerData.currentEfficiency}
                          onChange={(e) => handleInputChange("currentEfficiency", e.target.value)}
                          placeholder="e.g., 0.85 kW/TR"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proposedEfficiency">Proposed Efficiency</Label>
                        <Input
                          id="proposedEfficiency"
                          value={chillerData.proposedEfficiency}
                          onChange={(e) => handleInputChange("proposedEfficiency", e.target.value)}
                          placeholder="e.g., 0.62 kW/TR"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="operatingHours">Operating Hours</Label>
                        <Input
                          id="operatingHours"
                          value={chillerData.operatingHours}
                          onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                          placeholder="e.g., 8760 hours/year"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expectedSaving">Expected Savings</Label>
                        <Input
                          id="expectedSaving"
                          value={chillerData.expectedSaving}
                          onChange={(e) => handleInputChange("expectedSaving", e.target.value)}
                          placeholder="e.g., 27%"
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
                        <Label htmlFor="investmentCost">Investment Cost</Label>
                        <Input
                          id="investmentCost"
                          value={chillerData.investmentCost}
                          onChange={(e) => handleInputChange("investmentCost", e.target.value)}
                          placeholder="e.g., $245,000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paybackPeriod">Payback Period</Label>
                        <Input
                          id="paybackPeriod"
                          value={chillerData.paybackPeriod}
                          onChange={(e) => handleInputChange("paybackPeriod", e.target.value)}
                          placeholder="e.g., 2.1 years"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="roi">Return on Investment</Label>
                        <Input
                          id="roi"
                          value={chillerData.roi}
                          onChange={(e) => handleInputChange("roi", e.target.value)}
                          placeholder="e.g., 42%"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Enter the contact details for the proposal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input
                          id="contactPerson"
                          value={chillerData.contactPerson}
                          onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                          placeholder="Enter contact person"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={chillerData.contactEmail}
                          onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                          placeholder="Enter email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={chillerData.contactPhone}
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
                <ChillerReportTemplate data={chillerData} />
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
                    <p className="text-sm text-gray-600">Investment Cost</p>
                    <p className="text-2xl font-bold text-green-600">
                      {chillerData.investmentCost}
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
                    <p className="text-sm text-gray-600">Expected Savings</p>
                    <p className="text-2xl font-bold text-orange-600">{chillerData.expectedSaving}</p>
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
                      {chillerData.paybackPeriod}
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
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="text-2xl font-bold text-green-600">
                      {chillerData.roi}
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
                  <CardTitle className="text-base">Chiller Optimization</CardTitle>
                  <CardDescription className="text-sm">Standard template for chiller optimization systems</CardDescription>
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
