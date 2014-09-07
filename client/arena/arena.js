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

	// Η flag "rebelosView" δείχνει αν θα είναι εμφανείς οι περιφερόμενοι παίκτες
	// (ρέμπελοι) στο καφενείο. Η αλλαγή της τιμής της flag γίνεται μέσω ειδικού
	// πλήκτρου στο panel προσκλήσεων.

	rebelosView: true,

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

// Η function "viewBoth" επιστρέφει true εφόσον ο χρήστης έχει επιλέξει πανοραμική άποψη,
// ήτοι ταυτόχρονη άποψη παρτίδας και καφενείου.

Arena.viewBoth = function() {
	return Arena.flags.viewBoth;
};

// Η function "viewSingle" επιστρέφει true εφόσον ο χρήστης έχει επιλέξει οικονομική
// άποψη, ήτοι άποψη της παρτίδας ή του καφενείου.

Arena.viewSingle = function() {
	return !Arena.viewBoth();
};

// Η function "partidaMode" επιστρέφει true εφόσον ο χρήστης έχει επιλέξει την περιοχή
// της παρτίδας. Η παρτίδα περιλαμβάνει τους νεοφερμένους, την τσόχα του τραπεζιού στο
// οποίο εξελίσσεται η παρτίδα και τη συζήτηση που αφορά στο συγκεκριμένο τραπέζι.

Arena.partidaMode = function() {
	return Arena.flags.partidaMode;
};

// Η function "kafenioMode" επιστρέφει true εφόσον ο χρήστης έχει επιλέξει την περιοχή
// καφενείου. Η περιοχή καφενείου περιλαμβάνει τους περιφερόμενους παίκτες και συνοπτική
// άποψη όλων των τραπεζιών. Όσον αφορά στη συζήτηση, στο προσκήνιο έρχεται η συζήτηση
// που εξελίσσεται στο συγκεκριμένο τραπέζι.

Arena.kafenioMode = function() {
	return !Arena.partidaMode();
};

// Η function "rebelosView" επιστρέφει true όσο η περιοχή των περιφερομένων παικτών είναι
// εμφανής.

Arena.rebelosView = function() {
	return Arena.flags.rebelosView;
};

// Η function "theatisView" επιστρέφει true όσο η περιοχή των θεατών, τόσο στο καφενείο όσο
// και στην παρτίδα είναι εμφανής.

Arena.theatisView = function() {
	return Arena.flags.theatisView;
};

// Η function "kouskous" επιστρέφει true εφόσον ο χρήστης έχει επιλέξει mode συζήτησης, όπου
// τόσο το καφενείο όσο και η παρτίδα έχουν αποκρυβεί και έχει απλωθεί απ' άκρου εις άκρον
// η περιοχή προσκλήσεων, αναζητήσεων και συζήτησης.

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
			Arena.prosklisi.panel.bpanelRefresh();
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
		Client.provlima('<div>Η συνεδρία σας έχει λήξει!</div><div><a href="' +
		Client.server + 'isodos" target="_self">Επανείσοδος</a></div>').css({
			textAlign: 'center',
		});
	});
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.unload = function() {
	if (Arena.unloaded) return;
	Arena.unloaded = true;

	Arena.
	paraskinio.klisimo().
	kitapi.klisimo().
	funchat.klisimo();
};

