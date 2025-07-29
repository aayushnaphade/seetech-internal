"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Database,
    Search,
    Filter,
    Download,
    Upload,
    Trash2,
    Edit,
    Eye,
    Plus,
    Calendar,
    Building2,
    Calculator,
    FileText,
    BarChart3,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Clock,
    Pause,
    TrendingUp,
    DollarSign,
    Snowflake,
    Zap,
    FileSpreadsheet
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Types
interface Project {
    id: string;
    name: string;
    client: string;
    type: 'led_retrofit' | 'hvac_upgrade' | 'solar_installation' | 'insulation' | 'other';
    status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
    estimated_savings: number;
    actual_savings?: number;
    investment_cost: number;
    payback_period: number;
    start_date: string;
    completion_date?: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

interface Calculation {
    id: string;
    project_id?: string;
    tool_type: 'energy_calculator' | 'load_analysis' | 'roi_calculator' | 'hvac_optimizer';
    input_data: Record<string, any>;
    output_data: Record<string, any>;
    created_at: string;
    created_by: string;
}

interface Proposal {
    id: string;
    project_id: string;
    client_name: string;
    project_name: string;
    project_type: string;
    current_consumption: number;
    proposed_savings: number;
    investment_cost: number;
    payback_period: number;
    description: string;
    template_used: string;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
}

// Base interface for common fields
interface BaseEquipment {
    id: string;
    sr_no: number;
    type: 'chiller' | 'vrf' | 'dx_unit';
    make: string; // Company Name for DX, Chiller Make for Chiller, VRV/VRF Make for VRF
    model: string; // DX Model, Chiller Model, VRV/VRF Model
    refrigerant_used: string;
    design_dbt_for_tr_capacity_oc: number; // Design DBT for TR capacity (°C)
    cooling_capacity_tr: number; // Cooling Capacity (TR)
    cooling_capacity_kw: number; // Cooling Capacity (KW)
    no_of_condenser_fans: number;
    cfm_per_fan: number; // CFM / fan
    fan_diameter: number | string; // Fan diameter (mm) or just Fan diameter for VRF
    motor_power_per_fan_kw: number; // Motor power per fan (kw)
    total_fan_motor_power_kw: number; // Total fan motor power (kw)
    fan_rpm: number; // Fan (RPM)
    total_airflow_cfm: number; // Total Airflow (CFM)
    total_power_consumption_100_loading_kw: number; // Total Power Consumption at 100% loading (kW)
    working_hours_hrs: number; // Working hours (hrs)
    length_mm: number; // Length (mm)
    width_mm: number; // Width (mm)
    height_mm: number; // Height (mm)
    water_consumption_liters_hr: number; // Water consumption (liters/hr)
    pump_for_pads_water_flow_lt_min: number; // Pump for pads water flow (lt/min)
    pump_head_m: number; // Pump head (m)
    pump_motor_kw: number; // Pump motor (kw)
    pipe_size: string;
    pipe_length: string;
    other_plumbing_material: string;
    water_tank_liters: number; // Water tank (liters)
    created_at: string;
    updated_at: string;
}

// Chiller specific interface
interface ChillerEquipment extends BaseEquipment {
    type: 'chiller';
    pad_area_required_front_ft2: number; // Pad area required (front - chiller panel face) (ft2)
    pad_area_required_left_side_ft2: number; // Pad area required (left side) (ft2)
    pad_area_required_left_side_left_top_ft2: number; // Left Top sub-column
    pad_area_required_left_side_left_bottom_ft2: number; // Left Bottom sub-column
    pad_area_required_right_side_ft2: number; // Pad area required (right side) (ft2)
    pad_area_required_right_side_right_top_ft2: number; // Right Top sub-column
    pad_area_required_right_side_right_bottom_ft2: number; // Right Bottom sub-column
    pad_area_required_back_side_ft2: number; // Pad area required (back side) (ft2)
    total_pad_area_ft2: number; // Total Pad area (ft2)
}

// VRF specific interface
interface VRFEquipment extends BaseEquipment {
    type: 'vrf';
    pad_area_required_front_ft2: number; // Pad area required (front - chiller panel face) (ft2)
    pad_area_required_left_side_ft2: number; // Pad area required (left side) (ft2)
    pad_area_required_left_side_left_top_ft2: number; // Left Top sub-column
    pad_area_required_left_side_left_bottom_ft2: number; // Left Bottom sub-column
    pad_area_required_right_side_ft2: number; // Pad area required (right side) (ft2)
    pad_area_required_right_side_right_top_ft2: number; // Right Top sub-column
    pad_area_required_right_side_right_bottom_ft2: number; // Right Bottom sub-column
    pad_area_required_back_side_ft2: number; // Pad area required (back side) (ft2)
    total_pad_area_ft2: number; // Total Pad area (ft2)
}

// DX Unit specific interface
interface DXEquipment extends BaseEquipment {
    type: 'dx_unit';
    total_pad_area_back_side_ft2: number; // Total Pad area (Back side) (ft2)
}

// Union type for all equipment
type CoolVaultEquipment = ChillerEquipment | VRFEquipment | DXEquipment;

interface DataStats {
    totalProjects: number;
    totalCalculations: number;
    totalProposals: number;
    totalCoolVaultEquipment: number;
    totalSavings: number;
    completedProjects: number;
    activeProjects: number;
}

export default function DataManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [calculations, setCalculations] = useState<Calculation[]>([]);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [coolVaultEquipment, setCoolVaultEquipment] = useState<CoolVaultEquipment[]>([]);
    const [stats, setStats] = useState<DataStats>({
        totalProjects: 0,
        totalCalculations: 0,
        totalProposals: 0,
        totalCoolVaultEquipment: 0,
        totalSavings: 0,
        completedProjects: 0,
        activeProjects: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    // Load data on component mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load projects
            let projectsData: Project[] = [];
            try {
                const projectsResponse = await fetch('/api/projects');
                if (projectsResponse.ok) {
                    projectsData = await projectsResponse.json();
                    // Ensure projectsData is an array
                    if (!Array.isArray(projectsData)) {
                        projectsData = [];
                    }
                }
            } catch (error) {
                console.error('Error loading projects:', error);
                // Provide sample data for demonstration
                projectsData = [
                    {
                        id: 'proj_001',
                        name: 'ABC Manufacturing LED Retrofit',
                        client: 'ABC Manufacturing Inc.',
                        type: 'led_retrofit',
                        status: 'completed',
                        estimated_savings: 120000,
                        actual_savings: 145000,
                        investment_cost: 450000,
                        payback_period: 3.1,
                        start_date: '2024-01-15',
                        completion_date: '2024-03-20',
                        description: 'Complete LED retrofit of manufacturing facility',
                        created_at: '2024-01-10T00:00:00Z',
                        updated_at: '2024-03-20T00:00:00Z'
                    },
                    {
                        id: 'proj_002',
                        name: 'XYZ Office HVAC Upgrade',
                        client: 'XYZ Corporation',
                        type: 'hvac_upgrade',
                        status: 'in_progress',
                        estimated_savings: 80000,
                        investment_cost: 350000,
                        payback_period: 4.4,
                        start_date: '2024-06-01',
                        description: 'HVAC system upgrade with smart controls',
                        created_at: '2024-05-15T00:00:00Z',
                        updated_at: '2024-06-01T00:00:00Z'
                    }
                ];
            }
            setProjects(projectsData);

            // Load calculations
            let calculationsData: Calculation[] = [];
            try {
                const calculationsResponse = await fetch('/api/calculations');
                if (calculationsResponse.ok) {
                    calculationsData = await calculationsResponse.json();
                    // Ensure calculationsData is an array
                    if (!Array.isArray(calculationsData)) {
                        calculationsData = [];
                    }
                }
            } catch (error) {
                console.error('Error loading calculations:', error);
                // Provide sample data for demonstration
                calculationsData = [
                    {
                        id: 'calc_001',
                        project_id: 'proj_001',
                        tool_type: 'energy_calculator',
                        input_data: { power: 100, hours: 8760, rate: 0.12 },
                        output_data: { annual_cost: 105120, savings: 25000 },
                        created_at: '2024-01-15T10:30:00Z',
                        created_by: 'engineer@seetech.com'
                    },
                    {
                        id: 'calc_002',
                        tool_type: 'hvac_optimizer',
                        input_data: { refrigerant: 'R134a', capacity: 100, efficiency: 3.2 },
                        output_data: { optimized_cop: 4.1, energy_savings: 15000 },
                        created_at: '2024-02-01T14:20:00Z',
                        created_by: 'engineer@seetech.com'
                    }
                ];
            }
            setCalculations(calculationsData);

            // Load proposals (when API is available)
            // const proposalsResponse = await fetch('/api/proposals');
            // const proposalsData = await proposalsResponse.json();
            // setProposals(proposalsData);

            // Load CoolVault equipment data
            let coolVaultData: CoolVaultEquipment[] = [];
            try {
                // For now, provide sample data - in future this could be from an API
                coolVaultData = [
                    // Sample Chiller Data
                    {
                        id: 'cv_001',
                        sr_no: 1,
                        type: 'chiller' as const,
                        make: 'Carrier',
                        model: '30XA-1002',
                        refrigerant_used: 'R134a',
                        design_dbt_for_tr_capacity_oc: 35,
                        cooling_capacity_tr: 100,
                        cooling_capacity_kw: 352,
                        no_of_condenser_fans: 4,
                        cfm_per_fan: 8500,
                        fan_diameter: 800,
                        motor_power_per_fan_kw: 2.2,
                        total_fan_motor_power_kw: 8.8,
                        fan_rpm: 850,
                        total_airflow_cfm: 34000,
                        total_power_consumption_100_loading_kw: 312,
                        working_hours_hrs: 8760,
                        length_mm: 4200,
                        width_mm: 2100,
                        height_mm: 2300,
                        pad_area_required_front_ft2: 95,
                        pad_area_required_left_side_ft2: 65,
                        pad_area_required_right_side_ft2: 65,
                        pad_area_required_back_side_ft2: 95,
                        total_pad_area_ft2: 320,
                        water_consumption_liters_hr: 450,
                        pump_for_pads_water_flow_lt_min: 8,
                        pump_head_m: 12,
                        pump_motor_kw: 1.5,
                        pipe_size: '2 inch',
                        pipe_length: '50 meters',
                        other_plumbing_material: 'Valves, Fittings, Strainer',
                        water_tank_liters: 2000,
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-01T00:00:00Z'
                    },
                    // Sample VRF Data
                    {
                        id: 'cv_002',
                        sr_no: 1,
                        type: 'vrf' as const,
                        make: 'Daikin',
                        model: 'VRV X7-224',
                        refrigerant_used: 'R32',
                        design_dbt_for_tr_capacity_oc: 35,
                        cooling_capacity_tr: 20,
                        cooling_capacity_kw: 70.4,
                        no_of_condenser_fans: 2,
                        cfm_per_fan: 3200,
                        fan_diameter: '630mm',
                        motor_power_per_fan_kw: 0.75,
                        total_fan_motor_power_kw: 1.5,
                        fan_rpm: 750,
                        total_airflow_cfm: 6400,
                        total_power_consumption_100_loading_kw: 21.3,
                        working_hours_hrs: 8760,
                        length_mm: 1680,
                        width_mm: 765,
                        height_mm: 1550,
                        pad_area_required_front_ft2: 14,
                        pad_area_required_left_side_ft2: 18,
                        pad_area_required_right_side_ft2: 18,
                        pad_area_required_back_side_ft2: 14,
                        total_pad_area_ft2: 64,
                        water_consumption_liters_hr: 85,
                        pump_for_pads_water_flow_lt_min: 1.5,
                        pump_head_m: 8,
                        pump_motor_kw: 0.37,
                        pipe_size: '1 inch',
                        pipe_length: '25 meters',
                        other_plumbing_material: 'Valves, Fittings',
                        water_tank_liters: 500,
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-01T00:00:00Z'
                    },
                    // Sample DX Unit Data
                    {
                        id: 'cv_003',
                        sr_no: 1,
                        type: 'dx_unit' as const,
                        make: 'Blue Star',
                        model: 'BS-5HW180SAA',
                        refrigerant_used: 'R410A',
                        design_dbt_for_tr_capacity_oc: 35,
                        cooling_capacity_tr: 15,
                        cooling_capacity_kw: 52.8,
                        no_of_condenser_fans: 2,
                        cfm_per_fan: 4500,
                        fan_diameter: 500,
                        motor_power_per_fan_kw: 1.1,
                        total_fan_motor_power_kw: 2.2,
                        fan_rpm: 900,
                        total_airflow_cfm: 9000,
                        total_power_consumption_100_loading_kw: 52,
                        working_hours_hrs: 8760,
                        length_mm: 3200,
                        width_mm: 1200,
                        height_mm: 1800,
                        total_pad_area_back_side_ft2: 42,
                        water_consumption_liters_hr: 120,
                        pump_for_pads_water_flow_lt_min: 2,
                        pump_head_m: 6,
                        pump_motor_kw: 0.25,
                        pipe_size: '1 inch',
                        pipe_length: '20 meters',
                        other_plumbing_material: 'Valves, Fittings',
                        water_tank_liters: 300,
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-01T00:00:00Z'
                    }
                ];
            } catch (error) {
                console.error('Error loading CoolVault data:', error);
                coolVaultData = [];
            }
            setCoolVaultEquipment(coolVaultData);

            // Calculate stats
            const totalSavings = projectsData.reduce((sum: number, p: Project) => {
                const savings = p.actual_savings || p.estimated_savings || 0;
                return sum + (typeof savings === 'number' ? savings : 0);
            }, 0);
            const completedProjects = projectsData.filter((p: Project) => p.status === 'completed').length;
            const activeProjects = projectsData.filter((p: Project) => p.status === 'in_progress').length;

            setStats({
                totalProjects: projectsData.length,
                totalCalculations: calculationsData.length,
                totalProposals: 0, // proposalsData.length,
                totalCoolVaultEquipment: coolVaultData.length,
                totalSavings,
                completedProjects,
                activeProjects
            });

        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'in_progress':
                return <Clock className="h-4 w-4 text-blue-500" />;
            case 'on_hold':
                return <Pause className="h-4 w-4 text-yellow-500" />;
            case 'planning':
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            completed: "default",
            in_progress: "secondary",
            on_hold: "outline",
            planning: "outline"
        };
        return <Badge variant={variants[status] || "outline"}>{status.replace('_', ' ')}</Badge>;
    };

