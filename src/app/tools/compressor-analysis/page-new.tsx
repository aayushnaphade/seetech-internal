'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home, Wrench, Zap, BarChart3, Calculator, Gauge, TrendingUp, Thermometer, Filter, Droplets, Snowflake, Workflow } from 'lucide-react';
import Link from 'next/link';

const subTools = [
  {
    title: "Performance Analyzer",
    description: "Analyze compressor performance with temperature optimization and efficiency calculations",
    icon: BarChart3,
    href: "/tools/compressor-analysis/performance-analyzer",
    status: "available",
    badge: { text: "Active", variant: "default" as const },
    features: ["Temperature optimization", "CoolProp integration", "Performance charts", "Efficiency analysis"]
  },
  {
    title: "ECM Optimizer",
    description: "6 Energy Conservation Methods for comprehensive compressor optimization",
    icon: Calculator,
    href: "/tools/compressor-analysis/ecm-optimization",
    status: "available",
    badge: { text: "Active", variant: "default" as const },
    features: ["Inlet air optimization", "Filter monitoring", "Humidity control", "Pressure optimization"]
  },
  {
    title: "Load Pattern Analysis",
    description: "Analyze load patterns and optimize operation cycles for maximum efficiency",
    icon: Gauge,
    href: "/tools/compressor-analysis/load-analysis",
    status: "coming-soon",
    badge: { text: "Soon", variant: "secondary" as const },
    features: ["Load/unload cycles", "Daily pattern analysis", "Capacity optimization", "Energy scheduling"]
  },
  {
    title: "Efficiency Tracker",
    description: "Real-time monitoring and tracking of compressor efficiency metrics",
    icon: TrendingUp,
    href: "/tools/compressor-analysis/efficiency-tracker",
    status: "coming-soon",
    badge: { text: "Soon", variant: "secondary" as const },
    features: ["Real-time monitoring", "Historical trends", "Performance alerts", "Predictive maintenance"]
  }
];

const ecmMethods = [
  { id: 1, method: "Inlet Air Temperature Optimization", icon: Thermometer, color: "text-red-600" },
  { id: 2, method: "Air Filter Quality Monitoring", icon: Filter, color: "text-blue-600" },
  { id: 3, method: "Humidity Monitoring", icon: Droplets, color: "text-cyan-600" },
  { id: 4, method: "Inter Cooler Water Temperature Optimization", icon: Snowflake, color: "text-indigo-600" },
  { id: 5, method: "Pressure Optimization", icon: Gauge, color: "text-green-600" },
  { id: 6, method: "Physical Layout Optimization", icon: Workflow, color: "text-purple-600" },
];

export default function CompressorAnalysisPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tools" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Tools
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Compressor Analysis</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Compressor Analysis Suite</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive compressor performance analysis and energy conservation tools for industrial efficiency optimization
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Analysis</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Temperature</div>
            <p className="text-xs text-muted-foreground">
              Inlet optimization analysis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ECM Methods</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6 ECMs</div>
            <p className="text-xs text-muted-foreground">
              Energy conservation measures
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Optimization</div>
            <p className="text-xs text-muted-foreground">
              Power & cost savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Real-time</div>
            <p className="text-xs text-muted-foreground">
              Performance tracking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sub-tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subTools.map((tool, index) => {
          const Icon = tool.icon;
          const isAvailable = tool.status === "available";
          
          return (
            <Card 
              key={index} 
              className={`transition-all duration-200 ${
                isAvailable 
                  ? "hover:shadow-md cursor-pointer border-l-4 border-l-orange-500" 
                  : "opacity-70 cursor-not-allowed"
              }`}
            >
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${isAvailable ? "text-orange-600" : "text-muted-foreground"}`} />
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                  {tool.badge && (
                    <Badge variant={tool.badge.variant}>
                      {tool.badge.text}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
                
                {/* Feature list */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Features:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {isAvailable ? (
                  <Link href={tool.href}>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Launch Tool
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ECM Methods Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-orange-600" />
            Energy Conservation Methods (ECM) Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ecmMethods.map((ecm) => {
              const Icon = ecm.icon;
              return (
                <div key={ecm.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${ecm.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">ECM {ecm.id}</p>
                    <p className="text-xs text-muted-foreground">{ecm.method}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Link href="/tools/compressor-analysis/ecm-optimization">
              <Button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                Explore All ECM Methods
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Compressor Analysis Suite</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The Compressor Analysis Suite provides comprehensive tools for analyzing and optimizing compressed air systems 
            in industrial facilities. Our tools help identify energy conservation opportunities, optimize operational 
            parameters, and implement proven energy-saving measures for maximum efficiency and cost reduction.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Key Capabilities:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Comprehensive performance analysis</li>
                <li>• 6 proven energy conservation methods</li>
                <li>• Real-time efficiency monitoring</li>
                <li>• Optimization recommendations</li>
                <li>• Cost-benefit analysis</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Technical Features:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Temperature optimization algorithms</li>
                <li>• Pressure drop analysis</li>
                <li>• Filter performance monitoring</li>
                <li>• Load pattern optimization</li>
                <li>• Energy savings calculations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
