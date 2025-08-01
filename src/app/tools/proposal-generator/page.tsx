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
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
  Info,
  DollarSign,
  Zap,
  Droplets,
  Settings,
  TrendingUp,
  Clock,
  BarChart3
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

  // Load CoolProp and Plotly libraries
  React.useEffect(() => {
    const loadLibraries = async () => {
      try {
        // Load CoolProp
        if (!window.Module) {
          console.log('Setting up CoolProp Module configuration...');
          window.Module = {
            locateFile: function(path: string) {
              if (path.endsWith('.wasm')) {
                return '/coolprop.wasm';
              }
              return path;
            },
            onRuntimeInitialized: function() {
              console.log('CoolProp WASM module initialized for proposal generator');
              // Force re-check in child components
              window.dispatchEvent(new Event('coolprop-ready'));
            },
            print: function(text: string) {
              console.log('CoolProp stdout:', text);
            },
            printErr: function(text: string) {
              console.error('CoolProp stderr:', text);
            }
          };

          const script = document.createElement('script');
          script.src = '/coolprop.js';
          script.onload = () => {
            console.log('CoolProp script loaded for proposal generator');
          };
          script.onerror = () => {
            console.error('Failed to load CoolProp script');
          };
          document.head.appendChild(script);
        }

        // Load Plotly
        if (!window.Plotly) {
          console.log('Loading Plotly library...');
          const plotlyScript = document.createElement('script');
          plotlyScript.src = 'https://cdn.plot.ly/plotly-3.0.3.min.js';
          plotlyScript.onload = () => {
            console.log('Plotly script loaded for proposal generator');
            // Force re-check in child components
            window.dispatchEvent(new Event('plotly-ready'));
          };
          plotlyScript.onerror = () => {
            console.error('Failed to load Plotly script');
          };
          document.head.appendChild(plotlyScript);
        }
      } catch (error) {
        console.error('Error loading libraries:', error);
      }
    };

    loadLibraries();
  }, []);

  // Initialize with enhanced sample data using chiller analyzer defaults
  const [chillerData, setChillerData] = useState<ChillerProposalData>({
    ...sampleChillerData,
    // Override with proven chiller analyzer values
    oemCOP: "2.87",
    oemCapacity: "897",
    refrigerant: "R134a",
    evapPressure: "307.7",
    condPressure: "1244.0",
    suctionTemp: "15.6",
    dischargeTemp: "65.0",
    evapLWT: "12.0",
    evapEWT: "7.0",
    superheat: "8.6",
    subcooling: "0.0",
    ambientDBT: "35.0",
    relativeHumidity: "60.0",
    condApproach: "7.0",
    compressorEfficiency: "0.85",
    systemEfficiencyFactor: "0.42",
    // Updated to Indian currency and include new financial fields
    investmentCost: "₹2,04,75,000",
    electricityTariff: "8.5",
    waterTariff: "25.0",
    maintenanceCostType: "percentage",
    maintenanceCostPercent: "2.0",
    chillerFanCFM: "300000", // CFM for chiller fan
    waterConsumption: String((300000 * 4 / 1000 * 8760) / 1000), // Auto-calculated from CFM
    projectLifespan: "15",
    paybackPeriod: "Auto-calculated",
    roi: "Auto-calculated"
  });


  // Demo data for quick testing - Using proven Daikin RWAD900CZ-XS values from chiller analyzer
  const loadDemoData = () => {
    const demoData: ChillerProposalData = {
      ...sampleChillerData,
      clientName: "SeeTech Demo Client",
      location: "Bangalore Technology Park, Karnataka",
      date: new Date().toISOString().split('T')[0],
      systemCapacity: "255 TR", // Matching Daikin RWAD900CZ-XS
      currentPowerConsumption: "425", // Higher baseline for demo
      proposedPowerConsumption: "310", // Optimized value
      expectedSaving: "27%", // This will now drive the calculations
      proposalNumber: "ST-CHL-DEMO-001",
      contactPerson: "SeeTech Demo Engineer",
      
      // Updated Indian Currency Values
      investmentCost: "₹2,04,75,000", // ~$245,000 converted to INR
      electricityTariff: "8.5", // ₹/kWh
      waterTariff: "25.0", // ₹/kL
      operatingHours: "8760", // hours/year (24/7 operation)
      maintenanceCostType: "percentage" as const, // Default maintenance cost type
      maintenanceCostPercent: "2.0", // % of investment
      chillerFanCFM: "300000", // CFM for chiller fan
      waterConsumption: "1200", // kL/year (auto-calculated from CFM)
      projectLifespan: "15", // years
      paybackPeriod: "Auto-calculated", // Will be calculated
      roi: "Auto-calculated", // Will be calculated
      
      // Proven Chiller Analyzer Parameters (Daikin RWAD900CZ-XS) - EXACT values
      // OEM Specifications
      oemCOP: "2.87",
      oemCapacity: "897", // kW
      refrigerant: "R134a",
      
      // Actual Sensor Data (proven working values from chiller analyzer)
      evapPressure: "307.7", // kPa
      condPressure: "1244.0", // kPa
      suctionTemp: "15.6", // °C (7°C evap + 8.6K superheat)
      dischargeTemp: "65.0", // °C
      evapLWT: "12.0", // °C
      evapEWT: "7.0", // °C
      superheat: "8.6", // K
      subcooling: "0.0", // K
      
      // Environmental Conditions
      ambientDBT: "35.0", // °C
      relativeHumidity: "60.0", // %
      condApproach: "7.0", // K
      
      // System Parameters
      compressorEfficiency: "0.85",
      systemEfficiencyFactor: "0.42" // Accounts for real-world losses
    };
    
    // Calculate financial metrics for demo data
    const calculatedMetrics = calculateFinancialMetrics(demoData);
    demoData.paybackPeriod = calculatedMetrics.paybackPeriod;
    demoData.roi = calculatedMetrics.roi;
    
    setChillerData(demoData);
  };

  // Using react-to-print hook for reliable printing
  const handlePrint = useReactToPrint({
    contentRef: proposalRef,
    documentTitle: `${chillerData.clientName}_Chiller_Proposal`,
    onAfterPrint: () => {
      console.log("Print completed successfully");
    }
  });

  // Function to calculate water consumption from CFM using thumb rule: 4 liters per 1000 CFM
  const calculateWaterConsumption = (cfm: string): string => {
    const cfmValue = parseFloat(cfm) || 0;
    // Thumb rule: 4 liters per 1000 CFM
    // Convert to kL/year: (CFM * 4 / 1000) * hours_per_year / 1000
    // Assuming continuous operation: 8760 hours/year
    const litersPerHour = (cfmValue * 4) / 1000;
    const litersPerYear = litersPerHour * 8760;
    const kLPerYear = litersPerYear / 1000;
    return kLPerYear.toFixed(0);
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedData = {
      ...chillerData,
      [field]: value
    };
    
    // Auto-calculate water consumption when CFM changes
    if (field === 'chillerFanCFM') {
      updatedData.waterConsumption = calculateWaterConsumption(value);
    }
    
    // Auto-calculate financial metrics when relevant fields change
    const financialFields = [
      'currentPowerConsumption', 'proposedPowerConsumption', 'operatingHours', 
      'investmentCost', 'electricityTariff', 'waterTariff', 'waterConsumption', 
      'projectLifespan', 'maintenanceCostType', 'maintenanceCostPercent', 
      'maintenanceCostStatic', 'maintenanceCostMonthly', 'maintenanceCostYearly', 
      'maintenanceCostOnetime', 'chillerFanCFM'
    ];
    
    if (financialFields.includes(field)) {
      const calculatedMetrics = calculateFinancialMetrics(updatedData);
      updatedData.paybackPeriod = calculatedMetrics.paybackPeriod;
      updatedData.roi = calculatedMetrics.roi;
    }
    
    setChillerData(updatedData);
  };

  // Enhanced function to calculate financial metrics with flexible maintenance cost options
  const calculateFinancialMetrics = (data: ChillerProposalData) => {
    const currentPower = parseFloat(data.currentPowerConsumption) || 0;
    const proposedPower = parseFloat(data.proposedPowerConsumption) || 0;
    const operatingHours = parseFloat(data.operatingHours) || 8760;
    const investmentCost = parseFloat(data.investmentCost?.replace(/[^\d.-]/g, '')) || 0;
    const electricityRate = parseFloat(data.electricityTariff || "8.5");
    const waterRate = parseFloat(data.waterTariff || "25.0");
    const waterConsumption = parseFloat(data.waterConsumption || "1200");
    const projectLifespan = parseFloat(data.projectLifespan || "15");
    
    const powerSaving = currentPower - proposedPower;
    const annualEnergySaving = powerSaving * operatingHours;
    const annualElectricitySavings = annualEnergySaving * electricityRate;
    const annualWaterCost = waterConsumption * waterRate;
    
    // Calculate annual maintenance cost based on selected type
    let annualMaintenanceCost = 0;
    const maintenanceType = data.maintenanceCostType || 'percentage';
    
    switch (maintenanceType) {
      case 'percentage':
        const maintenancePercent = parseFloat(data.maintenanceCostPercent || "2.0");
        annualMaintenanceCost = (investmentCost * maintenancePercent) / 100;
        break;
      case 'static':
        annualMaintenanceCost = parseFloat(data.maintenanceCostStatic || "0");
        break;
      case 'monthly':
        const monthlyCost = parseFloat(data.maintenanceCostMonthly || "0");
        annualMaintenanceCost = monthlyCost * 12;
        break;
      case 'yearly':
        annualMaintenanceCost = parseFloat(data.maintenanceCostYearly || "0");
        break;
      case 'onetime':
        // For one-time cost, amortize over project lifespan
        const onetimeCost = parseFloat(data.maintenanceCostOnetime || "0");
        annualMaintenanceCost = onetimeCost / projectLifespan;
        break;
      default:
        annualMaintenanceCost = 0;
    }
    
    const netAnnualSavings = annualElectricitySavings - annualWaterCost - annualMaintenanceCost;
    
    const paybackYears = netAnnualSavings > 0 ? investmentCost / netAnnualSavings : 0;
    const lifetimeSavings = netAnnualSavings * projectLifespan;
    const roi = investmentCost > 0 ? ((lifetimeSavings - investmentCost) / investmentCost) * 100 : 0;
    
    return {
      paybackPeriod: paybackYears < 1 ? `${(paybackYears * 12).toFixed(1)} months` : `${paybackYears.toFixed(1)} years`,
      roi: `${roi.toFixed(1)}%`,
      annualMaintenanceCost,
      netAnnualSavings,
      annualElectricitySavings
    };
  };



  const generateProposal = () => {
    console.log("Generating proposal with data:", chillerData);
    setIsProposalGenerated(true);
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
                        <p className="text-sm text-muted-foreground">
                          Commercial electricity rate in your area
                        </p>
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
                        <p className="text-sm text-muted-foreground">
                          Municipal/industrial water rate per kiloliter
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="maintenanceCostType">Maintenance Cost Type</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Choose how you want to specify maintenance costs:<br/>
                                • Percentage: As % of initial investment<br/>
                                • Static: Fixed annual amount<br/>
                                • Monthly: Monthly cost (×12 for annual)<br/>
                                • Yearly: Direct annual cost<br/>
                                • One-time: One-time cost (amortized)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Select 
                          value={chillerData.maintenanceCostType || "percentage"} 
                          onValueChange={(value) => handleInputChange("maintenanceCostType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select maintenance cost type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">
                              <div className="flex items-center gap-2">
                                <span>💰</span>
                                <span>Percentage of Investment</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="static">
                              <div className="flex items-center gap-2">
                                <span>📊</span>
                                <span>Static Annual Amount</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="monthly">
                              <div className="flex items-center gap-2">
                                <span>📅</span>
                                <span>Monthly Amount</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="yearly">
                              <div className="flex items-center gap-2">
                                <span>🗓️</span>
                                <span>Yearly Amount</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="onetime">
                              <div className="flex items-center gap-2">
                                <span>⚡</span>
                                <span>One-time Cost</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Choose how you want to specify maintenance costs
                        </p>
                      </div>
                    </div>

                    {/* Dynamic maintenance cost input based on selected type */}
                    <div className="space-y-2">
                      {chillerData.maintenanceCostType === "percentage" && (
                        <>
                          <Label htmlFor="maintenanceCostPercent">Maintenance Cost (% of Investment)</Label>
                          <Input
                            id="maintenanceCostPercent"
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={chillerData.maintenanceCostPercent || "2.0"}
                            onChange={(e) => handleInputChange("maintenanceCostPercent", e.target.value)}
                            placeholder="e.g., 2.0"
                          />
                          <p className="text-sm text-muted-foreground">
                            Typical range: 1.5% - 3% of investment cost
                          </p>
                        </>
                      )}

                      {chillerData.maintenanceCostType === "static" && (
                        <>
                          <Label htmlFor="maintenanceCostStatic">Annual Maintenance Cost (₹)</Label>
                          <Input
                            id="maintenanceCostStatic"
                            type="number"
                            min="0"
                            value={chillerData.maintenanceCostStatic || ""}
                            onChange={(e) => handleInputChange("maintenanceCostStatic", e.target.value)}
                            placeholder="e.g., 50000"
                          />
                          <p className="text-sm text-muted-foreground">
                            Fixed annual maintenance cost in rupees
                          </p>
                        </>
                      )}

                      {chillerData.maintenanceCostType === "monthly" && (
                        <>
                          <Label htmlFor="maintenanceCostMonthly">Monthly Maintenance Cost (₹)</Label>
                          <Input
                            id="maintenanceCostMonthly"
                            type="number"
                            min="0"
                            value={chillerData.maintenanceCostMonthly || ""}
                            onChange={(e) => handleInputChange("maintenanceCostMonthly", e.target.value)}
                            placeholder="e.g., 4000"
                          />
                          <p className="text-sm text-muted-foreground">
                            Will be multiplied by 12 for annual cost calculation
                          </p>
                        </>
                      )}

                      {chillerData.maintenanceCostType === "yearly" && (
                        <>
                          <Label htmlFor="maintenanceCostYearly">Yearly Maintenance Cost (₹)</Label>
                          <Input
                            id="maintenanceCostYearly"
                            type="number"
                            min="0"
                            value={chillerData.maintenanceCostYearly || ""}
                            onChange={(e) => handleInputChange("maintenanceCostYearly", e.target.value)}
                            placeholder="e.g., 48000"
                          />
                          <p className="text-sm text-muted-foreground">
                            Direct annual maintenance cost in rupees
                          </p>
                        </>
                      )}

                      {chillerData.maintenanceCostType === "onetime" && (
                        <>
                          <Label htmlFor="maintenanceCostOnetime">One-time Maintenance Cost (₹)</Label>
                          <Input
                            id="maintenanceCostOnetime"
                            type="number"
                            min="0"
                            value={chillerData.maintenanceCostOnetime || ""}
                            onChange={(e) => handleInputChange("maintenanceCostOnetime", e.target.value)}
                            placeholder="e.g., 100000"
                          />
                          <p className="text-sm text-muted-foreground">
                            Will be amortized over project lifespan for annual calculation
                          </p>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="chillerFanCFM" className="text-sm font-medium">
                          Chiller Fan CFM
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 ml-1 inline" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Cubic Feet per Minute - used to calculate water consumption</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Input
                          id="chillerFanCFM"
                          type="number"
                          value={chillerData.chillerFanCFM || "300000"}
                          onChange={(e) => handleInputChange("chillerFanCFM", e.target.value)}
                          placeholder="e.g., 300000"
                          className="bg-white/50"
                        />
                        <p className="text-xs text-orange-600">
                          Used to auto-calculate water consumption
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="waterConsumption" className="text-sm font-medium">
                          Water Consumption (kL/year)
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 ml-1 inline" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Auto-calculated: 4 liters per 1000 CFM × 8760 hours</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Input
                          id="waterConsumption"
                          type="number"
                          value={chillerData.waterConsumption || "1200"}
                          onChange={(e) => handleInputChange("waterConsumption", e.target.value)}
                          placeholder="e.g., 1200"
                          className="bg-gray-100"
                          readOnly
                        />
                        <p className="text-xs text-blue-600">
                          Auto-calculated from CFM using thumb rule
                        </p>
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

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Financial Metrics (Real-time)</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Payback Period:</span>
                          <div className="font-mono text-lg text-green-600">{chillerData.paybackPeriod}</div>
                        </div>
                        <div>
                          <span className="text-blue-700">ROI:</span>
                          <div className="font-mono text-lg text-green-600">{chillerData.roi}</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-blue-200">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-blue-600">Annual Maintenance:</span>
                            <div className="font-mono text-sm">
                              ₹{(() => {
                                const metrics = calculateFinancialMetrics(chillerData);
                                return (metrics.annualMaintenanceCost || 0).toLocaleString('en-IN');
                              })()}
                            </div>
                          </div>
                          <div>
                            <span className="text-green-600">Net Annual Savings:</span>
                            <div className="font-mono text-sm">
                              ₹{(() => {
                                const metrics = calculateFinancialMetrics(chillerData);
                                return (metrics.netAnnualSavings || 0).toLocaleString('en-IN');
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        <strong>Note:</strong> All financial metrics are calculated in real-time based on your inputs
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

              {/* Comprehensive Chiller Analysis Parameters - Based on Proven Chiller Analyzer */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* OEM Specifications */}
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
                        <option value="R1234ze">R-1234ze (Low GWP)</option>
                        <option value="R717">R-717 (Ammonia)</option>
                        <option value="R744">R-744 (CO2)</option>
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

                {/* Actual Sensor Data */}
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="evapLWT">Evap LWT (°C)</Label>
                        <Input
                          id="evapLWT"
                          type="number"
                          step="0.1"
                          value={chillerData.evapLWT || "12.0"}
                          onChange={(e) => handleInputChange("evapLWT", e.target.value)}
                          placeholder="e.g., 12.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evapEWT">Evap EWT (°C)</Label>
                        <Input
                          id="evapEWT"
                          type="number"
                          step="0.1"
                          value={chillerData.evapEWT || "7.0"}
                          onChange={(e) => handleInputChange("evapEWT", e.target.value)}
                          placeholder="e.g., 7.0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="superheat">Superheat (K)</Label>
                        <Input
                          id="superheat"
                          type="number"
                          step="0.1"
                          value={chillerData.superheat || "8.6"}
                          onChange={(e) => handleInputChange("superheat", e.target.value)}
                          placeholder="e.g., 8.6"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subcooling">Subcooling (K)</Label>
                        <Input
                          id="subcooling"
                          type="number"
                          step="0.1"
                          value={chillerData.subcooling || "0.0"}
                          onChange={(e) => handleInputChange("subcooling", e.target.value)}
                          placeholder="e.g., 0.0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Conditions */}
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
                        <p className="text-sm text-muted-foreground">
                          WBT calculated automatically using Stull formula
                        </p>
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

                {/* System Parameters */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Parameters</CardTitle>
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
                      <p className="text-sm text-muted-foreground">
                        Accounts for motor, mechanical, and heat losses
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Calculated Performance Preview</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Pressure Ratio:</span>
                          <div className="font-mono text-lg">
                            {((parseFloat(chillerData.condPressure || "1244") / parseFloat(chillerData.evapPressure || "307.7"))).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <span className="text-green-700">Superheat:</span>
                          <div className="font-mono text-lg">{chillerData.superheat || "8.6"} K</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        <strong>Note:</strong> Based on proven Daikin RWAD900CZ-XS analysis methodology
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
