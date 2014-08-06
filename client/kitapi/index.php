<?php
require_once "../lib/selida.php";

Selida::head("Πρεφαδόρος - Κιτάπι");
Selida::stylesheet("kitapi/kitapi");
Selida::javascript("common/prefadoros");
Selida::javascript("kitapi/kitapi");

Selida::body();
Selida::ofelimo_begin();
Kitapi::setup();
Selida::ofelimo_end();
Selida::telos();

class Kitapi {
	public static function setup() {
		?>
		<table id="kitapiPinakas">
		<tr>
		<td style="width: 50%;">
			<div id="kitapiPerioxi3" class="kitapiPerioxi"></div>
		</td>
		<td style="width: 50%;">
			<div id="kitapiPerioxi2" class="kitapiPerioxi"></div>
		</td>
		</tr>
		</table>
		<div id="kitapiPerioxi1" class="kitapiPerioxi"></div>
		<?php
	}
}
?>
