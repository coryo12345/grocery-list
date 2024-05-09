CREATE TABLE `grocery_list` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`checked` integer DEFAULT false,
	`order` integer
);
