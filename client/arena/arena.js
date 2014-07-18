// Το singleton "Arena" χρησιμοποιείται ως name space στο οποίο θα εντάξουμε
// functions και αντικείμενα που αφορούν στην αναπαράσταση του σκηνικού στο
// DOM, καθώς επίσης και στον εφοπλισμό των DOM elements με mouse event
// listeners.

Arena = {};

// Στο attribute "flags" εντάσσουμε διάφορες flags που κανονίζουν εν πολλοίς
// τη συμπεριφορά και την εμφάνιση διαφόρων DOM elements.

Arena.flags = {
	// Η flag "emoticon" δείχνει το αν είναι εμφανής η στήλη των emoticons.
	// Η τιμή της flag αλλάζει μέσω κατάλληλου πλήκτρου στο control panel.

	emoticon: true,

	// Η flag "viewBoth" δείχνει αν θα έχουμε πανοραμική ή οικονομική άποψη.
	// Η πανοραμική άποψη περιλαμβάνει ταυτόχρονη εμφάνιση στο DOM τόσο του
	// καφενείου όσο και της παρτίδας, ενώ η οικονομική άποψη εμφανίζει μόνο
	// το καφενείο ή μόνο την παρτίδα. Η αλλαγή της τιμής της flag γίνεται
	// κυρίως μέσω πλήκτρου στο control panel.

	viewBoth: false,

	// Η flag "partidaMode" δείχνει αν ο παίκτης βρίσκεται και επιχειρεί στο
	// καφενείο ή σε κάποια παρτίδα (είτε ως παίκτης είτε ως θεατής).

	partidaMode: false,

	// Η flag "theatisView" δείχνει αν θα είναι εμφανείς οι θεατές στο καφενείο
	// και στην παρτίδα. Η αλλαγή της τιμής της flag γίνεται μέσω ειδικού πλήκτρου
	// στο panel προσκλήσεων.

	theatisView: true,

	// Η flag "epanadiataxiPss" δείχνει αν θα εμφανίζεται πλήκτρο επαναδιάταξης
	// περιοχών pss στο panel των προσκλήσεων. Αυτό το πλήκτρο πρέπει να εμφανίζεται
	// κάθε φορά που αλλάζουμε την default αναλογία περιοχών στο pss μετακινώντας
	// καθ' ύψος τα ενδιάμεσα χωρίσματα των περιοχών αυτών.

	epanadiataxiPss: false,

	// Η flag "kouskous" δείχνει αν βρισκόμαστε σε mode συζήτησης. Σε mode συζήτησης
	// αποκρύπτονται οι λειτουργικές περιοχές καφενείου και τραπεζιού και μεγαλώνει
	// κατά πλάτος ο χώρος συζήτησης και γενικότερα η περιοχή pss. Η αλλαγή της τιμής
	// της εν λόγω flag γίνεται με πλήκτρο στο δεξί μέρος του panel συζήτησης.

	kouskous: false,
};

Arena.viewBoth = function() {
	return Arena.flags.viewBoth;
};

Arena.viewSingle = function() {
	return !Arena.viewBoth();
};

Arena.partidaMode = function() {
	return Arena.flags.partidaMode;
};

Arena.kafenioMode = function() {
	return !Arena.partidaMode();
};

Arena.theatisView = function() {
	return Arena.flags.theatisView;
};

