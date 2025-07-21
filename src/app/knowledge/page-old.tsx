"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { 
  BookOpen, 
  Search, 
  Calculator, 
  Zap, 
  FileText, 
  BarChart3, 
  Settings, 
  ChevronRight,
  ExternalLink,
  Download,
  BookmarkPlus,
  Filter,
  Tag,
  Clock,
  User,
  ChevronDown,
  Eye,
  Copy,
  Share2,
  Lightbulb,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  Activity,
  Thermometer,
  Gauge,
  Building2,
  Flame,
  Snowflake,
  Home
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Area, AreaChart, PieChart as RechartsPieChart, Cell, Pie, Tooltip, Legend } from "recharts";

// Enhanced Knowledge Base Data Structures
interface KnowledgeCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  articles: number;
}

interface Formula {
  id: string;
  name: string;
  formula: string;
  description: string;
  variables: { symbol: string; description: string; unit: string; }[];
  example?: { inputs: Record<string, number>; result: number; unit: string; };
  category: string;
}

interface TipCard {
  id: string;
  title: string;
  content: string;
  type: 'tip' | 'warning' | 'info' | 'success';
  category: string;
}

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  industry: string;
  savings: { energy: number; cost: number; co2: number; };
  payback: number;
  tags: string[];
  details: string;
}

// Sample data for efficiency comparison chart
const efficiencyData = [
  { equipment: 'Old Boiler', efficiency: 65, cost: 100 },
  { equipment: 'Standard Boiler', efficiency: 78, cost: 85 },
  { equipment: 'Condensing Boiler', efficiency: 92, cost: 65 },
  { equipment: 'Heat Pump', efficiency: 300, cost: 25 },
];

const refrigerantData = [
  { name: 'R134a', gwp: 1430, ozone: 0, temp_range: '5 to 40°C' },
  { name: 'R410A', gwp: 2088, ozone: 0, temp_range: '-10 to 50°C' },
  { name: 'R32', gwp: 675, ozone: 0, temp_range: '-15 to 55°C' },
  { name: 'R290', gwp: 3, ozone: 0, temp_range: '-20 to 60°C' },
  { name: 'R744', gwp: 1, ozone: 0, temp_range: '-30 to 40°C' },
];

const copData = [
  { temperature: -20, cop: 2.1 },
  { temperature: -15, cop: 2.4 },
  { temperature: -10, cop: 2.8 },
  { temperature: -5, cop: 3.2 },
  { temperature: 0, cop: 3.7 },
  { temperature: 5, cop: 4.2 },
  { temperature: 10, cop: 4.8 },
];

// Knowledge Categories
const categories: KnowledgeCategory[] = [
  {
    id: 'fundamentals',
    title: 'Thermodynamics Fundamentals',
    description: 'Core principles, laws, and concepts of thermodynamics',
    icon: Flame,
    color: 'text-red-600 bg-red-100',
    articles: 12
  },
  {
    id: 'hvac',
    title: 'HVAC Systems',
    description: 'Heating, ventilation, and air conditioning principles',
    icon: Activity,
    color: 'text-blue-600 bg-blue-100',
    articles: 18
  },
  {
    id: 'refrigeration',
    title: 'Refrigeration & Cooling',
    description: 'Vapor compression cycles and cooling systems',
    icon: Snowflake,
    color: 'text-cyan-600 bg-cyan-100',
    articles: 15
  },
  {
    id: 'calculations',
    title: 'Engineering Calculations',
    description: 'Formulas, equations, and calculation methods',
    icon: Calculator,
    color: 'text-green-600 bg-green-100',
    articles: 25
  },
  {
    id: 'efficiency',
    title: 'Energy Efficiency',
    description: 'Best practices and optimization strategies',
    icon: TrendingUp,
    color: 'text-purple-600 bg-purple-100',
    articles: 20
  },
  {
    id: 'tools',
    title: 'Tool Guides',
    description: 'How-to guides for using our engineering tools',
    icon: Settings,
    color: 'text-orange-600 bg-orange-100',
    articles: 8
  }
];

