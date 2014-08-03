<?php
require_once "../lib/selida.php";

Selida::head();
Selida::stylesheet("kitapi/kitapi");
Selida::javascript("kitapi/kitapi");

Selida::body();
Selida::ofelimo_begin();
Kitapi::setup();
Selida::ofelimo_end();
Selida::telos();

class Kitapi {
	public static function setup() {
		print "<i>Ετοιμάζεται…</i>";
	}
}
?>
