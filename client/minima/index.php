<?php
require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");

Selida::head("Αλληλογραφία");
Globals::pektis_must();
Globals::database();

Selida::stylesheet("minima/minima");
Selida::javascript("common/skiniko");
Selida::javascript("minima/minima");

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
Minima::controls();
Minima::minimata();
Minima::controlsGo();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

Class Minima {
	public static function controls() {
		?>
		<div id="minimaControls">
			<button id="minimaNeo" class="formaButton" type="button">Νέο μήνυμα</button>
		</div>
		<?php
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

	public static function controlsGo() {
		?>
		<div class="minimaControlsGo" style="left: 0;">
			<img class="minimaControlsGoIcon" style="left: 0;" />
		</div>
		<div class="minimaControlsGo" style="right: 0;">
			<img class="minimaControlsGoIcon" style="right: 0;" />
		</div>
		<?php
	}
}
?>
