Arena.anazitisi = {
	// Το flag "active" δείχνει αν υπάρχει ενεργό φίλτρο αναζήτησης
	// στη σελίδα του χρήστη.

	active: false,

	// Το property "pattern" περιέχει το pattern αναζήτησης που αφορά
	// στο login και στο όνομα των παικτών.

	pattern: '',

	// Το property "katastasi" αφορά στην κατάσταση των αναζητουμένων
	// παικτών. Πιο συγκεκριμένα, μπορούμε να φιλτράρουμε παίκτες που
	// είναι online, online και διαθέσιμοι για παιχνίδι:
	//
	//	ONLINE		Φιλτράρονται οι online παίκτες, ασχέτως αν
	//			συμμετέχουν σε κάποιο τραπέζι ως παίκτες ή
	//			όχι.
	//
	//	AVAILABLE	Φιλτράρονται οι online παίκτες που δεν δείχνουν
	//			να συμμετέχουν ως παίκτες σε κάποιο τραπέζι.
	//
	//	ALL		Δεν φιλτράρονται οι παίκτες σε σχέση με την
	//			κατάστασή τους.

	katastasi: 'ONLINE',

	// Το property "sxetikos" παίρνει τιμές true/false και δείχνει αν
	// φιλτράρονται οι φίλοι του παίκτη που εκτελεί την αναζήτηση.

	sxetikos: true,

	// Η λίστα "lista" περιέχει μια εγγραφή για κάθε παίκτη που πληροί
	// τα κριτήρια ανζήτησης. Η λίστα είναι δεικοτοδοτημένη με το login
	// name του παίκτη και δείχνει το σχετικό DOM element στην περιοχή
	// εμφάνισης των αποτελεσμάτων αναζήτησης.

	lista: {},

	// Όταν γίνονται αναζητήσεις στον skiser θέτουμε κάποιο όριο στο
	// πλήθος των αποτελεσμάτων.

	max: 10,
};

Arena.anazitisi.isActive = function() {
	return Arena.anazitisi.active;
};

Arena.anazitisi.oxiActive = function() {
	return !Arena.anazitisi.isActive();
};

Arena.anazitisi.setup = function() {
	Arena.anazitisi.panelDOM = $('<div>').appendTo(Arena.pssDOM);
	Arena.anazitisi.areaDOM = $('<div>').addClass('pss').appendTo(Arena.pssDOM);

	Arena.anazitisi.panel.bpanelRefresh();
	Arena.anazitisi.panelDOM.
	append(Arena.anazitisi.panel.bpanelHorizontal().bpanelSiromeno().bpanelGetDOM());
	Arena.anazitisi.panelSetup();

	Arena.anazitisi.panel.bpanelButtonGet('metakinisi').pbuttonGetDOM().
	on('mouseenter', function(e) {
		$(this).css('cursor', 'ns-resize');
	});

	return Arena;
};

Arena.anazitisi.panel = new BPanel();

Arena.anazitisi.panel.clickCommon = function(e) {
	Arena.inputRefocus(e);
};

Arena.anazitisi.panel.bpanelButtonPush(new PButton({
	id: 'metakinisi',
	img: 'ikona/misc/bara.png',
	title: 'Αυξομείωση περιοχής αναζητήσεων',
}));

Arena.anazitisi.panel.bpanelGetDOM().
append(Arena.anazitisi.inputDOM = $('<input>').
addClass('panelInput').
on('keyup', function(e) {
	Arena.anazitisi.keyup(e);
}).
on('click', function(e) {
	Arena.inputTrexon = $(this);
	Arena.inputRefocus(e);
}));

// Όταν κάνουμε κλικ στον μεγεθυντικό φακό επιχειρούμε εκ νέου αναζήτηση
// με τα κριτήρια που ήδη είναι καθορισμένα στη σελίδα μας.

Arena.anazitisi.panel.bpanelButtonPush(Arena.anazitisi.anazitisiDOM = new PButton({
	img: 'fakos.png',
	title: 'Αναζήτηση τώρα!',
	click: function(e) {
		Arena.inputRefocus(e);
		Arena.anazitisi.zitaData();
	},
}));

