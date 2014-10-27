USE `prefatria`
;

SELECT
	`login`,
	`egrafi`,
	`onoma`,
	`email`,
	`kodikos`
FROM `prefatria`.`pektis`
INTO OUTFILE '__DIR__/pektis.data'
;

SELECT
	`pektis`,
	`param`,
	`timi`
FROM `prefatria`.`peparam`
INTO OUTFILE '__DIR__/peparam.data'
;

SELECT
	`pektis`,
	`sxoliastis`,
	`kimeno`
FROM `prefatria`.`profinfo`
INTO OUTFILE '__DIR__/profinfo.data'
;

SELECT
	`pektis`,
	`sxetizomenos`,
	`sxesi`
FROM `prefatria`.`sxesi`
INTO OUTFILE '__DIR__/sxesi.data'
;

SELECT
	`pektis`,
	`imerominia`,
	`poso`
FROM `prefatria`.`isfora`
INTO OUTFILE '__DIR__/isfora.data'
;
