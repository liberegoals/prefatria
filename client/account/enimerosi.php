<?php
register_shutdown_function('Enimerosi::klisimo');
require_once "../lib/standard.php";
require_once "../lib/pektis.php";
Enimerosi::init();
Enimerosi::check_data();

Globals::database();
Enimerosi::check_idio();

$query = "UPDATE `pektis` SET " .
	"`onoma` = " . Globals::asfales_sql($_POST["onoma"]) . ", " .
	"`email` = " . Globals::asfales_sql($_POST["email"]);
if (Globals::perastike("kodikos1") && $_POST["kodikos1"] != "")
	$query .= ", `kodikos` = " . Globals::asfales_sql(sha1($_POST["kodikos1"]));
$query .= " WHERE (`login` LIKE " . Globals::asfales_sql($_SESSION["pektis"]) .
	") AND (`kodikos` LIKE BINARY " . Globals::asfales_sql(sha1($_POST["kodikos"])) . ")";
@Globals::$db->query($query);
if (Globals::affected_rows() != 1) Globals::klise_fige("Απέτυχε η ενημέρωση λογαριασμού");

class Enimerosi {
	public static function init() {
		Globals::header_html();
		Globals::session_init();
		if (Globals::oxi_pektis())
		Globals::klise_fige("Απροσδιόριστος λογαριασμός");
	}

	public static function check_data() {
		Globals::perastike_must("onoma");
		Globals::perastike_must("email");
	}

	public static function check_idio() {
		$pektis = @new Pektis($_SESSION["pektis"], $_POST["kodikos"]);
		if (!isset($pektis->login)) Globals::klise_fige("Access denied");

		if ($pektis->onoma !== $_POST["onoma"]) return;
		if ($pektis->email !== $_POST["email"]) return;
		if (Globals::perastike("kodikos1") && ($_POST["kodikos1"] !== "") &&
			($pektis->kodikos !== $_POST["kodikos1"])) return;
		Globals::klise_fige("Δεν έγιναν αλλαγές");
	}

	public static function klisimo() {
		?>@EOD@<script type="text/javascript">parent.Account.checkAction();</script><?php
	}
}
?>
