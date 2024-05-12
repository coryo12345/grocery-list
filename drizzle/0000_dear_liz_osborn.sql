CREATE TABLE `all_groceries` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
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
	FOREIGN KEY (`item_id`) REFERENCES `all_groceries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `presets` (
	`preset_id` integer,
	`category_id` integer,
	`order` integer,
	PRIMARY KEY(`category_id`, `preset_id`),
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);