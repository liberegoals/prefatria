<?php
// Το παρόν περιέχει την κλάση "Selida" που αφορά στην κατασκευή ιστοσελίδων του ιστοτόπου.
// Το αρχείο γίνεται "include" σε όλες τις ιστοσελίδες και αφού διασφαλίσουμε ότι έχουμε
// διαβασμένα τα βασικά εργαλεία, ενεργοποιούμε by default το session.

if (!class_exists('Globals')) require_once "standard.php";
$sport = preg_replace("/[^0-9]/", "", file_get_contents(Globals::$www . "misc/.mistiko/sport"));
if (!$sport) Globals::klise_fige("Αδυναμία αναγνώρισης πόρτας server σκηνικού");
Globals::$skiser .= ":" . $sport . "/";
Globals::session_init();

// Η κλάση "Selida" χρησιμοποιείται ως name space και όλες οι μέθοδοι είναι static.

class Selida {
	public static function head($titlos = "Πρεφαδόρος") {
		Globals::header_html();
		?>
		<!DOCTYPE html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="description" content="Παίξτε πρέφα on-line!" />
		<meta name="keywords" content="πρέφα,πρεφαδόρος,prefa,prefadoros" />
		<meta name="author" content="<?php print OWNER_ONOMA; ?>" />
		<meta name="copyright" content="Copyright by <?php print OWNER_ONOMA; ?>. All Rights Reserved." />

		<link rel="icon" type="image/png" href="<?php Globals::url("favicon.ico"); ?>" />
		<link rel="shortcut icon" type="image/vnd.microsoft.icon" href="<?php print Globals::url("favicon.ico"); ?>" />
		<link rel="canonical" href="http://www.prefadoros.gr" />
		<title><?php print $titlos; ?></title>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css" />
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>
		<?php
		self::stylesheet('lib/selida');
		self::javascript('common/globals');
		self::javascript('lib/selida');
		self::javascript_begin();
		?>
		Client.server = '<?php print Globals::$server; ?>';
		Client.skiser = '<?php print Globals::$skiser; ?>';
		Client.timeDif = <?php print time(); ?> - Globals.tora();
		Client.diafimisi.emfanis = <?php print Globals::perastike("diafimisi") ? "false" : "true"; ?>;
		Client.motd.emfanes = <?php print Globals::perastike("motd") ? "false" : "true"; ?>;
		<?php
		foreach ($_SESSION as $key => $val) {
			?>
			Client.session[<?php print Globals::asfales_json($key); ?>] = <?php
				print Globals::asfales_json($val); ?>;
			<?php
		}
		self::javascript_end();

	}

	public static function stylesheet($css) {
		$file = Globals::$www . "client/" . $css . ".css";
		if (!file_exists($file)) return;

		$mtime = filemtime($file);
		?><link rel="stylesheet" type="text/css" href="<?php Globals::url($css); ?>.css?t=<?php
			print $mtime; ?>" /><?php
	}

	public static function javascript($script) {
		$file = Globals::$www . "client/" . $script . ".js";
		if (!file_exists($file)) return;

		$mtime = filemtime($file);
		?><script type="text/javascript" src="<?php Globals::url($script); ?>.js?t=<?php
			print $mtime; ?>"></script><?php
	}

	public static function javascript_begin() {
		?>
		<script type="text/javascript">
		//<![CDATA[
		<?php
	}

