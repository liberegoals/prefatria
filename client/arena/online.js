Trapezi.prototype.processEnergiaOnlineΣΟΛΟ = function(energia) {
	var soloDom;

	Arena.partida.
	trapeziRefreshDOM().
	enimerosiRefreshDOM().
	tsoxaDOM.append(soloDom = $('<img>').attr({
		id: 'tsoxaSoloEndixi',
		src: Client.server + 'ikona/endixi/solo.png',
	}));

	$(soloDom).fadeIn(300);
	Client.sound.kanonia();
	return this;
};

Trapezi.prototype.processEnergiaOnlineΣΥΜΜΕΤΟΧΗ = function(energia) {
	var pektis;

	Arena.partida.trapeziRefreshDOM();
	if (Arena.ego.oxiPektis()) return this;
	if (Debug.flagGet('epomenosCheck') &&
	this.partidaTzogadorosGet() != Arena.ego.thesiGet()) return this;
	switch (this.partidaFasiGet()) {
	case 'ΠΑΙΧΝΙΔΙ':
		break;
	default:
		return this;
	}

	Arena.cpanel.bpanelRefresh();
	if (energia.energiaDataGet().simetoxiIsMazi()) Client.sound.bikebell();
	return this;
};

Trapezi.prototype.processEnergiaOnlineΦΥΛΛΟ = function(energia) {
	// Ελέγχουμε μήπως μόλις έκλεισε μπάζα και αν με αυτήν την μπάζα
	// κάποιος μπαίνει μέσα, απλά, σόλο, ή τρίσολο, ώστε να ηχήσουν
	// οι ανάλογοι κρότοι.

	this.processEnergiaOnlineFiloKrotos();

	// Αν είμαι θεατής απλώς δείχνω το φύλλο να κινείται προς το κέντρο
	// και εφόσον έκλεισε μπάζα δείχνω και την μπάζα να κινείται προς
	// το μέρος του παίκτη που κερδίζει την μπάζα.

	if (Arena.ego.isTheatis())
	return this.processEnergiaOnlineFiloKinisi(energia);

	// Αν το φύλλο δεν είναι δικό μας, αλλά παίχτηκε από κάποιον άλλον,
	// πάλι δείχνω τις ίδιες κινήσεις.

	if (Arena.ego.thesiGet() != energia.energiaPektisGet()) {
		// Κατά την ανάπτυξη προγραμμάτων παίζω εγώ όλους τους παίκτες.
		// Σ' αυτήν την περίπτωση καθαρίζω την κατάσταση.

		if (!Debug.flagGet('epomenosCheck')) delete Arena.partida.klikFilo;
		return this.processEnergiaOnlineFiloKinisi(energia);
	}

	// Είμαστε στην περίπτωση που παραλαμβάνει την ενέργεια ο παίκτης
	// που έπαιξε το φύλλο. Αν είμαστε ακόμη σε κατάσταση 1 σημαίνει
	// ότι το φύλλο που έπαιξε ο παίκτης ακόμη κινείται προς το κέντρο,
	// οπότε αλλάζω κατάσταση σε 3 και δεν κάνω τίποτε άλλο, καθώς η
	// τρέχουσα κατάσταση και τυχόν κίνηση μπάζας θα εμφανιστεί μόλις
	// περατωθεί η κίνηση του φύλλου προς το κέντρο.

	if (Arena.partida.klikFilo == 1) {
		Arena.partida.klikFilo = 3;
		return this;
	}

	// Παραλαμβάνω την ενέργεια αφού η κίνηση του φύλλου προς το κέντρο
	// έχει περατωθεί. Σ' αυτή την περίπτωση καθαρίζω την κατάσταση και
	// δείχνω πώς έχουν αυτή τη στιγμή τα πράγματα στο τραπέζι και κινώ
	// τυχόν μπάζα προς τον παίκτη που την κερδίζει.
	
	if (Arena.partida.klikFilo == 2) {
		delete Arena.partida.klikFilo;
		Arena.partida.trapeziRefreshDOM();
		Arena.partida.kinisiBaza();
		return this;
	}

	return this;
};

Trapezi.prototype.processEnergiaOnlineFiloKinisi = function(energia) {
	var pektis, filo, filoFom, fila, i, css = {};

	pektis = energia.energiaPektisGet();
	filo = energia.energiaDataGet().string2filo();
	filoDom = null;
	fila = $('.tsoxaXartosiaFilo');
	for (i = 0; i < fila.length; i++) {
		if (filo.filoOxiFilo($(fila[i]).data('filo'))) continue;

		if ($(fila[i]).offset().top) filoDom = $(fila[i]);
		break;
	}

	if (!filoDom) {
		css = {position: 'relative'};
		switch (Arena.ego.thesiMap(pektis)) {
		case 3:
			css.left = '90px';
			css.top = '40px';
			css.width = '60px';
			break;
		case 2:
			css.left = '400px';
			css.top = '40px';
			css.width = '60px';
			break;
		default:
			css.left = '340px';
			css.top = '360px';
			css.width = '80px';
			break;
		}

		filoDom = $('<img>').css(css).attr({
			src: 'ikona/trapoula/' + filo.filoXromaGet() + filo.filoAxiaGet() + '.png',
		}).appendTo(Arena.partida.trapeziDOM);
	}

	Arena.partida.kinisiFilo(pektis, filoDom, function() {
		Arena.partida.trapeziRefreshDOM();
		Arena.partida.kinisiBaza();
	});

	return this;
};

