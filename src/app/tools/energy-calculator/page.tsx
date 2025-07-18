"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calculator, Zap, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function EnergyCalculator() {
  const [currentPower, setCurrentPower] = useState("");
  const [proposedPower, setProposedPower] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [electricityRate, setElectricityRate] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [results, setResults] = useState<any>(null);

  const calculateSavings = () => {
    const currentKW = parseFloat(currentPower) || 0;
    const proposedKW = parseFloat(proposedPower) || 0;
    const hours = parseFloat(operatingHours) || 0;
    const rate = parseFloat(electricityRate) || 0;

    const currentAnnualKWh = currentKW * hours * 365;
    const proposedAnnualKWh = proposedKW * hours * 365;
    const energySavingsKWh = currentAnnualKWh - proposedAnnualKWh;
    const costSavings = energySavingsKWh * rate;
    const efficiencyImprovement = ((energySavingsKWh / currentAnnualKWh) * 100);

    setResults({
      currentAnnualKWh: currentAnnualKWh.toFixed(0),
      proposedAnnualKWh: proposedAnnualKWh.toFixed(0),
      energySavingsKWh: energySavingsKWh.toFixed(0),
      costSavings: costSavings.toFixed(2),
      efficiencyImprovement: efficiencyImprovement.toFixed(1),
      co2Reduction: (energySavingsKWh * 0.0004).toFixed(2) // Approximate CO2 reduction in tons
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Energy Efficiency Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Calculate Energy Savings</h2>
            <p className="text-muted-foreground">
              Compare current vs proposed equipment to determine energy and cost savings
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Information</CardTitle>
                <CardDescription>
                  Enter the specifications for current and proposed equipment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="equipmentType">Equipment Type</Label>
                  <Select value={equipmentType} onValueChange={setEquipmentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lighting">LED Lighting</SelectItem>
                      <SelectItem value="motor">Electric Motor</SelectItem>
                      <SelectItem value="hvac">HVAC System</SelectItem>
                      <SelectItem value="compressor">Air Compressor</SelectItem>
                      <SelectItem value="pump">Water Pump</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPower">Current Power (kW)</Label>
                    <Input
                      id="currentPower"
                      type="number"
                      value={currentPower}
                      onChange={(e) => setCurrentPower(e.target.value)}
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proposedPower">Proposed Power (kW)</Label>
                    <Input
                      id="proposedPower"
                      type="number"
                      value={proposedPower}
                      onChange={(e) => setProposedPower(e.target.value)}
                      placeholder="e.g., 6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Operating Hours per Day</Label>
                  <Input
                    id="operatingHours"
                    type="number"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="e.g., 12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="electricityRate">Electricity Rate ($/kWh)</Label>
                  <Input
                    id="electricityRate"
                    type="number"
                    step="0.01"
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(e.target.value)}
                    placeholder="e.g., 0.12"
                  />
                </div>

                <Button onClick={calculateSavings} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Savings
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
                <CardDescription>
                  Energy savings and financial impact analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Energy Savings</span>
                        </div>
                        <p className="text-2xl font-bold">{results.energySavingsKWh}</p>
                        <p className="text-sm text-muted-foreground">kWh/year</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Cost Savings</span>
                        </div>
                        <p className="text-2xl font-bold">${results.costSavings}</p>
                        <p className="text-sm text-muted-foreground">per year</p>
                      </div>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Efficiency Improvement</span>
                      </div>
                      <p className="text-xl font-bold">{results.efficiencyImprovement}%</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Annual Energy Consumption</h4>
                      <div className="flex justify-between text-sm">
                        <span>Current: {results.currentAnnualKWh} kWh</span>
                        <span>Proposed: {results.proposedAnnualKWh} kWh</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Environmental Impact</Badge>
                        <span className="text-sm">CO₂ Reduction: {results.co2Reduction} tons/year</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter equipment specifications to calculate energy savings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Tools */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Quick Calculations</h3>
            <Tabs defaultValue="payback" className="w-full">
              <TabsList>
                <TabsTrigger value="payback">Payback Period</TabsTrigger>
                <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
                <TabsTrigger value="lifecycle">Lifecycle Cost</TabsTrigger>
              </TabsList>
              
              <TabsContent value="payback" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Simple Payback Period</CardTitle>
                    <CardDescription>Calculate how long it takes to recover the initial investment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Initial Investment ($)</Label>
                        <Input placeholder="e.g., 15000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Annual Savings ($)</Label>
                        <Input placeholder={results ? results.costSavings : "0"} />
                      </div>
                    </div>
                    <Button className="mt-4">Calculate Payback</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roi" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Return on Investment</CardTitle>
                    <CardDescription>Calculate ROI over different time periods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">ROI calculation tools will be implemented here</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lifecycle" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lifecycle Cost Analysis</CardTitle>
                    <CardDescription>Compare total cost of ownership over equipment lifetime</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Lifecycle cost analysis tools will be implemented here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
