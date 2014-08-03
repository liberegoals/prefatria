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
		?>
		<p class="kitapiEnimerosi">
		Φίλοι πρεφαδόροι,
		<br />
		Το κιτάπι του νέου «Πρεφαδόρου» θα είναι θα είναι σύντομα κοντά σας.
		Ως τότε, απλώς σας υπενθυμίζω ότι το κιτάπι δεν παρέχει καμια χρήσιμη πληροφορία,
		ούτε θα πρέπει με οποιονδήποτε τρόπο να επηρεάζει το παίξιμο και τις αγορές σας.
		Πράγματι, τα καπίκια που έχουν απομείνει στην κάσα ανήκουν εξίσου και στους τρεις
		παίκτες, ενώ τα κέρδη και οι ζημίες των παικτών στην τρέχουσα φάση του παιχνιδιού
		εμφανίζονται ευκρινώς στις αντίστοιχες περιοχές.
		</p>
		<?php
	}
}
?>
