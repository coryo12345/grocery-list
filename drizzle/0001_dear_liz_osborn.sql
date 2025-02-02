CREATE TABLE `household` (
	`id` integer PRIMARY KEY NOT NULL,
	`household_name` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE all_groceries ADD `household_id` integer not null default 0;--> statement-breakpoint
ALTER TABLE categories ADD `household_id` integer not null default 0;--> statement-breakpoint
ALTER TABLE grocery_list ADD `household_id` integer not null default 0;--> statement-breakpoint
ALTER TABLE presets ADD `household_id` integer not null default 0;