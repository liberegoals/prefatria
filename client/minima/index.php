<?php
print "SKDJHSJKDHKSD";
exit(0);
require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");

Selida::head("Αλληλογραφία");
Globals::pektis_must();
Minima::pektisSet();
Globals::database();

Selida::stylesheet("minima/minima");
Selida::javascript("minima/minima");
Minima::setupView();

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
Minima::epikefalida();
Minima::minimata();
Minima::klisimo();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

Class Minima {
	private static $time_dif;
	private static $pektis;

	public static function setupView() {
		self::$time_dif = $_REQUEST["timeDif"];
		if (is_nan(self::$time_dif)) self::$time_dif = 0;
		else self::$time_dif *= 3600;
	}

	public static function pektisSet() {
		self::$pektis = $_SESSION["pektis"];
	}

	public static function epikefalida() {
		?>
		<table id="minimata" style="width: 100%;">
		<?php
	}

	public static function klisimo() {
		?>
		</table>
		<?php
	}

	public static function minimata() {
		$query = "SELECT `kodikos`, UNIX_TIMESTAMP(`pote`), `apostoleas`, `paraliptis`, `kimeno` " .
			"FROM `minima` WHERE " .
			"(`apostoleas` = " . Globals::asfales_sql(self::$pektis) . ") OR " .
			"(`paraliptis` = " . Globals::asfales_sql(self::$pektis) . ") " .
			"ORDER BY `kodikos` DESC";
		$result = Globals::query($query);
		while ($row = $result->fetch_array(MYSQL_NUM)) {
			?>
			<tr>
			<td class="minimaKodikos"><?php print $row[0]; ?></td>
			<td class="minimaImerominia"><?php print date("d/m/Y<b\\r />H:i",
				$row[1] - self::$time_dif); ?></td>
			<td class="minimaPios"><?php print $row[2]; ?></td>
			<td class="minimaMinima"><?php print str_replace(array("\r\n", "\n", "\r"),
				"<br />", $row[4]); ?></td>
			<td class="minimaPanel"></td>
			</tr>
			<?php
		}
		$result->free();
	}
}
?>
