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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
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
  ArrowLeft,
  Info
} from 'lucide-react';
import Link from "next/link";
import { useReactToPrint } from 'react-to-print';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

declare global {
  interface Window {
    Module: any;
    Plotly: any;
  }
}

export default function ProposalGeneratorPage() {
  const [activeTab, setActiveTab] = useState("inputs");
  const proposalRef = useRef<HTMLDivElement>(null);
  const [isProposalGenerated, setIsProposalGenerated] = useState(false);

  // Initialize with enhanced sample data
  const [chillerData, setChillerData] = useState<ChillerProposalData>({
    ...sampleChillerData,
    investmentCost: "₹2,04,75,000",
    electricityTariff: "8.5",
    waterTariff: "25.0",
    maintenanceCostType: "percentage",
    maintenanceCostPercent: "2.0",
    chillerFanCFM: "300000",
    waterConsumption: "1200",
    projectLifespan: "15",
    paybackPeriod: "Auto-calculated",
    roi: "Auto-calculated",
    ratedPowerConsumption: "350",
    calculationMode: "automatic",
    workingDays: "365",
    workingHoursPerDay: "24"
  });

  const handleInputChange = (field: string, value: string) => {
    setChillerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Using react-to-print hook for reliable printing
  const handlePrint = useReactToPrint({
    contentRef: proposalRef,
    documentTitle: `${chillerData.clientName}_Chiller_Proposal`,
    onAfterPrint: () => {
      console.log("Print completed successfully");
    }
  });

  const generatePDF = useCallback(() => {
    handlePrint?.();
  }, [handlePrint]);

  const generateProposal = () => {
    console.log("Generating proposal with data:", chillerData);
    setIsProposalGenerated(true);
    setActiveTab("proposal");
  };

  const loadDemoData = () => {
    setChillerData({
      ...sampleChillerData,
      clientName: "SeeTech Demo Client",
      location: "Bangalore Technology Park, Karnataka",
      date: new Date().toISOString().split('T')[0],
      systemCapacity: "255 TR",
      currentPowerConsumption: "425",
      proposedPowerConsumption: "310",
      expectedSaving: "27%",
      proposalNumber: "ST-CHL-DEMO-001",
      contactPerson: "SeeTech Demo Engineer",
      investmentCost: "₹2,04,75,000",
      electricityTariff: "8.5",
      waterTariff: "25.0",
      projectLifespan: "15"
    });
  };

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

            <TabsContent value="inputs" className="space-y-6">
              {/* Two Column Layout */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Client Information, Financial Impact & Tariffs, OEM Specifications, Environmental Conditions */}
                <div className="flex-1 min-w-0 space-y-6">
                  {/* Client Information Card */}
                  <Card className="h-fit">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Client Information</CardTitle>
                      <CardDescription className="text-sm">
                        Enter the client and project details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="clientName" className="text-sm">Client Name</Label>
                          <Input
                            id="clientName"
                            value={chillerData.clientName}
                            onChange={(e) => handleInputChange("clientName", e.target.value)}
                            placeholder="e.g., Ashirwad Pipes"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="projectName" className="text-sm">Project Name</Label>
                          <Input
                            id="projectName"
                            value={chillerData.projectName}
                            onChange={(e) => handleInputChange("projectName", e.target.value)}
                            placeholder="e.g., Chiller Optimization"
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="clientLocation" className="text-sm">Location</Label>
                        <Textarea
                          id="clientLocation"
                          value={chillerData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="Enter client location"
                          rows={2}
                          className="resize-none text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="projectDate" className="text-sm">Project Date</Label>
                        <Input
                          id="projectDate"
                          type="date"
                          value={chillerData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Impact & Tariffs Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Impact & Tariffs</CardTitle>
                      <CardDescription>
                        Enter financial parameters and utility tariffs for accurate ROI calculations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="investmentCost">Investment Cost (₹)</Label>
                          <Input
                            id="investmentCost"
                            value={chillerData.investmentCost}
                            onChange={(e) => handleInputChange("investmentCost", e.target.value)}
                            placeholder="e.g., ₹2,04,75,000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="electricityTariff">Electricity Tariff (₹/kWh)</Label>
                          <Input
                            id="electricityTariff"
                            type="number"
                            step="0.1"
                            value={chillerData.electricityTariff || "8.5"}
                            onChange={(e) => handleInputChange("electricityTariff", e.target.value)}
                            placeholder="e.g., 8.5"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="waterTariff">Water Tariff (₹/kL)</Label>
                          <Input
                            id="waterTariff"
                            type="number"
                            step="0.1"
                            value={chillerData.waterTariff || "25.0"}
                            onChange={(e) => handleInputChange("waterTariff", e.target.value)}
                            placeholder="e.g., 25.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectLifespan">Project Lifespan (years)</Label>
                          <Input
                            id="projectLifespan"
                            type="number"
                            min="5"
                            max="25"
                            value={chillerData.projectLifespan || "15"}
                            onChange={(e) => handleInputChange("projectLifespan", e.target.value)}
                            placeholder="e.g., 15"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* OEM Specifications Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>OEM Specifications</CardTitle>
                      <CardDescription>
                        Original Equipment Manufacturer specifications from datasheet
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="refrigerant">Refrigerant Type</Label>
                        <select
                          id="refrigerant"
                          value={chillerData.refrigerant || "R134a"}
                          onChange={(e) => handleInputChange("refrigerant", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="R134a">R-134a (Most Common)</option>
                          <option value="R410A">R-410A</option>
                          <option value="R32">R-32</option>
                          <option value="R1234yf">R-1234yf (Low GWP)</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="oemCOP">OEM COP</Label>
                          <Input
                            id="oemCOP"
                            type="number"
                            step="0.01"
                            value={chillerData.oemCOP || "2.87"}
                            onChange={(e) => handleInputChange("oemCOP", e.target.value)}
                            placeholder="e.g., 2.87"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="oemCapacity">OEM Capacity (kW)</Label>
                          <Input
                            id="oemCapacity"
                            type="number"
                            value={chillerData.oemCapacity || "897"}
                            onChange={(e) => handleInputChange("oemCapacity", e.target.value)}
                            placeholder="e.g., 897"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Environmental Conditions Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Environmental Conditions</CardTitle>
                      <CardDescription>
                        Ambient conditions affecting chiller performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ambientDBT">Ambient DBT (°C)</Label>
                          <Input
                            id="ambientDBT"
                            type="number"
                            step="0.1"
                            value={chillerData.ambientDBT || "35.0"}
                            onChange={(e) => handleInputChange("ambientDBT", e.target.value)}
                            placeholder="e.g., 35.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="relativeHumidity">Relative Humidity (%)</Label>
                          <Input
                            id="relativeHumidity"
                            type="number"
                            step="0.1"
                            min="5"
                            max="99"
                            value={chillerData.relativeHumidity || "60.0"}
                            onChange={(e) => handleInputChange("relativeHumidity", e.target.value)}
                            placeholder="e.g., 60.0"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="condApproach">Condenser Approach (K)</Label>
                        <Input
                          id="condApproach"
                          type="number"
                          step="0.1"
                          value={chillerData.condApproach || "7.0"}
                          onChange={(e) => handleInputChange("condApproach", e.target.value)}
                          placeholder="e.g., 7.0"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: System Parameters, Contact Information, Actual Sensor Data, System Parameters */}
                <div className="flex-1 min-w-0 space-y-6">
                  {/* System Parameters Card */}
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
                          <Label htmlFor="ratedPowerConsumption">Rated Power Consumption (kW)</Label>
                          <Input
                            id="ratedPowerConsumption"
                            value={chillerData.ratedPowerConsumption || ""}
                            onChange={(e) => handleInputChange("ratedPowerConsumption", e.target.value)}
                            placeholder="e.g., 350 kW"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentPowerConsumption">Actual Power Consumption (kW)</Label>
                          <Input
                            id="currentPowerConsumption"
                            value={chillerData.currentPowerConsumption}
                            onChange={(e) => handleInputChange("currentPowerConsumption", e.target.value)}
                            placeholder="e.g., 425 kW"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information Card */}
                  <Card className="h-fit">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                      <CardDescription className="text-sm">
                        Enter the contact details for the proposal
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson" className="text-sm">Contact Person</Label>
                        <Input
                          id="contactPerson"
                          value={chillerData.contactPerson}
                          onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                          placeholder="Enter contact person"
                          className="h-9"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail" className="text-sm">Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={chillerData.contactEmail}
                            onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                            placeholder="Enter email"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone" className="text-sm">Phone</Label>
                          <Input
                            id="contactPhone"
                            type="tel"
                            value={chillerData.contactPhone}
                            onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                            placeholder="Enter phone"
                            className="h-9"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actual Sensor Data Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actual Sensor Data</CardTitle>
                      <CardDescription>
                        Real-time readings from chiller sensors
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="evapPressure">Evap Pressure (kPa)</Label>
                          <Input
                            id="evapPressure"
                            type="number"
                            step="0.1"
                            value={chillerData.evapPressure || "307.7"}
                            onChange={(e) => handleInputChange("evapPressure", e.target.value)}
                            placeholder="e.g., 307.7"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="condPressure">Cond Pressure (kPa)</Label>
                          <Input
                            id="condPressure"
                            type="number"
                            step="0.1"
                            value={chillerData.condPressure || "1244.0"}
                            onChange={(e) => handleInputChange("condPressure", e.target.value)}
                            placeholder="e.g., 1244.0"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="suctionTemp">Suction Temp (°C)</Label>
                          <Input
                            id="suctionTemp"
                            type="number"
                            step="0.1"
                            value={chillerData.suctionTemp || "15.6"}
                            onChange={(e) => handleInputChange("suctionTemp", e.target.value)}
                            placeholder="e.g., 15.6"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dischargeTemp">Discharge Temp (°C)</Label>
                          <Input
                            id="dischargeTemp"
                            type="number"
                            step="0.1"
                            value={chillerData.dischargeTemp || "65.0"}
                            onChange={(e) => handleInputChange("dischargeTemp", e.target.value)}
                            placeholder="e.g., 65.0"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Efficiency Parameters Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>System Efficiency Parameters</CardTitle>
                      <CardDescription>
                        System efficiency factors and operational parameters
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="compressorEfficiency">Compressor Efficiency</Label>
                        <Input
                          id="compressorEfficiency"
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={chillerData.compressorEfficiency || "0.85"}
                          onChange={(e) => handleInputChange("compressorEfficiency", e.target.value)}
                          placeholder="e.g., 0.85"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="systemEfficiencyFactor">System Efficiency Factor</Label>
                        <Input
                          id="systemEfficiencyFactor"
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={chillerData.systemEfficiencyFactor || "0.42"}
                          onChange={(e) => handleInputChange("systemEfficiencyFactor", e.target.value)}
                          placeholder="e.g., 0.42"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
          </div>
        </div>
      </main>
    </div>
  );
}
