Arena.prosklisi = {};

Arena.prosklisi.setup = function() {
	Arena.prosklisi.panelDOM = $('<div>').appendTo(Arena.pssDOM);
	Arena.prosklisi.areaDOM = $('<div>').addClass('pss').appendTo(Arena.pssDOM);

	Arena.prosklisi.panel.bpanelRefresh();
	Arena.prosklisi.panelDOM.append(Arena.prosklisi.panel.bpanelHorizontal().bpanelGetDOM());
	Arena.prosklisi.panel.bpanelButtonGet('epanadiataxiPss').pbuttonDexia();
	return Arena;
};

Arena.prosklisi.panel = new BPanel();

Arena.prosklisi.panel.clickCommon = function(e) {
	Arena.inputRefocus(e);
};

Arena.prosklisi.panel.bpanelGetDOM().
append($('<div>').addClass('panelKimeno').text('Προσκλήσεις'));

Arena.prosklisi.panel.bpanelButtonPush(new PButton({
	id: 'delete',
	img: 'ikona/misc/Xred.png',
	title: 'Διαγραφή όλων των προσκλήσεων',
	click: function(e) {
	},
}));

Arena.prosklisi.panel.bpanelButtonPush(new PButton({
	id: 'niofertos',
	img: 'niofertos.png',
	refresh: function() {
		if (Arena.partida.niofertosView()) {
			this.pbuttonIconGetDOM().css('opacity', 1);
			this.pbuttonGetDOM().attr('title', 'Απόκρυψη νεοφερμένων');
		}
		else {
			this.pbuttonIconGetDOM().css('opacity', 0.5);
			this.pbuttonGetDOM().attr('title', 'Εμφάνιση νεοφερμένων');
		}
	},
	click: function(e) {
		Arena.partida.flags.niofertosView = !Arena.partida.flags.niofertosView;
		Arena.partida.niofertosDOM.css('visibility', Arena.partida.niofertosView() ? 'visible' : 'hidden');
		this.pbuttonRefresh();
		this.pbuttonIconGetDOM().strofi(Arena.partida.niofertosView() ? -180 : 180);
	},
}));

Arena.prosklisi.panel.bpanelButtonPush(new PButton({
	id: 'theatis',
	img: 'theatis.png',
	refresh: function() {
		if (Arena.theatisView()) {
			this.pbuttonIconGetDOM().css('opacity', 1);
			this.pbuttonGetDOM().attr('title', 'Απόκρυψη θεατών');
		}
		else {
			this.pbuttonIconGetDOM().css('opacity', 0.5);
			this.pbuttonGetDOM().attr('title', 'Εμφάνιση θεατών');
		}
	},
	click: function(e) {
		Arena.flags.theatisView = !Arena.flags.theatisView;
		if (Arena.theatisView()) {
			Arena.partida.theatisDOM.css('visibility', 'visible');
			$('.trapeziTheatis').css('display', 'block');
		}
		else {
			Arena.partida.theatisDOM.css('visibility', 'hidden');
			$('.trapeziTheatis').css('display', 'none');
		}

		this.pbuttonRefresh();
		this.pbuttonIconGetDOM().strofi(Arena.theatisView() ? -180 : 180);
	},
}));

Arena.prosklisi.panel.bpanelButtonPush(new PButton({
	id: 'rebelos',
	img: 'rebelos.png',
	refresh: function() {
		if (Arena.rebelosView()) {
			this.pbuttonIconGetDOM().css('opacity', 1);
			this.pbuttonGetDOM().attr('title', 'Απόκρυψη περιφερόμενων θαμώνων');
		}
		else {
			this.pbuttonIconGetDOM().css('opacity', 0.5);
			this.pbuttonGetDOM().attr('title', 'Εμφάνιση περιφερόμενων θαμώνων');
		}
	},
	click: function(e) {
		Arena.flags.rebelosView = !Arena.flags.rebelosView;
		Arena.rebelosDOM.css('display', Arena.rebelosView() ? 'block' : 'none');
		this.pbuttonRefresh();
		this.pbuttonIconGetDOM().strofi(Arena.rebelosView() ? -180 : 180);
	},
}));

Arena.prosklisi.panel.bpanelButtonPush(Arena.prosklisi.panel.diathesimosButton = new PButton({
	img: 'ikona/panel/diathesimos.png',
	title: 'Φαίνεσται ΑΠΑΣΧΟΛΗΜΕΝΟΣ. Κλικ για αλλαγή κατάστασης σε ΔΙΑΘΕΣΙΜΟΣ',
	check: function() {
		return Arena.ego.isApasxolimenos();
	},
	click: function(e) {
		Arena.cpanel.diathesimosButton.pbuttonGetDOM().trigger('click');
	},
}));

Arena.prosklisi.panel.bpanelButtonPush(Arena.prosklisi.panel.apasxolimenosButton = new PButton({
	img: 'ikona/panel/apasxolimenos.png',
	title: 'Φαίνεσται ΔΙΑΘΕΣΙΜΟΣ. Κλικ για αλλαγή κατάστασης σε ΑΠΑΣΧΟΛΗΜΕΝΟΣ',
	check: function() {
		return Arena.ego.isDiathesimos();
	},
	click: function(e) {
		Arena.cpanel.apasxolimenosButton.pbuttonGetDOM().trigger('click');
	},
}));

Arena.prosklisi.panel.bpanelButtonPush(new PButton({
	img: 'leak.png',
	title: 'Inspect memory leaks',
	check: function() {
		if (Debug.flagGet('developer')) return true;
		return Arena.ego.isDeveloper();
	},
	click: function(e) {
		var count, max;

		count = 0;
		max = 0;
		for (i in $.cache) {
			count++;
			if (parseInt(i) > max)
			max = i;
		}
		Client.fyi.pano('cache count: ' + count + ', max: ' + max);
		console.log($.cache);
	},
}));

Arena.prosklisi.panel.bpanelButtonPush(new PButton({
	id: 'epanadiataxiPss',
	img: 'resize.gif',
	title: 'Επαναδιάταξη περιοχών',
	check: function() {
		return Arena.flags.epanadiataxiPss;
	},
	click: function(e) {
		Arena.epanadiataxiPss();
	},
}));