Arena.kouskous = function() {
	return Arena.flags.kouskous;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
	Client.toolbarLeft('pexnidi');
	Client.toolbarRight();
	Arena.kafenioDOM = $('<div>').addClass('stiliPeriexomeno').appendTo('#stiliKafenio');
	Arena.partidaDOM = $('<div>').addClass('stiliPeriexomeno').appendTo('#stiliPartida');
	Arena.cpanelDOM = $('<div>').addClass('stiliPeriexomeno').appendTo('#stiliCpanel');
	Arena.pssDOM = $('<div>').addClass('stiliPeriexomeno').appendTo('#stiliPss');
	Arena.epanelDOM = $('<div>').addClass('stiliPeriexomeno').appendTo('#stiliEpanel');
	Arena.setup();

	Client.fyi.pano('Αναμένονται πλήρη σκηνικά δεδομένα. Παρακαλώ περιμένετε…').
	skiserService('salute').
	done(function(rsp) {
		Arena.skiniko.stisimo(function() {
			Client.fyi.pano('Καλώς ήλθατε στον «Πρεφαδόρο»');
			Client.fyi.kato('Καλή διασκέδαση και καλές σολαρίες!');
			if (Arena.ego.oxiTrapezi()) return;

			// Αν ο παίκτης βρίσκεται σε κάποιο τραπέζι, τον περνάμε αυτόματα
			// σε mode παρτίδας, αλλά κάνουμε εμφανές το tab που τον επαναφέρει
			// στο καφενείο.

			Arena.partidaModeSet();
			Arena.modeTabDOM.kounima(20);
		});
	}).
	fail(function(rsp) {
		$.ajax('account/exodos.php', {async: false});
		Client.provlima('Η συνεδρία σας έχει λήξει!');
	});
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.setup = function() {
	$('#arena td').addClass('stili').
	find('.stiliPeriexomeno').css('height', Client.ofelimoDOM.innerHeight() + 'px');
	Client.ofelimoDOM.append(Arena.pektisFormaDOM = $('<div>').attr('id', 'pektisForma').siromeno({
		top: '100px',
		left: '100px',
	}));

	Arena.
	setupDiafimisi().
	setupMotd().
	kafenio.setup().
	partida.setup().
	setupPss().
	setupCpanel().
	setupEpanel().
	setupView().
	setupMode().
	viewRefresh();

	Arena.inputTrexon.focus();
	return Arena;
};

Arena.setupDiafimisi = function() {
	Client.diafimisi.callback = function() {
		Client.diafimisi.emfanis = false;
		Arena.cpanel.nottub['diafimisi'].refresh();
	};

	return Arena;
};

Arena.setupMotd = function() {
	Client.motd.callback = function() {
		Client.motd.emfanes = false;
		Arena.cpanel.nottub['motd'].refresh();
	};

	return Arena;
};

Arena.setupCpanel = function() {
	Arena.cpanel.bpanelRefresh();
	Arena.cpanelDOM.empty().
	append(Arena.cpanel.bpanelVertical().bpanelGetDOM());

	return Arena;
};

Arena.setupEpanel = function() {
	Arena.epanel.setup();
	Arena.epanel.bpanelRefresh();
	Arena.epanelDOM.empty().
	append(Arena.epanel.bpanelVertical().bpanelGetDOM());

	if (Arena.flags.emoticon)
	$('#stiliEpanel').css('display', 'table-cell');

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.setupPss = function() {
	Arena.pssDOM.empty();
	Arena.
	prosklisi.setup().
	anazitisi.setup().
	sizitisi.setup().
	epanadiataxiPss();

	return Arena;
};

Arena.epanadiataxiPss = function() {
	var hpss, h;

	hpss = $('#stiliPss').innerHeight();
	hpss -= Arena.prosklisi.panelDOM.outerHeight(true);
	hpss -= Arena.anazitisi.panelDOM.outerHeight(true);
	hpss -= Arena.sizitisi.panelDOM.outerHeight(true);
	h = Math.floor(hpss / 4) - 1;

	Arena.prosklisi.areaDOM.css('height', h + 'px');
	Arena.anazitisi.areaDOM.css('height', h + 'px');
	h = hpss - h - h - 3;
	Arena.sizitisi.areaDOM.css('height', h + 'px');

	Arena.flags.epanadiataxiPss = false;
	Arena.prosklisi.panel.bpanelButtonGet('epanadiataxiPss').pbuttonDisplay();

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.setupView = function() {
	var dom;

	dom = Client.tab($('<a>').attr({href: '#'}).
	on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.flags.viewBoth = !Arena.flags.viewBoth;
		Arena.viewRefresh();
	}).append(Arena.viewTabDOM = Client.sinefo('')));

	$('#toolbarLeft').prepend(dom);
	Arena.viewRefresh();

	return Arena;
};

Arena.viewRefresh = function() {
	var kirio, oirik;

	if (Arena.partidaMode()) {
		kirio = $('#stiliPartida');
		oirik = $('#stiliKafenio');
	}
	else {
		kirio = $('#stiliKafenio');
		oirik = $('#stiliPartida');
	}

	if (Arena.kouskous()) {
		kirio.css('display', 'none');
		oirik.css('display', 'none');
	}
	else {
		kirio.css('display', 'table-cell');
		oirik.css('display', Arena.viewBoth() ? 'table-cell' : 'none');
	}

	Arena.viewTabDOM.text(Arena.viewBoth() ? 'Οικονομική' : 'Πανοραμική');
	Arena.cpanel.bpanelButtonGet('view').pbuttonRefresh();

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.setupMode = function() {
	var dom;

	dom = Client.tab($('<a>').attr({href: '#'}).
	on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.flags.partidaMode = !Arena.flags.partidaMode;
		Arena.modeRefresh();
	}).append(Arena.modeTabDOM = Client.sinefo('')));

	$('#toolbarLeft').prepend(dom);
	Arena.modeRefresh();

	return Arena;
};

