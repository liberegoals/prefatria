Server = null;
Client = {
	session: {},
	antiCache: 0,
	anadisiIndex: 100,
};

$.ajaxSetup({
	type: 'POST',
});

Client.ajaxService = function() {
	var service, i;

	Client.antiCache++;
	service = Client.server + arguments[0] +
		'?TS=' + Globals.tora() +
		'&AC=' + Client.antiCache;
	for (i = 1; i < arguments.length; i++) service += '&' + arguments[i];
	return $.ajax(service);
};

Client.ajaxFail = function(rsp) {
	var msg = 'Σφάλμα κλήσης ajax';

	if (rsp.hasOwnProperty('responseText') && (rsp.responseText !== '')) msg = rsp.responseText;
	else if (typeof rsp === 'string') msg = rsp;

	Client.fyi.epano(msg);
};

Client.skiserService = function() {
	var service, i, opts;

	Client.antiCache++;
	service = Client.skiser + arguments[0] + '?TS=' + Globals.tora() + '&AC=' + Client.antiCache;
	try {
		service += '&PK=' + Client.session.pektis.uri() + '&KL=' + Client.session.klidi.uri();
	} catch (e) {}

	opts = {};
	for (i = 1; i < arguments.length; i++) {
		if (typeof arguments[i] === 'string')
		service += '&' + arguments[i];

		else
		opts = arguments[i];
	}
	return $.ajax(service, opts);
};

Client.skiserFail = function(rsp) {
	var msg = 'Ο server σκηνικού δεν ανταποκρίνεται';

	if (rsp.hasOwnProperty('responseText') && (rsp.responseText !== '')) msg = rsp.responseText;
	else if (typeof rsp === 'string') msg = rsp;

	Client.fyi.epano(msg);
};

Client.isSession = function(tag) {
	return Client.session.hasOwnProperty(tag);
};

Client.provlima = function(msg, fatal) {
	var provlimaDom;

	if (msg === undefined) msg = 'Απροσδιόριστο σοβαρό σφάλμα';
	provlimaDom = $('<div>').addClass('dialogos provlima').
	append(msg).siromeno({
		top: '60px',
		left: '10px',
	});
	$('#ofelimo').append(provlimaDom);
	if (fatal) throw msg;

	return provlimaDom;
};

// Η function "removeDOM" δέχεται ένα αντικείμενο και διαγράφει τυχόν DOM
// elements στα οποία δείχνουν properties του αντικειμένου.

