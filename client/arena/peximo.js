Arena.partida.bazaRefreshDOM = function(prev) {
	var pios, fila, nikitis, i, iseht, epomenos;

	if (Arena.ego.oxiTrapezi()) {
		$('.tsoxaBazaFilo').remove();
		$('.tsoxaVelosFilo').remove();
		return Arena.partida;
	}

	if (prev === undefined) {
		pios = Arena.ego.trapezi.bazaPios;
		fila = Arena.ego.trapezi.bazaFila;
	}
	else {
		pios = Arena.ego.trapezi.azabPios;
		fila = Arena.ego.trapezi.azabFila;
	}

	epomenos = Arena.ego.trapezi.partidaEpomenosGet();
	nikitis = Arena.ego.trapezi.partidaBazaPios(prev);
	$('.tsoxaBazaFilo').finish().remove();
	$('.tsoxaVelosFilo').remove();
	for (i = 0; i < pios.length; i++) {
		iseht = Arena.ego.thesiMap(pios[i]);
		Arena.partida.tsoxaDOM.
		append($('<img>').addClass('tsoxaBazaFilo').attr({
			id: 'tsoxaBazaFilo' + iseht,
			src: 'ikona/trapoula/' + fila[i].filoXromaGet() + fila[i].filoAxiaGet() + '.png',
		})).
		append($('<img>').addClass('tsoxaVelosFilo').attr({
			id: 'tsoxaVelosFilo' + iseht,
			src: 'ikona/baza/' + (epomenos === pios[i] ? 'pare' : 'dose') + iseht + '.png',
		}).css('opacity', pios[i] == nikitis ? 1.0 : 0.5));
	}

	return Arena.partida;
};

// Στα arrays που ακολουθούν κρατάμε τα στοιχεία της τελευταίας που
// παίχτηκε στην τσόχα μας. Συνήθως η τελευταία μπάζα εμφανίζεται με
// βάση τα σχετικά στοιχεία που υπάρχουν στην παρτίδα, αλλά αυτά
// μηδενίζονται κατά την επαναδιανομή και έτσι δεν μπορούμε να δούμε
// την τελευταία μπάζα της τελευταίας διανομής μετά την επαναδιανομή.

Arena.partida.azabPios = [];
Arena.partida.azabFila = [];

Arena.partida.azabRefreshDOM = function() {
	var pios, fila, torini, i, iseht;

	Arena.partida.azabDOM.empty().
	css('display', Arena.partida.flags.azab ? 'block' : 'none');

	if (Arena.ego.oxiTrapezi()) return Arena.partida;

	// Στο σημείο αυτό ελέγχουμε αν υπάρχουν στοιχεία τελευταίας
	// μπάζας στην παρτίδα. Αν δεν υπάρχουν σημαίνει ότι δεν
	// εμφανίσαμε καμία μπάζα γι' αυτή την παρτίδα, οπότε θα
	// πρέπει να καταφύγουμε σε τυχόν κρατημένη τελευταία μπάζα
	// της τσόχας μας.

	pios = Arena.ego.trapezi.azabPios;
	if (pios.length) {
		fila = Arena.ego.trapezi.azabFila;
		Arena.partida.azabPios = [];
		Arena.partida.azabFila = [];
		torini = true;
	}
	else {
		pios = Arena.partida.azabPios;
		fila = Arena.partida.azabFila;
		torini = false;
	}

	for (i = 0; i < pios.length; i++) {
		if (torini) {
			Arena.partida.azabPios.push(pios[i]);
			Arena.partida.azabFila.push(fila[i]);
		}

		iseht = Arena.ego.thesiMap(pios[i]);
		Arena.partida.azabDOM.
		append($('<img>').addClass('tsoxaAzabFilo').attr({
			id: 'tsoxaAzabFilo' + iseht,
			src: 'ikona/trapoula/' + fila[i].filoXromaGet() + fila[i].filoAxiaGet() + '.png',
		}));
	}

	return Arena.partida;
};

