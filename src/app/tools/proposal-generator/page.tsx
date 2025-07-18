"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Building2, Calculator, Download, Eye } from "lucide-react";
import Link from "next/link";

export default function ProposalGenerator() {
  const [formData, setFormData] = useState({
    clientName: "",
    projectName: "",
    projectType: "",
    currentConsumption: "",
    proposedSavings: "",
    investmentCost: "",
    paybackPeriod: "",
    description: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateProposal = () => {
    console.log("Generating proposal with data:", formData);
    // Here you would implement the actual proposal generation logic
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
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Proposal Generator</h1>
              <Badge variant="outline">Beta</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Generate Energy Efficiency Proposal</h2>
            <p className="text-muted-foreground">
              Create professional proposals for energy efficiency projects
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>
                  Enter the details for your energy efficiency proposal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    placeholder="e.g., ABC Manufacturing Inc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange("projectName", e.target.value)}
                    placeholder="e.g., LED Lighting Retrofit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lighting">Lighting Upgrade</SelectItem>
                      <SelectItem value="hvac">HVAC Optimization</SelectItem>
                      <SelectItem value="motors">Motor Efficiency</SelectItem>
                      <SelectItem value="building">Building Envelope</SelectItem>
                      <SelectItem value="solar">Solar Installation</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentConsumption">Current Consumption (kWh/year)</Label>
                    <Input
                      id="currentConsumption"
                      type="number"
                      value={formData.currentConsumption}
                      onChange={(e) => handleInputChange("currentConsumption", e.target.value)}
                      placeholder="e.g., 50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proposedSavings">Proposed Savings (%)</Label>
                    <Input
                      id="proposedSavings"
                      type="number"
                      value={formData.proposedSavings}
                      onChange={(e) => handleInputChange("proposedSavings", e.target.value)}
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investmentCost">Investment Cost ($)</Label>
                    <Input
                      id="investmentCost"
                      type="number"
                      value={formData.investmentCost}
                      onChange={(e) => handleInputChange("investmentCost", e.target.value)}
                      placeholder="e.g., 25000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paybackPeriod">Payback Period (years)</Label>
                    <Input
                      id="paybackPeriod"
                      type="number"
                      step="0.1"
                      value={formData.paybackPeriod}
                      onChange={(e) => handleInputChange("paybackPeriod", e.target.value)}
                      placeholder="e.g., 3.2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the energy efficiency measures and expected benefits..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Proposal Preview</CardTitle>
                <CardDescription>
                  Preview of your generated proposal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">
                      {formData.projectName || "Project Name"}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">{formData.clientName || "Client Name"}</span>
                    </div>
                    <Badge variant="outline">
                      {formData.projectType || "Project Type"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Project Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Consumption:</span>
                        <p className="font-medium">{formData.currentConsumption || "0"} kWh/year</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Projected Savings:</span>
                        <p className="font-medium">{formData.proposedSavings || "0"}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Investment Cost:</span>
                        <p className="font-medium">${formData.investmentCost || "0"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payback Period:</span>
                        <p className="font-medium">{formData.paybackPeriod || "0"} years</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.description || "Project description will appear here..."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <Button onClick={generateProposal} className="flex-1">
              <Calculator className="h-4 w-4 mr-2" />
              Generate Full Proposal
            </Button>
            <Button variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview PDF
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
                  <CardTitle className="text-base">Basic Energy Audit</CardTitle>
                  <CardDescription className="text-sm">Standard template for energy audits</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Lighting Retrofit</CardTitle>
                  <CardDescription className="text-sm">Template for LED lighting projects</CardDescription>
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