Client.removeDOM = function(obj) {
	var i, prop;

	for (i in obj) {
		prop = obj[i];

		if (typeof prop !== 'object')
		continue;

		if (prop === null)
		continue;

		if (typeof prop['remove'] !== 'function')
		continue;

		if (!i.match(/DOM$/))
		continue;

		prop['remove']();
		delete prop;
	}
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.fyi = {};

Client.fyi.setup = function() {
	var
	p = $('.fyi'),
	h = p.outerHeight() + 'px';

	p.css({
		maxHeight: h,
		minHeight: h,
		visibility: 'hidden',
	});
};

Client.fyi.print = function(s, pk, dur) {
	var tmp;

	if (s === undefined) s = '';
	else if (typeof s === 'number') s += '';

	if (typeof s === 'string') {
		tmp = $('<span>').html(s.trim())
		if (tmp.text() === '') s = '';
		tmp.remove();
	}
	else s = '';

	pk.finish();
	if (s === '') pk.css({visibility:'hidden'}).empty();
	else {
		pk.css({visibility:'visible'}).html(s).fadeTo(0, 1);
		if (dur === undefined) dur = 5000;
		if (dur) pk.delay(dur).fadeTo(1000, 0);
	}

	return Client;
};

Client.fyi.error = function(s, pk, dur) {
	return Client.fyi.print('<span class="kokino">' + s + '</span>', pk, dur);
};

Client.fyi.pano = function(s, dur) {
	return Client.fyi.print(s, $('#fyiPano'), dur);
};

Client.fyi.kato = function(s, dur) {
	return Client.fyi.print(s, $('#fyiKato'), dur);
};

Client.fyi.epano = function(s, dur) {
	return Client.fyi.error(s, $('#fyiPano'), dur);
};

Client.fyi.ekato = function(s, dur) {
	return Client.fyi.error(s, $('#fyiKato'), dur);
};

Client.fyi.ekatoDexia = function(s, dur) {
	return Client.fyi.error('<div class="dexia">' + s + '</div>', $('#fyiKato'), dur);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.isPektis = function() {
	return Client.session.hasOwnProperty('pektis');
};

Client.oxiPektis = function() {
	return !Client.isPektis();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.sinefo = function(s, x) {
	var t = $('<span>').addClass('sinefo').html(s);
	if (x) x.append(t);
	return t;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.tab = function(p, x) {
	var t = $('<div>').addClass('tab');
	t.append(p);
	if (x) x.append(t);
	return t;
};

Client.tabKlisimo = function(x) {
	return Client.tab($('<a>').attr({href: '#'}).on('click', function(e) {
		self.close();
		return false;
	}).append(Client.sinefo('Κλείσιμο')), x === undefined ? $('#toolbarLeft') : x);

};

Client.tabEpistrofi = function(lektiko, url, x) {
	return Client.tab($('<a>').attr({href: '#'}).on('click', function(e) {
		self.location = url ? url : Client.server;
		return false;
	}).append(Client.sinefo(lektiko === undefined ? 'Επιστροφή' : lektiko)),
	x === undefined ? $('#toolbarLeft') : x);

};

Client.tabArxiki = function(x) {
	return Client.tab($('<a>').attr({href: '#'}).on('click', function(e) {
		self.location = Client.server;
		return false;
	}).append(Client.sinefo('Αρχική')),
	x === undefined ? $('#toolbarLeft') : x);

};

Client.tabEgrafi = function(x) {
	return Client.tab($('<a>').attr({href: Client.server + 'account'}).append(Client.sinefo('Εγγραφή')),
		x === undefined ? $('#toolbarRight') : x);

};

Client.tabIsodos = function(x) {
	return Client.tab($('<a>').attr({href: Client.server + 'isodos'}).append(Client.sinefo('Είσοδος')),
		x === undefined ? $('#toolbarRight') : x);
};

Client.tabExodos = function(x) {
	return Client.tab($('<a>').attr({href: Client.server + 'exodos?url=' + Client.server}).
	append(Client.sinefo('Έξοδος').
	on('click', function(e) {
		e.stopPropagation();
		Client.skiserService('exodos', {async:false});
		return true;
	})), x === undefined ? $('#toolbarRight') : x);
};

Client.tabPektis = function(x) {
	if (x === undefined) x = $('#toolbarRight');
	Client.tab($('<a target="_blank" href="' + Client.server + 'account">' +
		'<span class="sinefo entona">' + Client.session.pektis + '</span>'), x);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.toolbarLeft = function(opts) {
	var tbr = $('#toolbarLeft');
	if (!tbr.length) return;

	if (opts === undefined) opts = {};
	else if (typeof opts == 'string') opts = {odigies:opts};
	if (opts.hasOwnProperty('odigies')) opts.odigies = '#' + opts.odigies;
	else opts.odigies = '';

	Client.tab($('<a>').attr({
		target: '_blank',
		href: Client.server + 'odigies/index.php' + opts.odigies,
	}).append(Client.sinefo('Οδηγίες')), tbr);
};

Client.toolbarRight = function(exodos) {
	var tbr = $('#toolbarRight');
	if (!tbr.length) return;

	if (Client.oxiPektis()) {
		Client.tabEgrafi(tbr);
		Client.tabIsodos(tbr);
		return;
	}

	Client.tabPektis(tbr);
	Client.tabExodos(tbr);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.diafimisi = {};

Client.diafimisi.emfanis = true;

Client.diafimisi.setup = function() {
	var dom;

	dom = $('#diafimisi');
	if (!dom.length) return;

	dom.append(
		Client.klisimo(function() {
			dom.slideUp();
			if (Client.diafimisi.callback) Client.diafimisi.callback();
		})
	);

	if (Client.diafimisi.emfanis) dom.css('display', 'block');
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.motd = {};

Client.motd.emfanes = true;

Client.motd.setup = function() {
	var dom;

	dom = $('#motd');
	if (!dom.length) return;

	dom.append(
		Client.klisimo(function() {
			dom.slideUp();
			if (Client.motd.callback) Client.motd.callback();
		})
	);

	if (Client.motd.emfanes) dom.css('display', 'block');
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Ακολουθούν δομές και functions που αφορούν στην εμφάνιση του φόρτου
// στο site. Τα σχετικά στοιχεία εμφανίζονται σε όλες τις σελίδες στο
// κάτω δεξιά μέρος. Τα στοιχεία περιλαμβάνουν το πλήθος των online
// παικτών, το πλήθος των τραπεζιών και μια εκτίμηση του τρέχοντος
// φόρτου της CPU.

Client.fortos = {
	// Η ανανέωση των στοιχείων φόρτου στο DOM επιχειρείται σε
	// τακτά χρονικά διαστήματα. Η περίοδος ανανέωσης ορίζεται
	// από το property "periodos" σε milliseconds.

	periodos: 30000,
};

Client.fortos.setup = function() {
	Client.fortos.DOM = $('#toolbarFortos');
	if (!Client.fortos.DOM.length) {
		delete Client.fortos.DOM;
		return;
	}

	// Ζητάμε δεδομένα φόρτου από τον skiser και τα εμφανίζουμε
	// στη σχετική περιοχή της σελίδας (κάτω δεξιά).

	Client.fortos.ananeosi();

	// Αφού εμφανίσουμε τα αρχικά δεδομένα φόρτου, φροντίζουμε
	// ώστε σε τακτά χρονικά διαστήματα να παίρνουμε νέα δεδομένα
	// φόρτου.

	Client.fortos.timer = setInterval(function() {
		Client.fortos.ananeosi();
	}, Client.fortos.periodos);
};

Client.fortos.clearTimer = function() {
	if (!Client.fortos.timer) return;
	clearInterval(Client.fortos.timer);
	delete Client.fortos.timer;
};

// Η function "ananeosi" ζητά από τον skiser δεδομένα φόρτου, ήτοι πλήθος
// online παικτών, πλήθος ενεργών τραπεζιών και φόρτο CPU.

Client.fortos.ananeosi = function() {
	if (!Client.fortos.DOM) return;
	Client.skiserService('fortosData').
	done(function(rsp) {
		try {
			eval('var data = {' + rsp + '};');
		} catch (e) {
			if (!Client.fortos.DOM) return;
			Client.fortos.DOM.empty().
			append($('<span>').addClass('plagia kokino').text('Ακαθόριστος φόρτος server σκηνικού'));
			return;
		}

		Client.fortos.display(data);
	}).
	fail(function(err) {
		if (!Client.fortos.DOM) return;
		Client.fortos.DOM.empty().
		append($('<span>').addClass('plagia kokino').text('Ο server σκηνικού δεν ανταποκρίνεται'));
	});
};

// Η function "display" δέχεται τα στοιχεία φόρτου, είτε ως JSON string, είτε
// ως αντικείμενο και τα εμφανίζει στο κάτω δεξιά μέρος της σελίδας. Τα στοιχεία
// φόρτου πρέπει να είναι:
//
//	pektes		Το πλήθος των online παικτών.
//
//	trapezia	Το πλήθος των ενεργών τραπεζιών.
//
//	cpuload		Το ποσοστό χρόνου απασχόλησης της CPU.

Client.fortos.display = function(data) {
	var xromaCPU;

	if (!Client.fortos.DOM)
	return;

	if (data.cpuload > 80) xromaCPU = '#CC0000';
	else if (data.cpuload > 50) xromaCPU = '#8A00B8';
	else if (data.cpuload > 30) xromaCPU = '#003366';
	else xromaCPU = '#006600';

	Client.fortos.DOM.empty().
	append('Online ').
	append($('<span>').addClass('toolbarFortosData').text(data.pektes)).
	append(', Τραπέζια ').
	append($('<span>').addClass('toolbarFortosData').text(data.trapezia)).
	append(', Φόρτος ').
	append($('<span>').addClass('toolbarFortosData').css('color', xromaCPU).text(data.cpuload)).
	append('%');
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.klisimo = function(callback) {
	return $('<img>').addClass('klisimoIcon').attr({
		src: Client.server + 'ikona/misc/klisimo.png',
	}).on('mouseenter', function(e) {
		e.stopPropagation();
		$(this).addClass('klisimoIconEmfanes');
	}).on('mouseleave', function(e) {
		e.stopPropagation();
		$(this).removeClass('klisimoIconEmfanes');
	}).on('click', function(e) {
		e.stopPropagation();
		callback();
	});
}

Client.stopProp = function(e) {
	if (e === false) return;
	if (!e) e = window.event;
	if (!e) return;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

String.prototype.isEgo = function() {
	return(this.valueOf() === Client.session.pektis);
};

String.prototype.oxiEgo = function() {
	return !this.isEgo();

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η jQuery μέθοδος "scrollKato" εφαρμόζεται σε scrollable DOM elements και
// προκαλεί scroll bottom στα συγκεκριμένα elements.

jQuery.fn.scrollKato = function(opts) {
	if (opts === undefined) opts = {};
	return this.each(function() {
		var div = this;

		try {
			if (opts.animation) $(this).finish().animate({
				scrollTop: this.scrollHeight
			}, opts.animation, function() {
				if (opts.callback) opts.callback();
			});

			else
			this.scrollTop = this.scrollHeight;

			if (opts.repeatAfter)
			setTimeout(function() {
				div.scrollTop = div.scrollHeight;
				if (opts.callback) opts.callback();
			}, opts.repeatAfter);
		} catch(e) {}
	});
};

jQuery.fn.scrollSteno = function(w) {
	return this.each(function() {
		if (w === undefined) w = $(this).outerWidth();
		$(this).css('overflowY', w < 20 ? 'hidden' : 'auto');
	});
};

jQuery.fn.kounima = function(n, i) {
	if (n === undefined) n = 10;
	if (i === undefined) i = 0;

	return this.each(function() {
		var obj = $(this);
		if (i > n) return obj.removeClass('kounima0 kounima1');

		obj.addClass('kounima' + (i % 2));
		i++;
		obj.removeClass('kounima' + (i % 2));

		setTimeout(function() {
			obj.kounima(n, i);
		}, 100);
	});
};

jQuery.fn.strofi = function(opts) {
	var prev = 'strofiPrev';

	if (opts === undefined) opts = {
		strofi: 90,
		duration: 200,
	};
	else if (typeof opts === 'number') opts = {
		strofi: parseInt(opts),
		duration: 200,
	};
	else if (isNaN(opts.strofi)) opts.strofi = 90;

	return this.each(function(){
		var elem = $(this), teliki;

		if (isNaN(opts.arxiki)) opts.arxiki = elem.data(prev);
		if (isNaN(opts.arxiki)) opts.arxiki = 0;
		teliki = opts.arxiki + opts.strofi;

		$({gonia: opts.arxiki}).animate({gonia: teliki}, {
			duration: opts.duration,
			easing: opts.easing,
			step: function(now) {
				elem.css('transform', 'rotate(' + now + 'deg)');
			},
			complete: function() {
				elem.data(prev, teliki);
				if (opts.complete) complete(elem);
			},
		});
	});
};

// Η μέθοδος "working" εφαρμόζεται σε εικόνες και τις αντικαθιστά με
// εικόνες εκτέλεσης εργασιών. Είναι χρήσιμη κυρίως κατά το κλικ σε
// εργαλεία όπου αλλάζουμε προσωρινά την εικόνα με εικόνα εκτέλεσης
// εργασιών μέχρι να ολοκληρωθεί η σχετική εργασία.

jQuery.fn.working = function(wrk) {
	var ico = $(this);

	if (wrk === false) return this.each(function() {
		ico.attr('src', ico.data('srcWorking')).removeData('srcWorking');
	});

	if (wrk === undefined) wrk = 'working/default.gif';
	else if (wrk === true) wrk = 'working/gear.png';

	return this.each(function() {
		if (!ico.data('srcWorking')) ico.data('srcWorking', ico.attr('src'));
		ico.attr('src', Client.server + 'ikona/' + wrk);
	});
};

// Η μέθοδος "anadisi" προκαλεί ανάδυση του στοιχείου μέσω αύξησης
// του σχετικού z-index.

jQuery.fn.anadisi = function() {
	return this.each(function() {
		$(this).css({zIndex: Client.anadisiIndex++});
	});
};

// Η μέθοδος "siromeno" δημιουργεί δυνατότητα μετακίνησης στα στοιχεία στα οποία
// εφαρμόζεται. Μπορούμε να περάσουμε ως παράμετρο css object με διάφορα στιλιστικά
// χαρακτηριστικά τα οποία θα εφαρμοστούν στο συρόμενο στοιχείο, π.χ. "top", "left"
// κλπ. Τα συρόμενα στοιχεία πρέπει να είναι absolute position elements και αν δεν
// είναι μετατρέπονται αυτόματα σε τέτοια. Αφαιρείται επίσης αυτόματα το wrap σε
// λευκούς χαρακτήρες, εκτός και αν υπάρχει άλλη σχετική προδιαγραφή στο στοιχείο.
//
// Αν περάσουμε παράμετρο "false" τότε ακυρώνονται οι χειρισμοί μετακίνησης για τα
// στοιχεία της λίστας. Εφαρμόζεται συνήθως σε υποστοιχεία του συρόμενου στοιχείου,
// π.χ. σε links, buttons κλπ. στα οποία θέλουμε να εκτελούμε άλλες εργασίες με το
// pointing device.

jQuery.fn.siromeno = function(css) {
	var doc;

	doc = $(document);
	return this.each(function() {
		var obj = $(this);

		if (css === false) {
			doc.off('mousemove mouseup contextmenu');
			obj.off('click mouseenter mouseleave mousedown');
			return;
		}

		// Θέτουμε κάποια στιλιστικά χαρακτηριστικά του στοιχείου
		// που είναι χρήσιμα στη μετακίνηση.
		obj.addClass('siromeno');
		if (!css) css = {};
		css.position = 'absolute';
		if (!obj.css('whiteSpace')) css.whiteSpace = 'nowrap';
		obj.css(css);

		// Θέτουμε το στοιχείο top/bottom εφόσον δεν υπάρχει.
		var siromeno_t = parseInt(obj.css('top'));
		if (isNaN(siromeno_t)) {
			var siromeno_b = parseInt(obj.css('bottom'));
			if (isNaN(siromeno_b)) obj.css({top: 0});
		}

		// Θέτουμε το στοιχείο left/right εφόσον δεν υπάρχει.
		var siromeno_l = parseInt(obj.css('left'));
		if (isNaN(siromeno_l)) {
			var siromeno_r = parseInt(obj.css('right'));
			if (isNaN(siromeno_r)) obj.css({left: 0});
		}

		$(this).find('input').on('mousedown', function(e) {
			e.stopPropagation();
		});

		var cursor = obj.css('cursor');
		var opacity = obj.css('opacity');
		var text = $();

		obj.off('click').on('click', function(e) {
			e.stopPropagation();
		}).off('mouseenter').on('mouseenter', function(e) {
			e.stopPropagation();
			obj.css({cursor: 'move'});
		}).off('mouseleave').on('mouseleave', function(e) {
			obj.css({cursor: cursor ? cursor : 'auto'});
		}).off('mousedown').on('mousedown', function(e) {
			e.stopPropagation();
			e.preventDefault();

			var siromeno_x = e.pageX;
			var siromeno_y = e.pageY;

			siromeno_t = parseInt(obj.css('top'));
			if (isNaN(siromeno_t)) {
				siromeno_b = parseInt(obj.css('bottom'));
				if (isNaN(siromeno_b)) {
					obj.css({top: 0});
					siromeno_t = 0;
					siromeno_b = null;
				}
				else {
					siromeno_t = null;
				}
			}

			siromeno_l = parseInt(obj.css('left'));
			if (isNaN(siromeno_l)) {
				siromeno_r = parseInt(obj.css('right'));
				if (isNaN(siromeno_r)) {
					obj.css({left: 0});
					siromeno_l = 0;
					siromeno_r = null;
				}
				else {
					siromeno_l = null;
				}
			}

			// Αλλάζουμε τον κέρσορα και προσδίδουμε διαφάνεια
			// στο συρόμενο στοιχείο.
			obj.css({cursor: 'move'}).anadisi();
			if (opacity > 0.9) obj.fadeTo(100, opacity - 0.3);
			else opacity = false;

			// Ο παρακάτω έλεγχος αποσωβεί δυσάρεστη κατάσταση σε γρήγορο mousemove
			// με mouseup πάνω σε input button κλπ.
			if (text.length) text.prop({disabled: false});
			text = $(this).find('input:enabled,textarea:enabled').prop({disabled: true}).off('mousemove');

			var arot = Globals.torams();
			var moving = true;
			var winW = $(window).width();
			var winH = $(window).height();

			obj.find('*').not('marquee').off('scroll').on('scroll', function(e) {
				e.stopPropagation();
				if (moving) doc.trigger('mouseup');
			});

			doc.on('mousemove', function(e) {
				e.stopPropagation();
				e.preventDefault();

				if (!moving) return;

				var tora = Globals.torams();
				if (tora - arot < 40) return;

				if (winW - e.pageX < 10) return;
				if (winH - e.pageY < 10) return;

				var dy = e.pageY; if (dy < 10) dy = 10; dy -= siromeno_y;
				var dx = e.pageX; if (dx < 10) dx = 10; dx -= siromeno_x;

				if (siromeno_t !== null) obj.css({top: (siromeno_t + dy) + 'px'});
				else obj.css({bottom: (siromeno_b - dy) + 'px'});

				if (siromeno_l !== null) obj.css({left: (siromeno_l + dx) + 'px'});
				else obj.css({right: (siromeno_r - dx) + 'px'});
				arot = tora;
			}).on('mouseup', function(e) {
				e.stopPropagation();
				e.preventDefault();

				moving = false;
				doc.off('mousemove mouseup contextmenu');
				text.prop({disabled: false}).off('mousemove');

				var css = {};
				css.cursor = 'move';
				if (opacity !== false) css.opacity = opacity;
				obj.stop().css(css);
			}).on('contextmenu', function(e) {
				e.stopPropagation();
				e.preventDefault();
			});
		});
	});
};

jQuery.fn.emfanesDebug = function() {
	return this.each(function() {
		$(this).css('backgroundColor', 'red');
	});
};

jQuery.fn.screenPosition = function() {
	var pos;

	this.each(function() {
		pos = $(this).offset();

		if (window.hasOwnProperty('screenLeft')) pos.left += window.screenLeft;
		else if (window.hasOwnProperty('screenX')) pos.left += window.screenX;
		else pos.left = 0;

		if (window.hasOwnProperty('screenTop')) pos.top += window.screenTop;
		else if (window.hasOwnProperty('screenY')) pos.top += window.screenY;
		else pos.top = 0;
	});

	return pos;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.session.entasi = 'ΚΑΝΟΝΙΚΗ';

Client.sound = {
	entasi: {
		'ΣΙΩΠΗΛΟ': 0,
		'ΧΑΜΗΛΗ': 3,
		'ΚΑΝΟΝΙΚΗ': 6,
		'ΔΥΝΑΤΗ': 10,
	},

	miosi: {
		'tsalakoma.ogg': 0.4,
	},

	play: function(sound, opts) {
		var entasi, src, jql, dom;

		if (!Client.sound.entasi.hasOwnProperty(Client.session.entasi))
		Client.session.entasi = 'ΚΑΝΟΝΙΚΗ';

		entasi = Client.sound.entasi[Client.session.entasi];
		if (entasi < 1) return null;

		if (opts === undefined)
		opts = null;

		if (opts === null) opts = {
			entasi: Client.sound.entasi['ΚΑΝΟΝΙΚΗ'],
		}
		else if (typeof opts === 'object') {
			opts.entasi = parseInt(opts.entasi);
			opts.delay = parseInt(opts.delay);
		}
		else opts = {
			entasi: parseInt(opts),
		}

		if (isNaN(opts.entasi))
		opts.entasi = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];

		else if (opts.entasi > Client.sound.entasi['ΔΥΝΑΤΗ'])
		opts.entasi = Client.sound.entasi['ΔΥΝΑΤΗ'];

		else if (opts.entasi <= 0)
		return null;

		if (Client.sound.miosi.hasOwnProperty(sound))
		opts.entasi *= Client.sound.miosi[sound];

		src = sound.match(/\//) ? sound : Client.server + 'sounds/' + sound;
		jql = $('<audio src="' + src + '" />').on('ended', function() {
			if (opts.hasOwnProperty('callback'))
			opts.callback();

			$(this).remove();
		});

		dom = jql.get(0);
		dom.volume = (entasi / Client.sound.entasi['ΔΥΝΑΤΗ']) * (opts.entasi / Client.sound.entasi['ΔΥΝΑΤΗ']);

		if (isNaN(opts.delay) || (opts.delay <= 0))
		dom.play();

		else
		setTimeout(function() {
			dom.play();
		}, opts.delay);

		return jql;
	},

	errorLast: 0,

	error: function(sound, vol) {
		Client.sound.play(sound ? sound : 'tilt.ogg', vol);
	},

	tap: function(vol) {
		Client.sound.play('tap.ogg', vol);
	},

	beep: function(vol) {
		Client.sound.play('beep.ogg', vol);
	},

	tilt: function(vol) {
		Client.sound.play('tilt.ogg', vol);
	},

	pop: function(vol) {
		Client.sound.play('pop.ogg', vol);
	},

	bop: function(vol) {
		Client.sound.play('bop.ogg', vol);
	},

	plop: function(vol) {
		Client.sound.play('plop.ogg', vol);
	},

	sfirigma: function(vol) {
		Client.sound.play('sfirigma.ogg', vol);
	},

	psit: function(vol) {
		Client.sound.play('psit.ogg', vol);
	},

	blioup: function(vol) {
		Client.sound.play('blioup.ogg', vol);
	},

	doorbell: function(vol) {
		Client.sound.play('doorbell.ogg', vol);
	},

	bikebell: function(vol) {
		Client.sound.play('bikebell.ogg', vol);
	},

	handbell: function(vol) {
		Client.sound.play('handbell.ogg', vol);
	},

	tik: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('tik.wav', vol);
	},

	trapeziNeo: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('pop.ogg', vol);
	},

	trapeziDel: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('blioup.ogg', vol);
	},

	tic: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('tic.ogg', vol);
	},

	bounce: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('bounce.ogg', vol);
	},

	stickhit: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('stickhit.ogg', vol);
	},

	klak: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('klak.ogg', vol);
	},

	tzamia: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('tzamia.ogg', vol);
	},

	coin: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('coin.ogg', vol);
	},

	bop: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('bop.ogg', vol);
	},

	skisimo: function(vol) {
		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		Client.sound.play('skisimo.ogg', vol);
	},

	kanonia: function() {
		Client.sound.play('kanonia.ogg', Client.sound.entasi['ΔΥΝΑΤΗ']);
	},

	balothia: function() {
		Client.sound.play('balothia.ogg', Client.sound.entasi['ΔΥΝΑΤΗ']);
	},

	machineGun: function() {
		Client.sound.play('machineGun.ogg', Client.sound.entasi['ΔΥΝΑΤΗ']);
	},

	polivolo: function() {
		Client.sound.play('polivolo.ogg', Client.sound.entasi['ΔΥΝΑΤΗ']);
	},

	korna: function() {
		Client.sound.play('korna.ogg', Client.sound.entasi['ΔΥΝΑΤΗ']);
	},

	applause: function() {
		Client.sound.play('applause.ogg', Client.sound.entasi['ΚΑΝΟΝΙΚΗ']);
	},

	hiThere: function() {
		Client.sound.play('hiThere.ogg', Client.sound.entasi['ΚΑΝΟΝΙΚΗ']);
	},
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.setup1 = function() {
	Client.bodyDOM = $(document.body);
	Client.ofelimoDOM = $('#ofelimo');

	if (Client.isPektis() && Client.isSession('paraskinio')) Client.bodyDOM.css({
		backgroundImage: "url('" + Client.server + "ikona/paraskinio/" +
			Client.session.paraskinio + "')",
	});
	else Client.session.paraskinio = 'standard.png';
	Client.fyi.setup();
	Client.diafimisi.setup();
	Client.motd.setup();
	Client.fortos.setup();
};

Client.setup2 = function() {
	$('.kounima').kounima();
};

$(document).ready(function() {
	Client.setup1();
	Client.setup2();

	// Κάθε 5 λεπτά ανανεώνουμε το session, ώστε ακόμη και αν ο παίκτης
	// δεν κάνει καμία ενέργεια, να μην χάνεται το session cookie.

	Client.cookieRecharge = setInterval(function() {
		$.ajax(Client.server + 'lib/session.php').
		done(function() {
			Client.fyi.pano('session recharged');
		}).
		fail(function(rsp) {
			Client.ajaxFail(rsp);
		});
	}, 300000);
});
