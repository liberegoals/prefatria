USE `prefatria`
;

DELETE FROM `prefatria`.`sinedria`
;

DELETE FROM `prefatria`.`trapezi`
;

DELETE FROM `prefatria`.`pektis`
;

LOAD DATA LOCAL INFILE 'pektis.data'
INTO TABLE `prefatria`.`pektis` (
	`login`,
	`egrafi`,
	`onoma`,
	`email`,
	`kodikos`
);

DELETE FROM `prefatria`.`profinfo`
;

LOAD DATA LOCAL INFILE 'profinfo.data'
REPLACE INTO TABLE `prefatria`.`profinfo` (
	`pektis`,
	`sxoliastis`,
	`kimeno`
);

DELETE FROM `prefatria`.`sxesi`
;

LOAD DATA LOCAL INFILE 'sxesi.data'
REPLACE INTO TABLE `prefatria`.`sxesi` (
	`pektis`,
	`sxetizomenos`,
	`sxesi`
);
