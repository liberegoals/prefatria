<?php
require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");

Selida::head("Αρχείο");

Selida::stylesheet("arena/arena");
Selida::stylesheet("arxio/arxio");
Selida::javascript("common/prefadoros");
Selida::javascript("common/skiniko");
Selida::javascript("common/partida");
Selida::javascript("common/energia");
Selida::javascript("arxio/arxio");

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();
?>
