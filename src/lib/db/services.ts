import { db } from './database';
import { projects, energyCalculations, proposals, activityLogs, equipmentLibrary } from './schema';
import { eq, desc, and, or, like } from 'drizzle-orm';

// Project operations
export const projectService = {
  async getAll() {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  },

  async getById(id: number) {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0] || null;
  },

  async create(projectData: Omit<typeof projects.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await db.insert(projects).values({
      ...projectData,
    }).returning();
    
    // Log activity
    await activityService.log('project_created', `New project created: ${projectData.name}`, result[0].id, 'project');
    
    return result[0];
  },

  async update(id: number, updates: Partial<typeof projects.$inferInsert>) {
    const result = await db.update(projects).set({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).where(eq(projects.id, id)).returning();
    
    // Log activity
    await activityService.log('project_updated', `Project updated: ${result[0].name}`, id, 'project');
    
    return result[0];
  },

  async delete(id: number) {
    const project = await this.getById(id);
    await db.delete(projects).where(eq(projects.id, id));
    
    // Log activity
    if (project) {
      await activityService.log('project_deleted', `Project deleted: ${project.name}`, id, 'project');
    }
  },

  async getStats() {
    const allProjects = await this.getAll();
    const totalProjects = allProjects.length;
    const activeProjects = allProjects.filter(p => p.status === 'in-progress').length;
    const completedProjects = allProjects.filter(p => p.status === 'completed').length;
    const totalSavings = allProjects.reduce((sum, p) => sum + (p.annualSavings || 0), 0);
    const totalEnergySaved = allProjects.reduce((sum, p) => sum + (p.energySaved || 0), 0);
    
    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalSavings,
      totalEnergySaved,
    };
  },
};

// Energy calculation operations
export const calculationService = {
  async create(calculationData: Omit<typeof energyCalculations.$inferInsert, 'id' | 'createdAt'>) {
    const result = await db.insert(energyCalculations).values(calculationData).returning();
    
    // Log activity
    await activityService.log('calculation_created', `Energy calculation completed for ${calculationData.equipmentType}`, result[0].id, 'calculation');
    
    return result[0];
  },

  async getByProjectId(projectId: number) {
    return await db.select().from(energyCalculations).where(eq(energyCalculations.projectId, projectId));
  },

  async getAll() {
    return await db.select().from(energyCalculations).orderBy(desc(energyCalculations.createdAt));
  },
};

// Proposal operations
export const proposalService = {
  async create(proposalData: Omit<typeof proposals.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await db.insert(proposals).values(proposalData).returning();
    
    // Log activity
    await activityService.log('proposal_created', `New proposal generated: ${proposalData.projectName}`, result[0].id, 'proposal');
    
    return result[0];
  },

  async getAll() {
    return await db.select().from(proposals).orderBy(desc(proposals.createdAt));
  },

  async getById(id: number) {
    const result = await db.select().from(proposals).where(eq(proposals.id, id));
    return result[0] || null;
  },

  async update(id: number, updates: Partial<typeof proposals.$inferInsert>) {
    const result = await db.update(proposals).set({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).where(eq(proposals.id, id)).returning();
    
    return result[0];
  },
};

// Activity log operations
export const activityService = {
  async log(action: string, details: string, relatedId?: number, relatedType?: string) {
    return await db.insert(activityLogs).values({
      action,
      details,
      relatedId,
      relatedType,
    }).returning();
  },

  async getRecent(limit: number = 10) {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
  },
};

// Equipment library operations
export const equipmentService = {
  async getByCategory(category: string) {
    return await db.select().from(equipmentLibrary).where(eq(equipmentLibrary.category, category));
  },

  async create(equipmentData: Omit<typeof equipmentLibrary.$inferInsert, 'id' | 'createdAt'>) {
    return await db.insert(equipmentLibrary).values(equipmentData).returning();
  },

  async getAll() {
    return await db.select().from(equipmentLibrary).orderBy(equipmentLibrary.category, equipmentLibrary.type);
  },
};

// Initialize database with sample data
export const initializeDatabase = async () => {
  try {
    // Check if we already have data
    const existingProjects = await projectService.getAll();
    if (existingProjects.length > 0) {
      console.log('Database already initialized');
      return;
    }

    // Create sample projects
    const sampleProjects = [
      {
        name: 'ABC Manufacturing LED Retrofit',
        client: 'ABC Manufacturing Inc.',
        type: 'led-retrofit' as const,
        status: 'completed' as const,
        annualSavings: 12000,
        investmentCost: 45000,
        energySaved: 85.5,
        co2Reduction: 42.3,
        description: 'Complete LED retrofit of manufacturing facility',
        startDate: '2024-01-15',
        completionDate: '2024-03-20',
      },
      {
        name: 'XYZ Office HVAC Upgrade',
        client: 'XYZ Corporation',
        type: 'hvac-upgrade' as const,
        status: 'in-progress' as const,
        annualSavings: 8000,
        investmentCost: 35000,
        energySaved: 62.8,
        co2Reduction: 31.4,
        description: 'HVAC system upgrade with smart controls',
        startDate: '2024-05-01',
      },
      {
        name: 'DEF Warehouse Solar Installation',
        client: 'DEF Logistics',
        type: 'solar' as const,
        status: 'planning' as const,
        annualSavings: 15000,
        investmentCost: 85000,
        energySaved: 120.0,
        co2Reduction: 60.0,
        description: 'Rooftop solar installation with battery storage',
      },
    ];

    for (const project of sampleProjects) {
      await projectService.create(project);
    }

    // Create sample equipment library
    const sampleEquipment = [
      {
        category: 'lighting',
        type: 'LED Panel',
        model: 'LP-40W-4000K',
        manufacturer: 'EcoLED',
        power: 40,
        efficiency: 120,
        lifespan: 50000,
        cost: 85.50,
        specifications: JSON.stringify({
          lumens: 4800,
          colorTemp: 4000,
          cri: 85,
          dimmable: true,
        }),
      },
      {
        category: 'hvac',
        type: 'Heat Pump',
        model: 'HP-3T-INV',
        manufacturer: 'EfficientAir',
        power: 2500,
        efficiency: 4.2,
        lifespan: 15,
        cost: 3200,
        specifications: JSON.stringify({
          capacity: '3 tons',
          seer: 18,
          inverter: true,
          refrigerant: 'R410A',
        }),
      },
    ];

    for (const equipment of sampleEquipment) {
      await equipmentService.create(equipment);
    }

    console.log('Database initialized with sample data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
