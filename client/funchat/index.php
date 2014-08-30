<?php
require_once "../lib/selida.php";

Selida::head("Πρεφαδόρος - Funchat");
Selida::stylesheet("funchat/funchat");
Selida::javascript("common/prefadoros");
Selida::javascript("funchat/funchat");

Selida::body();
Selida::ofelimo_begin();
Funchat::setup();
Selida::ofelimo_end();
Selida::telos();

class Funchat {
	public static function setup() {
	}
}
?>
