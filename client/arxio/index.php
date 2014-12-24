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
	// αυτά έχουν δοθεί, τα περνά στα αντίστοιχα πεδία της φόρμας κριτηρίων.

	public static function kritiria() {
		?>
		<script type="text/javascript">
		//<![CDATA[
		Arxio.setupPost = function() {
			var kritiria = false;

			<?php
			if (Globals::perastike("pektis")) {
				?>
				Arxio.pektisInputDOM.val('<?php print $_REQUEST["pektis"]; ?>');
				kritiria = true;
				<?php
			}

			if (Globals::perastike("apo")) {
				?>
				Arxio.apoInputDOM.val('<?php print $_REQUEST["apo"]; ?>');
				kritiria = true;
				<?php
			}

			if (Globals::perastike("eos")) {
				?>
				Arxio.eosInputDOM.val('<?php print $_REQUEST["eos"]; ?>');
				kritiria = true;
				<?php
			}

			if (Globals::perastike("partida")) {
				?>
				Arxio.partidaInputDOM.val('<?php print $_REQUEST["partida"]; ?>');
				kritiria = true;
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
