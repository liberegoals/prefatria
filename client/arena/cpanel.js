Arena.cpanel = new BPanel();
Arena.cpanel.omadaMax = 3;

Arena.cpanel.clickCommon = function(e) {
	Arena.inputRefocus(e);
};

Arena.cpanel.trapeziRithmisi = function() {
	if (Arena.ego.oxiTrapezi()) return false;
	if (Arena.ego.oxiPektis()) return false;
	if (Debug.flagGet('rithmisiPanta')) return true;
	return Arena.ego.trapezi.trapeziOxiDianomi();
};

Arena.cpanel.trapeziOxiRithmisi = function() {
	return !Arena.cpanel.trapeziRithmisi();
};

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
	id: 'arxiki',
	img: 'ikona/misc/mazemaPano.png',
	title: 'Αρχική σειρά εργαλείων',
	click: function(e) {
		Arena.cpanel.bpanelOmadaSet(1);
		Arena.cpanel.nottub['enalagi'].pbuttonGetDOM().strofi({
			strofi: -90,
			duration: 200,
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'emoticon',
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
	img: 'miaPrefa.png',
	title: 'Νέο τραπέζι',
	check: function() {
		return Arena.ego.oxiPektis();
	},
	click: function(e) {
		Client.fyi.pano('Δημιουργία νέου τραπεζιού. Παρακαλώ περιμένετε…');
		Client.skiserService('miaPrefa').
		done(function(rsp) {
			Client.fyi.epano(rsp);
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'diataxi',
	omada: 1,
	img: 'diataxi.png',
	title: 'Αλλαγή διάταξης παικτών',
	check: function() {
		return Arena.cpanel.trapeziRithmisi();
	},
	click: function(e) {
		var img;

		img = this.pbuttonIconGetDOM();
		img.working(true);
		Client.fyi.pano('Αλλαγή διάταξης παικτών. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('diataxi').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'roloi',
	omada: 1,
	img: 'roloi.png',
	title: 'Κυκλική εναλλαγή θέσης',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return true;
		if (Debug.flagGet('rithmisiPanta')) return true;
		return Arena.ego.trapezi.trapeziOxiDianomi();
	},
	click: function(e) {
		var img;

		img = this.pbuttonIconGetDOM();
		img.working(true);
		Client.fyi.pano('Κυκλική εναλλαγή θέσης. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('roloi').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'kasa.png',
	title: 'Κάσα 50/30',
	check: function() {
		return Arena.cpanel.trapeziRithmisi();
	},
	click: function(e) {
		var img, kasa;

		if (Arena.ego.oxiTrapezi()) return;
		img = this.pbuttonIconGetDOM();
		img.working(true);
		kasa = Arena.ego.trapezi.trapeziKasaGet() == 50 ? 30 : 50;
		Client.fyi.pano('Αλλαγή κάσας σε ' + kasa + '. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΚΑΣΑ', 'timi=' + kasa).
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'asoiOn',
	omada: 1,
	img: 'asoiOn.png',
	title: 'Να παίζονται οι άσοι',
	check: function() {
		if (Arena.cpanel.trapeziOxiRithmisi()) return false;
		return Arena.ego.trapezi.trapeziOxiAsoi();
	},
	click: function(e) {
		var img;

		img = this.pbuttonIconGetDOM();
		img.working(true);
		Client.fyi.pano('Αλλαγή καθεστώτος πληρωμής άσων. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΑΣΟΙ', 'timi=ΝΑΙ').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'asoiOff',
	omada: 1,
	img: 'asoiOff.png',
	title: 'Να μην παίζονται οι άσοι',
	check: function() {
		if (Arena.cpanel.trapeziOxiRithmisi()) return false;
		return Arena.ego.trapezi.trapeziIsAsoi();
	},
	click: function(e) {
		var img;

		img = this.pbuttonIconGetDOM();
		img.working(true);
		Client.fyi.pano('Αλλαγή καθεστώτος πληρωμής άσων. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΑΣΟΙ', 'timi=ΟΧΙ').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'pasoOn',
	omada: 1,
	img: 'pasoOn.png',
	title: 'Να παίζεται το πάσο',
	check: function() {
		if (Arena.cpanel.trapeziOxiRithmisi()) return false;
		return Arena.ego.trapezi.trapeziOxiPaso();
	},
	click: function(e) {
		var img;

		img = this.pbuttonIconGetDOM();
		img.working(true);
		Client.fyi.pano('Αλλαγή καθεστώτος άγονης αγοράς. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΠΑΣΟ', 'timi=ΝΑΙ').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'pasoOff',
	omada: 1,
	img: 'pasoOff.png',
	title: 'Να μην παίζεται το πάσο',
	check: function() {
		if (Arena.cpanel.trapeziOxiRithmisi()) return false;
		return Arena.ego.trapezi.trapeziIsPaso();
	},
	click: function(e) {
		var img;

		img = this.pbuttonIconGetDOM();
		img.working(true);
		Client.fyi.pano('Αλλαγή καθεστώτος άγονης αγοράς. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΠΑΣΟ', 'timi=ΟΧΙ').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
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
		var img;

		img = this.pbuttonIconGetDOM();
		img.working(true);
		Client.fyi.pano(this.pbuttonGetDOM().attr('title') + '. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('apodoxi').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
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
		(Arena.ego.thesiGet() != Arena.ego.trapezi.partidaTzogadorosGet())) return false;

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
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	},
}));
Arena.cpanel.claimButtonDOM = Arena.cpanel.bpanelButtonGet('claim').pbuttonGetDOM();

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'akirosiStart.png',
	title: 'Ακύρωση κινήσεων',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return false;

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
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'akirosiStop.png',
	title: 'Λήξη ακυρώσεων',
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
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'ananeosi',
	omada: 1,
	img: 'bugFix.png',
	title: 'Ανανέωση σκηνικού',
	click: function(e) {
		var img;

		img = this.pbuttonIconGetDOM();
		img.working(true);
		Client.fyi.pano('Γίνεται ενημέρωση του σκηνικού. Παρακαλώ περιμένετε…', 0);
		Arena.skiniko.stisimo(function() {
			Client.fyi.pano();
			img.working(false);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'azab',
	omada: 1,
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
		//Arena.partida.azabRefreshDOM();
		Arena.partida.flags.azab = !Arena.partida.flags.azab;
		if (Arena.partida.flags.azab) Arena.partida.azabDOM.finish().fadeIn(100);
		else Arena.partida.azabDOM.finish().fadeOut(200);
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

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'pektisTheatis',
	omada: 2,
	img: 'matakias.png',
	title: 'Παίκτης/Θεατής',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;

		if (Arena.ego.isPektis()) return true;
		if (!Arena.ego.trapezi.trapeziKeniThesi()) return false;
		return Arena.ego.trapezi.trapeziIsProsklisi(Client.session.pektis);
	},
	click: function(e) {
		var img;

		img = this.pbuttonIconGetDOM();
		img.working(true);
		Client.fyi.pano('Εναλλαγή παίκτη/θεατή. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('pektisTheatis').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
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
			Arena.partida.fila3DOM.css('display', 'none');
			Arena.partida.fila2DOM.css('display', 'none');
		}
		else {
			Arena.partida.flags.fanera23 = true;
			Arena.partida.fila3DOM.css('display', 'block');
			Arena.partida.fila2DOM.css('display', 'block');
		}
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'exodos',
	omada: 2,
	check: function() {
		return Arena.ego.trapezi;
	},
	img: 'exodos.png',
	title: 'Έξοδος από το τραπέζι',
	click: function(e) {
		var img;

		img = this.pbuttonIconGetDOM();
		img.working(true);
		Client.fyi.pano('Δρομολογήσατε την έξοδό σας από το τραπέζι. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('exodosTrapezi').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'kasaPano.png',
	title: 'Αύξηση κάσας',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return false;
		if (Debug.flagGet('rithmisiPanta')) return true;
		return Arena.ego.trapezi.trapeziIsDianomi();
	},
	click: function(e) {
		var img, kasa;

		if (Arena.ego.oxiTrapezi()) return;
		img = this.pbuttonIconGetDOM();
		img.working(true);
		kasa = Arena.ego.trapezi.trapeziKasaGet() + 10;
		Client.fyi.pano('Αύξηση κάσας. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΚΑΣΑ', 'timi=' + kasa, 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 2,
	img: 'kasaKato.png',
	title: 'Μείωση κάσας',
	check: function() {
		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return false;
		if (Debug.flagGet('rithmisiPanta')) return true;
		return Arena.ego.trapezi.trapeziIsDianomi();
	},
	click: function(e) {
		var img, kasa;

		if (Arena.ego.oxiTrapezi()) return;
		img = this.pbuttonIconGetDOM();
		img.working(true);
		kasa = Arena.ego.trapezi.trapeziKasaGet() - 10;
		Client.fyi.pano('Αύξηση κάσας. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΚΑΣΑ', 'timi=' + kasa, 'apodoxi=1').
		done(function(rsp) {
			Client.fyi.pano();
			img.working(false);
		}).
		fail(function(err) {
			Client.skiserFail(err);
			img.working(false);
		});
	},
}));

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
		});
		Client.fyi.kato('Η τσόχα επανατοθετήθηκε σε σταθερή θέση!');
		Arena.partida.flags.amolimeni = 0;
		this.pbuttonPanelGet().bpanelRefresh();
	},
}));
