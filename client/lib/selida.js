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
	var service, i;

	Client.antiCache++;
	service = Client.skiser + arguments[0] + '?TS=' + Globals.tora() + '&AC=' + Client.antiCache;
	try {
		service += '&PK=' + Client.session.pektis.uri() + '&KL=' + Client.session.klidi.uri();
	} catch (e) {}

	for (i = 1; i < arguments.length; i++) {
		if (typeof arguments[i] === 'string')
		service += '&' + arguments[i];
	}
	return $.ajax(service);
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

Client.fyi.error = function(s, pk) {
	return Client.fyi.print('<span class="kokino">' + s + '</span>', pk);
};

Client.fyi.pano = function(s, dur) {
	return Client.fyi.print(s, $('#fyiPano'), dur);
};

Client.fyi.kato = function(s, dur) {
	return Client.fyi.print(s, $('#fyiKato'), dur);
};

Client.fyi.epano = function(s) {
	return Client.fyi.error(s, $('#fyiPano'));
};

Client.fyi.ekato = function(s) {
	return Client.fyi.error(s, $('#fyiKato'));
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
	return Client.tab($('<a>').attr({href: Client.server}).
	append(Client.sinefo('Έξοδος').
	on('click', function(e) {
		e.stopPropagation();
		Client.exodos();
		return false;
	})), x === undefined ? $('#toolbarRight') : x);
};

Client.tabPektis = function(x) {
	if (x === undefined) x = $('#toolbarRight');
	Client.tab($('<a target="_blank" href="' + Client.server + 'account">' +
		'<span class="sinefo entona">' + Client.session.pektis + '</span>'), x);
};

Client.exodos = function() {
	Client.skiserService('exodos').
	done(function(rsp) {
		$.ajax('account/exodos.php', {async: false});
	}).
	fail(function(rsp) {
		$.ajax('account/exodos.php', {async: false});
	});
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

jQuery.fn.scrollKato = function(anim, callback) {
	var delay;

	delay = (typeof anim === 'number' ? anim : 'fast');
	return this.each(function() {
		try {
			if (anim) $(this).finish().animate({scrollTop: this.scrollHeight}, delay, function() {
				if (callback) callback();
			});
			else this.scrollTop = this.scrollHeight;
		} catch(e) {};
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

		$(this).find("input").on('mousedown', function(e) {
			e.stopPropagation();
		});

		var cursor = obj.css('cursor');
		var opacity = obj.css('opacity');
		var text = $();

		obj.off('click').on('click', function(e) {
			e.stopPropagation();
		}).off('mouseenter').on('mouseenter', function(e) {
			e.stopPropagation();
			obj.css({cursor: 'crosshair'});
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

			obj.find('*').not('marquee').on('scroll', function(e) {
				e.stopPropagation();
				obj.trigger('mouseup');
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
				css.cursor = 'crosshair';
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

	play: function(sound, vol, delay) {
		var entasi, ixos;

		if (!Client.sound.entasi.hasOwnProperty(Client.session.entasi)) Client.session.entasi = 'ΚΑΝΟΝΙΚΗ';
		entasi = Client.sound.entasi[Client.session.entasi];
		if (entasi < 1) return;

		if (vol === undefined) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		else if (vol === null) vol = Client.sound.entasi['ΚΑΝΟΝΙΚΗ'];
		else if (vol <= 0) return;
		else if (vol > Client.sound.entasi['ΔΥΝΑΤΗ']) vol = Client.sound.entasi['ΔΥΝΑΤΗ'];
		if (Client.sound.miosi.hasOwnProperty(sound)) vol *= Client.sound.miosi[sound];

		ixos = $('#ixos');
		$('<audio src="' + Client.server + 'sounds/' + sound + '" />').appendTo(ixos).each(function() {
			var audio = this;
			audio.volume = (entasi / Client.sound.entasi['ΔΥΝΑΤΗ']) * (vol / Client.sound.entasi['ΔΥΝΑΤΗ']);
			setTimeout(function() { audio.play(); }, delay ? delay : 1);
		});

		if (ixos.children().size() > 100) ixos.children(':lt(30)').remove();
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
};

Client.setup2 = function() {
	$('.kounima').kounima();
};

$(document).ready(function() {
	Client.setup1();
	Client.setup2();
$('#fyiPano').text('pano');
$('#fyiKato').text('kato');
$('.fyi').css('visibility', 'visible');
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
