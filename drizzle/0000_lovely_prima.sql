CREATE TABLE `visibility_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text,
	`website` text NOT NULL,
	`brand` text NOT NULL,
	`industry` text NOT NULL,
	`email` text NOT NULL,
	`needs` text NOT NULL,
	`marketing_consent` integer DEFAULT 0 NOT NULL,
	`ref` text NOT NULL,
	`source` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`delete_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `visibility_reports`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `visibility_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`n` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `visibility_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`cache_key` text NOT NULL,
	`website` text NOT NULL,
	`brand` text NOT NULL,
	`industry` text NOT NULL,
	`score` integer NOT NULL,
	`result` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `visibility_reports_cache` ON `visibility_reports` (`cache_key`,`created_at`);--> statement-breakpoint
CREATE TABLE `visibility_scans` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text,
	`website` text NOT NULL,
	`brand` text NOT NULL,
	`industry` text NOT NULL,
	`ref` text NOT NULL,
	`source` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `visibility_reports`(`id`) ON UPDATE no action ON DELETE set null
);
