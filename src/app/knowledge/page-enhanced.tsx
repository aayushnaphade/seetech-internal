"use client";

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  Calculator,
  Lightbulb,
  BarChart3,
  FileText,
  BookOpen,
  Home,
  Thermometer,
  Zap,
  Gauge,
  Copy,
  Play,
  Download,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function EnhancedKnowledgePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Categories with enhanced structure
  const categories = [
    {
      id: 'thermodynamics',
      title: 'Thermodynamics',
      description: 'Heat transfer, energy balance, and thermodynamic cycles',
      icon: <Thermometer className="h-5 w-5" />,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'fluids',
      title: 'Fluid Mechanics',
      description: 'Pressure drop, flow calculations, and pump sizing',
      icon: <Gauge className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'refrigeration',
      title: 'Refrigeration',
      description: 'Cooling cycles, COP calculations, and refrigerant properties',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      id: 'electrical',
      title: 'Electrical',
      description: 'Power calculations, motor sizing, and energy analysis',
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  // Enhanced formulas with interactive examples
  const formulas = [
    {
      id: 'cop-heating',
      name: 'Coefficient of Performance (Heating)',
      category: 'thermodynamics',
      description: 'Efficiency measure for heat pumps in heating mode',
      formula: 'COP_h = \\frac{Q_h}{W_{input}}',
      variables: [
        { symbol: 'COP_h', description: 'Coefficient of Performance (Heating)', unit: 'dimensionless' },
        { symbol: 'Q_h', description: 'Heat delivered to conditioned space', unit: 'kW' },
        { symbol: 'W_{input}', description: 'Electrical power input', unit: 'kW' }
      ],
      example: {
        inputs: { 'Heat Output': '15 kW', 'Power Input': '4 kW' },
        result: '3.75',
        unit: 'COP'
      }
    },
    {
      id: 'cop-cooling',
      name: 'Coefficient of Performance (Cooling)',
      category: 'refrigeration',
      description: 'Efficiency measure for cooling systems',
      formula: 'COP_c = \\frac{Q_c}{W_{input}}',
      variables: [
        { symbol: 'COP_c', description: 'Coefficient of Performance (Cooling)', unit: 'dimensionless' },
        { symbol: 'Q_c', description: 'Cooling capacity', unit: 'kW' },
        { symbol: 'W_{input}', description: 'Electrical power input', unit: 'kW' }
      ],
      example: {
        inputs: { 'Cooling Output': '12 kW', 'Power Input': '4 kW' },
        result: '3.0',
        unit: 'COP'
      }
    },
    {
      id: 'pressure-drop',
      name: 'Darcy-Weisbach Pressure Drop',
      category: 'fluids',
      description: 'Pressure loss in pipes due to friction',
      formula: '\\Delta P = f \\cdot \\frac{L}{D} \\cdot \\frac{\\rho v^2}{2}',
      variables: [
        { symbol: '\\Delta P', description: 'Pressure drop', unit: 'Pa' },
        { symbol: 'f', description: 'Friction factor', unit: 'dimensionless' },
        { symbol: 'L', description: 'Pipe length', unit: 'm' },
        { symbol: 'D', description: 'Pipe diameter', unit: 'm' },
        { symbol: '\\rho', description: 'Fluid density', unit: 'kg/m³' },
        { symbol: 'v', description: 'Flow velocity', unit: 'm/s' }
      ],
      example: {
        inputs: { 'Length': '50 m', 'Diameter': '0.1 m', 'Velocity': '2 m/s' },
        result: '2,500',
        unit: 'Pa'
      }
    },
    {
      id: 'electrical-power',
      name: 'Three-Phase Electrical Power',
      category: 'electrical',
      description: 'Power calculation for three-phase electrical systems',
      formula: 'P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos(\\phi)',
      variables: [
        { symbol: 'P', description: 'Power', unit: 'W' },
        { symbol: 'V_L', description: 'Line voltage', unit: 'V' },
        { symbol: 'I_L', description: 'Line current', unit: 'A' },
        { symbol: '\\cos(\\phi)', description: 'Power factor', unit: 'dimensionless' }
      ],
      example: {
        inputs: { 'Voltage': '400 V', 'Current': '10 A', 'Power Factor': '0.85' },
        result: '5,887',
        unit: 'W'
      }
    },
    {
      id: 'heat-transfer',
      name: 'Heat Transfer Coefficient',
      category: 'thermodynamics',
      description: 'Overall heat transfer in heat exchangers',
      formula: 'Q = U \\cdot A \\cdot \\Delta T_{lm}',
      variables: [
        { symbol: 'Q', description: 'Heat transfer rate', unit: 'W' },
        { symbol: 'U', description: 'Overall heat transfer coefficient', unit: 'W/(m²·K)' },
        { symbol: 'A', description: 'Heat transfer area', unit: 'm²' },
        { symbol: '\\Delta T_{lm}', description: 'Log mean temperature difference', unit: 'K' }
      ],
      example: {
        inputs: { 'U-value': '500 W/(m²·K)', 'Area': '10 m²', 'LMTD': '15 K' },
        result: '75,000',
        unit: 'W'
      }
    },
    {
      id: 'pump-power',
      name: 'Pump Power Calculation',
      category: 'fluids',
      description: 'Power required for pumping fluids',
      formula: 'P_{pump} = \\frac{\\rho \\cdot g \\cdot Q \\cdot H}{\\eta}',
      variables: [
        { symbol: 'P_{pump}', description: 'Pump power', unit: 'W' },
        { symbol: '\\rho', description: 'Fluid density', unit: 'kg/m³' },
        { symbol: 'g', description: 'Gravitational acceleration', unit: 'm/s²' },
        { symbol: 'Q', description: 'Flow rate', unit: 'm³/s' },
        { symbol: 'H', description: 'Total head', unit: 'm' },
        { symbol: '\\eta', description: 'Pump efficiency', unit: 'dimensionless' }
      ],
      example: {
        inputs: { 'Flow Rate': '0.05 m³/s', 'Head': '30 m', 'Efficiency': '0.75' },
        result: '19,620',
        unit: 'W'
      }
    }
  ];

  // Practical tips with categories
  const tips = [
    {
      id: 'tip-1',
      title: 'COP Optimization',
      category: 'thermodynamics',
      type: 'tip',
      content: 'Heat pump COP decreases as temperature difference increases. Design systems with minimal temperature lift for maximum efficiency.'
    },
    {
      id: 'tip-2',
      title: 'Pressure Drop Minimization',
      category: 'fluids',
      type: 'warning',
      content: 'Excessive pressure drop in piping systems increases pump power requirements. Keep velocities under 3 m/s for water systems.'
    },
    {
      id: 'tip-3',
      title: 'Motor Sizing Guidelines',
      category: 'electrical',
      type: 'info',
      content: 'Size motors at 80-90% of full load for optimal efficiency. Oversized motors operate at poor power factor and low efficiency.'
    },
    {
      id: 'tip-4',
      title: 'Refrigerant Selection',
      category: 'refrigeration',
      type: 'success',
      content: 'Consider Global Warming Potential (GWP) when selecting refrigerants. Natural refrigerants like CO₂ and ammonia have very low GWP.'
    },
    {
      id: 'tip-5',
      title: 'Heat Exchanger Sizing',
      category: 'thermodynamics',
      type: 'tip',
      content: 'Increase heat exchanger surface area to improve efficiency, but balance against cost and space constraints. Aim for LMTD > 5K for cost-effective designs.'
    }
  ];

  // Case studies data
  const caseStudies = [
    {
      id: "case-1",
      title: "Industrial Chiller Optimization",
      industry: "Manufacturing",
      description: "50% energy savings achieved through advanced chiller optimization",
      challenge: "High energy costs from inefficient cooling system in automotive manufacturing plant",
      solution: "Implemented variable-speed drives and smart controls with real-time optimization",
      results: [
        { value: "50%", metric: "Energy Savings" },
        { value: "₹1Cr", metric: "Annual Savings" },
        { value: "18 months", metric: "ROI Period" }
      ]
    },
    {
      id: "case-2", 
      title: "Data Center Cooling Enhancement",
      industry: "Technology",
      description: "Precision cooling solution for mission-critical data center operations",
      challenge: "Maintaining stable temperatures while reducing energy consumption in high-density server environment",
      solution: "Designed precision air conditioning system with hot aisle containment and intelligent controls",
      results: [
        { value: "99.9%", metric: "Uptime" },
        { value: "40%", metric: "Energy Reduction" },
        { value: "±1°C", metric: "Temperature Control" }
      ]
    },
    {
      id: "case-3",
      title: "Hospital HVAC Upgrade", 
      industry: "Healthcare",
      description: "Clean room environmental control with energy efficiency focus",
      challenge: "Meeting strict air quality standards while controlling operational costs",
      solution: "Installed advanced filtration with heat recovery ventilation and demand-controlled ventilation",
      results: [
        { value: "HEPA", metric: "Filtration Grade" },
        { value: "35%", metric: "Energy Savings" },
        { value: "ISO 14644", metric: "Clean Room Standard" }
      ]
    }
  ];

  // Tool guides data  
  const toolGuides = [
    {
      id: "compressor-analysis-guide",
      title: "Compressor Analysis Tool Guide",
      difficulty: "Intermediate", 
      description: "Complete guide to analyzing compressor performance and efficiency",
      steps: [
        "Navigate to **Tools > Compressor Analysis**",
        "Select your compressor type (reciprocating, scroll, screw, centrifugal)",
        "Input operating conditions: suction pressure, discharge pressure, flow rate",
        "Enter fluid properties or select from refrigerant database",
        "Review calculated performance metrics: efficiency, power consumption, capacity",
        "Analyze P-H diagram visualization for thermodynamic cycle",
        "Export results or save configuration for future reference"
      ],
      tips: [
        "Ensure discharge pressure > suction pressure",
        "Use actual measured values when available",
        "Consider seasonal variations in operating conditions",
        "Compare with manufacturer specifications"
      ],
      formula: "\\eta_s = \\frac{h_{2s} - h_1}{h_2 - h_1}"
    },
    {
      id: "energy-calculator-guide",
      title: "Energy Calculator Tool Guide", 
      difficulty: "Beginner",
      description: "Step-by-step guide to calculating energy consumption and costs",
      steps: [
        "Navigate to **Tools > Energy Calculator**",
        "Select equipment type (chiller, heat pump, compressor, etc.)",
        "Input power rating and operating hours",
        "Enter local electricity rates and demand charges",
        "Add seasonal load factors if applicable", 
        "Review energy consumption breakdown",
        "Generate cost projections and savings scenarios"
      ],
      tips: [
        "Include demand charges for accurate cost analysis",
        "Consider part-load operation efficiency",
        "Account for maintenance and operational costs"
      ],
      formula: "E = \\frac{P \\cdot h}{\\eta/100}"
    }
  ];

  // Chart data
  const efficiencyData = [
    { equipment: 'Heat Pump', efficiency: 300, cost: 0.8 },
    { equipment: 'Gas Boiler', efficiency: 90, cost: 1.0 },
    { equipment: 'Electric Heater', efficiency: 100, cost: 3.5 },
    { equipment: 'Oil Boiler', efficiency: 85, cost: 1.2 }
  ];

  const copData = [
    { temperature: -20, cop: 1.8 },
    { temperature: -10, cop: 2.2 },
    { temperature: 0, cop: 2.8 },
    { temperature: 10, cop: 3.5 },
    { temperature: 20, cop: 4.2 }
  ];

  const refrigerantData = [
    { name: 'R-134a', gwp: 1430, ozone: 0, temp_range: '-26.3°C to 101.1°C' },
    { name: 'R-410A', gwp: 2088, ozone: 0, temp_range: '-51.4°C to 70.2°C' },
    { name: 'R-32', gwp: 675, ozone: 0, temp_range: '-51.7°C to 78.1°C' },
    { name: 'R-1234yf', gwp: 4, ozone: 0, temp_range: '-29.5°C to 94.7°C' },
    { name: 'CO₂ (R-744)', gwp: 1, ozone: 0, temp_range: '-56.6°C to 31.0°C' },
    { name: 'Ammonia (R-717)', gwp: 0, ozone: 0, temp_range: '-33.3°C to 132.3°C' }
  ];

  // Filter formulas based on search and category
  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || formula.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">HVAC Engineering Knowledge Base</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive resources, formulas, and practical guidance for HVAC engineers and technicians
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search knowledge base..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.title}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="formulas" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Formulas
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Tips
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Examples & Charts
            </TabsTrigger>
            <TabsTrigger value="case-studies" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Case Studies
            </TabsTrigger>
            <TabsTrigger value="tool-guides" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tool Guides
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(category => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setActiveTab('formulas');
                      }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`p-2 rounded ${category.color}`}>
                        {category.icon}
                      </div>
                      {category.title}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formulas.filter(f => f.category === category.id).length} formulas</span>
                      <span>{tips.filter(t => t.category === category.id).length} tips</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>Frequently used formulas and calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Thermometer className="h-6 w-6" />
                    <span className="text-sm">COP Calculator</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Zap className="h-6 w-6" />
                    <span className="text-sm">Power Calculation</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Gauge className="h-6 w-6" />
                    <span className="text-sm">Pressure Drop</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    <span className="text-sm">Unit Converter</span>
                  </Button>
                </div>
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

          {/* Case Studies Tab */}
          <TabsContent value="case-studies" className="space-y-6">
            <div className="grid gap-6">
              {caseStudies.map((study) => (
                <Card key={study.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{study.title}</span>
                      <Badge variant="outline">{study.industry}</Badge>
                    </CardTitle>
                    <CardDescription>{study.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Challenge:</h4>
                        <p className="text-sm text-gray-600">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Solution:</h4>
                        <p className="text-sm text-gray-600">{study.solution}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Results:</h4>
                      <div className="grid md:grid-cols-3 gap-2">
                        {study.results.map((result, index) => (
                          <div key={index} className="p-2 bg-green-50 rounded text-center">
                            <div className="font-semibold text-green-700">{result.value}</div>
                            <div className="text-xs text-green-600">{result.metric}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tool Guides Tab */}
          <TabsContent value="tool-guides" className="space-y-6">
            <div className="grid gap-6">
              {toolGuides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{guide.title}</span>
                      <Badge variant="outline">{guide.difficulty}</Badge>
                    </CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Steps:</h4>
                      <div className="space-y-2">
                        {guide.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 p-2 border rounded">
                            <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                            <div className="flex-1">
                              <ReactMarkdown className="text-sm">
                                {step}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {guide.tips && (
                      <div>
                        <h4 className="font-semibold mb-2">Pro Tips:</h4>
                        <div className="space-y-1">
                          {guide.tips.map((tip, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-blue-600">
                              <Lightbulb className="h-4 w-4" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {guide.formula && (
                      <div>
                        <h4 className="font-semibold mb-2">Key Formula:</h4>
                        <div className="p-3 bg-gray-50 rounded text-center">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {`$$${guide.formula}$$`}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Try Tool
                      </Button>
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Video Tutorial
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
