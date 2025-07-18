// Database abstraction layer for hybrid deployment
import { createClient } from '@libsql/client';

export interface Project {
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

export interface Calculation {
  id: string;
  project_id?: string;
  tool_type: 'energy_calculator' | 'load_analysis' | 'roi_calculator' | 'hvac_optimizer';
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  created_at: string;
  created_by: string;
}

export interface Proposal {
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

class DatabaseService {
  private client: any;
  private isLocal: boolean;

  constructor() {
    this.isLocal = process.env.NODE_ENV === 'development' || process.env.DB_TYPE === 'local';
    
    if (this.isLocal) {
      // Local SQLite database
      this.client = createClient({
        url: 'file:./data/seetech.db',
      });
    } else {
      // Cloud Turso database
      this.client = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      });
    }
  }

  async initialize() {
    // Create tables if they don't exist
    await this.createTables();
    
    // Seed with sample data in development
    if (this.isLocal) {
      await this.seedSampleData();
    }
  }

  private async createTables() {
    // Projects table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        client TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'planning',
        estimated_savings REAL NOT NULL,
        actual_savings REAL,
        investment_cost REAL NOT NULL,
        payback_period REAL NOT NULL,
        start_date TEXT NOT NULL,
        completion_date TEXT,
        description TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Calculations table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS calculations (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        tool_type TEXT NOT NULL,
        input_data TEXT NOT NULL,
        output_data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )
    `);

    // Proposals table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS proposals (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        client_name TEXT NOT NULL,
        project_name TEXT NOT NULL,
        project_type TEXT NOT NULL,
        current_consumption REAL NOT NULL,
        proposed_savings REAL NOT NULL,
        investment_cost REAL NOT NULL,
        payback_period REAL NOT NULL,
        description TEXT,
        template_used TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )
    `);
  }

  private async seedSampleData() {
    // Check if data already exists
    const existingProjects = await this.client.execute('SELECT COUNT(*) as count FROM projects');
    if (existingProjects.rows[0].count > 0) return;

    // Sample projects
    const sampleProjects = [
      {
        id: 'proj_001',
        name: 'ABC Manufacturing LED Retrofit',
        client: 'ABC Manufacturing Inc.',
        type: 'led_retrofit',
        status: 'completed',
        estimated_savings: 12000,
        actual_savings: 14500,
        investment_cost: 45000,
        payback_period: 3.1,
        start_date: '2024-01-15',
        completion_date: '2024-03-20',
        description: 'Complete LED retrofit of manufacturing facility'
      },
      {
        id: 'proj_002',
        name: 'XYZ Office HVAC Upgrade',
        client: 'XYZ Corporation',
        type: 'hvac_upgrade',
        status: 'in_progress',
        estimated_savings: 8000,
        investment_cost: 35000,
        payback_period: 4.4,
        start_date: '2024-06-01',
        description: 'HVAC system upgrade with smart controls'
      },
      {
        id: 'proj_003',
        name: 'DEF Warehouse Solar Installation',
        client: 'DEF Logistics',
        type: 'solar_installation',
        status: 'planning',
        estimated_savings: 25000,
        investment_cost: 120000,
        payback_period: 4.8,
        start_date: '2024-09-01',
        description: 'Rooftop solar installation with battery storage'
      }
    ];

    for (const project of sampleProjects) {
      await this.client.execute({
        sql: `INSERT INTO projects (id, name, client, type, status, estimated_savings, actual_savings, investment_cost, payback_period, start_date, completion_date, description) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          project.id,
          project.name,
          project.client,
          project.type,
          project.status,
          project.estimated_savings,
          project.actual_savings || null,
          project.investment_cost,
          project.payback_period,
          project.start_date,
          project.completion_date || null,
          project.description
        ]
      });
    }
  }

  // Projects CRUD operations
  async getProjects(): Promise<Project[]> {
    const result = await this.client.execute('SELECT * FROM projects ORDER BY created_at DESC');
    return result.rows.map(row => ({
      ...row,
      input_data: row.input_data ? JSON.parse(row.input_data) : {},
      output_data: row.output_data ? JSON.parse(row.output_data) : {}
    }));
  }

  async getProject(id: string): Promise<Project | null> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM projects WHERE id = ?',
      args: [id]
    });
    return result.rows[0] || null;
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const id = `proj_${Date.now()}`;
    const now = new Date().toISOString();
    
    await this.client.execute({
      sql: `INSERT INTO projects (id, name, client, type, status, estimated_savings, actual_savings, investment_cost, payback_period, start_date, completion_date, description, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        project.name,
        project.client,
        project.type,
        project.status,
        project.estimated_savings,
        project.actual_savings || null,
        project.investment_cost,
        project.payback_period,
        project.start_date,
        project.completion_date || null,
        project.description || null,
        now,
        now
      ]
    });

    return { ...project, id, created_at: now, updated_at: now } as Project;
  }

  // Calculations CRUD operations
  async saveCalculation(calculation: Omit<Calculation, 'id' | 'created_at'>): Promise<Calculation> {
    const id = `calc_${Date.now()}`;
    const now = new Date().toISOString();
    
    await this.client.execute({
      sql: `INSERT INTO calculations (id, project_id, tool_type, input_data, output_data, created_at, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        calculation.project_id || null,
        calculation.tool_type,
        JSON.stringify(calculation.input_data),
        JSON.stringify(calculation.output_data),
        now,
        calculation.created_by
      ]
    });

    return { ...calculation, id, created_at: now };
  }

  async getCalculations(projectId?: string): Promise<Calculation[]> {
    const query = projectId 
      ? 'SELECT * FROM calculations WHERE project_id = ? ORDER BY created_at DESC'
      : 'SELECT * FROM calculations ORDER BY created_at DESC';
    
    const result = await this.client.execute({
      sql: query,
      args: projectId ? [projectId] : []
    });
    
    return result.rows.map(row => ({
      ...row,
      input_data: JSON.parse(row.input_data),
      output_data: JSON.parse(row.output_data)
    }));
  }

  // Proposals CRUD operations
  async saveProposal(proposal: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>): Promise<Proposal> {
    const id = `prop_${Date.now()}`;
    const now = new Date().toISOString();
    
    await this.client.execute({
      sql: `INSERT INTO proposals (id, project_id, client_name, project_name, project_type, current_consumption, proposed_savings, investment_cost, payback_period, description, template_used, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        proposal.project_id,
        proposal.client_name,
        proposal.project_name,
        proposal.project_type,
        proposal.current_consumption,
        proposal.proposed_savings,
        proposal.investment_cost,
        proposal.payback_period,
        proposal.description || null,
        proposal.template_used,
        proposal.status,
        now,
        now
      ]
    });

    return { ...proposal, id, created_at: now, updated_at: now };
  }

  async getProposals(): Promise<Proposal[]> {
    const result = await this.client.execute('SELECT * FROM proposals ORDER BY created_at DESC');
    return result.rows as Proposal[];
  }

  // Analytics methods
  async getAnalytics() {
    const [projects, calculations, proposals] = await Promise.all([
      this.client.execute('SELECT COUNT(*) as count, status FROM projects GROUP BY status'),
      this.client.execute('SELECT COUNT(*) as count, tool_type FROM calculations GROUP BY tool_type'),
      this.client.execute('SELECT COUNT(*) as count, status FROM proposals GROUP BY status')
    ]);

    const totalSavings = await this.client.execute('SELECT SUM(estimated_savings) as total FROM projects');
    const completedProjects = await this.client.execute('SELECT COUNT(*) as count FROM projects WHERE status = "completed"');

    return {
      projectsByStatus: projects.rows,
      calculationsByTool: calculations.rows,
      proposalsByStatus: proposals.rows,
      totalEstimatedSavings: totalSavings.rows[0]?.total || 0,
      completedProjectsCount: completedProjects.rows[0]?.count || 0
    };
  }
}

// Singleton instance
export const db = new DatabaseService();

// Initialize database on app start
export async function initializeDatabase() {
  await db.initialize();
}
