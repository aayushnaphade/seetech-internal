"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, TrendingUp, TrendingDown, DollarSign, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

interface Equipment {
  power: number;
  efficiency: number;
  operatingHours: number;
  energyRate: number;
}

interface Calculation {
  currentConsumption: number;
  proposedConsumption: number;
  savings: number;
  costSavings: number;
  roi: number;
  payback: number;
}

export default function EnergyCalculatorPage() {
  const [current, setCurrent] = useState<Equipment>({
    power: 100,
    efficiency: 80,
    operatingHours: 8760,
    energyRate: 0.12
  });

  const [proposed, setProposed] = useState<Equipment>({
    power: 80,
    efficiency: 95,
    operatingHours: 8760,
    energyRate: 0.12
  });

  const [investmentCost, setInvestmentCost] = useState<number>(10000);

  const calculateSavings = (): Calculation => {
    const currentConsumption = (current.power * current.operatingHours) / (current.efficiency / 100);
    const proposedConsumption = (proposed.power * proposed.operatingHours) / (proposed.efficiency / 100);
    const savings = currentConsumption - proposedConsumption;
    const costSavings = savings * current.energyRate;
    const roi = (costSavings / investmentCost) * 100;
    const payback = investmentCost / costSavings;

    return {
      currentConsumption,
      proposedConsumption,
      savings,
      costSavings,
      roi,
      payback
    };
  };

  const results = calculateSavings();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Energy Efficiency Calculator</h1>
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
                  <BreadcrumbPage>Energy Calculator</BreadcrumbPage>
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
              <CardContent>
                <Tabs defaultValue="current" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="current">Current Equipment</TabsTrigger>
                    <TabsTrigger value="proposed">Proposed Equipment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="current" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-power">Power Rating (kW)</Label>
                      <Input
                        id="current-power"
                        type="number"
                        value={current.power}
                        onChange={(e) => setCurrent({...current, power: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-efficiency">Efficiency (%)</Label>
                      <Input
                        id="current-efficiency"
                        type="number"
                        value={current.efficiency}
                        onChange={(e) => setCurrent({...current, efficiency: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-hours">Operating Hours/Year</Label>
                      <Input
                        id="current-hours"
                        type="number"
                        value={current.operatingHours}
                        onChange={(e) => setCurrent({...current, operatingHours: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-rate">Energy Rate ($/kWh)</Label>
                      <Input
                        id="current-rate"
                        type="number"
                        step="0.01"
                        value={current.energyRate}
                        onChange={(e) => setCurrent({...current, energyRate: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="proposed" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="proposed-power">Power Rating (kW)</Label>
                      <Input
                        id="proposed-power"
                        type="number"
                        value={proposed.power}
                        onChange={(e) => setProposed({...proposed, power: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proposed-efficiency">Efficiency (%)</Label>
                      <Input
                        id="proposed-efficiency"
                        type="number"
                        value={proposed.efficiency}
                        onChange={(e) => setProposed({...proposed, efficiency: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proposed-hours">Operating Hours/Year</Label>
                      <Input
                        id="proposed-hours"
                        type="number"
                        value={proposed.operatingHours}
                        onChange={(e) => setProposed({...proposed, operatingHours: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proposed-rate">Energy Rate ($/kWh)</Label>
                      <Input
                        id="proposed-rate"
                        type="number"
                        step="0.01"
                        value={proposed.energyRate}
                        onChange={(e) => setProposed({...proposed, energyRate: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label htmlFor="investment">Investment Cost ($)</Label>
                  <Input
                    id="investment"
                    type="number"
                    value={investmentCost}
                    onChange={(e) => setInvestmentCost(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Energy Savings Analysis</CardTitle>
                <CardDescription>
                  Financial and environmental impact of the proposed upgrade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Energy Consumption */}
                  <div>
                    <h3 className="font-semibold mb-3">Energy Consumption</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {results.currentConsumption.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Current kWh/year</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {results.proposedConsumption.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Proposed kWh/year</div>
                      </div>
                    </div>
                  </div>

                  {/* Savings */}
                  <div>
                    <h3 className="font-semibold mb-3">Annual Savings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Energy Savings</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {results.savings.toLocaleString()} kWh
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {((results.savings / results.currentConsumption) * 100).toFixed(1)}% reduction
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Cost Savings</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">
                            ${results.costSavings.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">per year</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROI Analysis */}
                  <div>
                    <h3 className="font-semibold mb-3">Investment Analysis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">ROI</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {results.roi.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">annual return</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingDown className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Payback</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {results.payback.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">years</div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-center">
                      <Badge variant={results.roi > 15 ? "default" : results.roi > 10 ? "secondary" : "outline"}>
                        {results.roi > 15 ? "Excellent Investment" : 
                         results.roi > 10 ? "Good Investment" : 
                         "Consider Alternatives"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