Trapezi.prototype.processEnergiaOnlineFiloKrotos = function() {
	var tzogadoros, protos, defteros;

	// Αν δεν υπάρχει τζογαδόρος σημαίνει ότι στο τραπέζι παίζεται το
	// πάσο και στη συγκεκριμένη διανομή όλοι οι παίκτες δήλωσαν πάσο,
	// οπότε δεν θα παραχθούν κρότοι.

	tzogadoros = this.partidaTzogadorosGet();
	if (!tzogadoros) return this;

	// Ελέγχουμε αν με το φύλλο που παίχτηκε έκλεισε μπάζα.

	if (this.bazaFila.length > 0) return this;

	// Με το φύλλο που παίχτηκε έκλεισε μπάζα. Χρειαζόμαστε
	// δομή στην οποία θα κρατήσουμε τους κρότους ώστε να μην
	// τους επαναλαμβάνουμε.

	if (!this.hasOwnProperty('krotos'))
	this.krotos = {};

	protos = tzogadoros.epomeniThesi();
	defteros = protos.epomeniThesi();

	if (this.sdilosi[protos].simetoxiIsPaso())
	return this.processEnergiaOnlineFiloKrotosEnas(tzogadoros, defteros);

	if (this.sdilosi[defteros].simetoxiIsPaso())
	return this.processEnergiaOnlineFiloKrotosEnas(tzogadoros, protos);

	this.processEnergiaOnlineFiloKrotosOloi(tzogadoros, protos, defteros);
	return this;
};

Trapezi.prototype.processEnergiaOnlineFiloKrotosEnas = function(tzogadoros, aminomenos) {
	var prepiTzogadoros, bazesTzogadoros, prepiAminomenos, bazesAminomenos,
		diathesimes;

	prepiTzogadoros = this.agora.dilosiBazesGet();
	bazesTzogadoros = this.partidaBazesGet(tzogadoros);

	switch (prepiTzogadoros) {
	case 6:
	case 7:
		prepiAminomenos = 2;
		break;
	case 8:
	case 9:
		prepiAminomenos = 1;
		break;
	default:
		prepiAminomenos = 0;
		break;
	}
	bazesAminomenos = this.partidaBazesGet(aminomenos);

	diathesimes = 10 - bazesTzogadoros - bazesAminomenos;

	dif = bazesTzogadoros + diathesimes - prepiTzogadoros;
	if (dif < -3) return this;
	if (dif !== this.krotos[tzogadoros]) {
		this.krotos[tzogadoros] = dif;
		switch (dif) {
		case -3:
			Client.sound.tzamia();
			return this;
		case -2:
			Client.sound.kanonia();
			return this;
		case -1:
			Client.sound.kanonia();
			return this;
		}
	}

	dif = bazesAminomenos + diathesimes - prepiAminomenos;
	if (dif < -3) return this;
	if (dif === this.krotos[aminomenos]) return this;

	this.krotos[aminomenos] = dif;
	switch (dif) {
	case -3:
		Client.sound.tzamia();
		return this;
	case -2:
		Client.sound.machineGun();
		Client.sound.polivolo();
		return this;
	case -1:
		Client.sound.balothia();
		return this;
	}

	return this;
};

Trapezi.prototype.processEnergiaOnlineFiloKrotosOloi = function(tzogadoros, protos, defteros) {
	var prepiTzogadoros, bazesTzogadoros, prepiAmina, bazesAmina,
		diathesimes;

	prepiTzogadoros = this.agora.dilosiBazesGet();
	bazesTzogadoros = this.partidaBazesGet(tzogadoros);

	prepiAmina = 10 - prepiTzogadoros;
	bazesAmina = this.partidaBazesGet(protos) + this.partidaBazesGet(defteros);

	diathesimes = 10 - bazesTzogadoros - bazesAmina;

	dif = bazesTzogadoros + diathesimes - prepiTzogadoros;
	if (dif < -3) return this;
	if (dif !== this.krotos[tzogadoros]) {
		this.krotos[tzogadoros] = dif;
		switch (dif) {
		case -3:
			Client.sound.tzamia();
			return this;
		case -2:
			Client.sound.kanonia();
			return this;
		case -1:
			Client.sound.kanonia();
			return this;
		}
	}

	dif = bazesAmina + diathesimes - prepiAmina;
	if (dif < -4) return this;

	// Επειδή οι κρότοι των αμυνομένων αφορούν και τους δύο
	// αμυνόμενους χρησιμοποιούμε μηδενικό δείκτη.

	if (dif === this.krotos[0]) return this;

	this.krotos[0] = dif;
	switch (dif) {
	case -4:
		Client.sound.tzamia();
		return this;
	case -3:
		Client.sound.machineGun();
		Client.sound.polivolo();
		return this;
	case -2:
	case -1:
		Client.sound.balothia();
		return this;
	}

	return this;
};