Arena.anazitisi.panel.bpanelButtonPush(new PButton({
	img: 'clear.png',
	title: 'Καθαρισμός κριτηρίων αναζήτησης',
	click: function(e) {
		Arena.inputRefocus(e);

		Arena.anazitisi.pattern = '';
		Arena.anazitisi.inputDOM.val('');

		Arena.anazitisi.katastasi = 'ONLINE';
		Arena.anazitisi.katastasiButtonDOM.pbuttonRefresh();

		Arena.anazitisi.sxetikos = true;
		Arena.anazitisi.sxetikosButtonDOM.pbuttonRefresh();

		Arena.anazitisi.schedule();
	},
}));

Arena.anazitisi.panel.bpanelButtonPush(Arena.anazitisi.katastasiButtonDOM = new PButton({
	refresh: function () {
		var xroma, desc, dom;

		switch (Arena.anazitisi.katastasi) {
		case 'ONLINE':
			xroma = 'portokali';
			desc = 'Αναζητούνται online παίκτες';
			break;
		case 'AVAILABLE':
			xroma = 'prasino';
			desc = 'Αναζητούνται διαθέσιμοι παίκτες';
			break;
		default:
			xroma = 'ble';
			desc = 'Αναζητούνται παίκτες ανεξαρτήτως κατάστασης';
			break;
		}

		dom = this.pbuttonIconGetDOM();
		if (dom) dom.attr('src', 'ikona/panel/balaki/' + xroma + '.png');

		dom = this.pbuttonGetDOM();
		if (dom) dom.attr('title', desc);
	},
	click: function(e) {
		Arena.inputRefocus(e);

		switch (Arena.anazitisi.katastasi) {
		case 'ONLINE':
			Arena.anazitisi.katastasi = 'ALL';
			break;
		case 'ALL':
			Arena.anazitisi.katastasi = 'AVAILABLE';
			break;
		default:
			Arena.anazitisi.katastasi = 'ONLINE';
			break;
		}

		this.pbuttonRefresh();
		Arena.anazitisi.schedule(100);
	},
}));

Arena.anazitisi.panel.bpanelButtonPush(Arena.anazitisi.sxetikosButtonDOM = new PButton({
	img: 'sxetikos.png',
	refresh: function () {
		var opacity, desc, dom;

		if (Arena.anazitisi.sxetikos) {
			opacity = 1;
			desc = 'Αναζητούνται μόνο σχετιζόμενοι παίκτες';
		}
		else {
			opacity = 0.4;
			desc = 'Αναζητούνται και μη σχετιζόμενοι παίκτες';
		}

		dom = this.pbuttonIconGetDOM();
		if (dom) dom.css('opacity', opacity);

		dom = this.pbuttonGetDOM();
		if (dom) dom.attr('title', desc);
	},
	click: function(e) {
		Arena.inputRefocus(e);
		Arena.anazitisi.sxetikos = !Arena.anazitisi.sxetikos;
		this.pbuttonRefresh();
		Arena.anazitisi.schedule(100);
	},
}));

Arena.anazitisi.zebraRefresh = function() {
	Arena.anazitisi.areaDOM.children('.anazitisi:odd').removeClass('anazitisiEven');
	Arena.anazitisi.areaDOM.children('.anazitisi:even').addClass('anazitisiEven');
	return Arena;
};

// Η function "setup" διαμορφώνει το οριζόντιο panel αναζήτησης και συσχετισμού παικτών.
// Εδώ παρέχεται input πεδίο στο οποίο ο χρήστης δίνει ονομαστικά στοιχεία των παικτών που
// αναζητά, και εικονίδια/εργαλεία που αφορούν σε φιλτράρισμα των αποτελεσμάτων αναζήτησης
// ανάλογα με την κατάσταση των παικτών (online, offline, ελεύθερος κλπ), και τη συσχέτιση
// των παικτών με τον χρήστη.

