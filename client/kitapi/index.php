<?php
require_once "../lib/selida.php";

Selida::head("Πρεφαδόρος - Κιτάπι");
Selida::stylesheet("kitapi/kitapi");
Selida::javascript("common/prefadoros");
Selida::javascript("kitapi/kitapi");

Selida::body();
Selida::ofelimo_begin();
Kitapi::setup();
//Kitapi::enimerosi();
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

	public static function enimerosi() {
		?>
		<div id="kitapiTabela">
		<div class="kitapiTabelaParagrafos">
		Φίλοι πρεφαδόροι,
		<br />
		Το κιτάπι του νέου «Πρεφαδόρου» θα είναι σύντομα κοντά σας!
		</div>
		<div class="kitapiTabelaParagrafos">
		Ως τότε, απλώς σας υπενθυμίζω ότι το κιτάπι δεν παρέχει καμια χρήσιμη πληροφορία,
		ούτε θα πρέπει με οποιονδήποτε τρόπο να επηρεάζει το παίξιμο και τις αγορές σας.
		Πράγματι, τα καπίκια που έχουν απομείνει στην κάσα ανήκουν εξίσου και στους τρεις
		παίκτες, ενώ τα κέρδη και οι ζημίες των παικτών στην τρέχουσα φάση του παιχνιδιού
		εμφανίζονται ευκρινώς στις αντίστοιχες περιοχές.
		</div>
		</div>
		<?php
	}
}
?>
