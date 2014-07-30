Arena.sizitisi = {};

Arena.sizitisi.flags = {
	pagomeni: false,
	molivi: false,
};

Arena.sizitisi.isPagomeni = function() {
	return Arena.sizitisi.pagomeni;
};

Arena.sizitisi.oxiPagomeni = function() {
	return !Arena.sizitisi.isPagomeni();
};

Arena.sizitisi.isMolivi = function() {
	return Arena.sizitisi.flags.molivi;
};

Arena.sizitisi.oxiMolivi = function() {
	return !Arena.sizitisi.isMolivi();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.sizitisi.setup = function() {
	var dom;

	Arena.sizitisi.panelDOM = $('<div>').appendTo(Arena.pssDOM);
	dom = $('<div>').appendTo(Arena.pssDOM).css('position', 'relative');

	Arena.sizitisi.tabelaDOM = $('<div>').attr('id', 'sizitisiTabela').appendTo(dom);
	Arena.sizitisi.areaDOM = $('<div>').addClass('pss').appendTo(dom);

	Arena.sizitisi.kafenioDOM = $('<div>').addClass('sizitisiArea').appendTo(Arena.sizitisi.areaDOM);
	Arena.sizitisi.trapeziDOM = $('<div>').addClass('sizitisiArea').appendTo(Arena.sizitisi.areaDOM);
	Arena.sizitisi.proepiskopisiDOM = $('<div>').attr('id', 'sizitisiProepiskopisi').appendTo(Arena.sizitisi.areaDOM);

	Arena.sizitisi.panel.bpanelRefresh();
	Arena.sizitisi.panelDOM.
	append(Arena.sizitisi.panel.bpanelHorizontal().bpanelSiromeno().bpanelGetDOM());
	Arena.sizitisi.panelSetup();

	Arena.sizitisi.panel.bpanelButtonGet('metakinisi').pbuttonGetDOM().
	on('mouseenter', function(e) {
		$(this).css('cursor', 'move');
	});

	Arena.sizitisi.panel.bpanelButtonGet('kouskous').pbuttonDexia();
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
append(Arena.sizitisi.inputDOM = $('<input>').addClass('panelInput').
on('click', function(e) {
	Arena.inputTrexon = $(this);
	Arena.inputRefocus();
}).
on('keyup', function(e) {
	Arena.sizitisi.keyup(e);
}));
Arena.inputTrexon = Arena.sizitisi.inputDOM;

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'apostoli',
	img: 'talk.png',
	title: 'Υποβολή σχολίου',
	click: function(e) {
		Arena.sizitisi.apostoli();
	},
}));

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'clear',
	img: 'clear.png',
	title: 'Καθαρισμός πεδίου εισαγωγής σχολίου',
	click: function(e) {
		Arena.sizitisi.katharismos();
		Arena.sizitisi.moliviTelos();
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
	id: 'korna',
	img: 'korna.png',
	title: 'Κόρνα',
	click: function(e) {
		if (Arena.ego.isPektis())
		return Client.skiserService('korna');

		Client.fyi.ekato('Μην κορνάρετε, δεν σας ακούει κανείς!');
		Client.sound.play('korna1.ogg');
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
			dom.attr('title', 'Ρολάρισμα κειμένου');
			img.attr('src', 'ikona/panel/xepagoma.png');
		}
		else {
			Arena.sizitisi.areaDOM.removeClass('sizitisiPagomeni');
			dom.attr('title', 'Πάγωμα κειμένου');
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
		Arena.prosklisi.panel.bpanelButtonGet('epanadiataxiPss').pbuttonDisplay();
		Arena.sizitisi.panelDOM.css('cursor', 'move');
		Arena.sizitisi.panel.bpanelButtonGet('metakinisi').
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
			Arena.sizitisi.areaDOM.css({
				display: sH > 1 ? 'block' : 'none',
				height: sH + 'px',
			});
		}).
		on('mouseup', function(e) {
			e.stopPropagation();
			Arena.sizitisi.panelDOM.css('cursor', '');
			Arena.sizitisi.panel.bpanelButtonGet('metakinisi').
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
};

Arena.sizitisi.keyup = function(e) {
	var sxolio;

	if (e) {
		e.stopPropagation();
		switch (e.which) {
		case 13:
			Arena.sizitisi.apostoli();
			return Arena;
		case 27:
			Arena.sizitisi.katharismos();
			return Arena;
		}
	}

	sxolio = Arena.sizitisi.inputDOM.val().trim();
	if (sxolio === '') {
		Arena.sizitisi.katharismos();
		return Arena;
	}

	new Sizitisi({
		pektis: Client.session.pektis,
		sxolio: sxolio,
		pote: Globals.toraServer(),
	}).sizitisiCreateDOM(true);

	if (Arena.sizitisi.oxiMolivi())
	Arena.sizitisi.moliviStart();

	return Arena;
};

Arena.sizitisi.apostoli = function() {
	var sxolio;

	sxolio = Arena.sizitisi.inputDOM.val().trim();
	if (sxolio === '') {
		Arena.sizitisi.katharismos();
		return Arena;
	}

	// Κατά την αποστολή δεν κάνουμε καθαρισμό μολυβιού με την
	// κλασική διαδικασία, καθώς το μολύβι θα «καθαρίσει» όταν
	// θα προστεθεί το σχόλιο της συζήτησης που αποστέλλεται.
	// Απλώς ακυρώνουμε το μολύβι τοπικά, ώστε να μπορεί να
	// επανεκκινήσει όταν ο χρήστης ξεκινήσει νέο σχόλιο.

	Arena.sizitisi.flags.molivi = false;

	Client.skiserService((Arena.partidaMode() && Arena.ego.isTrapezi()) ?
		'sizitisiPartida' : 'sizitisiKafenio', 'sxolio=' + sxolio.uri()).
	done(function(rsp) {
		Arena.sizitisi.inputDOM.val('');
	}).
	fail(function(err) {
		Client.skiserFail(err);
	});

	return Arena;
};

Arena.sizitisi.katharismos = function() {
	Arena.sizitisi.inputDOM.val('');
	Arena.sizitisi.proepiskopisiClearDOM();

	if (Arena.sizitisi.isMolivi())
	Arena.sizitisi.moliviStop();

	return Arena;
};

Arena.sizitisi.proepiskopisiClearDOM = function() {
	Arena.sizitisi.proepiskopisiDOM.empty();
};

Arena.sizitisi.moliviStart = function() {
	Arena.sizitisi.flags.molivi = true;
	Client.skiserService('moliviStart');
};

Arena.sizitisi.moliviStop = function() {
	Client.skiserService('moliviStop');
	Arena.sizitisi.flags.molivi = false;
};

// Στη λίστα "moliviPektis" κρατάμε τα dom elements των σχολίων μολυβιού
// δεικτοδοτημένα με το login name του αντίστοιχου παίκτη.

Arena.sizitisi.moliviPektis = {};

Arena.sizitisi.moliviEnarxi = function(sizitisi, dom) {
	var pektis, molivi;

	pektis = sizitisi.sizitisiPektisGet();

	// Αρχικά διαγράφουμε τυχόν υπάρχον μολύβι για τον συγκεκριμένο
	// παίκτη.

	if (Arena.sizitisi.moliviPektis[pektis])
	Arena.sizitisi.moliviPektis[pektis].remove();

	// Κρατάμε το φρέσκο dom element μολυβιού που μόλις παραλάβαμε
	// και σχηματίζουμε το μολύβι.

	Arena.sizitisi.moliviPektis[pektis] = dom.parents('.sizitisi');
	dom.append($('<div>').addClass('sizitisiMoliviContainer').
	append($('<img>').addClass('sizitisiMolivi').
	attr('src', 'ikona/endixi/grafi.gif')));
};

// Η function "moliviTelos" διαγράφει τυχόν μολύβι για τον παίκτη του οποίου
// το login δίνουμε ως παράμετρο. Αν δεν περάσουμε παίκτη, τότε διαγράφονται
// όλα τα μολύβια.

Arena.sizitisi.moliviTelos = function(pektis) {
	if (pektis === undefined) {
		for (pektis in Arena.sizitisi.moliviPektis) {
			Arena.sizitisi.moliviTelos(pektis);
		}
		return;
	}

	if (Arena.sizitisi.moliviPektis[pektis])
	Arena.sizitisi.moliviPektis[pektis].remove();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sizitisi.zebraPaleta = [
	'#B45F04',
	'#B4045F',
	'#006600',
	'#8A0808',
	'#084B8A',
	'#CD5C5C',
	'#663300',
	'#D52A00',
	'#666699',
];

Sizitisi.zebraIndex = Sizitisi.zebraPaleta.length;

Sizitisi.zebraXroma = {};

Sizitisi.prototype.sizitisiGetDOM = function() {
	return this.DOM;
};

Sizitisi.prototype.sizitisiCreateDOM = function(pro) {
	var pektis, klasi, xroma, dom, sxolioDOM;

	pektis = this.sizitisiPektisGet();
	klasi = 'sizitisiPektis';
	if (pektis.isEgo()) {
		klasi += ' sizitisiPektisEgo';
		xroma = '#144C88';
	}
	else {
		xroma = Sizitisi.zebraXroma[pektis];
		if (!xroma) {
			xroma = Sizitisi.zebraPaleta[Sizitisi.zebraIndex++ % Sizitisi.zebraPaleta.length];
			Sizitisi.zebraXroma[pektis] = xroma;
		}
	}

	dom = pro ? Arena.sizitisi.proepiskopisiDOM.empty() : this.DOM = $('<div>');

	dom.addClass('sizitisi').
	append($('<div>').addClass(klasi).css('color', xroma).text(pektis)).
	append(sxolioDOM = $('<div>').addClass('sizitisiSxolio'));

	this.sizitisiSxolioCreateDOM(sxolioDOM);

	if (pro) {
		Arena.sizitisi.scrollKato(true);
		return this;
	}

	this.DOM.appendTo(this.sizitisiTrapeziGet() ? Arena.sizitisi.trapeziDOM : Arena.sizitisi.kafenioDOM);
	return this;
};

Sizitisi.prototype.sizitisiSxolioCreateDOM = function(dom) {
	var sxolio, tmima, dom, html, i;

	sxolio = this.sizitisiSxolioGet();
	tmima = sxolio.split('^');

	dom.empty();

	switch (tmima[0]) {

	// Αν το πρώτο πεδίο του σχολίου είναι "FP" τότε πρόκειται για τα φύλλα της
	// προηγούμενης διανομής του παίκτη.

	case 'FP':
		sxolio = tmima[1].string2xartosia().xartosiaTaxinomisi().xartosiaDOM();
		dom.append(sxolio);
		return this;

	// Αν το πρώτο πεδίο του σχολίου είναι "MV" τότε πρόκειται για έναρξη
	// μολυβιού.

	case 'MV':
		Arena.sizitisi.moliviEnarxi(this, dom);
		return this;

	// Αν το πρώτο πεδίο του σχολίου είναι "KN" τότε πρόκειται για κόρνα από
	// κάποιον παίκτη του τραπεζιού.

	case 'KN':
		Sizitisi.kornaAppend(dom);
		return this;
	}

	for (i = 0; i < tmima.length; i++) {
		if (tmima[i].match(/^E[0-9]+:[0-9]+$/)) {
			Sizitisi.emoticonAppend(dom, tmima[i]);
			continue;
		}

		if (tmima[i].match(/^http:\/\/youtu\.be\//)) {
			Sizitisi.youtubeAppend(dom, tmima[i]);
			continue;
		}

		if (tmima[i].match(/^https?:\/\/.*\.(png|jpg|gif)[-+]*$/i)) {
			Sizitisi.ikonaAppend(dom, tmima[i]);
			continue;
		}

		if (tmima[i] === '~') {
			dom.append($('<br />'));
			continue;
		}

		sxolio = tmima[i].replace(/</g, '&lt;');
		dom.append(sxolio);
	}

	return this;
};

Sizitisi.kornaAppend = function(dom) {
	var img;

	img = $('<img>').attr('src', 'ikona/panel/korna.png').css('width', '60px');
	dom.append(img);
	img.animate({
		width: '40px',
	}, 1000, 'easeInOutBounce');
	Client.sound.play('korna.ogg');
};

Sizitisi.emoticonAppend = function(dom, s) {
	var tmima, omada, ikona;

	tmima = s.split(':');
	if (tmima.length != 2) return;

	omada = parseInt(tmima[0].replace(/^E/, ''));
	ikona = parseInt(tmima[1]);
	dom.append($('<img>').addClass('sizitisiEmoticon').
	attr('src', 'ikona/emoticon/set' + omada + '/' + Arena.epanel.lefkoma[omada - 1][ikona - 1]));
};

Sizitisi.youtubeAppend = function(dom, s) {
	var iframe;

	dom.
	append($('<img>').addClass('sizitisiYoutube').attr({
		src: 'ikona/external/youtube.jpg',
		title: 'Κλικ για βίντεο',
	}).
	data('video', s.replace(/^http:\/\/youtu\.be/, '')).
	on('click', function(e) {
		Arena.inputRefocus(e);
		$('.sizitisiIframe').empty();
		if ($(this).data('klikarismeno'))
		return $(this).removeData('klikarismeno').attr('title', 'Κλικ για επανεμφάνιση του βίντεο');

		$('.sizitisiYoutube').removeData('klikarismeno');
		$(this).data('klikarismeno', true).attr('title', 'Κλικ για απόκρυψη του βίντεο');
		iframe.html($('<iframe>').attr({
			width: 420,
			height: 315,
			frameborder: 0,
			src: '//www.youtube.com/embed' + $(this).data('video') + '?rel=0',
		}));
	})).
	append(iframe = $('<div>').addClass('sizitisiIframe'));
};

Sizitisi.ikonaAppend = function(dom, s) {
	var sinPlin, img, width;

	sinPlin = [];
	for (i = 0; i < s.length; i++) {
		switch (s.substr(i, 1)) {
		case '+':
			sinPlin.push(2);
			break;
		case '-':
			sinPlin.push(0.5);
			break;
		default:
			sinPlin = [];
			break;
		}
	}

	dom.
	append(img = $('<img>').addClass('sizitisiIkona').attr({
		src: s.replace(/[-+]*$/, ''),
	}));

	if (!sinPlin.length)
	return;

	width = 80;
	for (i = 0; i < sinPlin.length; i++) {
		width *= sinPlin[i];
	}
	img.css('width', width + '%');
};
