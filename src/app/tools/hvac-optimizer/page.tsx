'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home, Wrench, Zap, BarChart3, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const subTools = [
  {
    title: "P-H Analyzer",
    description: "Pressure-Enthalpy diagram analysis for vapor compression cycles",
    icon: BarChart3,
    href: "/tools/hvac-optimizer/ph-analyzer",
    status: "available",
    badge: { text: "New", variant: "default" as const }
  },
  {
    title: "Refrigeration Cycle Optimizer",
    description: "Optimize refrigeration cycle parameters for maximum efficiency",
    icon: Zap,
    href: "/tools/hvac-optimizer/cycle-optimizer",
    status: "coming-soon",
    badge: { text: "Soon", variant: "secondary" as const }
  },
  {
    title: "Chiller Performance",
    description: "Analyze and optimize chiller performance characteristics",
    icon: Settings,
    href: "/tools/hvac-optimizer/chiller-performance",
    status: "coming-soon",
    badge: { text: "Soon", variant: "secondary" as const }
  },
  {
    title: "Energy Efficiency Metrics",
    description: "Calculate COP, EER, and other efficiency metrics",
    icon: TrendingUp,
    href: "/tools/hvac-optimizer/efficiency-metrics",
    status: "coming-soon",
    badge: { text: "Soon", variant: "secondary" as const }
  }
];

export default function HVACOptimizerPage() {
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
            <BreadcrumbPage>HVAC Optimizer</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">HVAC Optimizer</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive HVAC system analysis and optimization tools for energy efficiency consulting
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Analysis</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">P-H Diagrams</div>
            <p className="text-xs text-muted-foreground">
              Thermodynamic cycle visualization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">COP Analysis</div>
            <p className="text-xs text-muted-foreground">
              Coefficient of Performance optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Energy Savings</div>
            <p className="text-xs text-muted-foreground">
              Optimization recommendations
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
                  ? "hover:shadow-md cursor-pointer border-l-4 border-l-blue-500" 
                  : "opacity-70 cursor-not-allowed"
              }`}
            >
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${isAvailable ? "text-blue-600" : "text-muted-foreground"}`} />
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                  {tool.badge && (
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tool.badge.variant === "default" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tool.badge.text}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
                
                {isAvailable ? (
                  <Link href={tool.href}>
                    <Button className="w-full">
                      Open Tool
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

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>About HVAC Optimizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The HVAC Optimizer suite provides professional-grade tools for analyzing and optimizing 
            heating, ventilation, air conditioning, and refrigeration systems. Each tool leverages 
            advanced thermodynamic calculations using CoolProp properties and professional visualization 
            with Plotly charts.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Key Features:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Real thermodynamic property calculations</li>
                <li>• Interactive P-H diagram visualization</li>
                <li>• Vapor compression cycle analysis</li>
                <li>• Performance optimization recommendations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Technical Capabilities:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• CoolProp WASM integration</li>
                <li>• Multiple refrigerant support</li>
                <li>• Professional report generation</li>
                <li>• Energy efficiency calculations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