Arena.anazitisi.panelSetup = function() {
	Arena.anazitisi.panelDOM.
	on('mousedown', function(e) {
		var
		y0 = e.pageY,
		prosklisiH = Arena.prosklisi.areaDOM.height();
		anazitisiH = Arena.anazitisi.areaDOM.height();
		sizitisiH = Arena.sizitisi.areaDOM.height();

		e.preventDefault();
		e.stopPropagation();

		Arena.flags.epanadiataxiPss = true;
		Arena.prosklisi.panel.bpanelButtonGet('epanadiataxiPss').pbuttonDisplay();
		Arena.anazitisi.panelDOM.css('cursor', 'ns-resize');
		Arena.anazitisi.panel.bpanelButtonGet('metakinisi').
		pbuttonGetDOM().addClass('panelButtonCandi');
		$(document).off('mousemove mouseup').
		on('mousemove', function(e) {
			var dh, h, pH, aH, sH;

			e.stopPropagation();
			sH = sizitisiH;

			dh = e.pageY - y0;
			if (dh <= 0) {
				h = prosklisiH + dh;
				if (h < 0) h = 0;
				dh = h - prosklisiH;

				pH = prosklisiH + dh;
				aH = anazitisiH - dh;
			}
			else {
				h = anazitisiH - dh;
				if (h < 0) {
					aH = 0;
					pH = prosklisiH + anazitisiH;
					dh -= anazitisiH;

					h = sizitisiH - dh;
					if (h < 0) {
						sH = 0;
						pH += sizitisiH;
						dh = sizitisiH;
					}
					else {
						pH += dh;
						sH -= dh;
					}
				}
				else {
					pH = prosklisiH + dh;
					aH = anazitisiH - dh;
				}
			}

			Arena.prosklisi.areaDOM.css('height', pH + 'px');
			Arena.anazitisi.areaDOM.css('height', aH + 'px');
			Arena.sizitisi.areaDOM.css('height', sH + 'px');
		}).
		on('mouseup', function(e) {
			e.stopPropagation();
			Arena.anazitisi.panelDOM.css('cursor', '');
			Arena.anazitisi.panel.bpanelButtonGet('metakinisi').
			pbuttonGetDOM().removeClass('panelButtonCandi');
			$(document).off('mousemove mouseoff');
		});
	});

	Arena.anazitisi.panelDOM.find('.panelButton').slice(1).
	add(Arena.anazitisi.panelDOM.find('.panelInput')).
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	});

	return Arena;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.anazitisi.keyup = function(e) {
	var code, pat;

	if (e) {
		code = e.keyCode ? e.keyCode : e.which;
		switch (code) {
		case 27:	// Escape
			Arena.anazitisi.inputDOM.val('');
			break;
		}
	}

	pat = Arena.anazitisi.inputDOM.val().trim();
	if (pat === Arena.anazitisi.pattern)
	return Arena;

	Arena.anazitisi.pattern = pat;
	Arena.anazitisi.schedule();

	return Arena;
};

Arena.anazitisi.schedule = function(delay) {
	var len;

	if (Arena.anazitisi.timer)
	clearTimeout(Arena.anazitisi.timer);

	if (isNaN(delay)) {
		len = Arena.anazitisi.pattern.length;
		if (len < 2) delay = 700;
		else if (len < 3) delay = 500;
		else if (len < 4) delay = 400;
		else if (len < 5) delay = 300;
		else delay = 200;
	}

	Arena.anazitisi.timer = setTimeout(function() {
		Arena.anazitisi.zitaData();
	}, delay);

	return Arena;
};

Arena.anazitisi.zitaData = function() {
	var buttonDom, msg;

	if (Arena.anazitisi.timer) {
		clearTimeout(Arena.anazitisi.timer);
		delete Arena.anazitisi.timer;
	}

	if ((Arena.anazitisi.katastasi === 'ALL') && (!Arena.anazitisi.pattern) && (!Arena.anazitisi.sxetikos)) {
		Arena.anazitisi.clearResults();
		Arena.anazitisi.active = false;
		return Arena;
	}

	Arena.anazitisi.active = true;
	if (Arena.anazitisi.katastasi !== 'ALL')
	return Arena.anazitisi.online();

	msg = 'Αναζήτηση';
	if (Arena.anazitisi.pattern)
	msg += ', όνομα: <span class="entona ble">' + Arena.anazitisi.pattern + '</span>';
	if (Arena.anazitisi.katastasi !== 'ALL')
	msg += ', <span class="entona prasino">' + Arena.anazitisi.katastasi + '</span>';
	if (Arena.anazitisi.sxetikos)
	msg += ', <span class="entona ble">σχετιζόμενοι</span>';
	msg += '. Παρακαλώ περιμένετε…';
	Client.fyi.pano(msg);

	buttonDom = Arena.anazitisi.anazitisiDOM.pbuttonIconGetDOM();
	if (buttonDom) buttonDom.working(true);

	Client.skiserService('anazitisi',
		'pattern=' + Arena.anazitisi.pattern,
		'sxesi=' + (Arena.anazitisi.sxetikos ? 1 : 0),
		'max=' + Arena.anazitisi.max).
	done(function(rsp) {
		Arena.anazitisi.clearResults();
		Arena.anazitisi.processData(rsp);
		buttonDom.working(false);
	}).
	fail(function(err) {
		Client.sound.beep();
		Client.skiserFail(err);
		buttonDom.working(false);
	});

	return Arena;
};

