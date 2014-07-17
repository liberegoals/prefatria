<?php
require_once "../lib/selida.php";
Globals::diavase("lib/pektis.php");

Globals::database();
Account::init();

Selida::head();
Selida::stylesheet("account/account");
Selida::javascript("account/account");

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
Account::display_forma();
Account::action_frame();
Selida::ofelimo_end();

Selida::ribbon();
Selida::telos();

class Account {
	public static $pektis;

	public static function init() {
		self::$pektis = @new Pektis($_SESSION["pektis"]);
	}

	public static function display_forma() {
		?>
		<form class="forma" target="action" action="<?php print Globals::is_pektis() ?
			"enimerosi" : "egrafi"; ?>.php" method="post" onsubmit="return Account.submit(this);">
			<div class="formaSoma">
				<div class="formaTitlos">
					<?php print Globals::is_pektis() ?
						"Ενημέρωση στοιχείων λογαριασμού" : "Δημιουργία λογαριασμού"; ?>
				</div>
			<table>
			<tr>
				<td class="formaPrompt">
					Login
				</td>
				<td>
					<input name="login" class="formaPedio" type="text" value="<?php
						print self::$pektis->login; ?>" maxlength="64" size="16" />
				</td>
			</tr>
			<tr>
				<td class="formaPrompt">
					Ονοματεπώνυμο
				</td>
				<td>
					<input name="onoma" class="formaPedio" type="text" value="<?php
						print self::$pektis->onoma; ?>" maxlength="128" size="50" />
				</td>
			</tr>
			<tr>
				<td class="formaPrompt">
					Email
				</td>
				<td>
					<input name="email" class="formaPedio" type="text" value="<?php
						print self::$pektis->email; ?>" maxlength="128" size="50" />
				</td>
			</tr>
			<tr class="account_sokidok">
				<td class="formaPrompt">
					<a href="#" onclick="return Account.kodikosAlagi(this);">Αλλαγή Κωδικού</a>
				</td>
			</tr>
			<tr class="account_kodikos">
				<td class="formaPrompt">
					<?php print Globals::is_pektis() ? "Νέος κωδικός" : "Κωδικός"; ?>
				</td>
				<td>
					<input name="kodikos1" class="formaPedio" type="password" value=""
						maxlength="16" size="16" />
				</td>
			</tr>
			<tr class="account_kodikos">
				<td class="formaPrompt">
					Επανάληψη κωδικού
				</td>
				<td>
					<input name="kodikos2" class="formaPedio" type="password" value=""
						maxlength="16" size="16" />
				</td>
			</tr>
			<tr class="account_sokidok">
				<td class="formaPrompt">
					Τρέχων κωδικός
				</td>
				<td>
					<input name="kodikos" class="formaPedio" type="password" value=""
						maxlength="16" size="16" />
				</td>
			</tr>
			</table>
			</div>
			<div class="formaPanel">
				<input class="formaButton" type="submit" value="<?php
					print Globals::is_pektis() ? "Ενημέρωση" : "Εγγραφή"; ?>" />
				<input class="formaButton" type="reset" value="Reset" />
				<input class="formaButton" type="button" value="Άκυρο" onclick="Account.akiro();" />
			</div>
		</form>
		<?php
	}

	// Το iframe που ακολουθεί είναι το target της φόρμας εγγραφής/ενημέρωσης, πράγμα
	// που σημαίνει ότι η action σελίδα της φόρμας θα εμφανιστεί μέσα σε αυτό το frame.
	// Θα μπορούσαμε να κάνουμε όλη τη δουλειά μέσω Ajax αλλά προτιμούμε αυτή τη μέθοδο
	// προκειμένου να διαχειριστούμε πιο εύκολα τα δεδομένα που ανεβάζει ο χρήστης, κυρίως
	// τη φωτογραφία προφίλ.
	//
	// Το iframe είναι αόρατο by default, αλλά μπορούμε να το κάνουμε ορατό μέσω του CSS
	// για το debugging.

	public static function action_frame() {
		?>
		<iframe name="action"></iframe>
		<?php
	}
}
?>
