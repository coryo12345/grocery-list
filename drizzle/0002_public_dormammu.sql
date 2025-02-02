DROP INDEX IF EXISTS `all_groceries_name_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `categories_name_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `presets_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `all_groceries_household_id_name_unique` ON `all_groceries` (`household_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_household_id_name_unique` ON `categories` (`household_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `presets_household_id_name_unique` ON `presets` (`household_id`,`name`);--> statement-breakpoint

UPDATE presets SET household_id = 1;--> statement-breakpoint
UPDATE categories SET household_id = 1;--> statement-breakpoint
UPDATE all_groceries SET household_id = 1;--> statement-breakpoint
UPDATE grocery_list SET household_id = 1;