Arena.anazitisi.clearResults = function() {
	Arena.anazitisi.areaDOM.empty();
	Arena.anazitisi.lista = {};
	return Arena;
};

Arena.anazitisi.online = function() {
	Arena.anazitisi.clearResults();
	Globals.walk(Arena.skiniko.sinedria, function(login, sinedria) {
		if (Arena.anazitisi.loginCheck(login, sinedria))
		new Anazitisi({login:login}).anazitisiCreateDOM();
	});

	return Arena;
};

Arena.anazitisi.processData = function(rsp) {
	var i;

	try {
		eval('var data = [' + rsp + ']');
	} catch (e) {
		Client.sound.beep();
		Client.fyi.epano('Ακαθόριστα αποτελέσματα αναζήτησης');
		return;
	}

	Client.fyi.pano('Επεξεργασία αποτελεσμάτων. Παρακαλώ περιμένετε…');
	for (i = 0; i < data.length; i++) {
		new Anazitisi(data[i]).anazitisiCreateDOM();
	}

	if (data.length < Arena.anazitisi.max) Client.fyi.pano();
	else Client.fyi.epano('<span class="entona ble">ΠΡΟΣΟΧΗ:</span> Ελλιπή αποτελέσματα. Περιορίστε την αναζήτηση!');
};

// Η function "pektisCheck" δέχεται το login name κάποιου παίκτη και ελέγχει
// τον συγκεκριμένο παίκτη σε σχέση με τα τρέχοντα κριτήρια αναζήτησης. Αν ο
// παίκτης συμφωνεί με τα κριτήρια αναζήτησης πρέπει να βρίσκεται στην περιοχή
// των αποτελεσμάτων, αλλιώς θα πρέπει να μην εμφανίζεται σ' αυτήν την περιοχή.
// Η function "pektisCheck" φροντίζει ώστε να ισχύουν τα παραπάνω.
//
// Αν έχουμε πρόχειρη και τη συνεδρία του παίκτη, μπορούμε να την περάσουμε ως
// δεύτερη παράμετρο, αλλιώς θα γίνει απόπειρα εντοπισμού της σχετικής συνεδρίας
// από την ίδια την "pektisCheck".

Arena.anazitisi.pektisCheck = function(login, sinedria) {
	var dom;

	// Αν δεν έχουμε ενεργή αναζήτηση, τότε δεν προβαίνουμε σε
	// κανέναν έλεγχο και σε καμιά περαιτέρω ενέργεια.

	if (Arena.anazitisi.oxiActive())
	return Arena;

	if (Arena.anazitisi.loginCheck(login, sinedria)) {
		new Anazitisi({login:login}).anazitisiCreateDOM();
		return Arena;
	}

	dom = Arena.anazitisi.lista[login];
	if (!dom)
	return Arena;

	dom.remove();
	delete Arena.anazitisi.lista[login];
};

// Η function "loginCheck" δέχεται το login name κάποιου παίκτη και ελέγχει
// τον συγκεκριμένο παίκτη σε σχέση με τα τρέχοντα κριτήρια αναζήτησης. Αν ο
// παίκτης συμφωνεί με τα κριτήρια αναζήτησης επιστρέφει true, αλλιώς επιστρέφει
// false.
//
// Αν έχουμε πρόχειρη και τη συνεδρία του παίκτη, μπορούμε να την περάσουμε ως
// δεύτερη παράμετρο, αλλιώς θα γίνει απόπειρα εντοπισμού της σχετικής συνεδρίας
// από την ίδια την "loginCheck".

