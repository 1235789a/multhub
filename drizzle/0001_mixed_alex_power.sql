CREATE TABLE `visibility_events` (
	`key` text PRIMARY KEY NOT NULL,
	`report_id` text,
	`scan_id` text,
	`event` text NOT NULL,
	`ref` text NOT NULL,
	`source` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `visibility_reports`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`scan_id`) REFERENCES `visibility_scans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `visibility_events_attribution` ON `visibility_events` (`ref`,`source`,`created_at`);--> statement-breakpoint
ALTER TABLE `visibility_leads` ADD `offer_id` text DEFAULT 'custom' NOT NULL;