// Essential Formulas
const formulas: Formula[] = [
  {
    id: 'cop-refrigeration',
    name: 'COP Refrigeration',
    formula: 'COP_R = \\frac{Q_L}{W}',
    description: 'Coefficient of Performance for refrigeration systems',
    variables: [
      { symbol: 'COP_R', description: 'Coefficient of Performance (Refrigeration)', unit: '-' },
      { symbol: 'Q_L', description: 'Cooling capacity', unit: 'kW' },
      { symbol: 'W', description: 'Compressor work input', unit: 'kW' }
    ],
    example: { inputs: { Q_L: 100, W: 25 }, result: 4.0, unit: '-' },
    category: 'refrigeration'
  },
  {
    id: 'cop-heat-pump',
    name: 'COP Heat Pump',
    formula: 'COP_H = \\frac{Q_H}{W}',
    description: 'Coefficient of Performance for heat pump systems',
    variables: [
      { symbol: 'COP_H', description: 'Coefficient of Performance (Heat Pump)', unit: '-' },
      { symbol: 'Q_H', description: 'Heating capacity', unit: 'kW' },
      { symbol: 'W', description: 'Compressor work input', unit: 'kW' }
    ],
    example: { inputs: { Q_H: 125, W: 25 }, result: 5.0, unit: '-' },
    category: 'hvac'
  },
  {
    id: 'carnot-efficiency',
    name: 'Carnot Efficiency',
    formula: '\\eta_{Carnot} = 1 - \\frac{T_C}{T_H}',
    description: 'Maximum theoretical efficiency for heat engines',
    variables: [
      { symbol: '\\eta_{Carnot}', description: 'Carnot efficiency', unit: '-' },
      { symbol: 'T_C', description: 'Cold reservoir temperature', unit: 'K' },
      { symbol: 'T_H', description: 'Hot reservoir temperature', unit: 'K' }
    ],
    example: { inputs: { T_C: 273, T_H: 373 }, result: 0.268, unit: '-' },
    category: 'fundamentals'
  },
  {
    id: 'heat-transfer-rate',
    name: 'Heat Transfer Rate',
    formula: 'Q = UA\\Delta T',
    description: 'Basic heat transfer equation for heat exchangers',
    variables: [
      { symbol: 'Q', description: 'Heat transfer rate', unit: 'W' },
      { symbol: 'U', description: 'Overall heat transfer coefficient', unit: 'W/m²·K' },
      { symbol: 'A', description: 'Heat transfer area', unit: 'm²' },
      { symbol: '\\Delta T', description: 'Temperature difference', unit: 'K' }
    ],
    example: { inputs: { U: 100, A: 10, delta_T: 20 }, result: 20000, unit: 'W' },
    category: 'calculations'
  },
  {
    id: 'energy-consumption',
    name: 'Energy Consumption',
    formula: 'E = \\frac{P \\cdot t}{\\eta}',
    description: 'Calculate energy consumption based on power and efficiency',
    variables: [
      { symbol: 'E', description: 'Energy consumption', unit: 'kWh' },
      { symbol: 'P', description: 'Power rating', unit: 'kW' },
      { symbol: 't', description: 'Operating time', unit: 'hours' },
      { symbol: '\\eta', description: 'Efficiency', unit: '-' }
    ],
    example: { inputs: { P: 10, t: 8760, eta: 0.85 }, result: 103059, unit: 'kWh/year' },
    category: 'efficiency'
  },
  {
    id: 'isentropic-efficiency',
    name: 'Isentropic Efficiency',
    formula: '\\eta_s = \\frac{h_{2s} - h_1}{h_2 - h_1}',
    description: 'Compressor isentropic efficiency calculation',
    variables: [
      { symbol: '\\eta_s', description: 'Isentropic efficiency', unit: '-' },
      { symbol: 'h_{2s}', description: 'Isentropic discharge enthalpy', unit: 'kJ/kg' },
      { symbol: 'h_1', description: 'Suction enthalpy', unit: 'kJ/kg' },
      { symbol: 'h_2', description: 'Actual discharge enthalpy', unit: 'kJ/kg' }
    ],
    category: 'refrigeration'
  }
];