// Η function "modeRefresh" καλείται όποτε αλλάζουμε εστίαση από καφενείο
// σε τραπέζι και το αντίστροφο. 

Arena.modeRefresh = function() {
	var tabela;

	if (Arena.partidaMode()) {
		Arena.modeTabDOM.text('Καφενείο');
		$('#stiliKafenio').addClass('stiliIpotoniki');
		$('#stiliPartida').removeClass('stiliIpotoniki');
		Arena.sizitisi.kafenioDOM.css('display', 'none');
		Arena.sizitisi.trapeziDOM.css('display', 'block');
		tabela = 'ΤΡΑΠΕΖΙ';
		if (Arena.ego.trapeziKodikos) tabela += ' ' + Arena.ego.trapeziKodikos;
	}
	else {
		Arena.modeTabDOM.text('Παρτίδα');
		$('#stiliPartida').addClass('stiliIpotoniki');
		$('#stiliKafenio').removeClass('stiliIpotoniki');
		Arena.sizitisi.trapeziDOM.css('display', 'none');
		Arena.sizitisi.kafenioDOM.css('display', 'block');
		tabela = 'ΚΑΦΕΝΕΙΟ';
	}

	Arena.sizitisi.tabelaDOM.text(tabela);
	Arena.sizitisi.areaDOM.scrollKato();
	Arena.viewRefresh();

	return Arena;
};

Arena.partidaModeSet = function() {
	if (Arena.kafenioMode())
	Arena.modeTabDOM.trigger('click');

	return Arena;
};

Arena.kafenioModeSet = function() {
	if (Arena.partidaMode())
	Arena.modeTabDOM.trigger('click');

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "inputRefocus" σκοπό έχει την επανατοπθέτηση του κέρσορα γραφής στο
// τρέχον input πεδίο της εφαρμογής. Υπάρχουν δύο input πεδία, το πεδίο αναζήτησης
// παικτών και το πεδίο γραφής σχολίων συζήτησης. Κάθε φορά που κάνουμε κλικ σε
// κάποιο οπλισμένο DOM element, π.χ. όταν παίζουμε κάποιο φύλλο, ή όταν επιλέγουμε
// κάποια αγορά από το panel των αγορών, ο κέρσορας χάνει το focus από το τρέχον
// input πεδίο, οπότε μπορούμε να καλούμε την εν λόγω function προκειμένου να
// επαναφέρουμε τον κέρσορα στο τρέχον input πεδίο. Παράλληλα συνδυάζουμε και
// την ακύρωση του event propagation που είναι πάγια σε τέτοιου είδους events.

Arena.inputRefocus = function(e) {
	if (e) {
		e.stopPropagation();
		e.preventDefault();
	}

	Arena.inputTrexon.focus();
	return Arena;
};
