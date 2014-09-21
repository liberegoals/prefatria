<?php
require_once("../lib/standard.php");
Globals::header_data();
Globals::session_init();
Globals::pektis_must();
Globals::database();

$query = "SELECT COUNT(*) FROM `minima` WHERE `paraliptis` = " .
	Globals::asfales_sql($_SESSION["pektis"]) . " AND `status` = 'ΑΔΙΑΒΑΣΤΟ'";
$row = Globals::first_row($query, MYSQLI_NUM);
if ($row && ($row[0] > 0)) print $row[0];
?>