    const getToolTypeIcon = (toolType: string) => {
        switch (toolType) {
            case 'energy_calculator':
                return <Calculator className="h-4 w-4 text-blue-500" />;
            case 'hvac_optimizer':
                return <BarChart3 className="h-4 w-4 text-green-500" />;
            case 'load_analysis':
                return <TrendingUp className="h-4 w-4 text-purple-500" />;
            case 'roi_calculator':
                return <DollarSign className="h-4 w-4 text-orange-500" />;
            default:
                return <Calculator className="h-4 w-4 text-gray-500" />;
        }
    };

    const filteredProjects = (projects || []).filter(project => {
        if (!project) return false;
        const matchesSearch = (project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.client || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || project.status === statusFilter;
        const matchesType = typeFilter === "all" || project.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const filteredCalculations = (calculations || []).filter(calc => {
        if (!calc) return false;
        const matchesSearch = (calc.tool_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (calc.created_by || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const exportData = (dataType: string) => {
        let data: any[] = [];
        let filename = '';

        switch (dataType) {
            case 'projects':
                data = projects;
                filename = 'projects_export.json';
                break;
            case 'calculations':
                data = calculations;
                filename = 'calculations_export.json';
                break;
            case 'proposals':
                data = proposals;
                filename = 'proposals_export.json';
                break;
            case 'coolvault':
                data = coolVaultEquipment;
                filename = 'coolvault_equipment_export.json';
                break;
            case 'chillers':
                data = coolVaultEquipment.filter(eq => eq.type === 'chiller');
                filename = 'chillers_export.json';
                break;
            case 'vrf':
                data = coolVaultEquipment.filter(eq => eq.type === 'vrf');
                filename = 'vrf_export.json';
                break;
            case 'dx':
                data = coolVaultEquipment.filter(eq => eq.type === 'dx_unit');
                filename = 'dx_units_export.json';
                break;
            default:
                return;
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success(`${dataType} data exported successfully`);
    };

    // Secure file import function (CSV-based to avoid xlsx vulnerabilities)
    const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check file type
        if (!file.name.endsWith('.csv')) {
            toast.error('For security reasons, please convert your Excel worksheets to CSV format. Use "Save As" → "CSV (Comma delimited)" in Excel for each worksheet (Chiller, VRF, DX).');
            event.target.value = '';
            return;
        }

        try {
            toast.info(`Processing "${file.name}"...`);
            await handleCSVImport(file);
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Failed to import file. Please check the format and try again.');
        }

        // Reset the input
        event.target.value = '';
    };

    // CSV import function (safer alternative to xlsx)
    const handleCSVImport = async (file: File) => {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const csvText = e.target?.result as string;
                    const lines = csvText.split('\n').filter(line => line.trim());

                    if (lines.length < 2) {
                        toast.error('CSV file appears to be empty or invalid');
                        reject(new Error('Invalid CSV'));
                        return;
                    }

                    // Parse CSV headers
                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

                    // Determine equipment type based on headers
                    let equipmentType: 'chiller' | 'vrf' | 'dx_unit' = 'chiller';
                    if (headers.includes('VRV/VRF Make') || headers.includes('VRV/VRF Model')) {
                        equipmentType = 'vrf';
                    } else if (headers.includes('Company Name') || headers.includes('DX Model')) {
                        equipmentType = 'dx_unit';
                    }

                    // Parse data rows
                    const newEquipment: CoolVaultEquipment[] = [];

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));

                        if (values.length !== headers.length) continue;

                        const rowData: any = {};
                        headers.forEach((header, index) => {
                            rowData[header] = values[index];
                        });

                        // Convert to equipment object
                        const equipment = convertCSVRowToEquipment(rowData, equipmentType);
                        if (equipment) {
                            newEquipment.push(equipment);
                        }
                    }

                    if (newEquipment.length > 0) {
                        // Add to existing equipment
                        setCoolVaultEquipment(prev => [...prev, ...newEquipment]);

                        // Update stats
                        setStats(prev => ({
                            ...prev,
                            totalCoolVaultEquipment: prev.totalCoolVaultEquipment + newEquipment.length
                        }));

                        toast.success(`Successfully imported ${newEquipment.length} ${equipmentType} equipment entries`);
                    } else {
                        toast.error('No valid equipment data found in CSV');
                    }

                    resolve();
                } catch (error) {
                    console.error('CSV parsing error:', error);
                    toast.error('Failed to parse CSV file. Please check the format.');
                    reject(error);
                }
            };

            reader.onerror = () => {
                toast.error('Failed to read file');
                reject(new Error('File read error'));
            };

            reader.readAsText(file);
        });
    };

