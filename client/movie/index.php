<?php
// ΣΑΠ -- Σελίδα Αναψηλάφησης Παρτίδας
// -----------------------------------
//
// Η παρούσα σελίδα χρησιμοποιείται για την αναψηλάφηση παρτίδας. Στο δεξί
// μέρος υπάρχει στήλη με όλες τις διανομές τής παρτίδας, ενώ στο αριστερό
// μέρος υπάρχει τσόχα στην οποία μπορούμε να δούμε τις κινήσεις που έγιναν
// σε κάθε διανομή.
//
// Η παρτίδα καθορίζεται στο URL είτε άμεσα μέσω των παραμέτρων "trapezi" ή
// "partida", είτε έμμεσα μέσα της διανομής που καθορίζεται με την παράμετρο
// "dianomi".

require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");
Globals::database("lib/selida.php");

Selida::head("Αναψηλάφηση");
?>
<script src="http://www.filajs.net/lib/filajs.js"></script>
<script src="http://www.filajs.net/lib/filajsDOM.js"></script>
<link rel="stylesheet" href="http://www.filajs.net/lib/filajs.css" />
<?php
if (file_exists("Boss!")) {
	?>
	<link rel="stylesheet" href="http://www.filajs.net/lib/filajsBoss.css" />
	<?php
}
Selida::stylesheet("arena/arena");
Selida::stylesheet("arxio/arxio");
Selida::stylesheet("movie/movie");
Selida::javascript("common/prefadoros");
Selida::javascript("common/skiniko");
Selida::javascript("common/partida");
Selida::javascript("common/energia");
Selida::javascript("lib/panel");
Selida::javascript("movie/movie");
Selida::javascript("movie/panel");
Movie::init();

Selida::body();
Selida::toolbar("Αναψηλάφηση παρτίδας");
Selida::fyi_pano();

Selida::ofelimo_begin();
Movie::selida();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

class Movie {
	// Το τραπέζι που αφορά στη ΣΑΠ κρατείται στην property
	// "trapezi".

	private static $trapezi = NULL;

	private static function trapezi_set($trapezi) {
		self::$trapezi = intval($trapezi);
	}

	private static function is_trapezi() {
		return self::$trapezi;
	}

	private static function oxi_trapezi() {
		return !self::is_trapezi();
	}

	// Η τρέχουσα διανομή της ΣΑΠ κρατείται στην property
	// "dianomi".

	private static $dianomi = NULL;

	private static function dianomi_set($dianomi) {
		self::$dianomi = intval($dianomi);
	}

	private static function is_dianomi() {
		return self::$dianomi;
	}

	public static function init() {
		if (Globals::perastike("dianomi"))
		self::dianomi_set($_REQUEST["dianomi"]);

		if (self::is_dianomi())
		self::trapezi_set_dianomi();

		if (self::oxi_trapezi())
		self::trapezi_set_url();

		if (self::oxi_trapezi())
		self::trapezi_set_trexon();

		if (self::oxi_trapezi())
		Globals::klise_fige("Ακαθόριστη παρτίδα");

		self::trapezi_check();
		?>
		<script type="text/javascript">
		//<![CDATA[
		Movie.trapezi.kodikos = <?php print self::$trapezi; ?>;
		Movie.dianomiKodikos = <?php print self::is_dianomi() ? self::$dianomi : "null"; ?>;
		//]]>
		</script>
		<?php
	}

	private static function trapezi_set_dianomi() {
		$query = "SELECT `trapezi` FROM `dianomi` WHERE `kodikos` = " . self::$dianomi;
		$dianomi = Globals::first_row($query);
		if (!$dianomi)
		Globals::klise_fige("Δεν βρέθηκε τραπέζι για τη διανομή " . self::$dianomi);

		self::trapezi_set($dianomi["trapezi"]);
	}

	private static function trapezi_set_url() {
		if (Globals::perastike("trapezi")) {
			self::trapezi_set($_REQUEST["trapezi"]);
			self::trapezi_check();
			return;
		}

		if (Globals::perastike("partida")) {
			self::trapezi_set($_REQUEST["partida"]);
			self::trapezi_check();
			return;
		}
	}

	private static function trapezi_check() {
		$query = "SELECT `kodikos` FROM `trapezi` WHERE `kodikos` = " . self::$trapezi;
		$trapezi = Globals::first_row($query);
		if (!$trapezi)
		Globals::klise_fige("Δεν βρέθηκε τραπέζι με κωδικό " . self::$trapezi);
	}

	private static function trapezi_set_trexon() {
		if (Globals::oxi_pektis())
		return;

		$pektis = $_SESSION["pektis"];
		$query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3` FROM `trapezi` " .
			"WHERE `arxio` IS NULL ORDER BY `kodikos` DESC";
		$result = Globals::query($query);
		while ($trapezi = $result->fetch_array(MYSQLI_NUM)) {
			for ($thesi = 1; $thesi <= 3; $thesi++) {
				if ($trapezi[$thesi] === $pektis) {
					$result->free();
					self::trapezi_set($trapezi[0]);
					return;
				}
			}
		}
	}

	public static function selida() {
		?>
		<div id="tsoxa" class="tsoxaPeximo">
		</div>
		<div id="panel">
		</div>
		<div id="dianomes">
		</div>
		<?php
	}
}
?>
