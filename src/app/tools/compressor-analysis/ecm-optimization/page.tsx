'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, Thermometer, Filter, Droplets, Snowflake, Gauge, Workflow, Home, Wrench, ArrowLeft, Info, CheckCircle, AlertTriangle } from 'lucide-react';

// Type definitions
interface CompressorBasicInfo {
  make: string;
  model: string;
  type: 'reciprocating' | 'screw' | 'centrifugal';
  stages: number;
  ratedPressureCutIn: number;
  ratedPressureCutOut: number;
  motorRating: number;
  operatingHours: number;
  loadUnloadDuration: number;
  fad: number;
}

interface ECMResult {
  method: string;
  description: string;
  currentCondition: string;
  improvedCondition: string;
  energySavingPercent: number;
  powerSavedKw: number;
  annualSavings: number;
  implementation: string;
}

export default function ECMOptimizationPage() {
  // Basic compressor information
  const [basicInfo, setBasicInfo] = useState<CompressorBasicInfo>({
    make: '',
    model: '',
    type: 'screw',
    stages: 1,
    ratedPressureCutIn: 6.0,
    ratedPressureCutOut: 8.0,
    motorRating: 37,
    operatingHours: 8,
    loadUnloadDuration: 80,
    fad: 100
  });

  // ECM Data States
  const [ecm1Data, setEcm1Data] = useState({
    ambientTemp: 30,
    intakeTemp: 35,
    implementationCost: 415000 // ₹4,15,000 (improved ventilation and ducting)
  });

  const [ecm2Data, setEcm2Data] = useState({
    filterType: '',
    initialPressureDrop: 400,
    finalPressureDrop: 50,
    implementationCost: 166000 // ₹1,66,000 (filter monitoring systems)
  });

  const [ecm3Data, setEcm3Data] = useState({
    relativeHumidity: 75,
    distanceFromHeatSource: 5,
    implementationCost: 249000 // ₹2,49,000 (humidity control equipment)
  });

  const [ecm4Data, setEcm4Data] = useState({
    intercoolerInletTemp: 35,
    intercoolerOutletTemp: 26.6,
    aftercoolerTemp: 30,
    coolingTowerReturnTemp: 32,
    coolingWaterFlowRate: 100,
    scalingPresent: false,
    implementationCost: 1245000 // ₹12,45,000 (intercooler upgrades)
  });

  const [ecm5Data, setEcm5Data] = useState({
    operationalCutIn: 7.5,
    operationalCutOut: 9.0,
    targetCutIn: 6.5,
    targetCutOut: 8.0,
    implementationCost: 83000 // ₹83,000 (pressure optimization controls)
  });

  const [ecm6Data, setEcm6Data] = useState({
    pipeDiameters: '80',
    totalLength: 200,
    pressureDropFarthest: 0.5,
    leaksPresent: true,
    currentPipeDiameter: 65,
    proposedPipeDiameter: 100,
    implementationCost: 2075000 // ₹20,75,000 (piping upgrades and leak repairs)
  });

  const [results, setResults] = useState<ECMResult[]>([]);
  const [activeTab, setActiveTab] = useState('basic');

  // Calculate ECM results
  const calculateECMResults = () => {
    const results: ECMResult[] = [];
    const ratedPowerKw = basicInfo.motorRating;
    const annualOperatingHours = basicInfo.operatingHours * 365;
    const energyCostPerKwh = 8.5; // Indian industrial electricity rate in INR per kWh

    // ECM 1: Inlet Air Temperature Optimization
    const tempDiff = ecm1Data.intakeTemp - ecm1Data.ambientTemp;
    const ecm1Savings = tempDiff / 4; // Formula from requirements
    const ecm1PowerSaved = (ratedPowerKw * ecm1Savings) / 100;
    const ecm1AnnualSavings = ecm1PowerSaved * annualOperatingHours * energyCostPerKwh;

    results.push({
      method: 'ECM 1: Inlet Air Temperature Optimization',
      description: 'Reduce inlet air temperature by improving ventilation and air intake design',
      currentCondition: `Intake temp: ${ecm1Data.intakeTemp}°C, Ambient: ${ecm1Data.ambientTemp}°C`,
      improvedCondition: `Reduce intake temp to match ambient temperature`,
      energySavingPercent: Math.max(0, ecm1Savings),
      powerSavedKw: Math.max(0, ecm1PowerSaved),
      annualSavings: Math.max(0, ecm1AnnualSavings),
      implementation: 'Install proper ventilation, relocate air intake, use ducting from cooler areas'
    });

    // ECM 2: Air Filter Quality Monitoring
    const pressureDropDiff = ecm2Data.initialPressureDrop - ecm2Data.finalPressureDrop;
    const ecm2Savings = 0.00875 * pressureDropDiff; // Formula from requirements
    const ecm2PowerSaved = (ratedPowerKw * ecm2Savings) / 100;
    const ecm2AnnualSavings = ecm2PowerSaved * annualOperatingHours * energyCostPerKwh;

    results.push({
      method: 'ECM 2: Air Filter Quality Monitoring',
      description: 'Maintain clean air filters to reduce pressure drop',
      currentCondition: `Pressure drop: ${ecm2Data.initialPressureDrop} mmWC`,
      improvedCondition: `Reduce pressure drop to ${ecm2Data.finalPressureDrop} mmWC`,
      energySavingPercent: Math.max(0, ecm2Savings),
      powerSavedKw: Math.max(0, ecm2PowerSaved),
      annualSavings: Math.max(0, ecm2AnnualSavings),
      implementation: 'Regular filter cleaning/replacement, install pressure drop monitoring'
    });

    // ECM 3: Humidity Monitoring
    const ecm3Savings = ecm3Data.relativeHumidity > 70 ? 2.5 : 0; // Estimated savings for high humidity
    const ecm3PowerSaved = (ratedPowerKw * ecm3Savings) / 100;
    const ecm3AnnualSavings = ecm3PowerSaved * annualOperatingHours * energyCostPerKwh;

    results.push({
      method: 'ECM 3: Humidity Monitoring',
      description: 'Control ambient humidity to reduce compressor wear and dryer load',
      currentCondition: `Relative humidity: ${ecm3Data.relativeHumidity}%`,
      improvedCondition: `Maintain humidity below 60%`,
      energySavingPercent: ecm3Savings,
      powerSavedKw: ecm3PowerSaved,
      annualSavings: ecm3AnnualSavings,
      implementation: 'Install dehumidification, improve ventilation, relocate compressor'
    });

    // ECM 4: Intercooler Water Temperature Optimization
    const ecm4Savings = basicInfo.stages > 1 ? 
      0.018 * ecm4Data.intercoolerOutletTemp + 4.42 : 0; // Formula from requirements
    const ecm4PowerSaved = (ratedPowerKw * ecm4Savings) / 100;
    const ecm4AnnualSavings = ecm4PowerSaved * annualOperatingHours * energyCostPerKwh;

    results.push({
      method: 'ECM 4: Intercooler Water Temperature Optimization',
      description: 'Optimize cooling system for multi-stage compressors',
      currentCondition: `Intercooler outlet: ${ecm4Data.intercoolerOutletTemp}°C`,
      improvedCondition: `Optimize cooling to reduce interstage temperature`,
      energySavingPercent: Math.max(0, ecm4Savings),
      powerSavedKw: Math.max(0, ecm4PowerSaved),
      annualSavings: Math.max(0, ecm4AnnualSavings),
      implementation: 'Improve cooling tower efficiency, clean heat exchangers, optimize water flow'
    });

    // ECM 5: Pressure Optimization
    const pressureReduction = Math.max(0, ecm5Data.operationalCutOut - ecm5Data.targetCutOut);
    const ecm5Savings = 6 * pressureReduction; // Formula from requirements
    const ecm5PowerSaved = (ratedPowerKw * ecm5Savings) / 100;
    const ecm5AnnualSavings = ecm5PowerSaved * annualOperatingHours * energyCostPerKwh;

    results.push({
      method: 'ECM 5: Pressure Optimization',
      description: 'Reduce operating pressure to minimum required level',
      currentCondition: `Operating pressure: ${ecm5Data.operationalCutOut} bar`,
      improvedCondition: `Reduce to: ${ecm5Data.targetCutOut} bar`,
      energySavingPercent: Math.max(0, ecm5Savings),
      powerSavedKw: Math.max(0, ecm5PowerSaved),
      annualSavings: Math.max(0, ecm5AnnualSavings),
      implementation: 'Adjust pressure settings, audit end-use requirements, optimize distribution'
    });

    // ECM 6: Distribution Network Optimization
    const getPressureDropSavings = (currentDiam: number, proposedDiam: number) => {
      const savings = {
        40: 9.3984,
        50: 3.432,
        65: 1.1616,
        80: 0.2112,
        100: 0.1056
      };
      const currentSavings = savings[currentDiam as keyof typeof savings] || 0;
      const proposedSavings = savings[proposedDiam as keyof typeof savings] || 0;
      return currentSavings - proposedSavings;
    };

    const ecm6PowerSaved = getPressureDropSavings(ecm6Data.currentPipeDiameter, ecm6Data.proposedPipeDiameter);
    const ecm6Savings = (ecm6PowerSaved / ratedPowerKw) * 100;
    const ecm6AnnualSavings = ecm6PowerSaved * annualOperatingHours * energyCostPerKwh;

    results.push({
      method: 'ECM 6: Distribution Network Optimization',
      description: 'Optimize pipe sizing and fix leaks in distribution network',
      currentCondition: `Pipe diameter: ${ecm6Data.currentPipeDiameter}mm, Leaks present: ${ecm6Data.leaksPresent ? 'Yes' : 'No'}`,
      improvedCondition: `Upgrade to: ${ecm6Data.proposedPipeDiameter}mm, Fix all leaks`,
      energySavingPercent: Math.max(0, ecm6Savings),
      powerSavedKw: Math.max(0, ecm6PowerSaved),
      annualSavings: Math.max(0, ecm6AnnualSavings),
      implementation: 'Replace undersized pipes, fix all leaks, optimize network layout'
    });

    setResults(results);
  };

  const getTotalSavings = () => {
    return results.reduce((total, result) => ({
      energySavingPercent: total.energySavingPercent + result.energySavingPercent,
      powerSavedKw: total.powerSavedKw + result.powerSavedKw,
      annualSavings: total.annualSavings + result.annualSavings
    }), { energySavingPercent: 0, powerSavedKw: 0, annualSavings: 0 });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tools" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Engineering Tools
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tools/compressor-analysis" className="flex items-center gap-2">
              Compressor Analysis
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>ECM Optimization</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Link href="/tools/compressor-analysis">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Analysis Tool
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6" />
            Compressor Energy Conservation Methods (ECM) Tool
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Analyze and optimize energy consumption through 6 proven Energy Conservation Methods
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="ecm1" className="flex items-center gap-1">
            <Thermometer className="h-3 w-3" />
            ECM 1
          </TabsTrigger>
          <TabsTrigger value="ecm2" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            ECM 2
          </TabsTrigger>
          <TabsTrigger value="ecm3" className="flex items-center gap-1">
            <Droplets className="h-3 w-3" />
            ECM 3
          </TabsTrigger>
          <TabsTrigger value="ecm4" className="flex items-center gap-1">
            <Snowflake className="h-3 w-3" />
            ECM 4
          </TabsTrigger>
          <TabsTrigger value="ecm5" className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            ECM 5
          </TabsTrigger>
          <TabsTrigger value="ecm6" className="flex items-center gap-1">
            <Workflow className="h-3 w-3" />
            ECM 6
          </TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        {/* Basic Compressor Information */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Compressor Basic Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Provide basic compressor details to establish baseline efficiency and applicable measures
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Compressor Make</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Atlas Copco, Ingersoll Rand"
                    value={basicInfo.make}
                    onChange={(e) => setBasicInfo({...basicInfo, make: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Compressor Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., GA37VSD"
                    value={basicInfo.model}
                    onChange={(e) => setBasicInfo({...basicInfo, model: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Compressor Type</Label>
                  <Select value={basicInfo.type} onValueChange={(value: any) => setBasicInfo({...basicInfo, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reciprocating">Reciprocating</SelectItem>
                      <SelectItem value="screw">Screw</SelectItem>
                      <SelectItem value="centrifugal">Centrifugal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stages">Number of Stages</Label>
                  <Input
                    id="stages"
                    type="number"
                    min="1"
                    max="3"
                    value={basicInfo.stages}
                    onChange={(e) => setBasicInfo({...basicInfo, stages: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cutIn">Rated Pressure Cut-in (bar)</Label>
                  <Input
                    id="cutIn"
                    type="number"
                    step="0.1"
                    value={basicInfo.ratedPressureCutIn}
                    onChange={(e) => setBasicInfo({...basicInfo, ratedPressureCutIn: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cutOut">Rated Pressure Cut-out (bar)</Label>
                  <Input
                    id="cutOut"
                    type="number"
                    step="0.1"
                    value={basicInfo.ratedPressureCutOut}
                    onChange={(e) => setBasicInfo({...basicInfo, ratedPressureCutOut: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motorRating">Motor Rating (kW)</Label>
                  <Input
                    id="motorRating"
                    type="number"
                    step="0.1"
                    value={basicInfo.motorRating}
                    onChange={(e) => setBasicInfo({...basicInfo, motorRating: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Operating Hours per Day</Label>
                  <Input
                    id="operatingHours"
                    type="number"
                    min="1"
                    max="24"
                    value={basicInfo.operatingHours}
                    onChange={(e) => setBasicInfo({...basicInfo, operatingHours: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loadDuration">Load Duration (%)</Label>
                  <Input
                    id="loadDuration"
                    type="number"
                    min="0"
                    max="100"
                    value={basicInfo.loadUnloadDuration}
                    onChange={(e) => setBasicInfo({...basicInfo, loadUnloadDuration: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fad">Free Air Delivery (m³/min)</Label>
                  <Input
                    id="fad"
                    type="number"
                    step="0.1"
                    value={basicInfo.fad}
                    onChange={(e) => setBasicInfo({...basicInfo, fad: Number(e.target.value)})}
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This basic information helps determine baseline efficiency and applicable energy conservation measures.
                  Ensure all values are accurate for reliable analysis results.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ECM 1: Inlet Air Temperature Optimization */}
        <TabsContent value="ecm1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                ECM 1: Inlet Air Temperature Optimization
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Optimize the temperature of air entering the compressor to reduce power consumption
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ambientTemp">Ambient Air Temperature (°C)</Label>
                  <Input
                    id="ambientTemp"
                    type="number"
                    step="0.1"
                    value={ecm1Data.ambientTemp}
                    onChange={(e) => setEcm1Data({...ecm1Data, ambientTemp: Number(e.target.value)})}
                  />
                  <p className="text-xs text-muted-foreground">Temperature of surrounding air</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intakeTemp">Intake Air Temperature (°C)</Label>
                  <Input
                    id="intakeTemp"
                    type="number"
                    step="0.1"
                    value={ecm1Data.intakeTemp}
                    onChange={(e) => setEcm1Data({...ecm1Data, intakeTemp: Number(e.target.value)})}
                  />
                  <p className="text-xs text-muted-foreground">Temperature at compressor intake</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ecm1Cost">Implementation Cost (₹)</Label>
                  <Input
                    id="ecm1Cost"
                    type="number"
                    value={ecm1Data.implementationCost}
                    onChange={(e) => setEcm1Data({...ecm1Data, implementationCost: Number(e.target.value)})}
                  />
                  <p className="text-xs text-muted-foreground">Estimated cost for implementation</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Formula Used</h4>
                <p className="text-sm">Energy Savings (%) = (Ambient Air Temp - Intake Air Temp) / 4</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Every 4°C reduction in intake temperature typically provides 1% energy savings
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">Sample Data Reference</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Inlet Temperature (°C)</TableHead>
                      <TableHead>Relative Air Delivery (%)</TableHead>
                      <TableHead>Power Saved (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow><TableCell>10</TableCell><TableCell>102</TableCell><TableCell>1.4</TableCell></TableRow>
                    <TableRow><TableCell>15.5</TableCell><TableCell>100</TableCell><TableCell>0</TableCell></TableRow>
                    <TableRow><TableCell>21.1</TableCell><TableCell>98.1</TableCell><TableCell>-1.3</TableCell></TableRow>
                    <TableRow><TableCell>26.6</TableCell><TableCell>96.3</TableCell><TableCell>-2.5</TableCell></TableRow>
                    <TableRow><TableCell>32.2</TableCell><TableCell>94.1</TableCell><TableCell>-4.0</TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tools & Methods:</strong> Use thermometer to measure temperatures at different times of day. 
                  Consider installing ducting from cooler areas or improving ventilation around the compressor.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ECM 2: Air Filter Quality Monitoring */}
        <TabsContent value="ecm2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                ECM 2: Air Filter Quality Monitoring
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor and maintain air filter conditions to minimize pressure drop
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filterType">Filter Type/Model</Label>
                  <Input
                    id="filterType"
                    placeholder="e.g., Standard pleated filter"
                    value={ecm2Data.filterType}
                    onChange={(e) => setEcm2Data({...ecm2Data, filterType: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialDrop">Initial Pressure Drop (mmWC)</Label>
                  <Input
                    id="initialDrop"
                    type="number"
                    value={ecm2Data.initialPressureDrop}
                    onChange={(e) => setEcm2Data({...ecm2Data, initialPressureDrop: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finalDrop">Final Pressure Drop (mmWC)</Label>
                  <Input
                    id="finalDrop"
                    type="number"
                    value={ecm2Data.finalPressureDrop}
                    onChange={(e) => setEcm2Data({...ecm2Data, finalPressureDrop: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ecm2Cost">Implementation Cost (₹)</Label>
                  <Input
                    id="ecm2Cost"
                    type="number"
                    value={ecm2Data.implementationCost}
                    onChange={(e) => setEcm2Data({...ecm2Data, implementationCost: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Formula Used</h4>
                <p className="text-sm">Power Saved (%) = 0.00875 × (Old Pressure Drop - New Pressure Drop)</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Measured in mmWC (millimeters of water column)
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2">Sample Data Reference</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Initial Pressure Drop (mmWC)</TableHead>
                      <TableHead>Final Pressure Drop (mmWC)</TableHead>
                      <TableHead>Power Saved (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow><TableCell>200</TableCell><TableCell>0</TableCell><TableCell>1.75</TableCell></TableRow>
                    <TableRow><TableCell>400</TableCell><TableCell>0</TableCell><TableCell>3.5</TableCell></TableRow>
                    <TableRow><TableCell>600</TableCell><TableCell>0</TableCell><TableCell>5.25</TableCell></TableRow>
                    <TableRow><TableCell>800</TableCell><TableCell>0</TableCell><TableCell>7.0</TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tools & Methods:</strong> Use manometer to measure pressure drop across filters. 
                  Implement regular cleaning/replacement schedule and pressure drop monitoring system.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ECM 3: Humidity Monitoring */}
        <TabsContent value="ecm3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                ECM 3: Humidity Monitoring
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor ambient humidity levels to reduce compressor wear and dryer load
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="humidity">Relative Humidity (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    min="0"
                    max="100"
                    value={ecm3Data.relativeHumidity}
                    onChange={(e) => setEcm3Data({...ecm3Data, relativeHumidity: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Distance from Heat Sources (m)</Label>
                  <Input
                    id="distance"
                    type="number"
                    min="0"
                    value={ecm3Data.distanceFromHeatSource}
                    onChange={(e) => setEcm3Data({...ecm3Data, distanceFromHeatSource: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ecm3Cost">Implementation Cost (₹)</Label>
                  <Input
                    id="ecm3Cost"
                    type="number"
                    value={ecm3Data.implementationCost}
                    onChange={(e) => setEcm3Data({...ecm3Data, implementationCost: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Impact Assessment</h4>
                <p className="text-sm">Humid air causes increased wear on compressor components and increases dryer load</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Optimal humidity: Below 60% RH | Current status: {ecm3Data.relativeHumidity > 70 ? 'High - Action needed' : 'Acceptable'}
                </p>
              </div>

              <Alert variant={ecm3Data.relativeHumidity > 70 ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {ecm3Data.relativeHumidity > 70 
                    ? "High humidity detected! This can cause increased compressor wear and higher energy consumption."
                    : "Humidity levels are within acceptable range."}
                </AlertDescription>
              </Alert>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tools & Methods:</strong> Use portable RH sensor to monitor humidity. 
                  Visually inspect proximity to cooling towers or exhaust vents. Consider dehumidification systems.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ECM 4: Intercooler Water Temperature Optimization */}
        <TabsContent value="ecm4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Snowflake className="h-5 w-5" />
                ECM 4: Intercooler Water Temperature Optimization
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Optimize cooling system performance for multi-stage compressors
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {basicInfo.stages < 2 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This ECM applies only to multi-stage compressors. Your compressor has {basicInfo.stages} stage(s).
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="intercoolerInlet">Intercooler Inlet Water Temp (°C)</Label>
                  <Input
                    id="intercoolerInlet"
                    type="number"
                    step="0.1"
                    value={ecm4Data.intercoolerInletTemp}
                    onChange={(e) => setEcm4Data({...ecm4Data, intercoolerInletTemp: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intercoolerOutlet">Intercooler Outlet Water Temp (°C)</Label>
                  <Input
                    id="intercoolerOutlet"
                    type="number"
                    step="0.1"
                    value={ecm4Data.intercoolerOutletTemp}
                    onChange={(e) => setEcm4Data({...ecm4Data, intercoolerOutletTemp: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aftercooler">Aftercooler Water Temp (°C)</Label>
                  <Input
                    id="aftercooler"
                    type="number"
                    step="0.1"
                    value={ecm4Data.aftercoolerTemp}
                    onChange={(e) => setEcm4Data({...ecm4Data, aftercoolerTemp: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coolingTower">Cooling Tower Return Temp (°C)</Label>
                  <Input
                    id="coolingTower"
                    type="number"
                    step="0.1"
                    value={ecm4Data.coolingTowerReturnTemp}
                    onChange={(e) => setEcm4Data({...ecm4Data, coolingTowerReturnTemp: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flowRate">Cooling Water Flow Rate (L/min)</Label>
                  <Input
                    id="flowRate"
                    type="number"
                    value={ecm4Data.coolingWaterFlowRate}
                    onChange={(e) => setEcm4Data({...ecm4Data, coolingWaterFlowRate: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ecm4Cost">Implementation Cost (₹)</Label>
                  <Input
                    id="ecm4Cost"
                    type="number"
                    value={ecm4Data.implementationCost}
                    onChange={(e) => setEcm4Data({...ecm4Data, implementationCost: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={ecm4Data.scalingPresent}
                    onChange={(e) => setEcm4Data({...ecm4Data, scalingPresent: e.target.checked})}
                  />
                  Signs of scaling in heat exchangers
                </Label>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Formula Used</h4>
                <p className="text-sm">Energy Consumption Change (%) = 0.018 × (Second-stage inlet temp in °C) + 4.42</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Poor cooling increases next stage inlet temperature, reducing efficiency
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900 mb-2">Sample Data Reference</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cooling Type</TableHead>
                      <TableHead>First Stage Inlet (°C)</TableHead>
                      <TableHead>Second Stage Inlet (°C)</TableHead>
                      <TableHead>Energy Change (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow><TableCell>Imperfect Cooling</TableCell><TableCell>21.1</TableCell><TableCell>26.6</TableCell><TableCell>+2.1</TableCell></TableRow>
                    <TableRow><TableCell>Perfect Cooling</TableCell><TableCell>21.1</TableCell><TableCell>21.1</TableCell><TableCell>Reference</TableCell></TableRow>
                    <TableRow><TableCell>Chilled Water</TableCell><TableCell>21.1</TableCell><TableCell>15.5</TableCell><TableCell>-2.1</TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tools & Methods:</strong> Use thermometers for all temperature measurements. 
                  Water flow sensor for flow rate. Visual inspection for scaling in heat exchangers.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ECM 5: Pressure Optimization */}
        <TabsContent value="ecm5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                ECM 5: Pressure Optimization
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Optimize operating pressure to minimize energy consumption
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opCutIn">Current Cut-in Pressure (bar)</Label>
                  <Input
                    id="opCutIn"
                    type="number"
                    step="0.1"
                    value={ecm5Data.operationalCutIn}
                    onChange={(e) => setEcm5Data({...ecm5Data, operationalCutIn: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="opCutOut">Current Cut-out Pressure (bar)</Label>
                  <Input
                    id="opCutOut"
                    type="number"
                    step="0.1"
                    value={ecm5Data.operationalCutOut}
                    onChange={(e) => setEcm5Data({...ecm5Data, operationalCutOut: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetCutIn">Target Cut-in Pressure (bar)</Label>
                  <Input
                    id="targetCutIn"
                    type="number"
                    step="0.1"
                    value={ecm5Data.targetCutIn}
                    onChange={(e) => setEcm5Data({...ecm5Data, targetCutIn: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetCutOut">Target Cut-out Pressure (bar)</Label>
                  <Input
                    id="targetCutOut"
                    type="number"
                    step="0.1"
                    value={ecm5Data.targetCutOut}
                    onChange={(e) => setEcm5Data({...ecm5Data, targetCutOut: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ecm5Cost">Implementation Cost (₹)</Label>
                  <Input
                    id="ecm5Cost"
                    type="number"
                    value={ecm5Data.implementationCost}
                    onChange={(e) => setEcm5Data({...ecm5Data, implementationCost: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Formula Used</h4>
                <p className="text-sm">Energy Savings (%) = 6 × (Pressure Reduction in bar)</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Each bar of pressure reduction typically saves 6% energy
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-900 mb-2">Sample Data Reference</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Initial Pressure (bar)</TableHead>
                      <TableHead>Reduced Pressure (bar)</TableHead>
                      <TableHead>Single-stage Savings (%)</TableHead>
                      <TableHead>Two-stage Savings (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow><TableCell>6.8</TableCell><TableCell>6.1</TableCell><TableCell>4%</TableCell><TableCell>4%</TableCell></TableRow>
                    <TableRow><TableCell>6.8</TableCell><TableCell>5.5</TableCell><TableCell>8%</TableCell><TableCell>8%</TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Ensure reduced pressure still meets all end-use requirements. 
                  Audit all pneumatic equipment before implementing pressure reduction.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ECM 6: Distribution Network Optimization */}
        <TabsContent value="ecm6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                ECM 6: Distribution Network Optimization
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Optimize pipe sizing and eliminate leaks in the distribution network
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPipe">Current Pipe Diameter (mm)</Label>
                  <Select value={ecm6Data.currentPipeDiameter.toString()} onValueChange={(value) => setEcm6Data({...ecm6Data, currentPipeDiameter: Number(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="40">40 mm</SelectItem>
                      <SelectItem value="50">50 mm</SelectItem>
                      <SelectItem value="65">65 mm</SelectItem>
                      <SelectItem value="80">80 mm</SelectItem>
                      <SelectItem value="100">100 mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposedPipe">Proposed Pipe Diameter (mm)</Label>
                  <Select value={ecm6Data.proposedPipeDiameter.toString()} onValueChange={(value) => setEcm6Data({...ecm6Data, proposedPipeDiameter: Number(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="40">40 mm</SelectItem>
                      <SelectItem value="50">50 mm</SelectItem>
                      <SelectItem value="65">65 mm</SelectItem>
                      <SelectItem value="80">80 mm</SelectItem>
                      <SelectItem value="100">100 mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalLength">Total Piping Length (m)</Label>
                  <Input
                    id="totalLength"
                    type="number"
                    value={ecm6Data.totalLength}
                    onChange={(e) => setEcm6Data({...ecm6Data, totalLength: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pressureDrop">Pressure Drop at Farthest Point (bar)</Label>
                  <Input
                    id="pressureDrop"
                    type="number"
                    step="0.1"
                    value={ecm6Data.pressureDropFarthest}
                    onChange={(e) => setEcm6Data({...ecm6Data, pressureDropFarthest: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ecm6Cost">Implementation Cost (₹)</Label>
                  <Input
                    id="ecm6Cost"
                    type="number"
                    value={ecm6Data.implementationCost}
                    onChange={(e) => setEcm6Data({...ecm6Data, implementationCost: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={ecm6Data.leaksPresent}
                    onChange={(e) => setEcm6Data({...ecm6Data, leaksPresent: e.target.checked})}
                  />
                  Leaks present in joints/fittings
                </Label>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Formula Used</h4>
                <p className="text-sm">Power Saved (kW) = 5.28 × (Old Pressure Drop - New Pressure Drop)</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Undersized pipes cause pressure drop, wasting compressor effort
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-900 mb-2">Sample Data Reference</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pipe Diameter (mm)</TableHead>
                      <TableHead>Pressure Drop (bar/100m)</TableHead>
                      <TableHead>Power Saved vs 100mm (kW)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow><TableCell>40</TableCell><TableCell>1.8</TableCell><TableCell>9.40</TableCell></TableRow>
                    <TableRow><TableCell>50</TableCell><TableCell>0.65</TableCell><TableCell>3.43</TableCell></TableRow>
                    <TableRow><TableCell>65</TableCell><TableCell>0.22</TableCell><TableCell>1.16</TableCell></TableRow>
                    <TableRow><TableCell>80</TableCell><TableCell>0.04</TableCell><TableCell>0.21</TableCell></TableRow>
                    <TableRow><TableCell>100</TableCell><TableCell>0.02</TableCell><TableCell>0.11</TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>

              <Alert variant={ecm6Data.leaksPresent ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {ecm6Data.leaksPresent 
                    ? "Leaks detected! This significantly increases energy waste. Consider implementing leak detection and repair program."
                    : "No leaks reported. Continue regular leak detection and repair maintenance."}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results */}
        <TabsContent value="results">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ECM Analysis Results</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={calculateECMResults} className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Calculate ECM Results
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-green-700">
                            {getTotalSavings().energySavingPercent.toFixed(1)}%
                          </div>
                          <p className="text-sm text-green-600">Total Energy Savings</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-blue-700">
                            {getTotalSavings().powerSavedKw.toFixed(1)} kW
                          </div>
                          <p className="text-sm text-blue-600">Total Power Saved</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-purple-700">
                            {formatCurrency(getTotalSavings().annualSavings)}
                          </div>
                          <p className="text-sm text-purple-600">Annual Savings</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Detailed Results Table */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Detailed ECM Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ECM Method</TableHead>
                                <TableHead>Current Condition</TableHead>
                                <TableHead>Improved Condition</TableHead>
                                <TableHead>Energy Savings (%)</TableHead>
                                <TableHead>Power Saved (kW)</TableHead>
                                <TableHead>Annual Savings</TableHead>
                                <TableHead>Implementation</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {results.map((result, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    <div>
                                      {result.method}
                                      <Badge className="ml-2" variant={result.energySavingPercent > 5 ? "default" : result.energySavingPercent > 2 ? "secondary" : "outline"}>
                                        {result.energySavingPercent > 5 ? "High Impact" : result.energySavingPercent > 2 ? "Medium Impact" : "Low Impact"}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{result.description}</p>
                                  </TableCell>
                                  <TableCell className="text-sm">{result.currentCondition}</TableCell>
                                  <TableCell className="text-sm">{result.improvedCondition}</TableCell>
                                  <TableCell>
                                    <span className={`font-semibold ${result.energySavingPercent > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                      {result.energySavingPercent.toFixed(2)}%
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <span className={`font-semibold ${result.powerSavedKw > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                                      {result.powerSavedKw.toFixed(2)} kW
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <span className={`font-semibold ${result.annualSavings > 0 ? 'text-purple-600' : 'text-gray-500'}`}>
                                      {formatCurrency(result.annualSavings)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-sm">{result.implementation}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Implementation Priority */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Implementation Priority Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {results
                            .sort((a, b) => b.energySavingPercent - a.energySavingPercent)
                            .slice(0, 3)
                            .map((result, index) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">
                                    Priority {index + 1}: {result.method.split(':')[1]?.trim()}
                                  </h4>
                                  <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                                    {result.energySavingPercent.toFixed(1)}% savings
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{result.implementation}</p>
                                <div className="flex gap-4 text-sm">
                                  <span>Annual Savings: <strong>{formatCurrency(result.annualSavings)}</strong></span>
                                  <span>Power Saved: <strong>{result.powerSavedKw.toFixed(1)} kW</strong></span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Complete the ECM data in the previous tabs and click "Calculate ECM Results" to see the analysis.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
