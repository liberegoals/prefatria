<?php
require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");

Selida::head("Αλληλογραφία");
Globals::pektis_must();
Minima::pektisSet();
Globals::database();

Selida::stylesheet("minima/minima");
Selida::javascript("common/skiniko");
Selida::javascript("minima/minima");
Minima::setupView();

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
Minima::minimata();
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

	public static function minimata() {
		?>
		<table id="minimata" style="width: 100%;"></table>
		<div id="minimaEditForma">
			<div id="minimaEditFormaPros">
				<span class="formaPrompt">Προς</span>
				<input id="minimaEditFormaParaliptisLogin"
					class="formaPedio" style="width: 200px;" />
			</div>
			<textarea id="minimaEditFormaKimeno"></textarea>
			<div id="minimaEditFormaPanel"></div>
		</div>
		<?php
	}
}
?>
