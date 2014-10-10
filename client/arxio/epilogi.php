<?php
require_once("../lib/standard.php");
Globals::session_init();
Globals::database();

Epilogi::queryInit();
Epilogi::queryPektis();
Epilogi::queryApo();
Epilogi::queryEos();
Epilogi::queryPartida();
Epilogi::queryClose();

$result = Epilogi::queryRun();
if (!$result)
Globals::fatal("Λανθασμένα κριτήρια");

Globals::header_data();
while ($row = $result->fetch_assoc()) {
	print json_encode($row) . ",";
	//Globals::asfales_sql($_REQUEST["login"]) . " AND `klidi` = BINARY " .
}
$result->free();

Globals::klise_fige(0);

class Epilogi {
	public static $query;

	public static function queryInit() {
		self::$query = "SELECT `kodikos`, UNIX_TIMESTAMP(`stisimo`) AS `stisimo`, " .
			"`pektis1`, `pektis2`, `pektis3`, UNIX_TIMESTAMP(`arxio`) AS `arxio` " .
			"FROM `trapezi` WHERE 1 = 1";
	}

	public static function queryPektis() {
		if (Globals::den_perastike("pektis"))
		return;
	}

	public static function queryApo() {
		if (Globals::den_perastike("apo"))
		return;
	}

	public static function queryEos() {
		if (Globals::den_perastike("eos"))
		return;
	}

	public static function queryPartida() {
		if (Globals::den_perastike("partida"))
		return;
	}

	public static function queryClose() {
		self::$query .= " ORDER BY `kodikos` LIMIT 20";
		return;
	}

	public static function queryRun() {
		return Globals::query(self::$query);
	}
}
?>
