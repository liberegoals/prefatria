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
	Epilogi::checkPektis($row);
	Epilogi::trparam($row);
	Epilogi::dianomi($row);
	print json_encode($row, JSON_UNESCAPED_UNICODE) . ",";
	//Globals::asfales_sql($_REQUEST["login"]) . " AND `klidi` = BINARY " .
}
$result->free();

Globals::klise_fige(0);

class Epilogi {
	public static $query;

	public static function queryInit() {
		self::$query = "SELECT `kodikos` AS `k`, UNIX_TIMESTAMP(`stisimo`) AS `s`, " .
			"`pektis1` AS `p1`, `pektis2` AS `p2`, `pektis3` AS `p3`, " .
			"UNIX_TIMESTAMP(`arxio`) AS `a` FROM `trapezi` WHERE 1 = 1";
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

	public static function checkPektis(&$trapezi) {
		for ($thesi = 1; $thesi <= 3; $thesi++) {
			if (!$trapezi["p" . $thesi])
			break;
		}

		if ($thesi > 3)
		return;

		$query = "SELECT `thesi`, `pektis` FROM `telefteos` WHERE `trapezi` = " . $trapezi["k"];
		$result = Globals::query($query);
		while ($telefteos = $result->fetch_assoc()) {
			if (!$telefteos["thesi"])
			continue;

			if (!$telefteos["pektis"])
			continue;

			$idx = "p" . $telefteos["thesi"];
			if (!array_key_exists($idx, $trapezi))
			continue;

			if ($trapezi[$idx])
			continue;

			$trapezi[$idx] = $telefteos["pektis"];
		}
		$result->free();
	}

	public static function trparam(&$trapezi) {
		$query = "SELECT `param`, `timi` FROM `trparam` WHERE `trapezi` = " . $trapezi["k"];
		$result = Globals::query($query);
		$trapezi["t"] = [];
		while ($trparam = $result->fetch_assoc()) {
			$trapezi["t"][$trparam["param"]] = $trparam["timi"];
		}
		$result->free();
	}

	public static function dianomi(&$trapezi) {
		$query = "SELECT `kodikos` AS `k`, UNIX_TIMESTAMP(`enarxi`) AS `e`, `dealer` AS `d`, " .
			"`kasa1` AS `k1`, `metrita1` AS `m1`, `kasa2` AS `k2`, `metrita2` AS `m2`, " .
			"`kasa3` AS `k3`, `metrita3` AS `m3` FROM `dianomi` WHERE `trapezi` = " . $trapezi["k"];
		$result = Globals::query($query);
		$trapezi["d"] = [];
		while ($dianomi = $result->fetch_assoc()) {
			$trapezi["d"][] = $dianomi;
		}
		$result->free();
	}
}
?>
