"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Lightbulb,
  Activity,
  PieChart,
  FileSpreadsheet,
  Building2,
  DollarSign,
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Leaf,
  Target,
  Gauge,
  BookOpen,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Area, AreaChart, PieChart as RechartsPieChart, Cell, Pie } from "recharts";
import DashboardLayout from "@/components/dashboard-layout";

// Sample data for charts
const monthlyData = [
  { month: "Jan", savings: 4000, projects: 3 },
  { month: "Feb", savings: 3000, projects: 2 },
  { month: "Mar", savings: 2000, projects: 4 },
  { month: "Apr", savings: 2780, projects: 3 },
  { month: "May", savings: 1890, projects: 2 },
  { month: "Jun", savings: 2390, projects: 5 },
];

const projectTypeData = [
  { name: "LED Retrofit", value: 35, color: "#0088FE" },
  { name: "HVAC Upgrade", value: 25, color: "#00C49F" },
  { name: "Solar Installation", value: 20, color: "#FFBB28" },
  { name: "Insulation", value: 15, color: "#FF8042" },
  { name: "Other", value: 5, color: "#8884D8" },
];

const chartConfig = {
  savings: {
    label: "Monthly Savings",
    color: "hsl(var(--chart-1))",
  },
  projects: {
    label: "Projects",
    color: "hsl(var(--chart-2))",
  },
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <p className="text-muted-foreground">
            Your comprehensive energy efficiency consultancy platform for calculations, analysis, and proposal generation.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                +3 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$47.2K</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Saved</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">MWh this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annual Impact</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$286K</div>
              <p className="text-xs text-muted-foreground">Projected annual savings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="solutions">SeeTech Solutions</TabsTrigger>
            <TabsTrigger value="tools">Engineering Tools</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Recent Activity and Quick Access */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">P-H Analyzer calculation completed</p>
                      <p className="text-xs text-muted-foreground">R134a vapor compression cycle - 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Energy calculator results exported</p>
                      <p className="text-xs text-muted-foreground">Industrial cooling system analysis - 15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New proposal generated</p>
                      <p className="text-xs text-muted-foreground">HVAC upgrade project proposal - 1 hour ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/tools/hvac-optimizer/ph-analyzer">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      P-H Analyzer
                    </Button>
                  </Link>
                  <Link href="/tools/energy-calculator">
                    <Button variant="outline" className="w-full justify-start">
                      <Calculator className="mr-2 h-4 w-4" />
                      Energy Calculator
                    </Button>
                  </Link>
                  <Link href="/tools/proposal-generator">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Proposal Generator
                    </Button>
                  </Link>
                  <Link href="/tools">
                    <Button variant="ghost" className="w-full justify-start">
                      View All Tools
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="solutions" className="space-y-4">
            {/* SeeTech Solutions */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Energy Efficiency Consulting
                  </CardTitle>
                  <CardDescription>
                    Comprehensive energy audits and efficiency optimization for industrial and commercial facilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Energy Audits</Badge>
                    <Badge variant="secondary">HVAC Optimization</Badge>
                    <Badge variant="secondary">Lighting Design</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our expert team provides detailed analysis using advanced thermodynamic modeling 
                    and cutting-edge calculation tools to maximize your energy savings.
                  </p>
                  <Button className="w-full">
                    Learn More
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    Refrigeration System Design
                  </CardTitle>
                  <CardDescription>
                    Custom refrigeration and cooling system design with advanced P-H diagram analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">P-H Analysis</Badge>
                    <Badge variant="secondary">CoolProp Integration</Badge>
                    <Badge variant="secondary">Cycle Optimization</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Leverage our advanced P-H Analyzer tool powered by CoolProp for precise 
                    thermodynamic calculations and optimal system design.
                  </p>
                  <Link href="/tools/hvac-optimizer/ph-analyzer">
                    <Button className="w-full">
                      Try P-H Analyzer
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Proposal & Documentation Services
                  </CardTitle>
                  <CardDescription>
                    Professional engineering reports, proposals, and compliance documentation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Technical Reports</Badge>
                    <Badge variant="secondary">ROI Analysis</Badge>
                    <Badge variant="secondary">Compliance Docs</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate professional proposals with our automated tools including detailed 
                    calculations, visualizations, and cost-benefit analysis.
                  </p>
                  <Link href="/tools/proposal-generator">
                    <Button className="w-full">
                      Generate Proposal
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Performance Monitoring & Optimization
                  </CardTitle>
                  <CardDescription>
                    Continuous monitoring and optimization of energy systems for maximum efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Real-time Monitoring</Badge>
                    <Badge variant="secondary">Performance Analytics</Badge>
                    <Badge variant="secondary">Predictive Maintenance</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Utilize our comprehensive analytics platform to track performance metrics, 
                    identify optimization opportunities, and ensure sustained efficiency gains.
                  </p>
                  <Button className="w-full" variant="outline">
                    Contact Us
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-4">
            {/* Engineering Tools Grid */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {/* HVAC Optimizer with Sub-tools */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    HVAC Optimizer Suite
                  </CardTitle>
                  <CardDescription>
                    Comprehensive HVAC system analysis and optimization tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Link href="/tools/hvac-optimizer/ph-analyzer" className="block">
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">P-H Analyzer</span>
                          <Badge variant="default" className="text-xs">Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Advanced pressure-enthalpy diagram analysis with CoolProp integration
                        </p>
                      </Link>
                    </div>
                    <div className="p-3 border rounded-lg opacity-60">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-sm">Cycle Optimizer</span>
                        <Badge variant="secondary" className="text-xs">Soon</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Optimize refrigeration cycle parameters for maximum efficiency
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg opacity-60">
                      <div className="flex items-center gap-2 mb-1">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-sm">Chiller Performance</span>
                        <Badge variant="secondary" className="text-xs">Soon</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Analyze and optimize chiller performance characteristics
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg opacity-60">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-sm">Efficiency Metrics</span>
                        <Badge variant="secondary" className="text-xs">Soon</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Calculate COP, EER, and other efficiency metrics
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/tools/hvac-optimizer/ph-analyzer" className="flex-1">
                      <Button className="w-full">Launch P-H Analyzer</Button>
                    </Link>
                    <Link href="/tools/hvac-optimizer">
                      <Button variant="outline" className="flex-shrink-0">View All</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Compressor Analysis Suite */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Compressor Analysis Suite
                  </CardTitle>
                  <CardDescription>
                    Energy conservation measures and compressor optimization tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Link href="/tools/compressor-analysis" className="block">
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">Performance Analyzer</span>
                          <Badge variant="default" className="text-xs">Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Analyze compressor performance with temperature optimization
                        </p>
                      </Link>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Link href="/tools/compressor-analysis/ecm-optimization" className="block">
                        <div className="flex items-center gap-2 mb-1">
                          <Calculator className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">ECM Optimizer</span>
                          <Badge variant="default" className="text-xs">Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          6 energy conservation methods for compressor optimization
                        </p>
                      </Link>
                    </div>
                    <div className="p-3 border rounded-lg opacity-60">
                      <div className="flex items-center gap-2 mb-1">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-sm">Load Analysis</span>
                        <Badge variant="secondary" className="text-xs">Soon</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Analyze load patterns and optimize operation cycles
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg opacity-60">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-sm">Efficiency Tracker</span>
                        <Badge variant="secondary" className="text-xs">Soon</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Track and monitor compressor efficiency over time
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/tools/compressor-analysis/ecm-optimization" className="flex-1">
                      <Button className="w-full">Launch ECM Optimizer</Button>
                    </Link>
                    <Link href="/tools/compressor-analysis">
                      <Button variant="outline" className="flex-shrink-0">View All</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Individual Tools */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Energy Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate energy consumption and savings for various equipment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tools/energy-calculator">
                    <Button className="w-full">Launch Calculator</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Proposal Generator
                  </CardTitle>
                  <CardDescription>
                    Generate professional energy efficiency proposals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tools/proposal-generator">
                    <Button className="w-full" variant="outline">
                      Create Proposal
                      <Badge variant="outline" className="ml-2">Beta</Badge>
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Load Analysis Tool
                  </CardTitle>
                  <CardDescription>
                    Analyze electrical loads and optimize power consumption
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tools/load-analysis">
                    <Button className="w-full" variant="outline">
                      Start Analysis
                      <Badge variant="secondary" className="ml-2">Soon</Badge>
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Lighting Design Tool
                  </CardTitle>
                  <CardDescription>
                    Design energy-efficient lighting systems and calculate ROI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" disabled>
                    Design Lighting
                    <Badge variant="secondary" className="ml-2">Soon</Badge>
                  </Button>
                </CardContent>
              </Card>

              {/* Tools Overview Link */}
              <Card className="col-span-full border-dashed border-2 hover:border-solid transition-all cursor-pointer">
                <CardContent className="flex items-center justify-center p-6">
                  <Link href="/tools" className="text-center">
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">View All Engineering Tools</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore our complete suite of engineering and analysis tools
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            {/* Knowledge Base */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Thermodynamics Fundamentals
                  </CardTitle>
                  <CardDescription>
                    Core concepts, formulas, and principles of thermodynamics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Heat Transfer</Badge>
                    <Badge variant="secondary">P-H Diagrams</Badge>
                    <Badge variant="secondary">Phase Changes</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive reference materials covering thermodynamic cycles, 
                    refrigeration principles, and heat transfer calculations.
                  </p>
                  <Link href="/knowledge">
                    <Button className="w-full">
                      Explore Knowledge Base
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Engineering Formulas
                  </CardTitle>
                  <CardDescription>
                    Essential formulas for HVAC, refrigeration, and energy calculations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">COP Calculations</Badge>
                    <Badge variant="secondary">Load Calculations</Badge>
                    <Badge variant="secondary">Efficiency Metrics</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quick access to commonly used engineering formulas with 
                    examples and practical applications.
                  </p>
                  <Link href="/knowledge">
                    <Button className="w-full" variant="outline">
                      View Formulas
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Best Practices & Guidelines
                  </CardTitle>
                  <CardDescription>
                    Industry standards, codes, and best practices for energy efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">ASHRAE Standards</Badge>
                    <Badge variant="secondary">Energy Codes</Badge>
                    <Badge variant="secondary">Safety Guidelines</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Stay updated with the latest industry standards, safety requirements, 
                    and proven methodologies for optimal results.
                  </p>
                  <Link href="/knowledge">
                    <Button className="w-full" variant="outline">
                      Access Guidelines
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Equipment Database
                  </CardTitle>
                  <CardDescription>
                    Comprehensive database of HVAC equipment specifications and performance data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Compressors</Badge>
                    <Badge variant="secondary">Heat Exchangers</Badge>
                    <Badge variant="secondary">Controls</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Access detailed specifications, performance curves, and selection 
                    guidelines for various HVAC equipment.
                  </p>
                  <Button className="w-full" variant="outline">
                    Browse Equipment
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-red-600" />
                    Case Studies & Examples
                  </CardTitle>
                  <CardDescription>
                    Real-world project examples and detailed case studies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Industrial</Badge>
                    <Badge variant="secondary">Commercial</Badge>
                    <Badge variant="secondary">Residential</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Learn from successful projects across different sectors with 
                    detailed analysis and lessons learned.
                  </p>
                  <Button className="w-full" variant="outline">
                    View Case Studies
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-teal-600" />
                    Training Resources
                  </CardTitle>
                  <CardDescription>
                    Educational materials and training resources for team development
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Tutorials</Badge>
                    <Badge variant="secondary">Webinars</Badge>
                    <Badge variant="secondary">Certifications</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enhance your team's expertise with curated training materials 
                    and professional development resources.
                  </p>
                  <Button className="w-full" variant="outline">
                    Start Learning
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Latest energy efficiency implementations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "ABC Manufacturing LED Retrofit", status: "Completed", savings: "$12K/year" },
                    { name: "XYZ Office HVAC Upgrade", status: "In Progress", savings: "$8K/year" },
                    { name: "DEF Warehouse Solar Installation", status: "Planning", savings: "$15K/year" },
                  ].map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.savings}</p>
                      </div>
                      <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Distribution</CardTitle>
                  <CardDescription>Types of energy efficiency projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={projectTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {projectTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Energy savings and project completion trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="savings" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Completion</CardTitle>
                  <CardDescription>Monthly project completion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="projects" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and updates across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "New proposal generated",
                      details: "LED Retrofit proposal for ABC Manufacturing",
                      time: "2 hours ago",
                      icon: FileText,
                    },
                    {
                      action: "Energy calculation completed",
                      details: "HVAC efficiency analysis for XYZ Office",
                      time: "4 hours ago",
                      icon: Calculator,
                    },
                    {
                      action: "Project marked as completed",
                      details: "DEF Warehouse lighting upgrade",
                      time: "1 day ago",
                      icon: Building2,
                    },
                    {
                      action: "Load analysis started",
                      details: "Power consumption analysis for GHI Factory",
                      time: "2 days ago",
                      icon: BarChart3,
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-muted rounded-full">
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.details}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
