<?php
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

	public static function isEgo($pektis) {
		return($pektis == self::$pektis);
	}

	public static function oxiEgo($pektis) {
		return !self::isEgo($pektis);
	}

	public static function epikefalida() {
		?>
		<table id="minimata" style="width: 100%;">
		<?php
	}

	public static function minimata() {
		$query = "SELECT `kodikos`, UNIX_TIMESTAMP(`pote`), `apostoleas`, `paraliptis`, `kimeno`, `status` " .
			"FROM `minima` WHERE " .
			"(`apostoleas` = " . Globals::asfales_sql(self::$pektis) . ") OR " .
			"(`paraliptis` = " . Globals::asfales_sql(self::$pektis) . ") " .
			"ORDER BY `kodikos` DESC";
		$result = Globals::query($query);
		while ($row = $result->fetch_array(MYSQL_NUM)) {
			$apostoleas = $row[2];
			$paraliptis = $row[3];

			if (self::oxiEgo($apostoleas)) {
				$idos = "iserxomeno";
				$idosDesc = "Εισερχόμενο";
				$klasi = "minimaIserxomeno";
				$pios = $apostoleas;
			}
			else if (self::oxiEgo($paraliptis)) {
				$idos = "exerxomeno";
				$idosDesc = "Εξερχόμενο";
				$klasi = "minimaExerxomeno";
				$pios = $paraliptis;
			}
			else {
				$idos = "ikothen";
				$idosDesc = "Οίκοθεν";
				$klasi = "minimaIkothen";
				$pios = $apostoleas;
			}

			if ($row[5] === 'ΔΙΑΒΑΣΜΕΝΟ')
			$klasi .= " minimaDiavasmeno";

			?>
			<tr class="minima <?php print $klasi; ?>">
			<td class="minimaKodikos"><?php print $row[0]; ?></td>
			<td class="minimaImerominia">
				<?php print date("d/m/Y<b\\r />H:i", $row[1] - self::$time_dif); ?>
			</td>
			<td class="minimaPios">
				<div class="minimaPiosOnoma"><?php print $pios; ?></div>
				<img class="minimaIdosIcon" src="../ikona/minima/<?php print $idos;
					?>.png" title="<?php print $idosDesc; ?>" />
			</td>
			<td class="minimaKimeno"><?php print str_replace(array("\r\n", "\n", "\r"),
				"<br />", $row[4]); ?></td>
			<td class="minimaPanel"></td>
			</tr>
			<?php
		}
		$result->free();
	}

	public static function klisimo() {
		?>
		</table>
		<div id="minimaEditForma">
			<div id="minimaEditFormaPros">
				<span class="formaPrompt">Προς</span>
				<input class="formaPedio" style="width: 200px;" />
			</div>
			<textarea id="minimaEditFormaKimeno"></textarea>
			<div id="minimaEditFormaPanel">
				<button class="formaButton" type="submit">Αποστολή</button>
				<button class="formaButton" type="button">Άκυρο</button>
			</div>
		</div>
		<?php
	}
}
?>
