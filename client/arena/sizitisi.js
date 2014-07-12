Arena.sizitisi = {};

Arena.sizitisi.flags = {
	pagomeni: false,
};

Arena.sizitisi.isPagomeni = function() {
	return Arena.sizitisi.pagomeni;
};

Arena.sizitisi.oxiPagomeni = function() {
	return !Arena.sizitisi.isPagomeni();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.sizitisi.setup = function() {
	Arena.sizitisi.panelDOM = $('<div>').appendTo(Arena.pssDOM).css('position', 'relative');
	Arena.sizitisi.tabelaDOM = $('<div>').attr('id', 'sizitisiTabela').appendTo(Arena.sizitisi.panelDOM);
	Arena.sizitisi.areaDOM = $('<div>').addClass('pss').appendTo(Arena.pssDOM);

	Arena.sizitisi.kafenioDOM = $('<div>').addClass('sizitisiArea').appendTo(Arena.sizitisi.areaDOM);
	Arena.sizitisi.trapeziDOM = $('<div>').addClass('sizitisiArea').appendTo(Arena.sizitisi.areaDOM);
	Arena.sizitisi.proepiskopisiDOM = $('<div>').attr('id', 'sizitisiProepiskopisi').appendTo(Arena.sizitisi.areaDOM);

	Arena.sizitisi.panel.bpanelRefresh();
	Arena.sizitisi.panelDOM.
	append(Arena.sizitisi.panel.bpanelHorizontal().bpanelSiromeno().bpanelGetDOM());
	Arena.sizitisi.panelSetup();

	Arena.sizitisi.panel.nottub['metakinisi'].pbuttonGetDOM().
	on('mouseenter', function(e) {
		$(this).css('cursor', 'move');
	});

	Arena.sizitisi.panel.bpanelGetButton('kouskous').pbuttonDexia();
	return Arena;
};

Arena.sizitisi.scrollKato = function() {
	if (Arena.sizitisi.isPagomeni())
	return Arena;

	Arena.sizitisi.areaDOM.scrollKato();
	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.sizitisi.panel = new BPanel();

Arena.anazitisi.panel.clickCommon = function(e) {
	Arena.inputRefocus(e);
};

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'metakinisi',
	img: 'ikona/misc/bara.png',
	title: 'Αυξομείωση περιοχής προσκλήσεων',
}));

Arena.sizitisi.panel.bpanelGetDOM().
append(Arena.inputTrexon = $('<input>').addClass('panelInput').on('click', function(e) {
	Arena.inputTrexon = $(this);
	Arena.inputRefocus();
}));

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'apostoli',
	img: 'talk.png',
	title: 'Υποβολή σχολίου',
	click: function(e) {
	},
}));

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'clear',
	img: 'clear.png',
	title: 'Καθαρισμός πεδίου εισαγωγής σχολίου',
	click: function(e) {
	},
}));

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'delete',
	img: 'ikona/misc/Xred.png',
	title: 'Διαγραφή σχολίου',
	click: function(e) {
	},
}));

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'sigasi',
	img: 'sigasi.png',
	title: 'Σίγαση funchat',
	click: function(e) {
	},
}));

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'pagoma',
	refresh: function() {
		var dom, img;

		dom = this.pbuttonGetDOM();
		img = this.pbuttonIconGetDOM();
		if (Arena.sizitisi.isPagomeni()) {
			Arena.sizitisi.areaDOM.addClass('sizitisiPagomeni');
			dom.attr('title', 'XXX');
			img.attr('src', 'ikona/panel/xepagoma.png');
		}
		else {
			Arena.sizitisi.areaDOM.removeClass('sizitisiPagomeni');
			dom.attr('title', 'YYY');
			img.attr('src', 'ikona/panel/pagoma.png');
		}
	},
	click: function(e) {
		Arena.sizitisi.pagomeni = !Arena.sizitisi.pagomeni;
		this.pbuttonRefresh();
		Arena.sizitisi.scrollKato();
	},
}));

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'kouskous',
	refresh: function() {
		var dom, img;

		dom = this.pbuttonGetDOM();
		img = dom.children('.panelIcon');

		if (Arena.flags.kouskous) {
			img.attr('src', 'ikona/endixi/dealer.png');
			dom.attr('title', 'Παιχνίδι');
		}
		else {
			img.attr('src', 'ikona/panel/kafedaki.png');
			dom.attr('title', 'Κουσκούς');
		}

		return this;
	},
	click: function(e) {
		Arena.flags.kouskous = !Arena.flags.kouskous;
		Arena.viewRefresh();
		this.refresh();
	},
}));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "panelSetup" διαμορφώνει το οριζόντιο panel της συζήτησης του καφενείου.
// Εδώ παρέχεται input πεδίο στο οποίο ο χρήστης γράφει τα σχόλιά του, και εικονίδια/εργαλεία
// που αφορούν σε ενέργειες που αφορούν στη συζήτηση του καφενείου, π.χ. αποστολή σχολίου,
// διαγραφή σχολίου, πάγωμα κειμένου κλπ.

Arena.sizitisi.panelSetup = function() {
	Arena.sizitisi.panelDOM.
	on('mousedown', function(e) {
		var
		y0 = e.pageY,
		prosklisiH = Arena.prosklisi.areaDOM.height();
		anazitisiH = Arena.anazitisi.areaDOM.height();
		sizitisiH = Arena.sizitisi.areaDOM.height();

		e.preventDefault();
		e.stopPropagation();

		Arena.flags.epanadiataxiPss = true;
		Arena.prosklisi.panel.bpanelGetButton('epanadiataxiPss').pbuttonDisplay();
		Arena.sizitisi.panelDOM.css('cursor', 'move');
		Arena.sizitisi.panel.bpanelGetButton('metakinisi').
		pbuttonGetDOM().addClass('panelButtonCandi');
		$(document).off('mousemove mouseup').
		on('mousemove', function(e) {
			var dh, h, pH, aH, sH;

			e.stopPropagation();
			pH = prosklisiH;

			dh = e.pageY - y0;
			if (dh >= 0) {
				h = sizitisiH - dh;
				if (h < 0) h = 0;
				dh = sizitisiH - h;

				aH = anazitisiH + dh;
				sH = sizitisiH - dh;
			}
			else {
				h = anazitisiH + dh;
				if (h < 0) {
					aH = 0;
					sH = sizitisiH + anazitisiH;
					dh += anazitisiH;

					h = prosklisiH + dh;
					if (h < 0) {
						pH = 0;
						sH += prosklisiH;
						dh = prosklisiH;
					}
					else {
						sH -= dh;
						pH += dh;
					}
				}
				else {
					sH = sizitisiH - dh;
					aH = anazitisiH + dh;
				}
			}

			Arena.prosklisi.areaDOM.css('height', pH + 'px');
			Arena.anazitisi.areaDOM.css('height', aH + 'px');
			Arena.sizitisi.areaDOM.css('height', sH + 'px');
		}).
		on('mouseup', function(e) {
			e.stopPropagation();
			Arena.anazitisi.panelDOM.css('cursor', '');
			Arena.sizitisi.panel.bpanelGetButton('metakinisi').
			pbuttonGetDOM().removeClass('panelButtonCandi');
			$(document).off('mousemove mouseoff');
		});
	});

	Arena.sizitisi.panelDOM.find('.panelButton').slice(1).
	add(Arena.sizitisi.panelDOM.find('.panelInput')).
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	});

	return Arena;
}
