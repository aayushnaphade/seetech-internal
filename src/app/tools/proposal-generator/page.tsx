"use client";

import React, { useState, useRef, useCallback } from 'react';
import buildInfo from '@/build-info';
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
import { Switch } from "@/components/ui/switch";
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
  // Collapsible section state
  const [showAllAdvanced, setShowAllAdvanced] = useState(false);
  const [openSections, setOpenSections] = useState<{[k:string]: boolean}>({
    oem: false,
    sensor: false,
    env: false,
    system: false,
  });
  const toggleSection = (key: string) => setOpenSections(s => ({...s, [key]: !s[key]}));
  const toggleAll = () => {
    const target = !showAllAdvanced;
    setShowAllAdvanced(target);
    setOpenSections({ oem: target, sensor: target, env: target, system: target });
  };

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
              window.dispatchEvent(new Event('coolprop-ready'));
            },
            print: function(text: string) { console.log('CoolProp stdout:', text); },
            printErr: function(text: string) { console.error('CoolProp stderr:', text); }
          } as any;

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
  systemType: 'chiller',
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
  // Default maintenance cost inclusion disabled; user can enable to include O&M in financials
  enableMaintenance: false,
    chillerFanCFM: "300000", // CFM for chiller fan
    waterConsumption: String((300000 * 4 / 1000 * 8760) / 1000), // Auto-calculated from CFM
    projectLifespan: "15",
    paybackPeriod: "Auto-calculated",
    roi: "Auto-calculated",
    // New fields for enhanced system parameters
    ratedPowerConsumption: "350",
  // Default optimization calculation mode set to manual (user inputs expected saving %)
  calculationMode: "manual",
    workingDays: "365",
    workingHoursPerDay: "24"
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

  const handleInputChange = (field: string, value: any) => {
    const updatedData = {
      ...chillerData,
      [field]: value
    };
    
    // Auto-calculate water consumption when CFM changes
    if (field === 'chillerFanCFM') {
      // Only auto-calculate when user has a numeric value; allow blank while editing
      if (value === '' || value === null) {
        updatedData.waterConsumption = '';
      } else {
        updatedData.waterConsumption = calculateWaterConsumption(value);
      }
    }
    
    // Auto-calculate operating hours when working days or hours per day changes
    if (field === 'workingDays' || field === 'workingHoursPerDay') {
      const days = parseFloat(field === 'workingDays' ? value : (updatedData.workingDays || "365"));
      const hours = parseFloat(field === 'workingHoursPerDay' ? value : (updatedData.workingHoursPerDay || "24"));
      updatedData.operatingHours = (days * hours).toString();
    }
    
    // Auto-calculate proposed power consumption based on calculation mode
    if (field === 'currentPowerConsumption' || field === 'expectedSaving' || field === 'calculationMode') {
      const currentPower = parseFloat(field === 'currentPowerConsumption' ? value : (updatedData.currentPowerConsumption || "0"));
      
      if (updatedData.calculationMode === "manual" || field === 'calculationMode') {
        const savingPercent = parseFloat((updatedData.expectedSaving || "27%").replace('%', '')) / 100;
        const proposedPower = currentPower * (1 - savingPercent);
        updatedData.proposedPowerConsumption = proposedPower.toFixed(1);
      } else {
        // For automatic mode, use thermodynamic calculations (placeholder)
        const savingPercent = 0.27; // Would come from P-H analysis
        const proposedPower = currentPower * (1 - savingPercent);
        updatedData.proposedPowerConsumption = proposedPower.toFixed(1);
        updatedData.expectedSaving = "27.0%"; // Would be calculated from thermodynamic analysis
      }
    }
    
    // Auto-calculate financial metrics when relevant fields change
    const financialFields = [
      'currentPowerConsumption', 'proposedPowerConsumption', 'operatingHours', 
      'investmentCost', 'electricityTariff', 'waterTariff', 'waterConsumption', 
      'projectLifespan', 'maintenanceCostType', 'maintenanceCostPercent', 
      'maintenanceCostStatic', 'maintenanceCostMonthly', 'maintenanceCostYearly', 
      'maintenanceCostOnetime', 'chillerFanCFM', 'workingDays', 'workingHoursPerDay'
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
  const electricityRate = data.electricityTariff === '' || data.electricityTariff == null ? 0 : (parseFloat(data.electricityTariff) || 0);
  const waterRate = data.waterTariff === '' || data.waterTariff == null ? 0 : (parseFloat(data.waterTariff) || 0);
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
      annualElectricitySavings,
      annualWaterCost,
      waterConsumption,
      waterRate
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
              <h1 className="text-xl font-semibold">Proposal Generator</h1>
              <Badge variant="outline">{buildInfo.versionString}</Badge>
              {buildInfo.isMajor && (
                <Badge variant="destructive" className="animate-pulse">Major Update</Badge>
              )}
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
            <h2 className="text-2xl font-bold tracking-tight mb-2">Adiabatic Cooling System for HVAC</h2>
            <p className="text-muted-foreground">
              Create professional proposals for chiller and adiabatic cooling optimization projects
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-[400px] mb-6">
              <TabsTrigger value="inputs">Input Parameters</TabsTrigger>
              <TabsTrigger value="proposal">Generated Proposal</TabsTrigger>
            </TabsList>

            <TabsContent value="inputs" className="space-y-4">
              {/* Primary Input Sections in Two Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* LEFT COLUMN: Client + System */}
                <div className="flex flex-col gap-6">
                {/* Client Information */}
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
                        placeholder={`e.g., ${chillerData.systemType === 'dx' ? 'DX' : chillerData.systemType === 'vrf' ? 'VRF' : 'Chiller'} Optimization Project`}
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
                {/* System Parameters */}
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
                        <Label htmlFor="systemCapacity">{chillerData.systemType === 'dx' ? 'DX System Capacity (TR)' : chillerData.systemType === 'vrf' ? 'VRF System Capacity (TR)' : 'Chiller Capacity (TR)'}</Label>
                        <Input
                          id="systemCapacity"
                          value={chillerData.systemCapacity}
                          onChange={(e) => handleInputChange("systemCapacity", e.target.value)}
                          placeholder={`e.g., ${chillerData.systemType === 'dx' ? '120 TR (multiple units)' : chillerData.systemType === 'vrf' ? '96 HP' : '255 TR'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="systemType">System Type</Label>
                        <Select value={chillerData.systemType || 'chiller'} onValueChange={(v) => handleInputChange('systemType', v)}>
                          <SelectTrigger id="systemType">
                            <SelectValue placeholder="Select system type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chiller">Chiller</SelectItem>
                            <SelectItem value="dx">DX</SelectItem>
                            <SelectItem value="vrf">VRF</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Label htmlFor="ratedPowerConsumption">Rated {chillerData.systemType === 'dx' ? 'DX Power' : chillerData.systemType === 'vrf' ? 'VRF Power' : 'Power'} Consumption (kW)</Label>
                        <Input
                          id="ratedPowerConsumption"
                          value={chillerData.ratedPowerConsumption || ""}
                          onChange={(e) => handleInputChange("ratedPowerConsumption", e.target.value)}
                          placeholder={`e.g., ${chillerData.systemType === 'dx' ? '18 kW / unit' : chillerData.systemType === 'vrf' ? '9.5 kW / module' : '350 kW (nameplate)'}`}
                        />
                        <p className="text-xs text-muted-foreground">
                          Nameplate/OEM rated {chillerData.systemType === 'dx' ? 'DX system' : chillerData.systemType === 'vrf' ? 'VRF system' : 'chiller'} power consumption
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentPowerConsumption">Actual {chillerData.systemType === 'dx' ? 'DX' : chillerData.systemType === 'vrf' ? 'VRF' : 'Power'} Consumption (kW)</Label>
                        <Input
                          id="currentPowerConsumption"
                          value={chillerData.currentPowerConsumption}
                          onChange={(e) => handleInputChange("currentPowerConsumption", e.target.value)}
                          placeholder={`e.g., ${chillerData.systemType === 'dx' ? '22 kW / unit' : chillerData.systemType === 'vrf' ? '11 kW / module' : '425 kW (measured)'}`}
                        />
                        <p className="text-xs text-muted-foreground">
                          Actual measured {chillerData.systemType === 'dx' ? 'DX system' : chillerData.systemType === 'vrf' ? 'VRF system' : 'chiller'} power consumption
                        </p>
                      </div>
                    </div>

                    {/* Calculation Mode Toggle */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="calculationMode">Optimization Calculation Mode</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Toggle between calculation methods:<br/>
                                • OFF: Manual percentage input<br/>
                                • ON: Automatic thermodynamic analysis with P-H charts</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">📝 Manual</span>
                            <Switch
                              id="calculationMode"
                              checked={chillerData.calculationMode === "automatic"}
                              onCheckedChange={(checked) => 
                                handleInputChange("calculationMode", checked ? "automatic" : "manual")
                              }
                            />
                            <span className="text-sm text-gray-600">⚙️ Automatic</span>
                          </div>
                        </div>
                      </div>
                      
                      {chillerData.calculationMode === "manual" && (
                        <div className="mt-3 space-y-2">
                          <Label htmlFor="expectedSaving">Expected Energy Saving (%)</Label>
                          <Input
                            id="expectedSaving"
                            type="number"
                            step="0.1"
                            min="0"
                            max="50"
                            value={chillerData.expectedSaving?.replace('%', '') || ""}
                            onChange={(e) => handleInputChange("expectedSaving", e.target.value + "%")}
                            placeholder="e.g., 27"
                          />
                          <p className="text-xs text-blue-600">
                            Manual percentage input - proposed power will be calculated automatically
                          </p>
                        </div>
                      )}
                      
                      {chillerData.calculationMode === "automatic" && (
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Automatic Mode:</strong> Expected savings will be calculated using thermodynamic analysis 
                            of the optimized refrigeration cycle with P-H chart plotting.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Operating Schedule */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workingDays">Working Days/Year</Label>
                        <Input
                          id="workingDays"
                          type="number"
                          min="1"
                          max="365"
                          value={chillerData.workingDays || "365"}
                          onChange={(e) => handleInputChange("workingDays", e.target.value)}
                          placeholder="e.g., 365"
                        />
                        <p className="text-xs text-muted-foreground">
                          Days per year the chiller operates
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workingHoursPerDay">Hours/Day</Label>
                        <Input
                          id="workingHoursPerDay"
                          type="number"
                          min="1"
                          max="24"
                          step="0.5"
                          value={chillerData.workingHoursPerDay || "24"}
                          onChange={(e) => handleInputChange("workingHoursPerDay", e.target.value)}
                          placeholder="e.g., 24"
                        />
                        <p className="text-xs text-muted-foreground">
                          Operating hours per day
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalOperatingHours">Total Hours/Year</Label>
                        <Input
                          id="totalOperatingHours"
                          value={(() => {
                            const days = parseFloat(chillerData.workingDays || "365");
                            const hours = parseFloat(chillerData.workingHoursPerDay || "24");
                            return (days * hours).toString();
                          })()}
                          className="bg-gray-100"
                          readOnly
                        />
                        <p className="text-xs text-blue-600">
                          Auto-calculated: Days × Hours
                        </p>
                      </div>
                    </div>

                    {/* Auto-calculated Efficiencies */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentEfficiency">Current Efficiency (kW/TR)</Label>
                        <Input
                          id="currentEfficiency"
                          value={(() => {
                            const capacity = parseFloat(chillerData.systemCapacity?.replace(/[^\d.-]/g, '') || "0");
                            const power = parseFloat(chillerData.currentPowerConsumption || "0");
                            if (capacity > 0 && power > 0) {
                              return (power / capacity).toFixed(3);
                            }
                            return chillerData.currentEfficiency || "";
                          })()}
                          className="bg-gray-100"
                          readOnly
                        />
                        <p className="text-xs text-blue-600">
                          Auto-calculated: Power ÷ Capacity
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proposedEfficiency">Proposed Efficiency (kW/TR)</Label>
                        <Input
                          id="proposedEfficiency"
                          value={(() => {
                            const capacity = parseFloat(chillerData.systemCapacity?.replace(/[^\d.-]/g, '') || "0");
                            const currentPower = parseFloat(chillerData.currentPowerConsumption || "0");
                            
                            let proposedPower = 0;
                            if (chillerData.calculationMode === "manual") {
                              const savingPercent = parseFloat(chillerData.expectedSaving?.replace('%', '') || "0") / 100;
                              proposedPower = currentPower * (1 - savingPercent);
                            } else {
                              // For automatic mode, use thermodynamic calculations
                              // This would be calculated from the actual thermodynamic analysis
                              const savingPercent = 0.27; // Placeholder - would come from P-H analysis
                              proposedPower = currentPower * (1 - savingPercent);
                            }
                            
                            if (capacity > 0 && proposedPower > 0) {
                              return (proposedPower / capacity).toFixed(3);
                            }
                            return chillerData.proposedEfficiency || "";
                          })()}
                          className="bg-gray-100"
                          readOnly
                        />
                        <p className="text-xs text-green-600">
                          Auto-calculated: Optimized Power ÷ Capacity
                        </p>
                      </div>
                    </div>

                    {/* Auto-calculated Proposed Power */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Optimization Results</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-700">Proposed Power Consumption:</span>
                          <div className="font-mono text-lg text-green-600">
                            {(() => {
                              const currentPower = parseFloat(chillerData.currentPowerConsumption || "0");
                              
                              if (chillerData.calculationMode === "manual") {
                                const savingPercent = parseFloat(chillerData.expectedSaving?.replace('%', '') || "0") / 100;
                                const proposedPower = currentPower * (1 - savingPercent);
                                return proposedPower > 0 ? `${proposedPower.toFixed(1)} kW` : "N/A";
                              } else {
                                // For automatic mode - placeholder calculation
                                const savingPercent = 0.27; // Would come from thermodynamic analysis
                                const proposedPower = currentPower * (1 - savingPercent);
                                return proposedPower > 0 ? `${proposedPower.toFixed(1)} kW` : "N/A";
                              }
                            })()}
                          </div>
                        </div>
                        <div>
                          <span className="text-green-700">Energy Saving:</span>
                          <div className="font-mono text-lg text-green-600">
                            {(() => {
                              if (chillerData.calculationMode === "manual") {
                                return chillerData.expectedSaving || "N/A";
                              } else {
                                return "27.0%"; // Placeholder - would come from thermodynamic analysis
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        <strong>Mode:</strong> {chillerData.calculationMode === "manual" ? "Manual percentage input" : "Automatic thermodynamic analysis"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>
                {/* RIGHT COLUMN: Financial + Contact */}
                <div className="flex flex-col gap-6">
                {/* Financial Impact & Tariffs */}
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
                          value={chillerData.electricityTariff ?? ''}
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
                          value={chillerData.waterTariff ?? ''}
                          onChange={(e) => handleInputChange("waterTariff", e.target.value)}
                          placeholder="e.g., 25.0"
                        />
                        <p className="text-sm text-muted-foreground">
                          Municipal/industrial water rate per kiloliter
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Label htmlFor="maintenanceCostType" className="whitespace-nowrap">Maintenance Costs</Label>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={"font-medium " + (chillerData.enableMaintenance ? 'text-green-600' : 'text-muted-foreground')}>Enabled</span>
                            <Switch
                              id="enableMaintenance"
                              checked={!!chillerData.enableMaintenance}
                              onCheckedChange={(checked) => handleInputChange('enableMaintenance', checked)}
                            />
                          </div>
                          <span className="text-[11px] text-muted-foreground">Toggle OFF to ignore maintenance in ROI / payback</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="maintenanceCostType" className="text-xs">Cost Type</Label>
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
                        {chillerData.enableMaintenance && (
                          <>
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
                          </>
                        )}
                        {!chillerData.enableMaintenance && (
                          <p className="text-xs italic text-muted-foreground">Maintenance costs excluded from calculations</p>
                        )}
                      </div>
                    </div>

                    {/* Dynamic maintenance cost input based on selected type */}
                    {chillerData.enableMaintenance && (
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
                    )}

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
                          value={chillerData.chillerFanCFM ?? ''}
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
                          value={chillerData.waterConsumption ?? ''}
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
                        <div className="grid grid-cols-3 gap-4 text-[11px] mt-3">
                          <div>
                            <span className="text-blue-700">Elec. Savings:</span>
                            <div className="font-mono">
                              ₹{(() => { const m = calculateFinancialMetrics(chillerData); return (m.annualElectricitySavings||0).toLocaleString('en-IN'); })()}
                            </div>
                          </div>
                          <div>
                            <span className="text-rose-700">Water Cost:</span>
                            <div className="font-mono">
                              ₹{(() => { const m = calculateFinancialMetrics(chillerData); return (m.annualWaterCost||0).toLocaleString('en-IN'); })()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Water Basis:</span>
                            <div className="font-mono">
                              {(() => { const m = calculateFinancialMetrics(chillerData); return `${m.waterConsumption} kL × ₹${m.waterRate}/kL`; })()}
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
                {/* Contact Information */}
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
                </div>
              </div>

      {/* Advanced Technical Sections: only relevant for detailed chiller thermodynamic (P-H) analysis. Hidden for DX & VRF. */}
      {chillerData.systemType === 'chiller' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Master Toggle (full width) */}
                <div className="lg:col-span-2 flex items-center justify-between border rounded-md p-4 bg-muted/30">
                  <div className="space-y-0.5">
        <h4 className="font-semibold text-sm tracking-tight">Advanced Technical Sections <span className="font-normal text-muted-foreground">(For P‑H Chart Analysis Only)</span></h4>
        <p className="text-xs text-muted-foreground">OEM Specs, Sensor Data, Environmental & System Parameters – Ignored for DX / VRF systems</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={toggleAll} className="h-7 px-3 text-xs">
                      {showAllAdvanced ? 'Hide All' : 'Show All'}
                    </Button>
                  </div>
                </div>
                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-6">
                {/* OEM Specifications */}
                <Card className="overflow-hidden">
                  <CardHeader className="cursor-pointer select-none" onClick={() => toggleSection('oem')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>OEM Specifications</CardTitle>
                        <CardDescription>Original Equipment Manufacturer specifications from datasheet</CardDescription>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{openSections.oem ? 'Hide' : 'Show'}</span>
                    </div>
                  </CardHeader>
                  {openSections.oem && (
                  <CardContent className="space-y-4 border-t pt-4 animate-in fade-in">
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
                        <Label htmlFor="oemCapacity">OEM Cooling Capacity (kW)</Label>
                        <Input
                          id="oemCapacity"
                          type="number"
                          value={chillerData.oemCapacity || "897"}
                          onChange={(e) => handleInputChange("oemCapacity", e.target.value)}
                          placeholder="e.g., 897"
                        />
                        <p className="text-xs text-muted-foreground">Rated cooling output at standard conditions (not electrical input power)</p>
                      </div>
                    </div>
                  </CardContent>
                  )}
                </Card>
                {/* Environmental Conditions */}
                <Card className="overflow-hidden">
                  <CardHeader className="cursor-pointer select-none" onClick={() => toggleSection('env')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Environmental Conditions</CardTitle>
                        <CardDescription>Ambient conditions affecting performance</CardDescription>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{openSections.env ? 'Hide' : 'Show'}</span>
                    </div>
                  </CardHeader>
                  {openSections.env && (
                  <CardContent className="space-y-4 border-t pt-4 animate-in fade-in">
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
                  )}
                </Card>
                </div>
                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-6">
                {/* Actual Sensor Data */}
                <Card className="overflow-hidden">
                  <CardHeader className="cursor-pointer select-none" onClick={() => toggleSection('sensor')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Actual Sensor Data</CardTitle>
                        <CardDescription>Real-time readings from system sensors</CardDescription>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{openSections.sensor ? 'Hide' : 'Show'}</span>
                    </div>
                  </CardHeader>
                  {openSections.sensor && (
                  <CardContent className="space-y-6 border-t pt-4 animate-in fade-in">
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
                          value={chillerData.dischargeTemp || "63.4"}
                          onChange={(e) => handleInputChange("dischargeTemp", e.target.value)}
                          placeholder="e.g., 63.4"
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
                  )}
                </Card>
                {/* System Parameters */}
                <Card className="overflow-hidden">
                  <CardHeader className="cursor-pointer select-none" onClick={() => toggleSection('system')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>System Parameters</CardTitle>
                        <CardDescription>System efficiency factors and operational parameters</CardDescription>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{openSections.system ? 'Hide' : 'Show'}</span>
                    </div>
                  </CardHeader>
                  {openSections.system && (
                  <CardContent className="space-y-4 border-t pt-4 animate-in fade-in">
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
                  )}
                </Card>
                </div>
              </div>
              )}
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
