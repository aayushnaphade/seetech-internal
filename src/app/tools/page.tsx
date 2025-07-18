'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  Calculator, 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Activity, 
  Lightbulb, 
  Zap,
  Home,
  Wrench,
  ArrowRight
} from 'lucide-react';

const tools = [
  {
    title: "Compressor Analysis",
    description: "Analyze compressor power consumption and energy savings at different suction temperatures",
    icon: Zap,
    href: "/tools/compressor-analysis",
    status: "available",
    badge: { text: "New", variant: "default" as const }
  },
  {
    title: "Energy Calculator",
    description: "Calculate energy consumption and potential savings for various equipment",
    icon: Calculator,
    href: "/tools/energy-calculator",
    status: "available",
    badge: null
  },
  {
    title: "Load Analysis",
    description: "Analyze electrical load patterns and identify optimization opportunities",
    icon: BarChart3,
    href: "/tools/load-analysis",
    status: "coming-soon",
    badge: { text: "Soon", variant: "secondary" as const }
  },
  {
    title: "Proposal Generator",
    description: "Generate professional energy efficiency proposals and reports",
    icon: FileText,
    href: "/tools/proposal-generator",
    status: "beta",
    badge: { text: "Beta", variant: "outline" as const }
  },
  {
    title: "ROI Calculator",
    description: "Calculate return on investment for energy efficiency projects",
    icon: TrendingUp,
    href: "/tools/roi-calculator",
    status: "coming-soon",
    badge: { text: "Soon", variant: "secondary" as const }
  },
  {
    title: "HVAC Optimizer",
    description: "Optimize HVAC systems for energy efficiency and comfort",
    icon: Activity,
    href: "/tools/hvac-optimizer",
    status: "coming-soon",
    badge: { text: "Soon", variant: "secondary" as const }
  },
  {
    title: "Lighting Designer",
    description: "Design energy-efficient lighting systems and calculate savings",
    icon: Lightbulb,
    href: "/tools/lighting-designer",
    status: "coming-soon",
    badge: { text: "Soon", variant: "secondary" as const }
  }
];

export default function ToolsPage() {
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
            <BreadcrumbPage className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Engineering Tools
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Engineering Tools</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive suite of engineering tools for energy efficiency analysis, 
          optimization, and reporting
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isAvailable = tool.status === 'available';
          const isBeta = tool.status === 'beta';
          
          return (
            <Card key={tool.title} className="relative group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      {tool.badge && (
                        <Badge variant={tool.badge.variant} className="mt-1">
                          {tool.badge.text}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
                
                {isAvailable || isBeta ? (
                  <Link href={tool.href}>
                    <Button 
                      className="w-full group-hover:bg-primary/90 transition-colors"
                      variant={isBeta ? "outline" : "default"}
                    >
                      {isBeta ? "Try Beta" : "Open Tool"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full" variant="outline">
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="text-center pt-8">
        <p className="text-sm text-muted-foreground">
          More tools are being developed. Check back regularly for updates.
        </p>
      </div>
    </div>
  );
}
