Arena.anazitisi = {};

Arena.anazitisi.setup = function() {
	Arena.anazitisi.panelDOM = $('<div>').appendTo(Arena.pssDOM);
	Arena.anazitisi.areaDOM = $('<div>').addClass('pss').appendTo(Arena.pssDOM);

	Arena.anazitisi.panel.bpanelRefresh();
	Arena.anazitisi.panelDOM.
	append(Arena.anazitisi.panel.bpanelHorizontal().bpanelSiromeno().bpanelGetDOM());
	Arena.anazitisi.panelSetup();

	Arena.anazitisi.panel.bpanelButtonGet('metakinisi').pbuttonGetDOM().
	on('mouseenter', function(e) {
		$(this).css('cursor', 'move');
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
append($('<input>').addClass('panelInput').on('click', function(e) {
	Arena.inputTrexon = $(this);
	Arena.inputRefocus();
}));

Arena.anazitisi.panel.bpanelButtonPush(new PButton({
	id: 'delete',
	img: 'ikona/misc/Xred.png',
	title: 'Διαγραφή όλων των προσκλήσεων',
	click: function(e) {
	},
}));

Arena.anazitisi.panel.bpanelButtonPush(new PButton({
	id: 'niofertos',
	img: 'niofertos.png',
	click: function(e) {
	},
}));

Arena.anazitisi.panel.bpanelButtonPush(new PButton({
	id: 'theatis',
	img: 'theatis.png',
	click: function(e) {
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
		Arena.anazitisi.panelDOM.css('cursor', 'move');
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
