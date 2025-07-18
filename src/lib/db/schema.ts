import { sql } from 'drizzle-orm';
import { integer, real, text, sqliteTable } from 'drizzle-orm/sqlite-core';

// Projects table
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  client: text('client').notNull(),
  type: text('type').notNull(), // 'led-retrofit', 'hvac-upgrade', 'solar', etc.
  status: text('status').notNull().default('planning'), // 'planning', 'in-progress', 'completed'
  annualSavings: real('annual_savings').notNull().default(0),
  investmentCost: real('investment_cost').notNull().default(0),
  energySaved: real('energy_saved').notNull().default(0), // in MWh
  co2Reduction: real('co2_reduction').notNull().default(0), // in tons
  startDate: text('start_date'),
  completionDate: text('completion_date'),
  description: text('description'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Energy calculations table
export const energyCalculations = sqliteTable('energy_calculations', {
  id: integer('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  equipmentType: text('equipment_type').notNull(),
  currentConsumption: real('current_consumption').notNull(),
  proposedConsumption: real('proposed_consumption').notNull(),
  operatingHours: real('operating_hours').notNull(),
  energyCost: real('energy_cost').notNull(),
  annualSavings: real('annual_savings').notNull(),
  co2Reduction: real('co2_reduction').notNull(),
  calculationData: text('calculation_data'), // JSON string with full calculation details
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Proposals table
export const proposals = sqliteTable('proposals', {
  id: integer('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  clientName: text('client_name').notNull(),
  projectName: text('project_name').notNull(),
  projectType: text('project_type').notNull(),
  currentConsumption: text('current_consumption'),
  proposedSavings: text('proposed_savings'),
  investmentCost: text('investment_cost'),
  paybackPeriod: text('payback_period'),
  description: text('description'),
  status: text('status').notNull().default('draft'), // 'draft', 'generated', 'sent'
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Load analysis data table
export const loadAnalysis = sqliteTable('load_analysis', {
  id: integer('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  facilityName: text('facility_name').notNull(),
  loadData: text('load_data').notNull(), // JSON string with hourly/daily load data
  peakDemand: real('peak_demand').notNull(),
  averageLoad: real('average_load').notNull(),
  loadFactor: real('load_factor').notNull(),
  analysisDate: text('analysis_date').notNull(),
  recommendations: text('recommendations'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Activity logs table
export const activityLogs = sqliteTable('activity_logs', {
  id: integer('id').primaryKey(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  relatedId: integer('related_id'), // ID of related project/calculation/proposal
  relatedType: text('related_type'), // 'project', 'calculation', 'proposal'
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Equipment library table
export const equipmentLibrary = sqliteTable('equipment_library', {
  id: integer('id').primaryKey(),
  category: text('category').notNull(), // 'lighting', 'hvac', 'motor', etc.
  type: text('type').notNull(),
  model: text('model').notNull(),
  manufacturer: text('manufacturer'),
  power: real('power').notNull(), // in watts
  efficiency: real('efficiency'),
  lifespan: integer('lifespan'), // in hours
  cost: real('cost'),
  specifications: text('specifications'), // JSON string
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Export all tables
export const schema = {
  projects,
  energyCalculations,
  proposals,
  loadAnalysis,
  activityLogs,
  equipmentLibrary,
};
