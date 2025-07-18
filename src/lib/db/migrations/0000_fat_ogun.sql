CREATE TABLE `activity_logs` (
	`id` integer PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`details` text NOT NULL,
	`related_id` integer,
	`related_type` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `energy_calculations` (
	`id` integer PRIMARY KEY NOT NULL,
	`project_id` integer,
	`equipment_type` text NOT NULL,
	`current_consumption` real NOT NULL,
	`proposed_consumption` real NOT NULL,
	`operating_hours` real NOT NULL,
	`energy_cost` real NOT NULL,
	`annual_savings` real NOT NULL,
	`co2_reduction` real NOT NULL,
	`calculation_data` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `equipment_library` (
	`id` integer PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`type` text NOT NULL,
	`model` text NOT NULL,
	`manufacturer` text,
	`power` real NOT NULL,
	`efficiency` real,
	`lifespan` integer,
	`cost` real,
	`specifications` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `load_analysis` (
	`id` integer PRIMARY KEY NOT NULL,
	`project_id` integer,
	`facility_name` text NOT NULL,
	`load_data` text NOT NULL,
	`peak_demand` real NOT NULL,
	`average_load` real NOT NULL,
	`load_factor` real NOT NULL,
	`analysis_date` text NOT NULL,
	`recommendations` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`client` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'planning' NOT NULL,
	`annual_savings` real DEFAULT 0 NOT NULL,
	`investment_cost` real DEFAULT 0 NOT NULL,
	`energy_saved` real DEFAULT 0 NOT NULL,
	`co2_reduction` real DEFAULT 0 NOT NULL,
	`start_date` text,
	`completion_date` text,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` integer PRIMARY KEY NOT NULL,
	`project_id` integer,
	`client_name` text NOT NULL,
	`project_name` text NOT NULL,
	`project_type` text NOT NULL,
	`current_consumption` text,
	`proposed_savings` text,
	`investment_cost` text,
	`payback_period` text,
	`description` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