	public static function javascript_end() {
		?>
		//]]>
		</script>
		<?php
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function body() {
		if (file_exists(Globals::$www . "client/common/rcLocal.js")) Selida::javascript("common/rcLocal");
		if (file_exists(Globals::$www . "client/rcLocal.js")) Selida::javascript("rcLocal");
		?>
		</head>
		<body>
		<?php
	}

	public static function telos() {
		?>
		</body>
		</html>
		<?php
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function sinefo_span_begin() {
		?><span class="sinefo"><?php
	}

	public static function sinefo_span_end() {
		?></span><?php
	}

	public static function sinefo_span($s) {
		self::sinefo_span_begin();
		print $s;
		self::sinefo_span_end();
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function sinefo_div_begin() {
		?><div class="sinefo"><?php
	}

	public static function sinefo_div_end() {
		?></div><?php
	}

	public static function sinefo_div($s) {
		self::sinefo_div_begin();
		print $s;
		self::sinefo_div_end();
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function tab_begin() {
		?><div class="tab"><span class="sinefo"><?php
	}

	public static function tab_end() {
		?></span></div><?php
	}

	public static function tab($s) {
		self::tab_begin();
		print $s;
		self::tab_end();
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "toolbar" προετοιμάζει το toolbar στο επάνω μέρος της σελίδας. Μπορούμε να
	// περάσουμε λίστα με options:
	//
	//	titlos		Είναι ο τίτλος που θα εμφανιστεί στην κεντρική περιοχή του toolbar.
	//			By default τίθεται "Πρεφαδόρος".
	//
	//	link		Είναι το link που μπορούμε να σχετίσουμε με τον τίτλο. Αν χρησιμοποιηθεί
	//			ο default τίτλος, τότε τίθεται link στο ΚΥΠ.

	public static function toolbar($options = array()) {
		?>
		<div id="toolbar">
			<table id="toolbarTable">
			<tr>
			<td style="width: 40%;">
				<div id="toolbarLeft"></div>
			</td>
			<td style="width: 20%;">
				<div id="toolbarCenter"><?php Selida::toolbar_center($options); ?></div>
			</td>
			<td style="width: 40%;">
				<div id="toolbarRight"></div>
			</td>
			</tr>
			</table>
		</div>
		<?php
	}

	private static function toolbar_center($options) {
		Selida::sinefo_span_begin();
		if (array_key_exists("titlos", $options)) {
			if (array_key_exists("link", $options)) {
				?><a target="_blank" href="<?php print $options["link"]; ?>"><?php
					print $options["titlos"]; ?></a><?php
			}
			else print $options["titlos"];
		}
		else {
			?><a target="_blank" href="http://www.prefadoros.net">Πρεφαδόρος</a><?php
		}
		Selida::sinefo_span_end();
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function ribbon() {
		?>
		<div id="ribbon">
			<table id="ribbonTable">
			<tr>
			<td style="width: 40%;">
				<div id="ribbonLeft">
					<?php Selida::ribbon_left(); ?>
				</div>
			</td>
			<td style="width: 20%;">
				<div id="ribbonCenter">
					<?php Selida::ribbon_center(); ?>
				</div>
			</td>
			<td style="width: 40%;">
				<div id="ribbonRight">
					<?php Selida::ribbon_right(); ?>
				</div>
			</td>
			</tr>
			</table>
		</div>
		<?php
	}

	public static function ribbon_left() {
		?>
		<a target="_blank" href="http://www.hellasbridge.org/"><img class="ribbonIcon"
			src="<?php Globals::url("ikona/external/eom.png"); ?>" /></a>
		<a target="_blank" href="http://www.bridgebase.com/"><img class="ribbonIcon"
			src="<?php Globals::url("ikona/external/bbo.png"); ?>" /></a>
		<?php if (Globals::is_pektis()) self::donate(); ?>
		<br />
		<a target="_blank" href="https://twitter.com/prefadorosTT"><img class="ribbonIcon"
			src="<?php Globals::url("ikona/external/twitter.png"); ?>" /></a>
		<a target="_blank" href="https://www.facebook.com/groups/prefadoros"><img class="ribbonIcon"
			src="<?php Globals::url("ikona/external/facebook.jpg"); ?>" /></a>
		<?php
	}

	public static function ribbon_center() {
		self::tab_begin();
		?><a target="<?php print defined("COPYRIGHT_PAGE") ? "_self" : "_blank"; ?>"
		href="<?php Globals::url("copyright/index.php"); ?>">Copyright</a><?php
		self::tab_end();
		self::tab_begin();
		?><a target="_blank" href="https://prefablog.wordpress.com">Ιστολόγιο</a><?php
		self::tab_end();
	}

	public static function donate() {
		?>
		<div id="donate" title="Για τις ανάγκες του server…">
		<form target="_blank" action="https://www.paypal.com/cgi-bin/webscr" method="post">
		<input type="hidden" name="cmd" value="_s-xclick" />
		<input type="hidden" name="hosted_button_id" value="7UGXKWGRM5TXU" />
		<input type="image" src="<?php Globals::url("ikona/external/donate.gif"); ?>"
			border="0" name="submit" title="Buy me a beer!"
			alt="PayPal - The safer, easier way to pay online!" />
		</form>
		</div>
		<?php
	}

	public static function ribbon_right() {
		Selida::sinefo_span_begin();
			?>
			<div id="toolbarCopyright"> &copy;<?php print OWNER_ONOMA; ?>
				[<a target="_blank" title="Send email to &quot;<?php print OWNER_EMAIL;
				?>&quot;" href="mailto:<?php print OWNER_EMAIL; ?>"><img
				id="toolbarEmailIcon" src="<?php
				Globals::url("ikona/misc/email.png"); ?>" /></a>] 2011&ndash;
			</div>
			<div id="toolbarFortos"></div>
			<?php
		Selida::sinefo_span_end();
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function fyi($klasi, $minima) {
		?>
		<div id="fyi<?php print $klasi; ?>" class="fyi">
			<?php print $minima; ?>
		</div>
		<?php
	}

	public static function fyi_pano($minima = "&nbsp;") {
		self::fyi("Pano", $minima);
	}

	public static function fyi_kato($minima = "&nbsp;") {
		self::fyi("Kato", $minima);
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function ofelimo_begin() {
		?><div id="ofelimo"><?php
	}

	public static function ofelimo_end() {
		?></div><?php
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function diafimisi() {
		$diafimisi = "site/diafimisi.php";
		if (!file_exists(Globals::$www . "client/" . $diafimisi)) return;
		?>
		<div id="diafimisi">
			<?php Globals::diavase($diafimisi); ?>
		</div>
		<?php
	}

	public static function motd() {
		$motd = "site/motd.php";
		if (!file_exists(Globals::$www . "client/" . $motd)) return;
		?>
		<div id="motd">
			<?php Globals::diavase($motd); ?>
		</div>
		<?php
	}

	// Η μέθοδος "redirect" καλείται στο head section και σκοπό έχει τη μετάβαση
	// του χρήστη σε άλλη σελίδα.

	public static function redirect($minima, $delay = 10) {
		?>
		<meta http-equiv="refresh" content="<?php print $delay; ?>; url=<?php Globals::url(); ?>" />
		<?php Selida::body(); ?>
		<div class="redirect">
		<div class="redirectMinima"><?php print $minima; ?></div>
			Θα μεταφερθείτε σύντομα στην αρχική σελίδα της εφαρμογής.
		<div class="redirectSimiosi">
			Αν μέσα σε <?php print $delay; ?> δευτερόλεπτα δεν έχετε
			μεταβεί στην αρχική σελίδα της εφαρμογής κάντε κλικ
			<a href="<?php Globals::url(); ?>">εδώ</a>.
		</div>
		</div>
		<?php
		Selida::telos();
		Globals::klise_fige();
	}
}
?>
