import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, Zap, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

export default function LoadAnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Load Analysis Tool</h1>
              <Badge variant="secondary">Coming Soon</Badge>
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
                  <BreadcrumbPage>Load Analysis</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Electrical Load Analysis</h2>
            <p className="text-muted-foreground">
              Analyze electrical loads and optimize power consumption patterns
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Load Profiling
                </CardTitle>
                <CardDescription>
                  Analyze power consumption patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Load profile visualization</p>
                  </div>
                  <Button className="w-full" disabled>
                    <Activity className="h-4 w-4 mr-2" />
                    Start Load Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Demand Optimization
                </CardTitle>
                <CardDescription>
                  Optimize peak demand and reduce utility costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Demand optimization charts</p>
                  </div>
                  <Button className="w-full" disabled>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Optimize Demand
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Feature Roadmap</CardTitle>
                <CardDescription>Planned features for the Load Analysis Tool</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Phase 1</Badge>
                    <span className="text-sm">Load curve analysis and visualization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Phase 2</Badge>
                    <span className="text-sm">Peak demand identification and optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Phase 3</Badge>
                    <span className="text-sm">Power factor analysis and correction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Phase 4</Badge>
                    <span className="text-sm">Energy storage integration planning</span>
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
