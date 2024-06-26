CREATE TABLE `all_groceries` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`categories` text
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `grocery_list` (
	`id` integer PRIMARY KEY NOT NULL,
	`item_id` integer,
	`checked` integer DEFAULT false,
	`item_count` integer,
	`note` text,
	FOREIGN KEY (`item_id`) REFERENCES `all_groceries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `presets` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`categories` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `all_groceries_name_unique` ON `all_groceries` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `presets_name_unique` ON `presets` (`name`);