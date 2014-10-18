<?php
Globals::diavase("lib/selida.php");

Selida::head();
Globals::pektis_must();

Selida::stylesheet("arena/arena");

Selida::javascript("lib/panel");
Selida::javascript("common/prefadoros");
Selida::javascript("common/skiniko");
Selida::javascript("common/partida");
Selida::javascript("common/energia");
Selida::javascript("common/kinisi");
Selida::javascript("arena/arena");
Selida::javascript("arena/partida");
Selida::javascript("arena/enimerosi");
Selida::javascript("arena/peximo");
Selida::javascript("arena/online");
Selida::javascript("arena/cpanel");
Selida::javascript("arena/prosklisi");
Selida::javascript("arena/anazitisi");
Selida::javascript("arena/sizitisi");
Selida::javascript("arena/epanel");
Selida::javascript("arena/skiniko");
Selida::javascript("arena/profinfo");
Selida::javascript("arena/kinisi");
Selida::javascript("arena/efoplismos");
Selida::javascript("arena/kitapi");
Selida::javascript("arena/radiaki");
Selida::javascript("funchat/common");
Arena::setupView();

Selida::body();
Selida::javascript("arena/rcLocal");
Selida::diafimisi();
Selida::motd();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
Arena::diamorfosi();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

Class Arena {
	public static function setupView() {
		Selida::javascript_begin();

		// Αν έχει περαστεί παράμετρος "viewBoth" ο χρήστης θα βλέπει ταυτόχρονα
		// το καφενείο και την παρτίδα, αλλιώς θα βλέπει μόνο το καφενείο, ή μόνο
		// την παρτίδα, ανάλογα με το αν είναι περιφερόμενος ή βρίσκεται σε κάποιο
		// τραπέζι. Ο χρήστης μπορεί να αλλάζει το view με ειδικό πλήκτρο στο toolbar.
		?>
		Arena.flags.viewBoth = <?php print Globals::perastike("viewBoth") ? "true" : "false"; ?>;

		<?php
		// Αν έχει περαστεί παράμετρος "kouskous" ο χρήστης έχει επιλέξει τη συζήτηση
		// οπότε δεν θα εμφανιστούν αρχικά οι περιοχές του καφενείου και του τραπεζιού.
		// Ο χρήστης έχει τη δυνατότητα να επανεμφανίσει τις περιοχές παιχνιδιού με
		// ειδικό πλήκτρο στο πάνελ συζήτησης.
		?>
		Arena.flags.kouskous = <?php print Globals::perastike("kouskous") ? "true" : "false"; ?>;

		<?php
		Selida::javascript_end();
	}

	// Το βασικό στοιχείο της σελίδας είναι η «αρένα», δηλαδή ο χώρος στον οποίον
	// υπάρχουν όλα τα στοιχεία της εφαρμογής. Ο χώρος αυτός είναι οργανωμένος ως
	// πίνακας ο οποίος εκτείνεται σε όλο το πλάτος της σελίδας και όπου κάθε στήλη
	// περιλαμβάνει συγκεκριμένα αντικείμενα της εφαρμογής.

	public static function diamorfosi() {
		?>
		<table id="arena"><tbody><tr>

		<?php
		// Στην πρώτη στήλη εμφανίζονται οι περιφερόμενοι θαμώνες του καφενείου
		// και αμέσως μετά εμφανίζονται τα τραπέζια στα οποία εξελίσσονται οι
		// παρτίδες. Πρόκειται για τον έναν από τους δύο βασικούς χώρους της
		// εφαρμογής και ονομάζεται «καφενείο».
		?>
		<td id="stiliKafenio"></td>

		<?php
		// Στη δεύτερη στήλη εμφανίζεται το τραπέζι του χρήστη. Ο χώρος αυτός
		// περιλαμβάνει τους νεοφερμένους στο καφενείο (αυτούς που εισήλθαν
		// πρόσφατα) και την τσόχα του τραπεζιού όπου ίσως εξελίσσεται κάποια
		// παρτίδα. Είναι ο δεύτερος βασικός χώρος της εφαρμογής τον οποίο θα
		// ονομάζουμε «τραπέζι», ή «παρτίδα».
		?>
		<td id="stiliPartida"></td>

		<?php
		// Ακολουθεί το control panel της σελίδας το οποίο παρέχει μια στήλη
		// πλήκτρων μέσω των οποίων ο χρήστης μπορεί να επιτελέσει διάφορες
		// εργασίες είτε λειτουργικές, είτε σχετικές με το παιχνίδι.
		?>
		<td id="stiliCpanel"></td>

		<?php
		// Ακολουθεί στήλη στην οποία περιέχονται οριζόντιες περιοχές που αφορούν
		// στις προσκλήσεις, στις αναζητήσεις, στη συζήτηση του καφενείου και στη
		// συζήτηση του τραπεζιού.
		?>
		<td id="stiliPss"></td>

		<?php
		// Η τελευταία στήλη περιλαμβάνει emoticons τα οποία ο χρήστης μπορεί να
		// τα μεταφέρει στο χώρο συζήτησης.
		?>
		<td id="stiliEpanel"></td>

		</tr></tbody></table>
		<?php
	}
}
?>
