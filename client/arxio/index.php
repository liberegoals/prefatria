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
Arxio::kritiria();

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

class Arxio {
	// Η μέθοδος "kritiria" ελέγχει αν έχουν δοθεί κριτήρια στο URL και εφόσον
	// αυτά έχουν δοθεί, τα περνάμε στα αντίστοιχα πεδία της φόρμας κριτηρίων
	// και τα κρατάμε ως data στα αντίστοιχα πεδία για το reset.

	public static function kritiria() {
		?>
		<script type="text/javascript">
		//<![CDATA[
		Arxio.setupPost = function() {
			var kritiria = false;

			<?php
			if (Globals::perastike("pektis")) {
				?>
				Arxio.pektisInputDOM.data('url', '<?php print $_REQUEST["pektis"]; ?>');
				Arxio.pektisInputDOM.val('<?php print $_REQUEST["pektis"]; ?>');
				kritiria = true;
				<?php
			}
			else if (Globals::is_pektis()) {
				?>
				Arxio.pektisInputDOM.data('url', '<?php print $_SESSION["pektis"]; ?>');
				Arxio.pektisInputDOM.val('<?php print $_SESSION["pektis"]; ?>');
				<?php
			}
			else {
				?>
				Arxio.pektisInputDOM.data('url', '');
				<?php
			}

			if (Globals::perastike("apo")) {
				?>
				Arxio.apoInputDOM.data('url', '<?php print $_REQUEST["apo"]; ?>');
				Arxio.apoInputDOM.val('<?php print $_REQUEST["apo"]; ?>');
				kritiria = true;
				<?php
			}
			else {
				?>
				Arxio.apoInputDOM.data('url', '');
				<?php
			}

			if (Globals::perastike("eos")) {
				?>
				Arxio.eosInputDOM.data('url', '<?php print $_REQUEST["eos"]; ?>');
				Arxio.eosInputDOM.val('<?php print $_REQUEST["eos"]; ?>');
				kritiria = true;
				<?php
			}
			else {
				?>
				Arxio.eosInputDOM.data('url', '');
				<?php
			}

			if (Globals::perastike("partida")) {
				?>
				Arxio.partidaInputDOM.data('url', '<?php print $_REQUEST["partida"]; ?>');
				Arxio.partidaInputDOM.val('<?php print $_REQUEST["partida"]; ?>');
				kritiria = true;
				<?php
			}
			else {
				?>
				Arxio.partidaInputDOM.data('url', '');
				<?php
			}
			?>

			if (kritiria)
			Arxio.goButtonDOM.trigger('click');
		};
		//]]>
		</script>
		<?php
	}
}
?>
