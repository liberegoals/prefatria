<?php
require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");

Selida::head("Αναψηλάφηση");

Selida::stylesheet("arena/arena");
Selida::stylesheet("movie/movie");
Selida::javascript("common/prefadoros");
Selida::javascript("common/skiniko");
Selida::javascript("common/partida");
Selida::javascript("common/energia");
Selida::javascript("movie/movie");

Selida::body();
Selida::toolbar("Αναψηλάφηση παρτίδας");
Selida::fyi_pano();

Selida::ofelimo_begin();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

class Movie {
}
?>