    // Convert CSV row to equipment object
    const convertCSVRowToEquipment = (row: any, type: 'chiller' | 'vrf' | 'dx_unit'): CoolVaultEquipment | null => {
        try {
            const baseEquipment: any = {
                id: `cv_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Common field mappings
            const commonMappings: Record<string, string> = {
                'Sr. no.': 'sr_no',
                'Sr no.': 'sr_no',
                'Refrigerant used': 'refrigerant_used',
                'Design DBT for TR capacity (OC)': 'design_dbt_for_tr_capacity_oc',
                'Cooling Capacity (TR)': 'cooling_capacity_tr',
                'Cooling Capacity (KW)': 'cooling_capacity_kw',
                'NO. of condenser fans': 'no_of_condenser_fans',
                'No. of condenser fans': 'no_of_condenser_fans',
                'CFM / fan': 'cfm_per_fan',
                'Fan diameter (mm)': 'fan_diameter',
                'Fan diameter': 'fan_diameter',
                'Motor power per fan (kw)': 'motor_power_per_fan_kw',
                'Total fan motor power (kw)': 'total_fan_motor_power_kw',
                'Total Fan motor power (kw)': 'total_fan_motor_power_kw',
                'Fan (RPM)': 'fan_rpm',
                'Total Airflow (CFM)': 'total_airflow_cfm',
                'Length (mm)': 'length_mm',
                'Width (mm)': 'width_mm',
                'Height (mm)': 'height_mm',
                'Water consumption (liters/hr)': 'water_consumption_liters_hr',
                'Pump for pads water flow (lt/min)': 'pump_for_pads_water_flow_lt_min',
                'Pump head (m)': 'pump_head_m',
                'Pump motor (kw)': 'pump_motor_kw',
                'Pipe size': 'pipe_size',
                'Pipe length': 'pipe_length',
                'Other Plumbing material': 'other_plumbing_material',
                'Water tank (liters)': 'water_tank_liters'
            };

            // Type-specific mappings
            if (type === 'chiller') {
                commonMappings['Chiller Make'] = 'make';
                commonMappings['Chiller Model'] = 'model';
                commonMappings['Chiller total Power Consumption at 100% loading (kW)'] = 'total_power_consumption_100_loading_kw';
                commonMappings['Chiller Working hours (hrs)'] = 'working_hours_hrs';
                commonMappings['Pad area required (front - chiller panel face ) , (ft2)'] = 'pad_area_required_front_ft2';
                commonMappings['Pad area required (left side) , (ft2)'] = 'pad_area_required_left_side_ft2';
                commonMappings['Left Top'] = 'pad_area_required_left_side_left_top_ft2';
                commonMappings['Left Bottom'] = 'pad_area_required_left_side_left_bottom_ft2';
                commonMappings['Pad area required (right side) , (ft2)'] = 'pad_area_required_right_side_ft2';
                commonMappings['Right Top'] = 'pad_area_required_right_side_right_top_ft2';
                commonMappings['Right Bottom'] = 'pad_area_required_right_side_right_bottom_ft2';
                commonMappings['Pad area required (back side ) (ft2)'] = 'pad_area_required_back_side_ft2';
                commonMappings['Total Pad area (ft2)'] = 'total_pad_area_ft2';
            } else if (type === 'vrf') {
                commonMappings['VRV/VRF Make'] = 'make';
                commonMappings['VRV/VRF Model'] = 'model';
                commonMappings['VRV total Power Consumption at 100% loading (kW)'] = 'total_power_consumption_100_loading_kw';
                commonMappings['VRV Working hours (hrs)'] = 'working_hours_hrs';
                commonMappings['Pad area required (front - chiller panel face ) , (ft2)'] = 'pad_area_required_front_ft2';
                commonMappings['Pad area required (left side) , (ft2)'] = 'pad_area_required_left_side_ft2';
                commonMappings['Left Top'] = 'pad_area_required_left_side_left_top_ft2';
                commonMappings['Left Bottom'] = 'pad_area_required_left_side_left_bottom_ft2';
                commonMappings['Pad area required (right side) , (ft2)'] = 'pad_area_required_right_side_ft2';
                commonMappings['Right Top'] = 'pad_area_required_right_side_right_top_ft2';
                commonMappings['Right Bottom'] = 'pad_area_required_right_side_right_bottom_ft2';
                commonMappings['Pad area required (back side ) (ft2)'] = 'pad_area_required_back_side_ft2';
                commonMappings['Total Pad area (ft2)'] = 'total_pad_area_ft2';
            } else if (type === 'dx_unit') {
                commonMappings['Company Name'] = 'make';
                commonMappings['DX Model'] = 'model';
                commonMappings['DX total Power Consumption at 100% loading (kW)'] = 'total_power_consumption_100_loading_kw';
                commonMappings['DX Working hours (hrs)'] = 'working_hours_hrs';
                commonMappings['Total Pad area (Back side) (ft2)'] = 'total_pad_area_back_side_ft2';
            }

            // Map the data
            Object.entries(commonMappings).forEach(([csvColumn, propertyName]) => {
                const value = row[csvColumn];
                if (value !== undefined && value !== null && value !== '') {
                    // Convert numeric values
                    if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
                        baseEquipment[propertyName] = Number(value);
                    } else {
                        baseEquipment[propertyName] = value;
                    }
                }
            });

            // Validate required fields
            if (!baseEquipment.sr_no || !baseEquipment.make || !baseEquipment.model) {
                return null;
            }

            return baseEquipment as CoolVaultEquipment;
        } catch (error) {
            console.error('Error converting CSV row:', error);
            return null;
        }
    };

    // Function to download CSV templates
    const downloadExcelTemplate = () => {
        // Create a sample Excel structure that matches the expected format
        const templateData = {
            chiller: [
                {
                    'Sr. no.': 1,
                    'Chiller Make': 'Carrier',
                    'Chiller Model': '30XA-1002',
                    'Refrigerant used': 'R134a',
                    'Design DBT for TR capacity (OC)': 35,
                    'Cooling Capacity (TR)': 100,
                    'Cooling Capacity (KW)': 352,
                    'NO. of condenser fans': 4,
                    'CFM / fan': 8500,
                    'Fan diameter (mm)': 800,
                    'Motor power per fan (kw)': 2.2,
                    'Total fan motor power (kw)': 8.8,
                    'Fan (RPM)': 850,
                    'Total Airflow (CFM)': 34000,
                    'Chiller total Power Consumption at 100% loading (kW)': 312,
                    'Chiller Working hours (hrs)': 8760,
                    'Length (mm)': 4200,
                    'Width (mm)': 2100,
                    'Height (mm)': 2300,
                    'Pad area required (front - chiller panel face ) , (ft2)': 95,
                    'Pad area required (left side) , (ft2)': 65,
                    'Pad area required (right side) , (ft2)': 65,
                    'Pad area required (back side ) (ft2)': 95,
                    'Total Pad area (ft2)': 320,
                    'Water consumption (liters/hr)': 450,
                    'Pump for pads water flow (lt/min)': 8,
                    'Pump head (m)': 12,
                    'Pump motor (kw)': 1.5,
                    'Pipe size': '2 inch',
                    'Pipe length': '50 meters',
                    'Other Plumbing material': 'Valves, Fittings, Strainer',
                    'Water tank (liters)': 2000
                }
            ],
            vrf: [
                {
                    'Sr no.': 1,
                    'VRV/VRF Make': 'Daikin',
                    'VRV/VRF Model': 'VRV X7-224',
                    'Refrigerant used': 'R32',
                    'Design DBT for TR capacity (OC)': 35,
                    'Cooling Capacity (TR)': 20,
                    'Cooling Capacity (KW)': 70.4,
                    'NO. of condenser fans': 2,
                    'CFM / fan': 3200,
                    'Fan diameter': '630mm',
                    'Motor power per fan (kw)': 0.75,
                    'Total Fan motor power (kw)': 1.5,
                    'Fan (RPM)': 750,
                    'Total Airflow (CFM)': 6400,
                    'VRV total Power Consumption at 100% loading (kW)': 21.3,
                    'VRV Working hours (hrs)': 8760,
                    'Length (mm)': 1680,
                    'Width (mm)': 765,
                    'Height (mm)': 1550,
                    'Pad area required (front - chiller panel face ) , (ft2)': 14,
                    'Pad area required (left side) , (ft2)': 18,
                    'Pad area required (right side) , (ft2)': 18,
                    'Pad area required (back side ) (ft2)': 14,
                    'Total Pad area (ft2)': 64,
                    'Water consumption (liters/hr)': 85,
                    'Pump for pads water flow (lt/min)': 1.5,
                    'Pump head (m)': 8,
                    'Pump motor (kw)': 0.37,
                    'Pipe size': '1 inch',
                    'Pipe length': '25 meters',
                    'Other Plumbing material': 'Valves, Fittings',
                    'Water tank (liters)': 500
                }
            ],
            dx: [
                {
                    'Sr no.': 1,
                    'Company Name': 'Blue Star',
                    'DX Model': 'BS-5HW180SAA',
                    'Refrigerant used': 'R410A',
                    'Design DBT for TR capacity (OC)': 35,
                    'Cooling Capacity (TR)': 15,
                    'Cooling Capacity (KW)': 52.8,
                    'No. of condenser fans': 2,
                    'CFM / fan': 4500,
                    'Fan diameter': 500,
                    'Motor power per fan (kw)': 1.1,
                    'Total Fan motor power (kw)': 2.2,
                    'Fan (RPM)': 900,
                    'Total Airflow (CFM)': 9000,
                    'DX total Power Consumption at 100% loading (kW)': 52,
                    'DX Working hours (hrs)': 8760,
                    'Length (mm)': 3200,
                    'Width (mm)': 1200,
                    'Height (mm)': 1800,
                    'Total Pad area (Back side) (ft2)': 42,
                    'Water consumption (liters/hr)': 120,
                    'Pump for pads water flow (lt/min)': 2,
                    'Pump head (m)': 6,
                    'Pump motor (kw)': 0.25,
                    'Pipe size': '1 inch',
                    'Pipe length': '20 meters',
                    'Other Plumbing material': 'Valves, Fittings',
                    'Water tank (liters)': 300
                }
            ]
        };

        // Create CSV templates for each equipment type
        const createCSV = (data: any[], filename: string) => {
            if (data.length === 0) return;

            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        // Download each template
        createCSV(templateData.chiller, 'chiller_template.csv');
        setTimeout(() => createCSV(templateData.vrf, 'vrf_template.csv'), 100);
        setTimeout(() => createCSV(templateData.dx, 'dx_template.csv'), 200);

        toast.success('CSV templates downloaded! Import each CSV file separately (chiller_template.csv, vrf_template.csv, dx_template.csv).');
    };

    // Individual import functions for each equipment type
    const handleChillerImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            toast.error('Please select a CSV file. Convert your Excel chiller worksheet to CSV format.');
            event.target.value = '';
            return;
        }

        try {
            toast.info(`Processing chiller data from "${file.name}"...`);
            await handleSpecificCSVImport(file, 'chiller');
        } catch (error) {
            console.error('Chiller import error:', error);
            toast.error('Failed to import chiller data. Please check the format.');
        }

        event.target.value = '';
    };

    const handleVRFImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            toast.error('Please select a CSV file. Convert your Excel VRF worksheet to CSV format.');
            event.target.value = '';
            return;
        }

        try {
            toast.info(`Processing VRF data from "${file.name}"...`);
            await handleSpecificCSVImport(file, 'vrf');
        } catch (error) {
            console.error('VRF import error:', error);
            toast.error('Failed to import VRF data. Please check the format.');
        }

        event.target.value = '';
    };

    const handleDXImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            toast.error('Please select a CSV file. Convert your Excel DX worksheet to CSV format.');
            event.target.value = '';
            return;
        }

        try {
            toast.info(`Processing DX unit data from "${file.name}"...`);
            await handleSpecificCSVImport(file, 'dx_unit');
        } catch (error) {
            console.error('DX import error:', error);
            toast.error('Failed to import DX unit data. Please check the format.');
        }

        event.target.value = '';
    };

    // Specific CSV import for a particular equipment type
    const handleSpecificCSVImport = async (file: File, expectedType: 'chiller' | 'vrf' | 'dx_unit') => {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const csvText = e.target?.result as string;
                    const lines = csvText.split('\n').filter(line => line.trim());

                    if (lines.length < 2) {
                        toast.error('CSV file appears to be empty or invalid');
                        reject(new Error('Invalid CSV'));
                        return;
                    }

                    // Parse CSV headers
                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

                    // Validate that the CSV matches the expected type
                    const isValidType = validateCSVType(headers, expectedType);
                    if (!isValidType) {
                        const typeNames = {
                            'chiller': 'Chiller (should have "Chiller Make", "Chiller Model")',
                            'vrf': 'VRF (should have "VRV/VRF Make", "VRV/VRF Model")',
                            'dx_unit': 'DX Unit (should have "Company Name", "DX Model")'
                        };
                        toast.error(`CSV format doesn't match expected ${typeNames[expectedType]} format`);
                        reject(new Error('Invalid CSV type'));
                        return;
                    }

                    // Parse data rows
                    const newEquipment: CoolVaultEquipment[] = [];

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));