// Practical Tips
const tips: TipCard[] = [
  {
    id: 'ph-diagram-tip',
    title: 'Reading P-H Diagrams',
    content: 'Always start at the evaporator inlet (point 4) and follow the cycle clockwise: evaporation → compression → condensation → expansion.',
    type: 'tip',
    category: 'refrigeration'
  },
  {
    id: 'superheat-warning',
    title: 'Superheat Control',
    content: 'Maintain 5-10K superheat for compressor protection. Too little risks liquid slugging, too much reduces capacity.',
    type: 'warning',
    category: 'hvac'
  },
  {
    id: 'cop-optimization',
    title: 'COP Optimization',
    content: 'Reduce pressure ratio by increasing evaporator temperature or decreasing condenser temperature to improve COP.',
    type: 'success',
    category: 'efficiency'
  },
  {
    id: 'refrigerant-selection',
    title: 'Refrigerant Selection',
    content: 'Consider GWP, operating temperatures, pressure levels, and safety classification when selecting refrigerants.',
    type: 'info',
    category: 'refrigeration'
  },
  {
    id: 'energy-audit-tip',
    title: 'Energy Audit Best Practice',
    content: 'Measure baseline consumption for at least 12 months to account for seasonal variations before proposing improvements.',
    type: 'tip',
    category: 'efficiency'
  }
];