$(window).
on('beforeunload', function() {
	Arena.unload();
}).
on('unload', function() {
	Arena.unload();
}).
on('focus', function() {
	setTimeout(function() {
		Arena.inputRefocus();
	}, 100);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.setup = function() {
	$('#arena td').addClass('stili').
	find('.stiliPeriexomeno').css('height', Client.ofelimoDOM.innerHeight() + 'px');
	Client.ofelimoDOM.append(Arena.pektisFormaDOM = $('<div>').attr('id', 'pektisForma').siromeno({
		top: '197px',
		left: '636px',
	}));

	Arena.
	setupDiafimisi().
	setupMotd().
	setupFortos().
	setupKafenio().
	partida.setup().
	setupPss().
	setupCpanel().
	setupEpanel().
	setupView().
	setupMode().
	viewRefresh();

	if (!Client.session.kinito)
	Arena.inputTrexon.focus();

	return Arena;
};

Arena.setupDiafimisi = function() {
	Client.diafimisi.callback = function() {
		Client.diafimisi.emfanis = false;
		Arena.cpanel.bpanelButtonGet('diafimisi').refresh();
	};

	return Arena;
};

Arena.setupMotd = function() {
	Client.motd.callback = function() {
		Client.motd.emfanes = false;
		Arena.cpanel.bpanelButtonGet('motd').refresh();
	};

	return Arena;
};

// Ακυρώνουμε την κλασική ανανέωση δεδομένων φόρτου, καθώς θα παίρνουμε
// τον φόρτο της CPU με κάθε ενημέρωση σκηνικών δεδομένων από τον skiser,
// ενώ το πλήθος των online παικτών και των ενεργών τραπεζιών θα υπολογίζεται
// στον client από τα τοπικά σκηνικά δεδομένα.

Arena.setupFortos = function() {
	Client.fortos.clearTimer();
	return Arena;
};

Arena.setupKafenio = function() {
	Arena.kafenioDOM.css('overflowY', 'auto');
	Arena.rebelosDOM = $('<div>').attr('id', 'rebelos').appendTo(Arena.kafenioDOM);
	Arena.trapeziDOM = $('<div>').attr('id', 'trapezi').appendTo(Arena.kafenioDOM);

	return Arena;
};

Arena.setupCpanel = function() {
	Arena.cpanel.bpanelRefresh();
	Arena.cpanelDOM.empty().
	append(Arena.cpanel.bpanelVertical().bpanelGetDOM());

	return Arena;
};

Arena.panelRefresh = function(omada) {
	Arena.cpanel.bpanelRefresh(omada);
	Arena.pektisPanelRefreshDOM();
	return Arena;
}

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

	if (Client.session.kinito)
	return Arena;

	Arena.inputTrexon.focus();
	return Arena;
};

Arena.kafenioScrollTop = function() {
	Arena.kafenioDOM.finish().animate({
		scrollTop: 0
	}, 400, 'easeInQuint');

	return Arena;
};

// Η function "trapeziRithmisi" επιστρέφει true εφόσον ο χρήστης ανήκει σε κάποιο
// τραπέζι και το τραπέζι βρίσκεται σε φάση ρυθμίσεων, δηλαδή πριν παιχτεί οποιαδήποτε
// διανομή. Αν θέλουμε μπορούμε αγνοήσουμε το αν υπάρχουν ή όχι διανομές περνώτας
// literal true.
//
// Η function χρησιμποιείται κατά κόρον στο control panel, μπορεί όμως να χρησιμοποιηθεί
// και οπουδήποτε αλλού.

Arena.trapeziRithmisi = function(dianomi) {
	if (Arena.ego.oxiTrapezi()) return false;
	if (Arena.ego.oxiPektis()) return false;
	if (Arena.ego.trapezi.trapeziIsIdioktito() && Arena.ego.oxiThesi(1)) return false;

	if (dianomi === undefined) dianomi = Debug.flagGet('rithmisiPanta');
	if (dianomi) return true;

	return Arena.ego.trapezi.trapeziOxiDianomi();
};

Arena.trapeziOxiRithmisi = function(dianomi) {
	return !Arena.trapeziRithmisi(dianomi);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.paraskinio = {
	win: null,
	button: $(),
};

Arena.paraskinio.open = function() {
	Arena.paraskinio.klisimo();
	Arena.paraskinio.win = window.open(Client.server + 'paraskinio',
		'_blank', 'top=80,left=80,width=820,height=400,scrollbars=1');
	Arena.paraskinio.button.addClass('panelButtonEkremes');
	return Arena;
};

Arena.paraskinio.klisimo = function() {
	if (!Arena.paraskinio.win)
	return Arena;

	Arena.paraskinio.win.close();
	delete Arena.paraskinio.win;
	Arena.paraskinio.button.removeClass('panelButtonEkremes');
	return Arena;
};

Arena.paraskinioAlagi = function(img) {
	$(document.body).css({backgroundImage:img});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.funchat = {
	win: null,
};

Arena.funchat.isAnikto = function() {
	return Arena.funchat.win;
};

Arena.funchat.isKlisto = function() {
	return !Arena.funchat.isAnikto();
};

Arena.funchat.anigma = function() {
	if (Arena.funchat.isAnikto())
	Arena.funchat.klisimo();

	Arena.funchat.win = window.open('funchat', '_blank', 'width=800,height=800,top=100,left=900');

	Arena.cpanel.bpanelRefresh();
	return Arena.funchat;
};

Arena.funchat.klisimo = function() {
	Arena.funchat.win.close();
	Arena.funchat.win = null;

	Arena.cpanel.bpanelRefresh();
	return Arena.funchat;
};
