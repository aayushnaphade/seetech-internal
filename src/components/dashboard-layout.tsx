"use client";

import { useState } from "react";
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  Zap, 
  Settings, 
  BarChart3, 
  Users, 
  Lightbulb,
  Activity,
  PieChart,
  FileSpreadsheet,
  Building2,
  Home,
  Menu,
  X,
  ChevronDown,
  Wrench,
  BookOpen,
  Database,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
    badge: null,
  },
  {
    title: "Engineering Tools",
    icon: Wrench,
    href: "/tools",
    badge: null,
    submenu: [
      {
        title: "Energy Calculator",
        icon: Calculator,
        href: "/tools/energy-calculator",
        badge: null,
      },
      {
        title: "Load Analysis",
        icon: BarChart3,
        href: "/tools/load-analysis",
        badge: { text: "Soon", variant: "secondary" as const },
      },
      {
        title: "Proposal Generator",
        icon: FileText,
        href: "/tools/proposal-generator",
        badge: { text: "Beta", variant: "outline" as const },
      },
      {
        title: "ROI Calculator",
        icon: TrendingUp,
        href: "/tools/roi-calculator",
        badge: { text: "Soon", variant: "secondary" as const },
      },
      {
        title: "HVAC Optimizer",
        icon: Activity,
        href: "/tools/hvac-optimizer",
        badge: { text: "Soon", variant: "secondary" as const },
      },
      {
        title: "Lighting Designer",
        icon: Lightbulb,
        href: "/tools/lighting-designer",
        badge: { text: "Soon", variant: "secondary" as const },
      },
      {
        title: "Compressor Analysis",
        icon: Zap,
        href: "/tools/compressor-analysis",
        badge: { text: "New", variant: "default" as const },
      },
    ],
  },
  {
    title: "Projects",
    icon: Building2,
    href: "/projects",
    badge: { text: "24", variant: "default" as const },
  },
  {
    title: "Analytics",
    icon: PieChart,
    href: "/analytics",
    badge: null,
  },
  {
    title: "Knowledge Base",
    icon: BookOpen,
    href: "/knowledge",
    badge: null,
  },
  {
    title: "Data Manager",
    icon: Database,
    href: "/data",
    badge: null,
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Zap className="h-6 w-6 text-primary" />
        <div className="flex flex-col">
          <h1 className="font-semibold text-sm">SeeTech Solutions</h1>
          <Badge variant="secondary" className="text-xs w-fit">Internal Toolbox</Badge>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between",
                        pathname.startsWith(item.href) && "bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-6 pt-2">
                    {item.submenu.map((subItem) => (
                      <Link key={subItem.title} href={subItem.href}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start",
                            pathname === subItem.href && "bg-muted"
                          )}
                        >
                          <subItem.icon className="h-3 w-3 mr-2" />
                          <span className="text-xs">{subItem.title}</span>
                          {subItem.badge && (
                            <Badge variant={subItem.badge.variant} className="ml-auto text-xs">
                              {subItem.badge.text}
                            </Badge>
                          )}
                        </Button>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href && "bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{item.title}</span>
                    {item.badge && (
                      <Badge variant={item.badge.variant} className="ml-auto text-xs">
                        {item.badge.text}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">ST</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-medium">SeeTech Team</span>
            <span className="text-xs text-muted-foreground">Engineering</span>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-1">
          <Link href="/help">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <HelpCircle className="h-3 w-3 mr-2" />
              <span className="text-xs">Help & Support</span>
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="h-3 w-3 mr-2" />
              <span className="text-xs">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r bg-background">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Mobile Header */}
        <header className="md:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <div className="flex items-center gap-2 ml-12">
              <Zap className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">SeeTech Solutions</h1>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
