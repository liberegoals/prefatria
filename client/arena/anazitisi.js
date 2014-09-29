Arena.anazitisi = {
	pattern: '',
	katastasi: 'ALL',
	sxetikos: true,
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

Arena.anazitisi.panel.bpanelButtonPush(Arena.anazitisi.anazitisiDOM = new PButton({
	img: 'fakos.png',
	title: 'Αναζήτηση τώρα!',
	click: function(e) {
		Arena.inputRefocus(e);
		Arena.anazitisi.zitaData();
	},
}));

Arena.anazitisi.panel.bpanelButtonPush(new PButton({
	id: 'clear',
	img: 'clear.png',
	title: 'Καθαρισμός πεδίου αναζήτησης',
	click: function(e) {
		Arena.inputRefocus(e);
		Arena.anazitisi.inputDOM.val('');
		Arena.anazitisi.keyup();
	},
}));

Arena.anazitisi.panel.bpanelButtonPush(new PButton({
	id: 'katastasi',
	refresh: function () {
		var dom, xroma, desc;

		switch (Arena.anazitisi.katastasi) {
		case 'ONLINE':
			xroma = 'portokali';
			desc = 'Αναζητούνται online παίκτες';
			break;
		case 'AVAILABLE':
			xroma = 'prasini';
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
			Arena.anazitisi.katastasi = 'AVAILABLE';
			break;
		case 'AVAILABLE':
			Arena.anazitisi.katastasi = 'ALL';
			break;
		default:
			Arena.anazitisi.katastasi = 'ONLINE';
			break;
		}

		this.pbuttonRefresh();
		Arena.anazitisi.schedule();
	},
}));

Arena.anazitisi.panel.bpanelButtonPush(new PButton({
	id: 'sxetikos',
	img: 'sxetikos.png',
	refresh: function () {
		var dom, opacity;

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
		Arena.anazitisi.schedule();
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

Arena.anazitisi.schedule = function() {
	var len, delay;

	if (Arena.anazitisi.timer)
	clearTimeout(Arena.anazitisi.timer);

	len = Arena.anazitisi.pattern.length;
	if (len < 2) delay = 700;
	else if (len < 3) delay = 500;
	else if (len < 4) delay = 400;
	else if (len < 5) delay = 300;
	else delay = 200;

	Arena.anazitisi.timer = setTimeout(function() {
		Arena.anazitisi.zitaData();
	}, delay);

	return Arena;
};

Arena.anazitisi.zitaData = function() {
	var buttonDom;

	if (Arena.anazitisi.timer) {
		clearTimeout(Arena.anazitisi.timer);
		delete Arena.anazitisi.timer;
	}

	buttonDom = Arena.anazitisi.anazitisiDOM.pbuttonIconGetDOM();
	if (buttonDom) buttonDom.working(true);
	Client.fyi.pano('>>' + Arena.anazitisi.pattern +
		'<< >>' + Arena.anazitisi.katastasi + '<< >>' +
		(Arena.anazitisi.sxetikos ? 'ΣΧΕΤΙΖΟΜΕΝΟΙ' : 'ΟΛΟΙ') + '<<');
	setTimeout(function() {
		buttonDom.working(false);
	}, 1000);

	return Arena;
};
