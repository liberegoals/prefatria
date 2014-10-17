////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
//
// Ακολουθεί κώδικας που χτίζει το βασικό control panel της εφαρμογής. Πρόκειται
// για κάθετη στήλη εργαλείων τοποθετημένη στη μέση της σελίδας, η οποία χωρίζει
// τη σελίδα στο αριστερό μέρος που περιέχει το καφενείο και την παρτίδα, και στο
// δεξί μέρος που περιέχει τις προσκλήσεις, τις αναζητήσεις και τη συζήτηση που
// διεξάγεται τόσο στο καφενείο, όσο και στο τρπαπέζι.

Arena.cpanel = new BPanel();
Arena.cpanel.omadaMax = 4;

// Ακυρώνουμε κάποιους mouse event listeners για να μην έχουμε ανεπιθύμητα φαινόμενα
// στα κλικ που κάνουμε σε πλήκτρα του control panel.

Arena.cpanel.bpanelGetDOM().
on('click', function(e) {
	Arena.inputRefocus(e);
}).
on('mousedown', function(e) {
	Arena.inputRefocus(e);
});

// Η μέθοδος "clickCommon", εφόσον υπάρχει, καλείται πρώτη στα κλικ που γίνονται σε
// πλήκτρα του control panel.

Arena.cpanel.clickCommon = function(e, pbutton) {
	Arena.inputRefocus(e);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
//
// Ακολουθούν εργαλεία τα οποία φαίνονται πάντα στο επάνω μέρος του control panel.

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'enalagi',
	img: '4Balls.png',
	title: 'Εναλλαγή εργαλείων',
	click: function(e) {
		Arena.cpanel.bpanelEpomeniOmada();
		this.pbuttonGetDOM().strofi({
			strofi: 90,
			duration: 200,
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	img: 'ikona/misc/mazemaPano.png',
	title: 'Αρχική σειρά εργαλείων',
	click: function(e) {
		Arena.cpanel.bpanelOmadaSet(1);
		Arena.cpanel.bpanelButtonGet('enalagi').pbuttonGetDOM().strofi({
			strofi: -90,
			duration: 200,
		});
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'miaPrefa.png',
	title: 'Νέο τραπέζι',
	check: function() {
		return Arena.ego.oxiTrapezi();
	},
	click: function(e) {
		var button, tora, dom, klikTS;

		tora = Globals.torams();
		dom = this.pbuttonGetDOM();
		klikTS = parseInt(dom.data('klikTS'));
		if (isNaN(klikTS)) dom.data('klikTS', tora);
		else if (tora - klikTS < 1000) return;

		button = this.pbuttonLock();
		Client.fyi.pano('Δημιουργία νέου τραπεζιού. Παρακαλώ περιμένετε…');
		Client.skiserService('miaPrefa').
		done(function(rsp) {
			Client.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	refresh: function() {
		if (Arena.flags.emoticon) {
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/emoticonOff.png');
			this.pbuttonGetDOM().attr('title', 'Απόκρυψη emoticons');
		}
		else {
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/emoticonOn.png');
			this.pbuttonGetDOM().attr('title', 'Εμφάνιση emoticons');
		}

		return this;
	},
	click: function(e) {
		Arena.flags.emoticon = !Arena.flags.emoticon;
		$('#stiliEpanel').css('display', Arena.flags.emoticon ? 'table-cell' : 'none');
		this.refresh();
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'diataxi.png',
	title: 'Αλλαγή διάταξης παικτών',
	check: function() {
		return Arena.trapeziRithmisi();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Αλλαγή διάταξης παικτών. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('diataxi').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'kasa.png',
	title: 'Κάσα 50/30',
	check: function() {
		return Arena.trapeziRithmisi();
	},
	click: function(e) {
		var button, kasa;

		if (Arena.ego.oxiTrapezi()) return;
		button = this.pbuttonLock();
		kasa = Arena.ego.trapezi.trapeziKasaGet() == 50 ? 30 : 50;
		Client.fyi.pano('Αλλαγή κάσας σε ' + kasa + '. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΚΑΣΑ', 'timi=' + kasa).
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'asoiOn.png',
	title: 'Να παίζονται οι άσοι',
	check: function() {
		if (Arena.trapeziOxiRithmisi()) return false;
		return Arena.ego.trapezi.trapeziOxiAsoi();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Αλλαγή καθεστώτος πληρωμής άσων. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΑΣΟΙ', 'timi=ΝΑΙ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'asoiOff.png',
	title: 'Να μην παίζονται οι άσοι',
	check: function() {
		if (Arena.trapeziOxiRithmisi()) return false;
		return Arena.ego.trapezi.trapeziIsAsoi();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Αλλαγή καθεστώτος πληρωμής άσων. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΑΣΟΙ', 'timi=ΟΧΙ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'pasoOn.png',
	title: 'Να παίζεται το πάσο',
	check: function() {
		if (Arena.trapeziOxiRithmisi()) return false;
		return Arena.ego.trapezi.trapeziOxiPaso();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Αλλαγή καθεστώτος άγονης αγοράς. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΠΑΣΟ', 'timi=ΝΑΙ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'pasoOff.png',
	title: 'Να μην παίζεται το πάσο',
	check: function() {
		if (Arena.trapeziOxiRithmisi()) return false;
		return Arena.ego.trapezi.trapeziIsPaso();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Αλλαγή καθεστώτος άγονης αγοράς. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΠΑΣΟ', 'timi=ΟΧΙ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return false;
		if (Debug.flagGet('rithmisiPanta')) return true;
		return Arena.ego.trapezi.trapeziOxiDianomi();
	},
	refresh: function(img) {
		var thesi;

		if (Arena.ego.oxiTrapezi()) return;
		thesi = Arena.ego.trapezi.trapeziThesiPekti(Client.session.pektis);
		if (!thesi) return;

		if (Arena.ego.trapezi.trapeziIsApodoxi(thesi)) {
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/ixodopa.png');
			this.pbuttonGetDOM().attr('title', 'Επαναδιαπραγμάτευση όρων παιχνιδιού');
			return;
		}

		if (Arena.ego.trapezi.trapeziApodoxiCount() === (Prefadoros.thesiMax - 1)) {
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/go.jpg');
			this.pbuttonGetDOM().attr('title', 'Αποδοχή όρων και εκκίνηση της παρτίδας');
			return;
		}

		this.pbuttonIconGetDOM().attr('src', 'ikona/panel/apodoxi.png');
		this.pbuttonGetDOM().attr('title', 'Αποδοχή όρων παιχνιδιού');
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano(this.pbuttonGetDOM().attr('title') + '. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('apodoxi').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'claim',
	omada: 1,
	img: 'claim.png',
	title: 'Δεν χάνω άλλη μπάζα!',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return false;
		if (Debug.flagGet('epomenosCheck') &&
		Arena.ego.oxiThesi(Arena.ego.trapezi.partidaTzogadorosGet())) return false;

		switch (Arena.ego.trapezi.partidaFasiGet()) {
		case 'ΠΑΙΧΝΙΔΙ':
			return true;
		}

		return false;
	},
	click: function(e) {
		if (Arena.cpanel.claimButtonDOM.data('akiro')) return;
		if (Arena.ego.oxiTrapezi()) return;

		Client.skiserService('claimProtasi').
		done(function(rsp) {
			Client.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));
Arena.cpanel.claimButtonDOM = Arena.cpanel.bpanelButtonGet('claim').pbuttonGetDOM();

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'radio',
	omada: 1,
	refresh: function() {
		var dom;

		if ($(this).data('active')) {
			dom = this.pbuttonGetDOM();
			dom.attr('title', 'Turn off the radio');

			dom = this.pbuttonIconGetDOM();
			dom.attr('src', 'ikona/panel/radioOff.png');
			return;
		}

		dom = this.pbuttonGetDOM();
		dom.attr('title', 'Turn on the radio!');

		dom = this.pbuttonIconGetDOM();
		dom.attr('src', 'ikona/panel/radioOn.png');
	},
	click: function(e) {
		var active;

		active = $(this).data('active');
		if (active) {
			$(this).removeData('active');
			active.remove();
			this.pbuttonRefresh();
			return;
		}

		window.open('http://www.e-radio.gr/Active-Radio-Internet-Radio-i48/live', 'radio');
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'kafedaki.png',
	title: 'Καφετζής',
	click: function(e) {
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'araxni.png',
	title: 'Επίδειξη προηγούμενης χαρτωσιάς',
	check: function() {
		return Arena.ego.isPektis();
	},
	click: function(e) {
		if (Arena.ego.oxiPektis())
		return;

		Client.skiserService('filaPrev').
		done(function(fila) {
			Arena.sizitisi.inputDOM.val('FP^' + fila);
			Arena.sizitisi.keyup();
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(Arena.cpanel.freskarismaButton = new PButton({
	omada: 1,
	img: 'bugFix.png',
	title: 'Ανανέωση σκηνικού',
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Γίνεται ενημέρωση του σκηνικού. Παρακαλώ περιμένετε…', 0);
		Arena.skiniko.stisimo(function() {
			Client.fyi.pano();
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'akirosi',
	omada: 1,
	img: 'akirosiStart.png',
	title: 'Ακύρωση κινήσεων',
	check: function() {
		var dianomi, energiaArray;

		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return false;

		dianomi = Arena.ego.trapezi.trapeziTelefteaDianomi();
		if (!dianomi) return false;

		energiaArray = dianomi.energiaArray;
		if (!energiaArray) return false;
		if (energiaArray.length < 2) return false;

		switch (Arena.ego.trapezi.partidaFasiGet()) {
		case 'ΔΗΛΩΣΗ':
		case 'ΑΛΛΑΓΗ':
		case 'ΣΥΜΜΕΤΟΧΗ':
		case 'ΠΑΙΧΝΙΔΙ':
		case 'CLAIM':
			return true;
		}

		return false;
	},
	click: function(e) {
		if (Arena.ego.oxiTrapezi()) return false;
		Client.skiserService('akirosiStart').
		done(function(rsp) {
			Client.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'akirosiStop.png',
	title: 'Λήξη ακύρωσης κινήσεων',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return false;
		return Arena.ego.trapezi.trapeziAkirosiGet();
	},
	click: function(e) {
		if (Arena.ego.oxiTrapezi()) return false;
		Client.skiserService('akirosiStop').
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'azab',
	omada: 1,
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		return Arena.ego.trapezi.trapeziIsDianomi();
	},
	refresh: function() {
		var img;

		img = this.pbuttonIconGetDOM();
		if (Arena.partida.flags.azab) img.attr({
			src: 'ikona/panel/bazaPrevOff.png',
			title: 'Απόκρυψη προηγούμενης μπάζας',
		});
		else img.attr({
			src: 'ikona/panel/bazaPrevOn.png',
			title: 'Εμφάνιση προηγούμενης μπάζας',
		});
	},
	click: function(e) {
		Arena.partida.flags.azab = !Arena.partida.flags.azab;

		if (Arena.partida.flags.azab)
		Arena.partida.azabDOM.finish().fadeIn(100);

		else Arena.partida.azabDOM.finish().fadeOut(200, function() {
			// Υπάρχει περίπτωση να έχουμε εμφανίσει τον τζόγο,
			// οπότε ξαναγυρνάμε στην τελευταία μπάζα.

			if (Arena.partida.azabDOM.data('tzogos'))
			Arena.partida.azabRefreshBazaDOM();
		});

		Arena.cpanel.bpanelRefresh();
	},
}));
Arena.cpanel.bpanelButtonGet('azab').pbuttonGetDOM().
on('mouseenter', function() {
	Arena.partida.azabDOM.addClass('tsoxaAzabEmfanis');
}).
on('mouseleave', function() {
	Arena.partida.azabDOM.removeClass('tsoxaAzabEmfanis');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	check: function() {
		return Arena.ego.isTrapezi();
	},
	img: 'exodos.png',
	title: 'Έξοδος από το τραπέζι',
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Δρομολογήσατε την έξοδό σας από το τραπέζι. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('exodosTrapezi').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	id: 'pektisTheatis',
	img: 'matakias.png',
	title: 'Παίκτης/Θεατής',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.isPektis()) return true;
		if (!Arena.ego.trapezi.trapeziKeniThesi()) return false;
		return Arena.ego.trapezi.trapeziIsProsklisi(Client.session.pektis);
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Εναλλαγή παίκτη/θεατή. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('pektisTheatis').
		done(function(rsp) {
			Client.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'frog.png',
	title: 'Εμφάνιση/απόκρυψη φύλλων Ανατολής και Δύσης',
	check: function() {
		if (Debug.flagGet('striptiz')) return true;
		if (Arena.ego.isPektis()) return false;
		return true;
		//return Kafenio.egoPektis.pektisIsVip();
	},
	click: function(e) {
		if (Arena.partida.flags.fanera23) {
			delete Arena.partida.flags.fanera23;
			Arena.partida.fila3DOM.css('visibility', 'hidden');
			Arena.partida.fila2DOM.css('visibility', 'hidden');
		}
		else {
			Arena.partida.flags.fanera23 = true;
			Arena.partida.fila3DOM.css('visibility', 'visible');
			Arena.partida.fila2DOM.css('visibility', 'visible');
		}
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	check: function() {
		return Arena.trapeziRithmisi();
	},
	refresh: function() {
		var img;

		if (Arena.ego.oxiTrapezi()) return;

		img = this.pbuttonIconGetDOM();
		switch (Arena.ego.trapezi.trapeziTelioma()) {
		case 'ΚΑΝΟΝΙΚΟ':
			img.attr({
				src: 'ikona/panel/postel/anisoropo.png',
				title: 'Ανισόρροπος τρόπος πληρωμής τελευταίας αγοράς',
			});
			break;
		case 'ΑΝΙΣΟΡΡΟΠΟ':
			img.attr({
				src: 'ikona/panel/postel/dikeo.png',
				title: 'Δίκαιος τρόπος πληρωμής τελευταίας αγοράς',
			});
			break;
		default:
			img.attr({
				src: 'ikona/panel/postel/kanoniko.png',
				title: 'Συμβατικός τρόπος πληρωμής τελευταίας αγοράς',
			});
			break;
		}
	},
	click: function(e) {
		var button, telioma;

		if (Arena.ego.oxiTrapezi()) return;

		button = this.pbuttonLock();

		switch (Arena.ego.trapezi.trapeziTelioma()) {
		case 'ΚΑΝΟΝΙΚΟ':
			telioma = 'ΑΝΙΣΟΡΡΟΠΟ';
			break;
		case 'ΑΝΙΣΟΡΡΟΠΟ':
			telioma = 'ΔΙΚΑΙΟ';
			break;
		default:
			telioma = 'ΚΑΝΟΝΙΚΟ';
			break;
		}

		Client.fyi.pano('Μετατροπή τρόπου πληρωμής τελευταίας αγοράς. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΤΕΛΕΙΩΜΑ', 'timi=' + telioma).
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'roloi.png',
	title: 'Κυκλική εναλλαγή θέσης',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.isTheatis()) return true;
		if (Arena.ego.trapezi.trapeziIsIdioktito()) return false;
		return Arena.trapeziRithmisi();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Κυκλική εναλλαγή θέσης. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('roloi').
		done(function(rsp) {
			Client.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'agonistiki.png',
	title: 'Αγωνιστική παρτίδα',
	check: function() {
		if (Arena.trapeziOxiRithmisi()) return false;
		return Arena.ego.trapezi.trapeziIsFiliki();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Αγωνιστική παρτίδα. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΦΙΛΙΚΗ', 'timi=ΟΧΙ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'filiki.png',
	title: 'ΕκπαιδευτικήΦιλική παρτίδα',
	check: function() {
		if (Arena.trapeziOxiRithmisi()) return false;
		return Arena.ego.trapezi.trapeziIsAgonistiki();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Φιλική παρτίδα. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΦΙΛΙΚΗ', 'timi=ΝΑΙ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'idioktito.png',
	title: 'Ιδιόκτητο τραπέζι',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return false;
		if (Arena.ego.trapezi.trapeziIsIdioktito()) return false;
		if (Arena.ego.oxiThesi(1)) return false;
		if (Arena.ego.trapezi.trapeziIsDianomi()) return false;
		return true;
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Μετατροπή τραπεζιού σε ιδιόκτητο. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΙΔΙΟΚΤΗΤΟ', 'timi=ΝΑΙ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'elefthero.png',
	title: 'Ελεύθερο τραπέζι',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return false;
		if (Arena.ego.trapezi.trapeziIsElefthero()) return false;
		if (Arena.ego.oxiThesi(1)) return false;
		return true;
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Μετατροπή τραπεζιού σε ελεύθερο. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΙΔΙΟΚΤΗΤΟ', 'timi=ΟΧΙ', 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'prive.png',
	title: 'Πριβέ τραπέζι',
	check: function() {
		if (Arena.trapeziOxiRithmisi(true)) return false;
		if (Arena.ego.oxiVip()) return false;
		return Arena.ego.trapezi.trapeziIsDimosio();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Κλείδωμα τραπεζιού. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΠΡΙΒΕ', 'timi=ΝΑΙ', 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'dimosio.png',
	title: 'Δημόσιο τραπέζι',
	check: function() {
		if (Arena.trapeziOxiRithmisi(true)) return false;
		if (Arena.ego.oxiVip()) return false;
		return Arena.ego.trapezi.trapeziIsPrive();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Ξεκλείδωμα τραπεζιού. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΠΡΙΒΕ', 'timi=ΟΧΙ', 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'aorato.png',
	title: 'Απόκρυψη τραπεζιού',
	check: function() {
		if (Arena.trapeziOxiRithmisi(true)) return false;
		if (Arena.ego.oxiVip()) return false;
		return Arena.ego.trapezi.trapeziIsOrato();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Απόκρυψη τραπεζιού. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΑΟΡΑΤΟ', 'timi=ΝΑΙ', 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'orato.png',
	title: 'Αποκάλυψη τραπεζιού',
	check: function() {
		if (Arena.trapeziOxiRithmisi(true)) return false;
		if (Arena.ego.oxiVip()) return false;
		return Arena.ego.trapezi.trapeziIsAorato();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Αποκάλυψη τραπεζιού. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΑΟΡΑΤΟ', 'timi=ΟΧΙ', 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'klisto.png',
	title: 'Κλείσιμο φύλλων για τους θεατές',
	check: function() {
		if (Arena.trapeziOxiRithmisi(true)) return false;
		if (Arena.ego.oxiVip()) return false;
		return Arena.ego.trapezi.trapeziIsAnikto();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Κλείσιμο φύλλων για τους θεατές. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΑΝΟΙΚΤΟ', 'timi=ΟΧΙ', 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'anikto.png',
	title: 'Άνοιγμα φύλλων για τους θεατές',
	check: function() {
		if (Arena.trapeziOxiRithmisi(true)) return false;
		if (Arena.ego.oxiVip()) return false;
		return Arena.ego.trapezi.trapeziIsKlisto();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Άνοιγμα φύλλων για τους θεατές. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΑΝΟΙΚΤΟ', 'timi=ΝΑΙ', 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'kasaPano.png',
	title: 'Αύξηση κάσας',
	check: function() {
		if (Arena.trapeziOxiRithmisi(true)) return false;
		return Arena.ego.trapezi.trapeziIsDianomi();
	},
	click: function(e) {
		var button, kasa;

		if (Arena.ego.oxiTrapezi()) return;
		button = this.pbuttonLock();
		kasa = Arena.ego.trapezi.trapeziKasaGet() + 10;
		Client.fyi.pano('Αύξηση κάσας. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΚΑΣΑ', 'timi=' + kasa, 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'kasaKato.png',
	title: 'Μείωση κάσας',
	check: function() {
		if (Arena.trapeziOxiRithmisi(true)) return false;
		return Arena.ego.trapezi.trapeziIsDianomi();
	},
	click: function(e) {
		var button, kasa;

		if (Arena.ego.oxiTrapezi()) return;
		button = this.pbuttonLock();
		kasa = Arena.ego.trapezi.trapeziKasaGet() - 10;
		Client.fyi.pano('Αύξηση κάσας. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΚΑΣΑ', 'timi=' + kasa, 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'refresh.png',
	title: 'Επαναφόρτωση σελίδας',
	click: function(e) {
		location.reload(true);
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.cpanel.bpanelButtonPush(Arena.cpanel.diathesimosButton =  new PButton({
	omada: 3,
	img: 'ikona/panel/diathesimos.png',
	title: 'Φαίνεστε ΑΠΑΣΧΟΛΗΜΕΝΟΣ. Κλικ για αλλαγή κατάστασης σε ΔΙΑΘΕΣΙΜΟΣ',
	check: function() {
		return Arena.ego.isApasxolimenos();
	},
	click: function(e) {
		var button1, button2;

		button1 = this.pbuttonLock();
		button2 = Arena.prosklisi.panel.diathesimosButton.pbuttonLock();
		Client.fyi.pano('Αλλαγή κατάστασης σε ΔΙΑΘΕΣΙΜΟΣ. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('peparamSet', 'param=ΚΑΤΑΣΤΑΣΗ', 'timi=ΔΙΑΘΕΣΙΜΟΣ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button1.pbuttonRelease();
			button2.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button1.pbuttonRelease();
			button2.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(Arena.cpanel.apasxolimenosButton =  new PButton({
	omada: 3,
	img: 'ikona/panel/apasxolimenos.png',
	title: 'Φαίνεστε ΔΙΑΘΕΣΙΜΟΣ. Κλικ για αλλαγή κατάστασης σε ΑΠΑΣΧΟΛΗΜΕΝΟΣ',
	check: function() {
		return Arena.ego.isDiathesimos();
	},
	click: function(e) {
		var button1, button2;

		button1 = this.pbuttonLock();
		button2 = Arena.prosklisi.panel.apasxolimenosButton.pbuttonLock();
		Client.fyi.pano('Αλλαγή κατάστασης σε ΑΠΑΣΧΟΛΗΜΕΝΟΣ. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('peparamSet', 'param=ΚΑΤΑΣΤΑΣΗ', 'timi=ΑΠΑΣΧΟΛΗΜΕΝΟΣ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button1.pbuttonRelease();
			button2.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button1.pbuttonRelease();
			button2.pbuttonRelease();
		});
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'funchatOn',
	omada: 3,
	img: 'ikona/panel/funchat/on.png',
	title: 'Ενεργοποίηση funchat',
	check: function() {
		if (!Arena) return false;
		if (!Arena.funchat) return false;
		if (Arena.ego.oxiTrapezi()) return false;
		return !Arena.funchat.win;
	},
	click: function(e) {
		Arena.funchat.anigma();
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'funchatOff',
	omada: 3,
	img: 'ikona/panel/funchat/off.png',
	title: 'Απενεργοποίηση funchat',
	check: function() {
		if (!Arena) return false;
		if (!Arena.funchat) return false;
		return Arena.funchat.win;
	},
	click: function(e) {
		Arena.funchat.klisimo();
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 3,
	refresh: function() {
		var taxitita;

		taxitita = parseInt(Client.session.taxitita);
		if (isNaN(taxitita)) taxitita = 3;
		else if (taxitita > 5) taxitita = 5;
		else if (taxitita < 1) taxitita = 1;

		img = this.pbuttonIconGetDOM();
		img.attr({
			src: 'ikona/panel/taxitita/speed' + taxitita + '.png',
			title: Arena.partida.taxititaTitlosGet(taxitita),
		});
	},
	click: function(e) {
		var taxitita;

		taxitita = parseInt(Client.session.taxitita);
		if (isNaN(taxitita)) taxitita = 3;
		else if (taxitita > 5) taxitita = 5;
		else if (taxitita < 1) taxitita = 1;
		if (++taxitita > 5) taxitita = 1;
		Client.session.taxitita = taxitita;
		this.pbuttonPanelGet().bpanelRefresh();
		Client.ajaxService('misc/setCookie.php', 'tag=taxitita', 'val=' + Client.session.taxitita);
		Client.fyi.kato('Ταχύτητα κίνησης φύλλων: <span class="ble entona">' +
			Arena.partida.taxititaTitlosGet(taxitita) + '</span>');
	},
}));

Arena.cpanel.bpanelButtonPush(Arena.paraskinio.button = new PButton({
	omada: 3,
	img: 'paraskinio.png',
	title: 'Αλλαγή παρασκηνίου',
	click: function(e) {
		Arena.paraskinio.open();
	},
}));
Arena.paraskinio.button = Arena.paraskinio.button.pbuttonGetDOM();

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 3,
	img: 'kinito.png',
	refresh: function() {
		var img;

		img = this.pbuttonIconGetDOM();
		if (Client.session.kinito) img.css('opacity', 0.5).attr({
			title: 'Ενεργοποίηση πληκτρολογίου αφής',
		});
		else img.css('opacity', '').attr({
			title: 'Απενεργοποίηση πληκτρολογίου αφής',
		});
	},
	click: function(e) {
		if (Client.session.kinito) {
			delete Client.session.kinito;
			params = '';
		}
		else {
			Client.session.kinito = 1;
			params = 'energo=1';
		}

		this.refresh();
		Client.ajaxService('misc/kinito.php', params).
		done(function(rsp) {
			Client.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 3,
	img: 'entasi.png',
	title: 'Ένταση ήχου: ' + Client.session.entasi,
	click: function(e) {
		switch (Client.session.entasi) {
		case 'ΚΑΝΟΝΙΚΗ':
			Client.session.entasi = 'ΔΥΝΑΤΗ';
			break;
		case 'ΔΥΝΑΤΗ':
			Client.session.entasi = 'ΣΙΩΠΗΛΟ';
			break;
		case 'ΣΙΩΠΗΛΟ':
			Client.session.entasi = 'ΧΑΜΗΛΗ';
			break;
		default:
			Client.session.entasi = 'ΚΑΝΟΝΙΚΗ';
			break;
		}
		this.pbuttonGetDOM().attr('title', 'Ένταση ήχου: ' + Client.session.entasi);
		Client.fyi.pano('Ένταση ήχου: ' + Client.session.entasi);
		Client.sound.beep();
		Client.ajaxService('misc/setCookie.php', 'tag=entasi', 'val=' + Client.session.entasi);
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'epidotisiOn',
	omada: 3,
	img: 'epidotisiOn.png',
	title: 'Επιδότηση',
	check: function() {
		if (Arena.ego.isErgazomenos()) return false;
		return Arena.ego.oxiEpidotisi();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Αίτηση επιδότησης. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('peparamSet', 'param=ΕΠΙΔΟΤΗΣΗ', 'timi=ΝΑΙ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'epidotisiOff',
	omada: 3,
	img: 'epidotisiOff.png',
	title: 'Διακοπή επιδότησης',
	check: function() {
		return Arena.ego.isEpidotisi();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Client.fyi.pano('Αίτημα διακοπής επιδότησης. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('peparamSet', 'param=ΕΠΙΔΟΤΗΣΗ', 'timi=ΟΧΙ').
		done(function(rsp) {
			Client.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			button.pbuttonRelease();
		});
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'diafimisi',
	omada: Arena.cpanel.omadaMax,
	refresh: function() {
		if (Client.diafimisi.emfanis) {
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/adsHide.png');
			this.pbuttonGetDOM().attr('title', 'Απόκρυψη διαφημίσεων');
		}
		else {
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/adsShow.png');
			this.pbuttonGetDOM().attr('title', 'Εμφάνιση διαφημίσεων');
		}

		return this;
	},
	click: function(e) {
		Client.diafimisi.emfanis = !Client.diafimisi.emfanis;
		if (Client.diafimisi.emfanis) {
			$('#diafimisi').slideDown();
		}
		else {
			$('#diafimisi').find('.klisimoIcon').trigger('click');
		}

		this.refresh();
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'motd',
	omada: Arena.cpanel.omadaMax,
	refresh: function() {
		if (Client.motd.emfanes) {
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/motdHide.png');
			this.pbuttonGetDOM().attr('title', 'Απόκρυψη ενημερωτικού μηνύματος');
		}
		else {
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/motdShow.png');
			this.pbuttonGetDOM().attr('title', 'Εμφάνιση ενημερωτικού μηνύματος');
		}

		return this;
	},
	click: function(e) {
		Client.motd.emfanes = !Client.motd.emfanes;
		if (Client.motd.emfanes) {
			$('#motd').slideDown();
		}
		else {
			$('#motd').find('.klisimoIcon').trigger('click');
		}

		this.refresh();
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'view',
	omada: Arena.cpanel.omadaMax,
	refresh: function() {
		if (Arena.flags.viewBoth) {
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/viewSingle.png');
			this.pbuttonGetDOM().attr('title', 'Οικονομική άποψη');
		}
		else {
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/viewBoth.png');
			this.pbuttonGetDOM().attr('title', 'Πανοραμική άποψη');
		}

		return this;
	},
	click: function(e) {
		Arena.flags.viewBoth = !Arena.flags.viewBoth;
		Arena.viewRefresh();
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: Arena.cpanel.omadaMax,
	refresh: function() {
		switch (Arena.partida.flags.amolimeni) {
		case 1:
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/tsoxaKinisi.png');
			this.pbuttonGetDOM().attr('title', 'Αγκύρωση τσόχας');
			break;
		default:
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/tsoxaDemeni.png');
			this.pbuttonGetDOM().attr('title', 'Χειραφεσία τσόχας');
			break;
		}
	},
	click: function(e) {
		switch (Arena.partida.flags.amolimeni) {
		case 1:
			Arena.partidaDOM.css({
				cursor: 'auto',
			}).siromeno(false);
			Client.fyi.kato('Η τσόχα σταθεροποιήθηκε στη συγκεκριμένη θέση!');
			Arena.partida.flags.amolimeni = 2;
			break;
		default:
			Arena.partidaDOM.siromeno();
			Arena.partida.refreshDOM();
			Arena.partida.peristrofiDOM();
			if (Arena.kafenioMode()) Arena.modeTabDOM.trigger('click');
			if (Arena.viewBoth()) Arena.cpanel.bpanelButtonGet('view').click();
			Client.fyi.kato('Τώρα μπορείτε να σύρετε την τσόχα σε βολικότερο μέρος&hellip;');
			Arena.partida.flags.amolimeni = 1;
			break;
		}
		this.pbuttonPanelGet().bpanelRefresh();
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: Arena.cpanel.omadaMax,
	img: 'tsoxaAmolimeni.png',
	title: 'Συμμόρφωση τσόχας',
	check: function() {
		switch (Arena.partida.flags.amolimeni) {
		case 1:
		case 2:
			return true;
		default:
			return false;
		}
	},
	click: function(e) {
		Arena.partidaDOM.css({
			position: 'relative',
			top: 0,
			left: 0,
			bottom: '',
			right: '',
			cursor: '',
		}).siromeno(false);
		Client.fyi.kato('Η τσόχα επανατοθετήθηκε σε σταθερή θέση!');
		Arena.partida.flags.amolimeni = 0;
		this.pbuttonPanelGet().bpanelRefresh();
	},
}));