Arena.anazitisi.loginCheck = function(login, sinedria) {
	var pattern, pektis;

	if (Arena.anazitisi.sxetikos && Arena.ego.pektis.pektisOxiFilos(login))
	return false;

	if (sinedria === undefined)
	sinedria = Arena.skiniko.skinikoSinedriaGet(login);

	// Αν η ζητούμενη κατάσταση δεν είναι "ALL", τότε αναζητούνται online παίκτες,
	// είτε παίζοντες, είτε ελεύθεροι. Σ' αυτήν την περίπτωση πρέπει να υπάρχει
	// συνεδρία για τον ελεγχόμενο παίκτη.

	if ((Arena.anazitisi.katastasi !== 'ALL') && (!sinedria))
	return false;

	// Αν αναζητούμε online ελεύθερους παίκτες, τότε οι παίκτες που παίζουν σε
	// κάποιο τραπέζι απορρίπτονται. Ο έλεγχος που κάνουμε εδώ δεν απόλυτα ορθός,
	// καθώς κάποιος παίκτης που σουλατσάρει ως θεατής σε κάποιο άλλο τραπέζι θα
	// φανεί ελεύθερος.

	if ((Arena.anazitisi.katastasi === 'AVAILABLE') && sinedria.sinedriaIsPektis())
	return false;

	// Αν δεν έχει δοθεί κριτήριο ονόματος, τότε ο παίκτης είναι δεκτός.

	if (!Arena.anazitisi.pattern)
	return true;

	// Έχει δοθεί κριτήριο ονόματος και θα ελέγξουμε το login name και το όνομα
	// του παίκτη. Επειδή τα κριτήρια δίδονται, ενδεχομένως, με μεταχαρακτήρες
	// που αφορούν σε αναζητήσεις της database, θα πρέπει να μετατρέψουμε το
	// pattern σε JS regular expression.

	pattern = new RegExp(Arena.anazitisi.pattern.replace(/%/g, '.*').replace(/_/g, '.'), "i");
	if (login.match(pattern)) return true;

	pektis = Arena.skiniko.skinikoPektisGet(login);
	if (!pektis) return false;

	return pektis.pektisOnomaGet().match(pattern);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Anazitisi = function(props) {
	var pektis;

	Globals.initObject(this, props);

	if (!this.hasOwnProperty('onoma')) {
		pektis = Arena.skiniko.skinikoPektisGet(this.login);
		if (pektis) this.onoma = pektis.pektisOnomaGet();
	}
};

Anazitisi.prototype.anazitisiLoginGet = function() {
	return this.login;
};

Anazitisi.prototype.anazitisiOnomaGet = function() {
	return this.onoma;
};

Anazitisi.prototype.anazitisiCreateDOM = function() {
	var login, pektis, sinedria, katastasi, dom, loginClass;

	login = this.anazitisiLoginGet();
	if (!login) return this;

	pektis = Arena.skiniko.skinikoPektisGet(login);
	if (!pektis) Arena.skiniko.skinikoPektisSet(pektis = new Pektis(this));

	sinedria = Arena.skiniko.skinikoSinedriaGet(login);
	if (!sinedria) katastasi = {
		src: 'ble',
		title: 'Offline',
	};
	else if (sinedria.sinedriaIsPektis()) katastasi = {
		src: 'portokali',
		title: 'Online',
	};
	else katastasi = {
		src: 'prasino',
		title: 'Online, ελεύθερος',
	};
	katastasi.src = 'ikona/panel/balaki/' + katastasi.src + '.png';

	loginClass = 'anazitisiLogin';
	if (Arena.ego.pektis.pektisIsFilos(login))
	loginClass += ' anazitisiFilos'; 

	dom = Arena.anazitisi.lista[login];
	if (dom) dom.remove();

	dom = $('<div>').addClass('anazitisi').
	data('pektis', pektis).
	append($('<img>').addClass('anazitisiKatastasiIcon').attr(katastasi)).
	append($('<div>').addClass(loginClass).text(login)).
	append($('<div>').addClass('anazitisiOnoma').text(this.anazitisiOnomaGet()));

	Arena.anazitisi.lista[login] = dom;
	Arena.anazitisi.areaDOM.prepend(dom);
	Arena.anazitisi.zebraRefresh();

	return this;
};
