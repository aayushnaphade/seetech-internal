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
  Gauge
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome to SeeTech Toolbox</h2>
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
        <Tabs defaultValue="tools" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tools">Engineering Tools</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tools" className="space-y-4">
            {/* Engineering Tools Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Energy Efficiency Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate energy savings and efficiency metrics for various equipment
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
                      <Badge variant="secondary" className="ml-2">Beta</Badge>
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    ROI Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate return on investment for energy projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" disabled>
                    Calculate ROI
                    <Badge variant="secondary" className="ml-2">Soon</Badge>
                  </Button>
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

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    HVAC Optimizer
                  </CardTitle>
                  <CardDescription>
                    Optimize heating, ventilation, and air conditioning systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" disabled>
                    Optimize HVAC
                    <Badge variant="secondary" className="ml-2">Soon</Badge>
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
