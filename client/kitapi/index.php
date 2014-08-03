<?php
require_once "../lib/selida.php";

Selida::head("Πρεφαδόρος - Κιτάπι");
Selida::stylesheet("kitapi/kitapi");
Selida::javascript("kitapi/kitapi");

Selida::body();
Selida::ofelimo_begin();
Kitapi::setup();
Selida::ofelimo_end();
Selida::telos();

class Kitapi {
	public static function setup() {
		?>
		<div style="padding: 20px;">
		<div class="kitapiEnimerosi">
		Φίλοι πρεφαδόροι,
		<br />
		Το κιτάπι του νέου «Πρεφαδόρου» θα είναι σύντομα κοντά σας!
		</div>
		<div class="kitapiEnimerosi">
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