// Case Studies
const caseStudies: CaseStudy[] = [
  {
    id: 'hospital-hvac',
    title: 'Hospital HVAC Retrofit',
    description: 'Comprehensive HVAC system upgrade at 500-bed medical facility',
    industry: 'Healthcare',
    savings: { energy: 35, cost: 180000, co2: 250 },
    payback: 3.2,
    tags: ['HVAC', 'Heat Recovery', 'Controls'],
    details: 'Implemented variable air volume systems, energy recovery ventilation, and advanced building controls resulting in 35% energy reduction while maintaining critical air quality standards.'
  },
  {
    id: 'food-processing',
    title: 'Food Processing Refrigeration',
    description: 'Industrial refrigeration system optimization using natural refrigerants',
    industry: 'Food & Beverage',
    savings: { energy: 42, cost: 125000, co2: 180 },
    payback: 2.8,
    tags: ['Refrigeration', 'Natural Refrigerants', 'Process Cooling'],
    details: 'Replaced R404A with CO2 cascade system, installed variable speed drives, and optimized defrost cycles achieving significant energy savings and environmental benefits.'
  },
  {
    id: 'office-building',
    title: 'Office Building Energy Upgrade',
    description: 'Comprehensive energy efficiency upgrade for 20-story commercial building',
    industry: 'Commercial Real Estate',
    savings: { energy: 28, cost: 95000, co2: 140 },
    payback: 4.1,
    tags: ['Lighting', 'HVAC', 'Building Envelope'],
    details: 'LED lighting retrofit, chiller upgrade, window replacement, and building automation system installation resulting in LEED Gold certification.'
  }
];

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);

  // Filter formulas based on search and category
  const filteredFormulas = useMemo(() => {
    return formulas.filter(formula => {
      const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formula.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || formula.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

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
            <BreadcrumbPage className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Knowledge Base
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">SeeTech Knowledge Base</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive engineering resources, formulas, best practices, and practical guides 
          for energy efficiency and HVAC systems
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
          <TabsTrigger value="tips">Tips & Best Practices</TabsTrigger>
          <TabsTrigger value="examples">Examples & Charts</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          <TabsTrigger value="tools">Tool Guides</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg">{category.title}</h3>
                        <Badge variant="secondary">{category.articles} articles</Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Explore Category
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">98</div>
                  <div className="text-sm text-muted-foreground">Total Articles</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formulas.length}</div>
                  <div className="text-sm text-muted-foreground">Engineering Formulas</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{caseStudies.length}</div>
                  <div className="text-sm text-muted-foreground">Case Studies</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{tips.length}</div>
                  <div className="text-sm text-muted-foreground">Practical Tips</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formulas Tab */}
        <TabsContent value="formulas" className="space-y-6">
          <div className="grid gap-6">
            {filteredFormulas.map((formula) => (
              <Card key={formula.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{formula.name}</span>
                    <Badge variant="outline">{categories.find(c => c.id === formula.category)?.title}</Badge>
                  </CardTitle>
                  <CardDescription>{formula.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Formula Display */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        className="text-lg"
                      >
                        {`$$${formula.formula}$$`}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Variables */}
                  <div>
                    <h4 className="font-semibold mb-2">Variables:</h4>
                    <div className="grid gap-2">
                      {formula.variables.map((variable, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              className="font-mono"
                            >
                              {`$${variable.symbol}$`}
                            </ReactMarkdown>
                            <span>{variable.description}</span>
                          </div>
                          <Badge variant="secondary">{variable.unit}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Example */}
                  {formula.example && (
                    <div>
                      <h4 className="font-semibold mb-2">Example:</h4>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex flex-wrap gap-4 mb-2">
                          {Object.entries(formula.example.inputs).map(([key, value]) => (
                            <span key={key} className="text-sm">
                              <strong>{key}:</strong> {value}
                            </span>
                          ))}
                        </div>
                        <div className="text-lg font-semibold text-blue-700">
                          Result: {formula.example.result} {formula.example.unit}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Formula
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calculator className="h-4 w-4 mr-2" />
                      Use in Calculator
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-6">
          <div className="grid gap-4">
            {tips.map((tip) => (
              <Alert key={tip.id} className={`border-l-4 ${
                tip.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                tip.type === 'success' ? 'border-l-green-500 bg-green-50' :
                tip.type === 'info' ? 'border-l-blue-500 bg-blue-50' :
                'border-l-orange-500 bg-orange-50'
              }`}>
                <div className="flex items-start gap-3">
                  {tip.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 mt-1" />}
                  {tip.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-1" />}
                  {tip.type === 'info' && <Info className="h-5 w-5 text-blue-600 mt-1" />}
                  {tip.type === 'tip' && <Lightbulb className="h-5 w-5 text-orange-600 mt-1" />}
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{tip.title}</h4>
                    <AlertDescription>{tip.content}</AlertDescription>
                    <Badge variant="outline" className="mt-2">
                      {categories.find(c => c.id === tip.category)?.title}
                    </Badge>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </TabsContent>

        {/* Examples & Charts Tab */}
        <TabsContent value="examples" className="space-y-6">
          {/* Equipment Efficiency Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Efficiency Comparison</CardTitle>
              <CardDescription>
                Efficiency and relative operating costs for different heating equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="equipment" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="efficiency" fill="#3b82f6" name="Efficiency (%)" />
                    <Bar yAxisId="right" dataKey="cost" fill="#ef4444" name="Relative Cost" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* COP vs Temperature */}
          <Card>
            <CardHeader>
              <CardTitle>Heat Pump COP vs Outdoor Temperature</CardTitle>
              <CardDescription>
                Typical heat pump performance across operating temperatures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={copData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="temperature" label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'COP', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="cop" stroke="#10b981" strokeWidth={3} name="COP" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Refrigerant Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Refrigerant Properties Comparison</CardTitle>
              <CardDescription>
                Environmental impact and operating characteristics of common refrigerants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Refrigerant</th>
                      <th className="text-left p-2">GWP</th>
                      <th className="text-left p-2">ODP</th>
                      <th className="text-left p-2">Operating Range</th>
                      <th className="text-left p-2">Environmental Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refrigerantData.map((ref, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{ref.name}</td>
                        <td className="p-2">
                          <Badge variant={ref.gwp < 150 ? 'default' : ref.gwp < 1000 ? 'secondary' : 'destructive'}>
                            {ref.gwp}
                          </Badge>
                        </td>
                        <td className="p-2">{ref.ozone}</td>
                        <td className="p-2">{ref.temp_range}</td>
                        <td className="p-2">
                          {ref.gwp < 150 ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">Low</Badge>
                          ) : ref.gwp < 1000 ? (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
                          ) : (
                            <Badge variant="destructive">High</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  {
    id: "compressor-analysis-guide",
    title: "Compressor Analysis Tool Guide",
    description: "Complete guide to using the compressor analysis tool with thermodynamic calculations",
    category: "Tool Guides",
    tags: ["compressor", "thermodynamics", "CoolProp", "analysis"],
    lastUpdated: "2025-07-18",
    author: "Engineering Team",
    views: 342,
    content: `# Compressor Analysis Tool Guide

## Overview
The Compressor Analysis Tool provides comprehensive thermodynamic analysis for vapor compression systems using the CoolProp library.

## How to Use
1. Navigate to **Tools > Compressor Analysis**
2. Select refrigerant type (R134a, R410A, R22, etc.)
3. Enter operating conditions:
   - Suction Temperature (°C)
   - Suction Pressure (bar)
   - Discharge Temperature (°C) 
   - Discharge Pressure (bar)
4. View calculated results and P-h diagram

## Key Calculations

### Power Consumption
$$P = \\dot{m} \\cdot (h_2 - h_1) / \\eta_{isentropic}$$

Where:
- $P$ = Power consumption (kW)
- $\\dot{m}$ = Mass flow rate (kg/s)
- $h_2$ = Discharge enthalpy (kJ/kg)
- $h_1$ = Suction enthalpy (kJ/kg)
- $\\eta_{isentropic}$ = Isentropic efficiency

### Coefficient of Performance (COP)
$$COP = \\frac{h_1 - h_4}{h_2 - h_1}$$

### Isentropic Efficiency
$$\\eta_s = \\frac{h_{2s} - h_1}{h_2 - h_1}$$

### Mass Flow Rate
$$\\dot{m} = \\rho_1 \\cdot V_{displacement} \\cdot \\eta_{volumetric}$$

## Technical Implementation
- **CoolProp Integration**: Uses WASM library for property calculations
- **Real-time Updates**: Calculations update as you modify inputs
- **P-h Diagrams**: Interactive pressure-enthalpy diagrams using Plotly.js
- **Error Handling**: Validates input ranges and state points

## Best Practices
- Ensure discharge pressure > suction pressure
- Verify refrigerant selection matches your system
- Check temperature ranges are realistic for your application
- Cross-reference results with manufacturer data

## Troubleshooting
- **Invalid State Points**: Check pressure/temperature combinations
- **NaN Results**: Ensure all inputs are valid numbers
- **Slow Loading**: Large calculations may take a few seconds`,
    formulas: [
      "P = \\dot{m} \\cdot (h_2 - h_1) / \\eta_{isentropic}",
      "COP = \\frac{h_1 - h_4}{h_2 - h_1}",
      "\\eta_s = \\frac{h_{2s} - h_1}{h_2 - h_1}"
    ],
    relatedTools: ["Energy Calculator", "Load Analysis"]
  },
  {
    id: "energy-calculator-guide",
    title: "Energy Efficiency Calculator Guide",
    description: "Learn how to calculate energy savings, ROI, and payback periods for equipment upgrades",
    category: "Tool Guides",
    tags: ["energy", "efficiency", "ROI", "payback", "savings"],
    lastUpdated: "2025-07-18",
    author: "Engineering Team",
    views: 428,
    content: `# Energy Efficiency Calculator Guide

## Overview
Compare current vs proposed equipment to determine energy and cost savings, ROI, and payback periods.

## How to Use
1. Navigate to **Tools > Energy Calculator**
2. Enter current equipment specifications:
   - Power Rating (kW)
   - Efficiency (%)
   - Operating Hours/Year
   - Energy Rate ($/kWh)
3. Enter proposed equipment specifications
4. Set investment cost
5. Review calculated savings and investment analysis

## Key Calculations

### Annual Energy Consumption
$$E = \\frac{P \\cdot h}{\\eta/100}$$

Where:
- $E$ = Annual energy consumption (kWh/year)
- $P$ = Power rating (kW)
- $h$ = Operating hours per year
- $\\eta$ = Equipment efficiency (%)

### Energy Savings
$$\\Delta E = E_{current} - E_{proposed}$$

### Annual Cost Savings
$$\\Delta C = \\Delta E \\cdot \\text{rate}$$

### Return on Investment (ROI)
$$ROI = \\frac{\\Delta C}{\\text{Investment Cost}} \\times 100\\%$$

### Payback Period
$$\\text{Payback} = \\frac{\\text{Investment Cost}}{\\Delta C}$$

## Investment Analysis
- **Excellent Investment**: ROI > 15%
- **Good Investment**: ROI 10-15%
- **Consider Alternatives**: ROI < 10%

## Features
- **Tabbed Interface**: Switch between current and proposed equipment
- **Real-time Calculations**: Results update instantly
- **Visual Indicators**: Color-coded performance metrics
- **Comprehensive Results**: Energy consumption, savings, and financial analysis`,
    formulas: [
      "E = \\frac{P \\cdot h}{\\eta/100}",
      "ROI = \\frac{\\Delta C}{\\text{Investment Cost}} \\times 100\\%",
      "\\text{Payback} = \\frac{\\text{Investment Cost}}{\\Delta C}"
    ],
    relatedTools: ["Compressor Analysis", "Proposal Generator"]
  },
  {
    id: "coolprop-integration",
    title: "CoolProp Library Integration",
    description: "Technical guide to CoolProp WASM integration for thermodynamic calculations",
    category: "Technical Documentation",
    tags: ["CoolProp", "WASM", "thermodynamics", "integration"],
    lastUpdated: "2025-07-18",
    author: "Development Team",
    views: 156,
    content: `# CoolProp Library Integration

## Overview
CoolProp is an open-source thermodynamic property library compiled to WebAssembly for browser compatibility.

## Library Features
- **100+ Fluids**: Pure fluids and pseudo-pure fluids
- **Refrigerants**: R134a, R410A, R22, R32, R1234yf, and more
- **Industrial Fluids**: Water, air, CO₂, ammonia, and hydrocarbons
- **Property Calculations**: Enthalpy, entropy, density, temperature, pressure

## Key Functions

### PropsSI Function
Primary function for property calculations:
\`\`\`javascript
PropsSI(output, input1, value1, input2, value2, fluid)
\`\`\`

### State Point Calculations
- **Enthalpy**: PropsSI('H', 'P', pressure, 'T', temperature, 'R134a')
- **Entropy**: PropsSI('S', 'P', pressure, 'T', temperature, 'R134a')
- **Density**: PropsSI('D', 'P', pressure, 'T', temperature, 'R134a')

## Implementation
- **WASM Module**: /public/coolprop.wasm
- **JavaScript Wrapper**: /public/coolprop.js
- **TypeScript Integration**: /utils/coolprop-integration.tsx

## Error Handling
- Invalid state points return NaN
- Out-of-range values throw exceptions
- Unsupported fluids return error messages

## Performance
- Optimized for real-time calculations
- Caching for repeated calculations
- Efficient memory management`,
    formulas: [
      "\\text{State Point: } PropsSI('H', 'P', P, 'T', T, \\text{fluid})",
      "\\text{Saturation: } PropsSI('T', 'P', P, 'Q', 0, \\text{fluid})",
      "\\text{Two-Phase: } PropsSI('H', 'P', P, 'Q', \\text{quality}, \\text{fluid})"
    ],
    relatedTools: ["Compressor Analysis"]
  },
  {
    id: "mathematical-formulas",
    title: "Mathematical Formulas Reference",
    description: "Complete reference of all mathematical formulas used in the engineering tools",
    category: "Reference",
    tags: ["formulas", "mathematics", "calculations", "reference"],
    lastUpdated: "2025-07-18",
    author: "Engineering Team",
    views: 289,
    content: `# Mathematical Formulas Reference

## Thermodynamic Calculations

### Vapor Compression Cycle
$$COP_{ideal} = \\frac{h_1 - h_4}{h_2 - h_1}$$

### Refrigeration Effect
$$q_e = h_1 - h_4 \\text{ (kJ/kg)}$$

### Compressor Work
$$w_c = h_2 - h_1 \\text{ (kJ/kg)}$$

### Heat Rejection
$$q_c = h_2 - h_3 \\text{ (kJ/kg)}$$

## Energy Analysis

### Annual Energy Consumption
$$E_{annual} = \\frac{P_{rated} \\times h_{operation}}{\\eta_{equipment}} \\times LF$$

Where:
- $LF$ = Load Factor
- $P_{rated}$ = Rated power (kW)
- $h_{operation}$ = Operating hours
- $\\eta_{equipment}$ = Equipment efficiency

### Load Factor
$$LF = \\frac{\\text{Average Load}}{\\text{Peak Load}}$$

### Energy Intensity
$$EI = \\frac{E_{annual}}{\\text{Production Units}}$$

## Financial Analysis

### Net Present Value
$$NPV = \\sum_{t=1}^{n} \\frac{CF_t}{(1+r)^t} - \\text{Initial Investment}$$

### Internal Rate of Return
$$0 = \\sum_{t=1}^{n} \\frac{CF_t}{(1+IRR)^t} - \\text{Initial Investment}$$

### Life Cycle Cost
$$LCC = C_{initial} + \\sum_{t=1}^{n} \\frac{C_{operation,t} + C_{maintenance,t}}{(1+r)^t}$$

## Electrical Analysis

### Power Factor
$$PF = \\frac{P}{S} = \\frac{\\text{Real Power}}{\\text{Apparent Power}}$$

### Demand Factor
$$DF = \\frac{\\text{Maximum Demand}}{\\text{Connected Load}}$$

### Utilization Factor
$$UF = \\frac{\\text{Maximum Demand}}{\\text{Rated Capacity}}$$`,
    formulas: [
      "COP = \\frac{h_1 - h_4}{h_2 - h_1}",
      "NPV = \\sum_{t=1}^{n} \\frac{CF_t}{(1+r)^t} - \\text{Initial Investment}",
      "LCC = C_{\\text{initial}} + \\sum_{t=1}^{n} \\frac{C_{\\text{operating},t}}{(1+r)^t}"
    ],
    relatedTools: ["All Tools"]
  },
  {
    id: "troubleshooting-guide",
    title: "Troubleshooting Guide",
    description: "Common issues and solutions for the engineering tools platform",
    category: "Support",
    tags: ["troubleshooting", "support", "issues", "solutions"],
    lastUpdated: "2025-07-18",
    author: "Support Team",
    views: 198,
    content: `# Troubleshooting Guide

## Common Calculation Errors

### Invalid State Points
**Problem**: CoolProp returns NaN or error messages

**Solution**: 
- Check pressure and temperature ranges for selected refrigerant
- Ensure discharge pressure > suction pressure
- Verify temperature is within fluid's operating range

### Unrealistic Results
**Problem**: COP values are too high/low or negative

**Solution**:
- Verify input parameters match actual system conditions
- Check unit conversions (°C vs K, bar vs Pa)
- Ensure refrigerant selection matches your system

### NaN Results in Calculations
**Problem**: Results show NaN instead of numbers

**Solution**:
- Ensure all input fields contain valid numeric values
- Check for division by zero conditions
- Verify efficiency values are between 0-100%

## Interface Issues

### Slow Performance
**Problem**: Calculations take too long to complete

**Solution**:
- Wait for calculations to complete before changing inputs
- Refresh the page if calculations seem stuck
- Check internet connection for WASM loading

### Charts Not Displaying
**Problem**: P-h diagrams or other charts don't appear

**Solution**:
- Ensure browser supports WebGL
- Update to a modern browser version
- Check if browser extensions are blocking content

### Mobile Responsiveness
**Problem**: Interface doesn't work well on mobile

**Solution**:
- Use landscape orientation for better visibility
- Zoom in on input fields if needed
- Some charts may require desktop viewing

## Data Issues

### Results Not Saving
**Problem**: Calculations are lost when navigating away

**Solution**:
- Results are not automatically saved between sessions
- Export or screenshot important results
- Use browser bookmarks for specific calculations

### Inconsistent Units
**Problem**: Mixed units causing confusion

**Solution**:
- All calculations use SI units (kW, kJ/kg, bar, °C)
- Convert inputs to standard units before entering
- Check unit labels on all input fields

## Browser Compatibility

### Supported Browsers
- Chrome 90+ (Recommended)
- Firefox 85+
- Safari 14+
- Edge 90+

### Required Features
- WebAssembly (WASM) support
- ES6 JavaScript
- WebGL for charts
- Local storage for preferences`,
    formulas: [],
    relatedTools: ["All Tools"]
  }
];

const categories = ["All", "Tool Guides", "Technical Documentation", "Reference", "Support"];

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);

  const filteredArticles = wikiArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleArticle = (articleId: string) => {
    setExpandedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const formatFormula = (formula: string) => {
    // Remove LaTeX formatting for display in the formulas tab
    return formula.replace(/\$\$.*?\$\$/g, (match) => {
      return match.replace(/\$\$/g, '');
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Knowledge Base</h1>
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
                  <BreadcrumbPage>Knowledge Base</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search knowledge base..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{filteredArticles.length} articles found</span>
              <span>•</span>
              <span>{wikiArticles.reduce((sum, article) => sum + article.views, 0)} total views</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Articles List */}
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <Badge variant="secondary">{article.category}</Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {article.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleArticle(article.id)}
                      className="ml-4"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${
                        expandedArticles.includes(article.id) ? 'rotate-180' : ''
                      }`} />
                    </Button>
                  </div>

                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(article.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views} views
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <Collapsible open={expandedArticles.includes(article.id)}>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />
                      
                      <Tabs defaultValue="content" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="content">Content</TabsTrigger>
                          <TabsTrigger value="formulas">Formulas</TabsTrigger>
                          <TabsTrigger value="tools">Related Tools</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="content" className="mt-4">
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-6">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>,
                                p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                code: ({ children, ...props }) => {
                                  const inline = !props.className?.includes('language-');
                                  return inline ? (
                                    <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>
                                  ) : (
                                    <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
                                      <code className="text-sm">{children}</code>
                                    </pre>
                                  );
                                },
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                                    {children}
                                  </blockquote>
                                ),
                              }}
                            >
                              {article.content}
                            </ReactMarkdown>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="formulas" className="mt-4">
                          {article.formulas && article.formulas.length > 0 ? (
                            <div className="space-y-3">
                              {article.formulas.map((formula, index) => (
                                <div key={index} className="p-3 bg-muted rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm flex-1">
                                      <ReactMarkdown
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                      >
                                        {`$$${formula}$$`}
                                      </ReactMarkdown>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="ml-2 h-6 w-6 p-0"
                                      onClick={() => navigator.clipboard.writeText(formula)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No formulas available for this article.</p>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="tools" className="mt-4">
                          {article.relatedTools && article.relatedTools.length > 0 ? (
                            <div className="grid gap-2">
                              {article.relatedTools.map((tool, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                  <span className="text-sm">{tool}</span>
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/tools/${tool.toLowerCase().replace(/\s+/g, '-')}`}>
                                      <ExternalLink className="h-3 w-3" />
                                    </Link>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No related tools specified.</p>
                          )}
                        </TabsContent>
                      </Tabs>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          Bookmark
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
