Arena.cpanel = new BPanel();
Arena.cpanel.omadaMax = 3;

Arena.cpanel.clickCommon = function(e) {
	Arena.inputRefocus(e);
};

Arena.cpanel.trapeziRithmisi = function() {
	if (Arena.ego.oxiTrapezi()) return false;
	if (Arena.ego.oxiPektis()) return false;
return true;
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
		var dom, img;

		dom = this.pbuttonGetDOM();
		img = dom.children('.panelIcon');

		if (Arena.flags.emoticon) {
			img.attr('src', 'ikona/panel/emoticonOff.png');
			dom.attr('title', 'Απόκρυψη emoticons');
		}
		else {
			img.attr('src', 'ikona/panel/emoticonOn.png');
			dom.attr('title', 'Εμφάνιση emoticons');
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
	id: 'diataxi',
	omada: 1,
	img: 'diataxi.png',
	title: 'Αλλαγή διάταξης παικτών',
	check: function() {
		return Arena.cpanel.trapeziRithmisi();
	},
	click: function(e) {
		Client.skiserService('diataxi').
		done(function(rsp) {
		}).
		fail(function(err) {
			Client.skiserFail(err);
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
return true;
	return Arena.ego.trapezi.trapeziOxiDianomi();
	},
	click: function(e) {
		Client.skiserService('roloi').
		done(function(rsp) {
		}).
		fail(function(err) {
			Client.skiserFail(err);
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
		var kasa;

		if (Arena.ego.oxiTrapezi()) return;
		kasa = Arena.ego.trapezi.trapeziKasaGet() == 50 ? 30 : 50;
		Client.fyi.pano('Αλλαγή κάσας σε ' + kasa + '. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('trparamSet', 'param=ΚΑΣΑ', 'timi=' + kasa).
		done(function(rsp) {
			Client.fyi.pano();
		}).
		fail(function(err) {
			Client.skiserFail(err);
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
		Client.skiserService('trparamSet', 'param=ΑΣΟΙ', 'timi=ΝΑΙ').
		done(function(rsp) {
			Client.fyi.pano();
		}).
		fail(function(err) {
			Client.skiserFail(err);
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
		Client.skiserService('trparamSet', 'param=ΑΣΟΙ', 'timi=ΟΧΙ').
		done(function(rsp) {
			Client.fyi.pano();
		}).
		fail(function(err) {
			Client.skiserFail(err);
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
		Client.skiserService('trparamSet', 'param=ΠΑΣΟ', 'timi=ΝΑΙ').
		done(function(rsp) {
			Client.fyi.pano();
		}).
		fail(function(err) {
			Client.skiserFail(err);
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
		Client.skiserService('trparamSet', 'param=ΠΑΣΟ', 'timi=ΟΧΙ').
		done(function(rsp) {
			Client.fyi.pano();
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: 1,
	check: function() {
		var trapezi;

		if (Arena.ego.oxiTrapezi()) return false;
		if (Arena.ego.oxiPektis()) return false;
		if (Debug.flagGet('apodoxiPanta')) return true;
		return Arena.ego.trapezi.trapeziOxiDianomi();
	},
	refresh: function(img) {
		var dom, img, thesi;

		dom = this.pbuttonGetDOM();
		img = dom.children('.panelIcon');

		if (Arena.ego.oxiTrapezi()) return;
		thesi = Arena.ego.trapezi.trapeziThesiPekti(Client.session.pektis);

		if (Arena.ego.trapezi.trapeziIsApodoxi(thesi)) img.attr({
			src: 'ikona/panel/ixodopa.png',
			title: 'Επαναδιαπραγμάτευση όρων παιχνιδιού',
		});
		else if (Arena.ego.trapezi.trapeziApodoxiCount() === (Prefadoros.thesiMax - 1)) img.attr({
			src: 'ikona/panel/go.jpg',
			title: 'Αποδοχή όρων και εκκίνηση της παρτίδας',
		});
		else img.attr({
			src: 'ikona/panel/apodoxi.png',
			title: 'Αποδοχή όρων παιχνιδιού',
		});
	},
	click: function(e) {
		Client.skiserService('apodoxi').
		done(function(rsp) {
		}).
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
		Client.fyi.pano('Γίνεται ενημέρωση του σκηνικού. Παρακαλώ περιμένετε…');
		Arena.skiniko.stisimo(function() {
			Client.fyi.pano();
		});
	},
}));

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
		Client.fyi.pano('Εναλλαγή παίκτη/θεατή. Παρακαλώ περιμένετε…', 0);
		Client.skiserService('pektisTheatis').
		done(function(rsp) {
			Client.fyi.pano();
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
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
		Client.skiserService('exodosTrapezi').
		fail(function(err) {
			Client.skiserFail(err);
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
return true;
		return Arena.ego.trapezi.trapeziIsDianomi();
	},
	click: function(e) {
		var kasa;

		if (Arena.ego.oxiTrapezi()) return;
		kasa = Arena.ego.trapezi.trapeziKasaGet() + 10;
		Client.skiserService('trparamSet', 'param=ΚΑΣΑ', 'timi=' + kasa, 'apodoxi=1').
		done(function(rsp) {
		}).
		fail(function(err) {
			Client.skiserFail(err);
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
return true;
		return Arena.ego.trapezi.trapeziIsDianomi();
	},
	click: function(e) {
		var kasa;

		if (Arena.ego.oxiTrapezi()) return;
		kasa = Arena.ego.trapezi.trapeziKasaGet() - 10;
		Client.skiserService('trparamSet', 'param=ΚΑΣΑ', 'timi=' + kasa, 'apodoxi=1').
		done(function(rsp) {
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	id: 'diafimisi',
	omada: Arena.cpanel.omadaMax,
	refresh: function() {
		var dom, img;

		dom = this.pbuttonGetDOM();
		img = dom.children('.panelIcon');

		if (Client.diafimisi.emfanis) {
			img.attr('src', 'ikona/panel/adsHide.png');
			dom.attr('title', 'Απόκρυψη διαφημίσεων');
		}
		else {
			img.attr('src', 'ikona/panel/adsShow.png');
			dom.attr('title', 'Εμφάνιση διαφημίσεων');
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
		var dom, img;

		dom = this.pbuttonGetDOM();
		img = dom.children('.panelIcon');

		if (Client.motd.emfanes) {
			img.attr('src', 'ikona/panel/motdHide.png');
			dom.attr('title', 'Απόκρυψη ενημερωτικού μηνύματος');
		}
		else {
			img.attr('src', 'ikona/panel/motdShow.png');
			dom.attr('title', 'Εμφάνιση ενημερωτικού μηνύματος');
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
		var dom, img;

		dom = this.pbuttonGetDOM();
		img = dom.children('.panelIcon');

		if (Arena.flags.viewBoth) {
			img.attr('src', 'ikona/panel/viewSingle.png');
			dom.attr('title', 'Οικονομική άποψη');
		}
		else {
			img.attr('src', 'ikona/panel/viewBoth.png');
			dom.attr('title', 'Πανοραμική άποψη');
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
			this.pbuttonGetDOM().attr('title', 'Αγκύρωση τσόχας');
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/tsoxaKinisi.png');
			break;
		default:
			this.pbuttonGetDOM().attr('title', 'Χειραφεσία τσόχας');
			this.pbuttonIconGetDOM().attr('src', 'ikona/panel/tsoxaDemeni.png');
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
			if (Arena.viewBoth()) Arena.cpanel.bpanelGetButton('view').click();
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
