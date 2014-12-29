<?php
require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");
Globals::database("lib/selida.php");

Selida::head("Αναψηλάφηση");

Selida::stylesheet("arena/arena");
Selida::stylesheet("movie/movie");
Selida::javascript("common/prefadoros");
Selida::javascript("common/skiniko");
Selida::javascript("common/partida");
Selida::javascript("common/energia");
Selida::javascript("movie/movie");
Movie::init();

Selida::body();
Selida::toolbar("Αναψηλάφηση παρτίδας");
Selida::fyi_pano();

Selida::ofelimo_begin();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

class Movie {
	public static $trapezi = NULL;
	public static $dianomi = NULL;

	public static function init() {
		if (Globals::perastike("trapezi"))
		self::$trapezi = $_REQUEST["trapezi"];

		elseif (Globals::perastike("partida"))
		self::$trapezi = $_REQUEST["partida"];

		if (Globals::perastike("dianomi"))
		self::$dianomi = $_REQUEST["dianomi"];

		self::trapezi_check();
	}

	private static function trapezi_check() {
		if (self::$dianomi)
		self::trapezi_set_dianomi();

		elseif (self::oxi_trapezi())
		self::trapezi_set_trexon();

		?>
		<script type="text/javascript">
		//<![CDATA[
		Movie.trapezi = {};
		Movie.trapezi.kodikos = <?php print self::$trapezi; ?>;
		//]]>
		</script>
		<?php
	}

	private static function trapezi_set_dianomi() {
		$dianomi = intval(self::$dianomi);
		if (!$dianomi)
		Globals::klise_fige(self::$dianomi . ": απαράδεκτος κωδικός διανομής");

		$query = "SELECT `trapezi` FROM `dianomi` WHERE `kodikos` = " . $dianomi;
		$trapezi = Globals::first_row($query);
		if (!$trapezi)
		Globals::klise_fige("Δεν βρέθηκε τραπέζι για τη διανομή " . self::$dianomi);

		self::$trapezi = intval($trapezi["trapezi"]);
	}

	private static function trapezi_set_trexon() {
		if (Globals::oxi_pektis())
		Globals::klise_fige("Ακαθόριστος παίκτης/παρτίδα");

		$pektis = $_SESSION["pektis"];
		$query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3` FROM `partida` ORDER BY `kodikos` DESC";
		$result = Globals::query($query);
		while ($trapezi = $result->fetch_array(MYSQLI_NUM)) {
			for ($thesi = 1; $thesi <= 3; $thesi++) {
				if ($trapezi[$thesi] == $pektis)
				goto SCAN_PARTIDA_END;
			}
		}

		SCAN_PARTIDA_END:
		$result->free();

		if (!$trapezi)
		Globals::klise_fige("Δεν βρέθηκε τραπέζι για τον παίκτη " . $pektis);

		self::$trapezi = intval($trapezi[0]);
	}

	private static function is_trapezi() {
		return self::$trapezi;
	}

	private static function oxi_trapezi() {
		return !self::is_trapezi();
	}
}
?>