Arena.partida.claimRefreshDOM = function() {
	var filaDom;

	$('#tsoxaClaimXartosia').remove();
	if (Arena.ego.oxiTrapezi()) return Arena.partida;

	switch (Arena.ego.trapezi.partidaFasiGet()) {
	case 'CLAIM':
		break;
	default:
		return Arena.partida;
	}

	filaDom = Arena.ego.trapezi.claimFila.xartosiaDOM(1);
	Arena.partida.tsoxaDOM.append($('<div>').attr('id', 'tsoxaClaimXartosia').
	append($('<div>').attr('id', 'tsoxaClaimMinima').text('Δεν δίνω άλλη μπάζα!')).
	append(filaDom));
	return Arena.partida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.kinisiFilo = function(pektis, filo, callback, delay) {
	var css = {width: '88px'}, tsoxaPos, filoPos, olif;

	switch (Arena.ego.thesiMap(pektis)) {
	case 3:
		css.top = 220;
		css.left = 200;
		break;
	case 2:
		css.top = 200;
		css.left = 260;
		break;
	default:
		css.top = 240;
		css.left = 230;
		break;
	}

	tsoxaPos = Arena.partida.tsoxaDOM.offset();
	filoPos = filo.offset();

	olif = filo.clone().addClass('tsoxaBazaFiloProxiro').appendTo(Arena.partida.tsoxaDOM).css({
		position: 'absolute',
		top: (filoPos.top - tsoxaPos.top - 3) + 'px',
		left: (filoPos.left - tsoxaPos.left - 3) + 'px',
		marginLeft: 0,
		zIndex: 1,
	});

	css.top = css.top + 'px';
	css.left = css.left + 'px';
	
	filo.css('visibility', 'hidden');
	if (delay === undefined) delay = 350;

	olif.
	removeClass('tsoxaXartosiaFiloOmioxromo').
	animate(css, delay, callback);

	return Arena.partida;
};

Arena.partida.kinisiBaza = function() {
	var trapezi, pios, iseht, css = {width: 0}, bazaDom;

	if (Arena.ego.oxiTrapezi()) return Arena.partida;
	if (!Arena.ego.trapezi.bazaFila) return Arena.partida;
	if (Arena.ego.trapezi.bazaFila.length) return Arena.partida;

	pios = Arena.ego.trapezi.partidaBazaPios(true);
	iseht = Arena.ego.thesiMap(pios);
	switch (iseht) {
	case 3:
		css.left = '100px';
		css.top = '140px';
		break;
	case 2:
		css.left = '400px';
		css.top = '140px';
		break;
	default:
		css.left = '130px';
		css.top = '420px';
		break;
	}

	Arena.partida.
	bazaRefreshDOM(true).
	azabRefreshDOM();

	bazaDom = $('#tsoxaPektisBazes' + iseht).find('.tsoxaPektisBazesBaza');
	bazaDom = (iseht === 2 ? bazaDom.first() : bazaDom.last());
	bazaDom.data('src', bazaDom.attr('src')).
	attr('src', 'ikona/endixi/baza.gif');
	$('.tsoxaVelosFilo').delay(400).fadeOut();
	$('.tsoxaBazaFilo').delay(600).animate(css, 350, function() {
		bazaDom.attr('src', bazaDom.data('src'));
	});
	return Arena.partida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.xipnitiriStadioList = [
	{ t: 10000, s: 'kanarini.ogg' },
	{ t: 10000, s: 'clocktickslow.ogg' },
	{ t: 10000, s: 'treno.ogg' },
	{ t: 10000, s: 'kabanaki.ogg' },
	{ t: 10000, s: 'sfirixtra.ogg' },
	{ t: 10000, s: 'korna.ogg' },
	{ t: 10000, s: 'dalika.ogg' },
];

delete Arena.partida.xipnitiriTimer;

Arena.partida.xipnitiriOplismos = function() {
	if (Debug.flagGet('xipnitiriOff'))
	return Arena.partida;

	Arena.partida.
	xipnitiriAfoplismos().
	xipnitiriTimerSet(0);
};

Arena.partida.xipnitiriTimerSet = function(stadio) {
	if (stadio >= Arena.partida.xipnitiriStadioList.length) {
		delete Arena.partida.xipnitiriTimer;
		return Arena.partida;
	}

	Arena.partida.xipnitiriTimer = setTimeout(function() {
		Client.sound.play(Arena.partida.xipnitiriStadioList[stadio].s);
		Arena.partida.xipnitiriTimerSet(stadio + 1);
	}, Arena.partida.xipnitiriStadioList[stadio].t);
	return Arena.partida;
};

Arena.partida.xipnitiriAfoplismos = function() {
	if (!Arena.partida.xipnitiriTimer)
	return Arena.partida;

	clearTimeout(Arena.partida.xipnitiriTimer);
	delete Arena.partida.xipnitiriTimer;
	return Arena.partida;
};