                        if (values.length !== headers.length) continue;

                        const rowData: any = {};
                        headers.forEach((header, index) => {
                            rowData[header] = values[index];
                        });

                        // Convert to equipment object
                        const equipment = convertCSVRowToEquipment(rowData, expectedType);
                        if (equipment) {
                            newEquipment.push(equipment);
                        }
                    }

                    if (newEquipment.length > 0) {
                        // Add to existing equipment
                        setCoolVaultEquipment(prev => [...prev, ...newEquipment]);

                        // Update stats
                        setStats(prev => ({
                            ...prev,
                            totalCoolVaultEquipment: prev.totalCoolVaultEquipment + newEquipment.length
                        }));

                        const typeNames = {
                            'chiller': 'chiller',
                            'vrf': 'VRF',
                            'dx_unit': 'DX unit'
                        };
                        toast.success(`Successfully imported ${newEquipment.length} ${typeNames[expectedType]} equipment entries`);
                    } else {
                        toast.error('No valid equipment data found in CSV');
                    }

                    resolve();
                } catch (error) {
                    console.error('CSV parsing error:', error);
                    toast.error('Failed to parse CSV file. Please check the format.');
                    reject(error);
                }
            };

            reader.onerror = () => {
                toast.error('Failed to read file');
                reject(new Error('File read error'));
            };

            reader.readAsText(file);
        });
    };

    // Validate CSV type based on headers
    const validateCSVType = (headers: string[], expectedType: 'chiller' | 'vrf' | 'dx_unit'): boolean => {
        switch (expectedType) {
            case 'chiller':
                return headers.includes('Chiller Make') && headers.includes('Chiller Model');
            case 'vrf':
                return headers.includes('VRV/VRF Make') && headers.includes('VRV/VRF Model');
            case 'dx_unit':
                return headers.includes('Company Name') && headers.includes('DX Model');
            default:
                return false;
        }
    };

    // Download specific template for equipment type
    const downloadSpecificTemplate = (type: 'chiller' | 'vrf' | 'dx_unit') => {
        const templateData = {
            chiller: [
                {
                    'Sr. no.': 1,
                    'Chiller Make': 'Carrier',
                    'Chiller Model': '30XA-1002',
                    'Refrigerant used': 'R134a',
                    'Design DBT for TR capacity (OC)': 35,
                    'Cooling Capacity (TR)': 100,
                    'Cooling Capacity (KW)': 352,
                    'NO. of condenser fans': 4,
                    'CFM / fan': 8500,
                    'Fan diameter (mm)': 800,
                    'Motor power per fan (kw)': 2.2,
                    'Total fan motor power (kw)': 8.8,
                    'Fan (RPM)': 850,
                    'Total Airflow (CFM)': 34000,
                    'Chiller total Power Consumption at 100% loading (kW)': 312,
                    'Chiller Working hours (hrs)': 8760,
                    'Length (mm)': 4200,
                    'Width (mm)': 2100,
                    'Height (mm)': 2300,
                    'Pad area required (front - chiller panel face ) , (ft2)': 95,
                    'Pad area required (left side) , (ft2)': 65,
                    'Pad area required (right side) , (ft2)': 65,
                    'Pad area required (back side ) (ft2)': 95,
                    'Total Pad area (ft2)': 320,
                    'Water consumption (liters/hr)': 450,
                    'Pump for pads water flow (lt/min)': 8,
                    'Pump head (m)': 12,
                    'Pump motor (kw)': 1.5,
                    'Pipe size': '2 inch',
                    'Pipe length': '50 meters',
                    'Other Plumbing material': 'Valves, Fittings, Strainer',
                    'Water tank (liters)': 2000
                }
            ],
            vrf: [
                {
                    'Sr no.': 1,
                    'VRV/VRF Make': 'Daikin',
                    'VRV/VRF Model': 'VRV X7-224',
                    'Refrigerant used': 'R32',
                    'Design DBT for TR capacity (OC)': 35,
                    'Cooling Capacity (TR)': 20,
                    'Cooling Capacity (KW)': 70.4,
                    'NO. of condenser fans': 2,
                    'CFM / fan': 3200,
                    'Fan diameter': '630mm',
                    'Motor power per fan (kw)': 0.75,
                    'Total Fan motor power (kw)': 1.5,
                    'Fan (RPM)': 750,
                    'Total Airflow (CFM)': 6400,
                    'VRV total Power Consumption at 100% loading (kW)': 21.3,
                    'VRV Working hours (hrs)': 8760,
                    'Length (mm)': 1680,
                    'Width (mm)': 765,
                    'Height (mm)': 1550,
                    'Pad area required (front - chiller panel face ) , (ft2)': 14,
                    'Pad area required (left side) , (ft2)': 18,
                    'Pad area required (right side) , (ft2)': 18,
                    'Pad area required (back side ) (ft2)': 14,
                    'Total Pad area (ft2)': 64,
                    'Water consumption (liters/hr)': 85,
                    'Pump for pads water flow (lt/min)': 1.5,
                    'Pump head (m)': 8,
                    'Pump motor (kw)': 0.37,
                    'Pipe size': '1 inch',
                    'Pipe length': '25 meters',
                    'Other Plumbing material': 'Valves, Fittings',
                    'Water tank (liters)': 500
                }
            ],
            dx_unit: [
                {
                    'Sr no.': 1,
                    'Company Name': 'Blue Star',
                    'DX Model': 'BS-5HW180SAA',
                    'Refrigerant used': 'R410A',
                    'Design DBT for TR capacity (OC)': 35,
                    'Cooling Capacity (TR)': 15,
                    'Cooling Capacity (KW)': 52.8,
                    'No. of condenser fans': 2,
                    'CFM / fan': 4500,
                    'Fan diameter': 500,
                    'Motor power per fan (kw)': 1.1,
                    'Total Fan motor power (kw)': 2.2,
                    'Fan (RPM)': 900,
                    'Total Airflow (CFM)': 9000,
                    'DX total Power Consumption at 100% loading (kW)': 52,
                    'DX Working hours (hrs)': 8760,
                    'Length (mm)': 3200,
                    'Width (mm)': 1200,
                    'Height (mm)': 1800,
                    'Total Pad area (Back side) (ft2)': 42,
                    'Water consumption (liters/hr)': 120,
                    'Pump for pads water flow (lt/min)': 2,
                    'Pump head (m)': 6,
                    'Pump motor (kw)': 0.25,
                    'Pipe size': '1 inch',
                    'Pipe length': '20 meters',
                    'Other Plumbing material': 'Valves, Fittings',
                    'Water tank (liters)': 300
                }
            ]
        };

        const data = templateData[type];
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_template.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        const typeNames = {
            'chiller': 'Chiller',
            'vrf': 'VRF',
            'dx_unit': 'DX Unit'
        };
        toast.success(`${typeNames[type]} CSV template downloaded!`);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading data...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold tracking-tight">Data Manager</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Manage and analyze your projects, calculations, and proposals data
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProjects}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.activeProjects} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Calculations</CardTitle>
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCalculations}</div>
                            <p className="text-xs text-muted-foreground">
                                Across all tools
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Proposals</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProposals}</div>
                            <p className="text-xs text-muted-foreground">
                                Generated
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cool Vault</CardTitle>
                            <Snowflake className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCoolVaultEquipment}</div>
                            <p className="text-xs text-muted-foreground">
                                Equipment models
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{((stats.totalSavings || 0) / 100000).toFixed(1)}L</div>
                            <p className="text-xs text-muted-foreground">
                                Estimated annual
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completedProjects}</div>
                            <p className="text-xs text-muted-foreground">
                                Projects finished
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Project completion
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Data Tables */}
                <Tabs defaultValue="projects" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <TabsList className="grid w-full max-w-2xl grid-cols-4">
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="calculations">Calculations</TabsTrigger>
                            <TabsTrigger value="proposals">Proposals</TabsTrigger>
                            <TabsTrigger value="coolvault">Cool Vault</TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2">
                            <Button onClick={loadData} variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="projects" className="space-y-4">
                        {/* Projects Filters and Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search projects..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 w-64"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="planning">Planning</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="led_retrofit">LED Retrofit</SelectItem>
                                        <SelectItem value="hvac_upgrade">HVAC Upgrade</SelectItem>
                                        <SelectItem value="solar_installation">Solar Installation</SelectItem>
                                        <SelectItem value="insulation">Insulation</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button onClick={() => exportData('projects')} variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                                <Link href="/projects/new">
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Project
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Projects Table */}
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Savings</TableHead>
                                            <TableHead>Investment</TableHead>
                                            <TableHead>Payback</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProjects.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} className="text-center py-8">
                                                    <div className="text-muted-foreground">
                                                        {projects.length === 0 ? 'No projects found' : 'No projects match your filters'}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredProjects.map((project) => (
                                                <TableRow key={project.id}>
                                                    <TableCell className="font-medium">
                                                        <div>
                                                            <div className="font-semibold">{project.name}</div>
                                                            {project.description && (
                                                                <div className="text-sm text-muted-foreground truncate max-w-48">
                                                                    {project.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{project.client}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {project.type.replace('_', ' ')}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {getStatusIcon(project.status)}
                                                            {getStatusBadge(project.status)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">
                                                                ₹{((project.estimated_savings || 0) / 1000).toFixed(0)}K
                                                            </div>
                                                            {project.actual_savings && (
                                                                <div className="text-sm text-green-600">
                                                                    Actual: ₹{((project.actual_savings || 0) / 1000).toFixed(0)}K
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>₹{((project.investment_cost || 0) / 100000).toFixed(1)}L</TableCell>
                                                    <TableCell>{(project.payback_period || 0).toFixed(1)} years</TableCell>
                                                    <TableCell>
                                                        {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="calculations" className="space-y-4">
                        {/* Calculations Filters and Actions */}
                        <div className="flex items-center justify-between">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search calculations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 w-64"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button onClick={() => exportData('calculations')} variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                                <Link href="/tools">
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Calculation
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Calculations Table */}
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tool</TableHead>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Created By</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Input Summary</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCalculations.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8">
                                                    <div className="text-muted-foreground">
                                                        {calculations.length === 0 ? 'No calculations found' : 'No calculations match your filters'}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredCalculations.map((calc) => (
                                                <TableRow key={calc.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {getToolTypeIcon(calc.tool_type)}
                                                            <span className="font-medium">
                                                                {calc.tool_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {calc.project_id ? (
                                                            <Badge variant="outline">{calc.project_id}</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">Standalone</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{calc.created_by}</TableCell>
                                                    <TableCell>
                                                        {calc.created_at ? new Date(calc.created_at).toLocaleDateString() : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-muted-foreground max-w-48 truncate">
                                                            {calc.input_data ? Object.keys(calc.input_data).length : 0} parameters
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-2xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Calculation Details</DialogTitle>
                                                                        <DialogDescription>
                                                                            {calc.tool_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} - {calc.created_at ? new Date(calc.created_at).toLocaleString() : 'N/A'}
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <h4 className="font-semibold mb-2">Input Data</h4>
                                                                            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                                                                                {JSON.stringify(calc.input_data || {}, null, 2)}
                                                                            </pre>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold mb-2">Output Data</h4>
                                                                            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                                                                                {JSON.stringify(calc.output_data || {}, null, 2)}
                                                                            </pre>
                                                                        </div>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Button variant="ghost" size="sm">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="proposals" className="space-y-4">
                        {/* Proposals - Coming Soon */}
                        <Card>
                            <CardContent className="flex items-center justify-center p-12">
                                <div className="text-center space-y-4">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                                    <div>
                                        <h3 className="text-lg font-semibold">Proposals Management</h3>
                                        <p className="text-muted-foreground">
                                            Proposal data management will be available soon.
                                            You can currently generate proposals using the Proposal Generator tool.
                                        </p>
                                    </div>
                                    <Link href="/tools/proposal-generator">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Generate Proposal
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="coolvault" className="space-y-4">
                        {/* Cool Vault Sub-Categories */}
                        <Tabs defaultValue="chillers" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <TabsList className="grid w-full max-w-md grid-cols-3">
                                    <TabsTrigger value="chillers">
                                        <Snowflake className="h-4 w-4 mr-2" />
                                        Chillers
                                    </TabsTrigger>
                                    <TabsTrigger value="vrf">
                                        <Zap className="h-4 w-4 mr-2" />
                                        VRF Systems
                                    </TabsTrigger>
                                    <TabsTrigger value="dx">
                                        <Calculator className="h-4 w-4 mr-2" />
                                        DX Units
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex items-center gap-2">
                                    <Button onClick={() => exportData('coolvault')} variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export All
                                    </Button>
                                </div>
                            </div>

                            {/* Chillers Tab */}
                            <TabsContent value="chillers" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search chillers..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-8 w-64"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button onClick={() => downloadSpecificTemplate('chiller')} variant="outline" size="sm">
                                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                                            CSV Template
                                        </Button>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={handleChillerImport}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                id="chiller-csv-upload"
                                            />
                                            <Button variant="outline" size="sm" asChild>
                                                <label htmlFor="chiller-csv-upload" className="cursor-pointer">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Import Chillers
                                                </label>
                                            </Button>
                                        </div>
                                        <Button onClick={() => exportData('chillers')} variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                        <Button size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Chiller
                                        </Button>
                                    </div>
                                </div>

                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Sr. No.</TableHead>
                                                    <TableHead>Make & Model</TableHead>
                                                    <TableHead>Refrigerant</TableHead>
                                                    <TableHead>Capacity (TR)</TableHead>
                                                    <TableHead>Power (kW)</TableHead>
                                                    <TableHead>Fans</TableHead>
                                                    <TableHead>Dimensions (mm)</TableHead>
                                                    <TableHead>Pad Area (ft²)</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {coolVaultEquipment.filter(eq => eq.type === 'chiller' &&
                                                    (eq.make || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (eq.model || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                ).length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={9} className="text-center py-8">
                                                            <div className="text-muted-foreground">
                                                                No chillers found. Import your chiller data or add manually.
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    coolVaultEquipment.filter(eq => eq.type === 'chiller' &&
                                                        ((eq.make || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                            (eq.model || '').toLowerCase().includes(searchTerm.toLowerCase()))
                                                    ).map((equipment) => (
                                                        <TableRow key={equipment.id}>
                                                            <TableCell className="font-medium">
                                                                {equipment.sr_no}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                <div>
                                                                    <div className="font-semibold">{equipment.make}</div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {equipment.model}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary">
                                                                    {equipment.refrigerant_used}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {equipment.cooling_capacity_tr} TR
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {equipment.cooling_capacity_kw} kW
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {equipment.total_power_consumption_100_loading_kw} kW
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Fan: {equipment.total_fan_motor_power_kw} kW
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div>{equipment.no_of_condenser_fans} fans</div>
                                                                    <div>{equipment.cfm_per_fan} CFM each</div>
                                                                    <div>Ø{equipment.fan_diameter}mm</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div>{equipment.length_mm} × {equipment.width_mm} × {equipment.height_mm}</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div className="font-medium">{(equipment as ChillerEquipment).total_pad_area_ft2} ft²</div>
                                                                    <div className="text-muted-foreground">Total area</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-1">
                                                                    <Button variant="ghost" size="sm">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* VRF Tab */}
                            <TabsContent value="vrf" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search VRF systems..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-8 w-64"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button onClick={() => downloadSpecificTemplate('vrf')} variant="outline" size="sm">
                                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                                            CSV Template
                                        </Button>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={handleVRFImport}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                id="vrf-csv-upload"
                                            />
                                            <Button variant="outline" size="sm" asChild>
                                                <label htmlFor="vrf-csv-upload" className="cursor-pointer">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Import VRF
                                                </label>
                                            </Button>
                                        </div>
                                        <Button onClick={() => exportData('vrf')} variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                        <Button size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add VRF
                                        </Button>
                                    </div>
                                </div>

                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Sr. No.</TableHead>
                                                    <TableHead>Make & Model</TableHead>
                                                    <TableHead>Refrigerant</TableHead>
                                                    <TableHead>Capacity (TR)</TableHead>
                                                    <TableHead>Power (kW)</TableHead>
                                                    <TableHead>Fans</TableHead>
                                                    <TableHead>Dimensions (mm)</TableHead>
                                                    <TableHead>Pad Area (ft²)</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {coolVaultEquipment.filter(eq => eq.type === 'vrf' &&
                                                    (eq.make || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (eq.model || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                ).length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={9} className="text-center py-8">
                                                            <div className="text-muted-foreground">
                                                                No VRF systems found. Import your VRF data or add manually.
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    coolVaultEquipment.filter(eq => eq.type === 'vrf' &&
                                                        ((eq.make || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                            (eq.model || '').toLowerCase().includes(searchTerm.toLowerCase()))
                                                    ).map((equipment) => (
                                                        <TableRow key={equipment.id}>
                                                            <TableCell className="font-medium">
                                                                {equipment.sr_no}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                <div>
                                                                    <div className="font-semibold">{equipment.make}</div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {equipment.model}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary">
                                                                    {equipment.refrigerant_used}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {equipment.cooling_capacity_tr} TR
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {equipment.cooling_capacity_kw} kW
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {equipment.total_power_consumption_100_loading_kw} kW
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Fan: {equipment.total_fan_motor_power_kw} kW
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div>{equipment.no_of_condenser_fans} fans</div>
                                                                    <div>{equipment.cfm_per_fan} CFM each</div>
                                                                    <div>Ø{equipment.fan_diameter}</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div>{equipment.length_mm} × {equipment.width_mm} × {equipment.height_mm}</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div className="font-medium">{(equipment as VRFEquipment).total_pad_area_ft2} ft²</div>
                                                                    <div className="text-muted-foreground">Total area</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-1">
                                                                    <Button variant="ghost" size="sm">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* DX Units Tab */}
                            <TabsContent value="dx" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search DX units..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-8 w-64"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button onClick={() => downloadSpecificTemplate('dx_unit')} variant="outline" size="sm">
                                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                                            CSV Template
                                        </Button>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={handleDXImport}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                id="dx-csv-upload"
                                            />
                                            <Button variant="outline" size="sm" asChild>
                                                <label htmlFor="dx-csv-upload" className="cursor-pointer">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Import DX
                                                </label>
                                            </Button>
                                        </div>
                                        <Button onClick={() => exportData('dx')} variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                        <Button size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add DX Unit
                                        </Button>
                                    </div>
                                </div>

                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Sr. No.</TableHead>
                                                    <TableHead>Company & Model</TableHead>
                                                    <TableHead>Refrigerant</TableHead>
                                                    <TableHead>Capacity (TR)</TableHead>
                                                    <TableHead>Power (kW)</TableHead>
                                                    <TableHead>Fans</TableHead>
                                                    <TableHead>Dimensions (mm)</TableHead>
                                                    <TableHead>Back Pad Area (ft²)</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {coolVaultEquipment.filter(eq => eq.type === 'dx_unit' &&
                                                    (eq.make || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (eq.model || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                ).length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={9} className="text-center py-8">
                                                            <div className="text-muted-foreground">
                                                                No DX units found. Import your DX data or add manually.
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    coolVaultEquipment.filter(eq => eq.type === 'dx_unit' &&
                                                        ((eq.make || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                            (eq.model || '').toLowerCase().includes(searchTerm.toLowerCase()))
                                                    ).map((equipment) => (
                                                        <TableRow key={equipment.id}>
                                                            <TableCell className="font-medium">
                                                                {equipment.sr_no}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                <div>
                                                                    <div className="font-semibold">{equipment.make}</div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {equipment.model}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary">
                                                                    {equipment.refrigerant_used}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {equipment.cooling_capacity_tr} TR
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {equipment.cooling_capacity_kw} kW
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {equipment.total_power_consumption_100_loading_kw} kW
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Fan: {equipment.total_fan_motor_power_kw} kW
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div>{equipment.no_of_condenser_fans} fans</div>
                                                                    <div>{equipment.cfm_per_fan} CFM each</div>
                                                                    <div>Ø{equipment.fan_diameter}</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div>{equipment.length_mm} × {equipment.width_mm} × {equipment.height_mm}</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div className="font-medium">{(equipment as DXEquipment).total_pad_area_back_side_ft2} ft²</div>
                                                                    <div className="text-muted-foreground">Back side only</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-1">
                                                                    <Button variant="ghost" size="sm">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Cool Vault Equipment Table */}
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sr. No.</TableHead>
                                            <TableHead>Make & Model</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Refrigerant</TableHead>
                                            <TableHead>Capacity (TR)</TableHead>
                                            <TableHead>Power (kW)</TableHead>
                                            <TableHead>Fans</TableHead>
                                            <TableHead>Dimensions (mm)</TableHead>
                                            <TableHead>Water Consumption</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {coolVaultEquipment.filter(equipment => {
                                            const matchesSearch = (equipment.make || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                (equipment.model || '').toLowerCase().includes(searchTerm.toLowerCase());
                                            const matchesType = typeFilter === "all" || equipment.type === typeFilter;
                                            return matchesSearch && matchesType;
                                        }).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={10} className="text-center py-8">
                                                    <div className="text-muted-foreground">
                                                        {coolVaultEquipment.length === 0 ? 'No equipment found' : 'No equipment matches your filters'}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            coolVaultEquipment.filter(equipment => {
                                                const matchesSearch = (equipment.make || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (equipment.model || '').toLowerCase().includes(searchTerm.toLowerCase());
                                                const matchesType = typeFilter === "all" || equipment.type === typeFilter;
                                                return matchesSearch && matchesType;
                                            }).map((equipment) => (
                                                <TableRow key={equipment.id}>
                                                    <TableCell className="font-medium">
                                                        {equipment.sr_no}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <div>
                                                            <div className="font-semibold">{equipment.make}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {equipment.model}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {equipment.type === 'chiller' && <Snowflake className="h-4 w-4 text-blue-500" />}
                                                            {equipment.type === 'vrf' && <Zap className="h-4 w-4 text-green-500" />}
                                                            {equipment.type === 'dx_unit' && <Calculator className="h-4 w-4 text-purple-500" />}
                                                            <Badge variant="outline">
                                                                {equipment.type === 'chiller' ? 'CHILLER' :
                                                                    equipment.type === 'vrf' ? 'VRF' : 'DX UNIT'}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">
                                                            {equipment.refrigerant_used}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">
                                                            {equipment.cooling_capacity_tr} TR
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {equipment.cooling_capacity_kw} kW
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">
                                                            {equipment.total_power_consumption_100_loading_kw} kW
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Fan: {equipment.total_fan_motor_power_kw} kW
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            <div>{equipment.no_of_condenser_fans} fans</div>
                                                            <div>{equipment.cfm_per_fan} CFM each</div>
                                                            <div>Ø{equipment.fan_diameter}mm</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            <div>{equipment.length_mm} × {equipment.width_mm} × {equipment.height_mm}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            <div className="font-medium">{equipment.water_consumption_liters_hr} L/hr</div>
                                                            <div className="text-muted-foreground">Tank: {equipment.water_tank_liters}L</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                                                                    <DialogHeader>
                                                                        <DialogTitle>{equipment.make} {equipment.model}</DialogTitle>
                                                                        <DialogDescription>
                                                                            {equipment.type.replace('_', ' ').toUpperCase()} - Sr. No. {equipment.sr_no}
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="grid grid-cols-2 gap-6">
                                                                        <div className="space-y-4">
                                                                            <div>
                                                                                <h4 className="font-semibold mb-2">Basic Information</h4>
                                                                                <div className="space-y-2 text-sm">
                                                                                    <div className="flex justify-between">
                                                                                        <span>Make:</span>
                                                                                        <span className="font-medium">{equipment.make}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Model:</span>
                                                                                        <span className="font-medium">{equipment.model}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Refrigerant Used:</span>
                                                                                        <span className="font-medium">{equipment.refrigerant_used}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Design DBT for TR capacity:</span>
                                                                                        <span className="font-medium">{equipment.design_dbt_for_tr_capacity_oc}°C</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-semibold mb-2">Capacity & Power</h4>
                                                                                <div className="space-y-2 text-sm">
                                                                                    <div className="flex justify-between">
                                                                                        <span>Cooling Capacity (TR):</span>
                                                                                        <span className="font-medium">{equipment.cooling_capacity_tr} TR</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Cooling Capacity (kW):</span>
                                                                                        <span className="font-medium">{equipment.cooling_capacity_kw} kW</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Total Power Consumption:</span>
                                                                                        <span className="font-medium">{equipment.total_power_consumption_100_loading_kw} kW</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Working Hours:</span>
                                                                                        <span className="font-medium">{equipment.working_hours_hrs} hrs</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-semibold mb-2">Fan Details</h4>
                                                                                <div className="space-y-2 text-sm">
                                                                                    <div className="flex justify-between">
                                                                                        <span>No. of Condenser Fans:</span>
                                                                                        <span className="font-medium">{equipment.no_of_condenser_fans}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>CFM per Fan:</span>
                                                                                        <span className="font-medium">{equipment.cfm_per_fan} CFM</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Fan Diameter:</span>
                                                                                        <span className="font-medium">{equipment.fan_diameter}mm</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Motor Power per Fan:</span>
                                                                                        <span className="font-medium">{equipment.motor_power_per_fan_kw} kW</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Total Fan Motor Power:</span>
                                                                                        <span className="font-medium">{equipment.total_fan_motor_power_kw} kW</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Fan RPM:</span>
                                                                                        <span className="font-medium">{equipment.fan_rpm} RPM</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Total Airflow:</span>
                                                                                        <span className="font-medium">{equipment.total_airflow_cfm} CFM</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-4">
                                                                            <div>
                                                                                <h4 className="font-semibold mb-2">Dimensions</h4>
                                                                                <div className="space-y-2 text-sm">
                                                                                    <div className="flex justify-between">
                                                                                        <span>Length:</span>
                                                                                        <span className="font-medium">{equipment.length_mm} mm</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Width:</span>
                                                                                        <span className="font-medium">{equipment.width_mm} mm</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Height:</span>
                                                                                        <span className="font-medium">{equipment.height_mm} mm</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {equipment.type === 'chiller' && (
                                                                                <div>
                                                                                    <h4 className="font-semibold mb-2">Pad Area Requirements (Chiller)</h4>
                                                                                    <div className="space-y-2 text-sm">
                                                                                        <div className="flex justify-between">
                                                                                            <span>Front (Panel Face):</span>
                                                                                            <span className="font-medium">{(equipment as ChillerEquipment).pad_area_required_front_ft2} ft²</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between">
                                                                                            <span>Left Side:</span>
                                                                                            <span className="font-medium">{(equipment as ChillerEquipment).pad_area_required_left_side_ft2} ft²</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between">
                                                                                            <span>Right Side:</span>
                                                                                            <span className="font-medium">{(equipment as ChillerEquipment).pad_area_required_right_side_ft2} ft²</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between">
                                                                                            <span>Back Side:</span>
                                                                                            <span className="font-medium">{(equipment as ChillerEquipment).pad_area_required_back_side_ft2} ft²</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between border-t pt-2">
                                                                                            <span className="font-semibold">Total Pad Area:</span>
                                                                                            <span className="font-bold">{(equipment as ChillerEquipment).total_pad_area_ft2} ft²</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {equipment.type === 'vrf' && (
                                                                                <div>
                                                                                    <h4 className="font-semibold mb-2">Pad Area Requirements (VRF)</h4>
                                                                                    <div className="space-y-2 text-sm">
                                                                                        <div className="flex justify-between">
                                                                                            <span>Front (Panel Face):</span>
                                                                                            <span className="font-medium">{(equipment as VRFEquipment).pad_area_required_front_ft2} ft²</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between">
                                                                                            <span>Left Side:</span>
                                                                                            <span className="font-medium">{(equipment as VRFEquipment).pad_area_required_left_side_ft2} ft²</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between">
                                                                                            <span>Right Side:</span>
                                                                                            <span className="font-medium">{(equipment as VRFEquipment).pad_area_required_right_side_ft2} ft²</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between">
                                                                                            <span>Back Side:</span>
                                                                                            <span className="font-medium">{(equipment as VRFEquipment).pad_area_required_back_side_ft2} ft²</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between border-t pt-2">
                                                                                            <span className="font-semibold">Total Pad Area:</span>
                                                                                            <span className="font-bold">{(equipment as VRFEquipment).total_pad_area_ft2} ft²</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {equipment.type === 'dx_unit' && (
                                                                                <div>
                                                                                    <h4 className="font-semibold mb-2">Pad Area Requirements (DX Unit)</h4>
                                                                                    <div className="space-y-2 text-sm">
                                                                                        <div className="flex justify-between">
                                                                                            <span>Total Pad Area (Back Side):</span>
                                                                                            <span className="font-medium">{(equipment as DXEquipment).total_pad_area_back_side_ft2} ft²</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            <div>
                                                                                <h4 className="font-semibold mb-2">Water System</h4>
                                                                                <div className="space-y-2 text-sm">
                                                                                    <div className="flex justify-between">
                                                                                        <span>Water Consumption:</span>
                                                                                        <span className="font-medium">{equipment.water_consumption_liters_hr} L/hr</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Pump Water Flow:</span>
                                                                                        <span className="font-medium">{equipment.pump_for_pads_water_flow_lt_min} L/min</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Pump Head:</span>
                                                                                        <span className="font-medium">{equipment.pump_head_m} m</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Pump Motor:</span>
                                                                                        <span className="font-medium">{equipment.pump_motor_kw} kW</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Pipe Size:</span>
                                                                                        <span className="font-medium">{equipment.pipe_size}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Pipe Length:</span>
                                                                                        <span className="font-medium">{equipment.pipe_length}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Other Plumbing:</span>
                                                                                        <span className="font-medium">{equipment.other_plumbing_material}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Water Tank:</span>
                                                                                        <span className="font-medium">{equipment.water_tank_liters} L</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}