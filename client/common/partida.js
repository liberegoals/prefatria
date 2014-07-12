Trapezi.prototype.partidaFilaSet = function(thesi, xartosia) {
	if (arguments.length === 2) this.fila[thesi] = xartosia;
	else this.fila = {};

	return this;
};

Trapezi.prototype.partidaFilaGet = function(thesi) {
	return this.fila[thesi];
};

Trapezi.prototype.partidaTzogosSet = function(xartosia) {
	if (xartosia) this.tzogos = xartosia;
	else delete this.tzogos;
	return this;
};

Trapezi.prototype.partidaTzogosGet = function() {
	return this.tzogos;
};

Trapezi.prototype.partidaBazesSet = function(thesi, bazes) {
	if (thesi === undefined) this.bazes = {};
	else this.bazes[thesi] = (bazes ? bazes : 0);
	return this;
};

Trapezi.prototype.partidaBazesAdd = function(thesi, count) {
	if (count === undefined) count = 1;
	if (isNaN(this.bazes[thesi])) this.bazes[thesi] = count;
	else this.bazes[thesi] += count;
	return this;
};

Trapezi.prototype.partidaBazesGet = function(thesi) {
	return this.bazes.hasOwnProperty(thesi) ? this.bazes[thesi] : 0;
};

Trapezi.prototype.partidaBazaCountSet = function(count) {
	if (count === undefined) count = 0;
	this.bazaCount = count;
	return this;
};

Trapezi.prototype.partidaBazaCountAdd = function(count) {
	if (count === undefined) count = 1;
	this.bazaCount += count;
	return this;
};

Trapezi.prototype.partidaBazaCountGet = function() {
	return this.bazaCount;
};

Trapezi.prototype.partidaIsClaim = function(thesi) {
	if (!this.hasOwnProperty('claim')) return false;
	return this.claim[thesi];
};

Trapezi.prototype.partidaIsMesa = function(poses) {
	var agora, tzogadoros, dif;

	agora = this.partidaAgoraGet();
	if (!agora) return false;

	tzogadoros = this.partidaTzogadorosGet();
	if (!tzogadoros) return false;

	dif = agora.dilosiBazesGet() - this.partidaBazesGet(tzogadoros);

	if (poses === 0) return(dif === 0);

	if (poses === undefined) poses = 1;
	return(dif >= poses);
};

Trapezi.prototype.partidaBazaPios = function(prev) {
	var nikitis, fila, pios, atou, i, filo, pektis, xroma, axia, piosXroma, piosAxia;

	nikitis = null;
	if (prev) {
		fila = this.azabFila;
		pios = this.azabPios;
	}
	else {
		fila = this.bazaFila;
		pios = this.bazaPios;
	}
	if (!fila) return nikitis;

	atou = this.partidaAtouGet();
	for (i = 0; i < fila.length; i++) {
		filo = fila[i];
		pektis = pios[i];
		xroma = filo.filoXromaGet();
		axia = filo.filoAxiaTaxiGet();

		if (!nikitis) {
			nikitis = pektis;
			piosXroma = xroma;
			piosAxia = axia;
			continue;
		}

		if (piosXroma === atou) {
			if (xroma !== atou) continue;
			if (axia < piosAxia) continue;

			nikitis = pektis;
			piosAxia = axia;
			continue;
		}

		if (xroma === atou) {
			nikitis = pektis;
			piosXroma = xroma;
			piosAxia = axia;
			continue;
		}

		if (xroma !== piosXroma) continue;
		if (axia < piosAxia) continue;

		nikitis = pektis;
		piosAxia = axia;
	}

	return nikitis;
};

Trapezi.prototype.partidaIsSolo = function() {
	return this.partidaIsMesa(2);
};

Trapezi.prototype.partidaIsVgike = function() {
	return this.partidaIsMesa(0);
};

Trapezi.prototype.partidaKapikiaSet = function(thesi, kapikia) {
	this.kapikia[thesi] = kapikia;
	return this;
};

Trapezi.prototype.partidaKapikiaAdd = function(thesi, kapikia) {
	this.kapikia[thesi] += kapikia;
	return this;
};

Trapezi.prototype.partidaKapikiaGet = function(thesi) {
	return this.kapikia[thesi];
};

Trapezi.prototype.partidaFasiSet = function(fasi) {
	this.fasi = fasi;
	return this;
};

Trapezi.prototype.partidaFasiGet = function() {
	return this.fasi;
};

Trapezi.prototype.partidaDealerSet = function(thesi) {
	if (thesi) this.dealer = thesi;
	else delete this.dealer;

	return this;
};

Trapezi.prototype.partidaDealerGet = function() {
	return this.dealer;
};

Trapezi.prototype.partidaProtosSet = function(thesi) {
	if (thesi) this.protos = thesi;
	else delete this.protos;

	return this;
};

Trapezi.prototype.partidaProtosGet = function() {
	return this.protos;
};

Trapezi.prototype.partidaEpomenosSet = function(thesi) {
	if (thesi) this.epomenos = thesi;
	else delete this.epomenos;

	return this;
};

Trapezi.prototype.partidaEpomenosGet = function() {
	return this.epomenos;
};

Trapezi.prototype.partidaTzogadorosSet = function(thesi) {
	if (thesi) this.tzogadoros = thesi;
	else delete this.tzogadoros;

	return this;
};

Trapezi.prototype.partidaTzogadorosGet = function() {
	return this.tzogadoros;
};

Trapezi.prototype.partidaAgoraSet = function(agora) {
	if (agora) this.agora = agora;
	else delete this.agora;

	return this;
};

Trapezi.prototype.partidaAgoraGet = function() {
	return this.agora;
};

Trapezi.prototype.partidaOxiAgora = function() {
	return !this.partidaAgoraGet();
};

Trapezi.prototype.partidaAtouGet = function() {
	var agora = this.partidaAgoraGet();
	if (!agora) return null;
	return agora.dilosiXromaGet();
};

Trapezi.prototype.partidaSkartaSet = function(skarta) {
	if (skarta) this.skarta = skarta;
	else delete this.skarta;

	return this;
};

Trapezi.prototype.partidaSkartaGet = function() {
	return this.skarta;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "partidaPliromi" θέτει το ανά χείρας τραπέζι σε φάση πληρωμής και
// ενημερώνει τα στοιχεία πληρωμής της τελευταίας διανομής με βάση τα στοιχεία
// της αγοράς, τους άσους, τις συμμετοχές, τις μπάζες που έχουν γίνει και γενικά
// όλες εκείνες τις παραμέτρους που καθορίζουν τα κέρδη και τις ζημίες μιας αγοράς.

Trapezi.prototype.partidaPliromi = function() {
	var data = {}, asoi;

	this.partidaFasiSet('ΠΛΗΡΩΜΗ');

	data.dianomi = this.trapeziTelefteaDianomi();
	if (!data.dianomi) return this;

	Prefadoros.thesiWalk(function(thesi) {
		data.dianomi.dianomiKasaSet(thesi, 0);
		data.dianomi.dianomiMetritaSet(thesi, 0);
	});

	// Αν δεν έχουμε αγορά αλλά έχουμε περάσει σε φάση πληρωμής, τότε
	// στο τραπέζι παίζει το πάσο.

	data.agora = this.partidaAgoraGet();
	if (!data.agora) return this.partidaPliromiPaso(data);

	data.axia = data.agora.dilosiAxiaAgoras();
	if (!data.axia) return this;

	data.tzogadoros = this.partidaTzogadorosGet();
	data.protos = data.tzogadoros.epomeniThesi();
	data.defteros = data.protos.epomeniThesi();

	data.simetoxi = this.sdilosi;

	// Εξετάζουμε πρώτα την περίπτωση κατά την οποία και οι δύο
	// αμυνόμενοι δήλωσαν πάσο.

	if (data.simetoxi[data.protos].simetoxiIsPaso() && data.simetoxi[data.defteros].simetoxiIsPaso())
	this.partidaPliromiAforologita(data);

	// Κατόπιν εξετάζουμε την περίπτωση που έπαιξαν και οι δύο
	// αμυνόμενοι είτε αυτοβούλως, είτε με προσεταιρισμό.

	else if (data.simetoxi[data.protos].simetoxiOxiPaso() && data.simetoxi[data.defteros].simetoxiOxiPaso())
	this.partidaPliromiOloi(data);

	// Τελευταία εξετάζουμε την περίπτωση να έπαιξε μόνο ένας
	// αμυνόμενος.

	else
	this.partidaPliromiEnas(data);

	// Έχουν συμπληρωθεί τα στοιχεία πληρωμής με βάση τις μπάζες
	// και τις συμμετοχές και πρέπει να εξετάσουμε τους άσους.

	if (data.agora.dilosiOxiAsoi()) return this;

	asoi = (data.agora.dilosiBazesGet() > 6 ? 50 : 25);
	if (this.partidaIsMesa()) asoi = -asoi;

	data.dianomi.dianomiMetritaAdd(data.tzogadoros, 2 * asoi);
	data.dianomi.dianomiMetritaAdd(data.protos, -asoi);
	data.dianomi.dianomiMetritaAdd(data.defteros, -asoi);

	return this;
};

Trapezi.prototype.partidaPliromiAforologita = function(data) {
	this.partidaBazesSet(data.tzogadoros, 10);
	data.dianomi.dianomiKasaAdd(data.tzogadoros, data.axia * 10);
	return this;
};

Trapezi.prototype.partidaPliromiOloi = function(data) {
	var dianomi, agora, axia, tzogadoros, protos, defteros,
		bazesTzogadoros, bazesProtos, bazesDefteros,
		prepiProtos, prepiDefteros, difProtos, difDefteros, poso;

	dianomi = data.dianomi;
	agora = data.agora;
	axia = data.axia;
	tzogadoros = data.tzogadoros;
	protos = data.protos;
	defteros = data.defteros;

	bazesTzogadoros = this.partidaBazesGet(tzogadoros);
	bazesProtos = this.partidaBazesGet(protos);
	bazesDefteros = this.partidaBazesGet(defteros);

	if (data.simetoxi[protos].simetoxiIsMazi()) defteros = protos;
	else if (data.simetoxi[defteros].simetoxiIsMazi()) protos = defteros;

	// Εξετάζουμε πρώτα την περίπτωση να μπήκε μέσα ο τζογαδόρος.

	if (this.partidaIsMesa()) {
		if (this.partidaIsSolo()) axia *= 2;
		dianomi.dianomiKasaAdd(tzogadoros, -axia * 10);
		dianomi.dianomiMetritaAdd(protos, axia * bazesProtos);
		dianomi.dianomiMetritaAdd(defteros, axia * bazesDefteros);
		dianomi.dianomiMetritaAdd(tzogadoros, -axia * (bazesProtos + bazesDefteros));
		return this;
	}

	// Εξετάζουμε, κατόπιν, την περίπτωση να έχει βγει κανονικά η αγορά.

	if (this.partidaIsVgike()) {
		dianomi.dianomiKasaAdd(tzogadoros, axia * bazesTzogadoros);
		dianomi.dianomiKasaAdd(protos, axia * bazesProtos);
		dianomi.dianomiKasaAdd(defteros, axia * bazesDefteros);
		return this;
	}

	// Τελευταία εξετάζουμε την περίπτωση να έχουν μπει μέσα οι αμυνόμενοι.

	switch (agora.dilosiBazesGet()) {
	case 6:
		prepiProtos = 2;
		prepiDefteros = 2;
		break;
	case 7:
		prepiProtos = 2;
		prepiDefteros = 1;
		break;
	case 8:
		prepiProtos = 1;
		prepiDefteros = 1;
		break;
	case 9:
		prepiProtos = 1;
		prepiDefteros = 0;
		break;
	default:
		prepiProtos = 0;
		prepiDefteros = 0;
		break;
	}

	difProtos = prepiProtos - bazesProtos;
	difDefteros = prepiDefteros - bazesDefteros;

	// Εξετάζουμε την περίπτωση να μπήκε μέσα ο πρώτος αμυνόμενος.

	if (difProtos > 0) {
		poso = bazesTzogadoros * axia;
		if (difProtos > 1) poso *= 2;
		dianomi.dianomiMetritaAdd(tzogadoros, poso);
		dianomi.dianomiMetritaAdd(protos, -poso);

		if ((protos != defteros) && (difDefteros <= 0)) {
			poso = bazesDefteros * axia;	// XXX ηθικό το σόλο;
			dianomi.dianomiMetritaAdd(defteros, poso);
			dianomi.dianomiMetritaAdd(protos, -poso);
		}
	}

	// Τώρα εξετάζουμε την περίπτωση να μπήκε μέσα ο δεύτερος αμυνόμενος.

	if (difDefteros > 0) {
		poso = bazesTzogadoros * axia;
		if (difDefteros > 1) poso *= 2;
		dianomi.dianomiMetritaAdd(tzogadoros, poso);
		dianomi.dianomiMetritaAdd(defteros, -poso);

		if ((defteros != protos) && (difProtos <= 0)) {
			poso = bazesProtos * axia;	// XXX ηθικό το σόλο;
			dianomi.dianomiMetritaAdd(protos, poso);
			dianomi.dianomiMetritaAdd(defteros, -poso);
		}
	}

	return this;
};

Trapezi.prototype.partidaPliromiEnas = function(data) {
	var dianomi, agora, axia, tzogadoros, aminomenos, bazesTzogadoros,
		bazesAminomenos, prepi, dif, poso;

	dianomi = data.dianomi;
	agora = data.agora;
	axia = data.axia;
	tzogadoros = data.tzogadoros;
	aminomenos = (data.simetoxi[data.protos].simetoxiOxiPaso() ? data.protos : data.defteros),

	bazesTzogadoros = this.partidaBazesGet(tzogadoros);
	bazesAminomenos = this.partidaBazesGet(aminomenos);

	// Εξετάζουμε πρώτα την περίπτωση να μπήκε μέσα ο τζογαδόρος.

	if (this.partidaIsMesa()) {
		if (this.partidaIsSolo()) axia *= 2;
		dianomi.dianomiKasaAdd(tzogadoros, -axia * 10);
		dianomi.dianomiMetritaAdd(aminomenos, axia * bazesAminomenos);
		dianomi.dianomiMetritaAdd(tzogadoros, -axia * bazesAminomenos);
		return this;
	}

	// Εξετάζουμε, κατόπιν, την περίπτωση να έχει βγει κανονικά η αγορά.

	if (this.partidaIsVgike()) {
		dianomi.dianomiKasaAdd(tzogadoros, axia * bazesTzogadoros);
		dianomi.dianomiKasaAdd(aminomenos, axia * bazesAminomenos);
		return this;
	}

	// Τελευταία εξετάζουμε την περίπτωση να έχουν μπει μέσα οι αμυνόμενοι.

	switch (agora.dilosiBazesGet()) {
	case 6:
		prepi = 2;
		break;
	case 7:
		prepi = 2;
		break;
	case 8:
		prepi = 1;
		break;
	case 9:
		prepi = 1;
		break;
	default:
		prepi = 0;
		break;
	}

	dif = prepi - bazesAminomenos;
	poso = bazesTzogadoros * axia;
	if (dif > 1) poso *= 2;
	dianomi.dianomiMetritaAdd(tzogadoros, poso);
	dianomi.dianomiMetritaAdd(aminomenos, -poso);

	return this;
};

Trapezi.prototype.partidaPliromiPaso = function(data) {
	var min = 10;

	this.
	trapeziThesiWalk(function(thesi) {
		var bazes = this.partidaBazesGet(thesi);
		if (bazes < min) min = bazes;
	}).
	trapeziThesiWalk(function(thesi) {
		data.dianomi.dianomiKasaAdd(thesi, (min - this.partidaBazesGet(thesi)) * 10);
	});
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Με τη μέθοδο "partidaReset" επαναφέρουμε την παρτίδα στο σημείο
// μηδέν, όπου δεν έχει γίνει ακόμη καμία διανομή και καμία ενέργεια.

Trapezi.prototype.partidaReset = function() {
	this.
	partidaProtosSet(1).
	partidaResetKapikia().
	partidaResetAgora().
	partidaResetSimetoxi().
	partidaResetBazes().
	partidaResetClaim().
	partidaResetFila().
	partidaDealerSet().
	partidaEpomenosSet().
	partidaFasiSet('ΣΤΗΣΙΜΟ');

	return this;
};

Trapezi.prototype.partidaResetBazes = function() {
	this.
	partidaBazesSet().
	partidaBazaCountSet().
	partidaResetBaza(true);
	return this;
};

Trapezi.prototype.partidaResetBaza = function(arxiki) {
	var i;

	this.partidaResetPrevBaza();
	if (arxiki === undefined) {
		for (i = 0; i < this.bazaPios.length; i++) this.azabPios.push(this.bazaPios[i]);
		for (i = 0; i < this.bazaFila.length; i++) this.azabFila.push(this.bazaFila[i]);
	}

	this.bazaPios = [];
	this.bazaFila = [];
	return this;
};

Trapezi.prototype.partidaResetPrevBaza = function() {
	this.azabPios = [];
	this.azabFila = [];
	return this;
};

Trapezi.prototype.partidaResetClaim = function() {
	delete this.claim;
	if (Server) return this;

	delete this.claimFila;
	return this;
};

Trapezi.prototype.partidaResetKapikia = function() {
	this.kapikia = {};
	return this;
};

Trapezi.prototype.partidaResetAgora = function() {
	this.acount = 0;			// συνολικό πλήθος δηλώσεων αγοράς
	this.adilosi = {};			// δηλώσεις αγοράς
	delete this.tagrafo;			// παίκτης που δήλωσε "άμα μείνουν"
	this.apaso = {};			// δηλώσεις πάσο στην αγορά
	this.apasoCount = 0;			// συνολικό πλήθος δηλώσεων πάσο στην αγορά
	delete this.alast;			// τελευταία δήλωση αγοράς
	this.anext = new Dilosi('DTG');		// επόμενη δήλωση αγοράς
	this.partidaSkartaSet();		// σκάρτα
	this.sdilosi = {};			// δηλώσεις συμμετοχής

	this.
	partidaTzogadorosSet().			// θέση τζογαδόρου
	partidaAgoraSet();			// αγορά

	return this;
};

Trapezi.prototype.partidaResetSimetoxi = function() {
	this.sdilosi = {};			// δηλώσεις συμμετοχής κάθε παίκτη
	return this;
};

Trapezi.prototype.partidaResetFila = function() {
	this.
	partidaFilaSet().
	partidaTzogadorosSet().
	partidaSkartaSet();

	return this;
};

// Με τη μέθοδο "partidaReplay" κάνουμε replay όλη την παρτίδα διατρέχοντας τις
// διανομές όσον αφορά στα κέρδη και στις ζημίες χωρίς να λαμβάνουμε υπ' όψιν
// τις επιμέρους ενέργειες κάθε διανομής. Τελικά εντοπίζουμε στην τελευταία
// διανομή όπου κάνουμε replay όλες τις ενέργειες προκειμένου να φέρουμε την
// παρτίδα στην τρέχουσα κατάσταση.

Trapezi.prototype.partidaReplay = function() {
	var trapezi = this, kasa, dianomi;

	this.partidaReset();

	// Αρχικά θέτουμε κάθε παίκτη να οφείλει όλο το ποσό της κάσας.

	kasa = this.trapeziKasaGet() * 10;
	this.trapeziThesiWalk(function(thesi) {
		trapezi.partidaKapikiaSet(thesi, -kasa);
	});

	// Δημιουργούμε κάσα με το συνολικό ποσό που έχουν καταθέσει
	// και οι τρεις παίκτες.

	kasa *= 3;

	// Διατρέχουμε όλες τις μέχρι τούδε διανομές που έχουν εξελιχθεί
	// και ενημερώνουμε τα κέρδη και τις ζημίες του κάθε παίκτη με
	// βάση τα ποσά που αναγράφονται στην κάθε διανομή. Παράλληλα
	// κρατάμε κάπου την τελευταία διανομή.

	dianomi = null;	// δείχνει την τελευταία διανομή
	this.trapeziDianomiWalk(function() {
		if ((!dianomi) || (this.dianomiKodikosGet() > dianomi.dianomiKodikosGet())) dianomi = this;
		trapezi.trapeziThesiWalk(function(thesi) {
			// Ελέγχουμε πρώτα τα καπίκια που πήρε ή κατέθεσε ο παίκτης
			// στην κάσα, ενημερώνοντας ανάλογα και το ποσό της κάσας.

			k = dianomi.dianomiKasaGet(thesi);
			kasa -= k;

			// Κατόπιν ελέγχουμε και τυχόν μετρητά από μεταξύ των παικτών
			// συναλλαγές, και ενημερώνουμε το ποσό του παίκτη σε σχέση
			// με το κέρδος ή τη ζημία που είχε στη συγκεκριμένη διανομή.

			k += dianomi.dianomiMetritaGet(thesi);
			trapezi.partidaKapikiaAdd(thesi, k);
		});
	});

	// Διατρέξαμε όλες τις διανομές και πρέπει να μοιράσουμε το υπόλοιπο
	// της κάσας πίσω στους παίκτες. Για να κλείσουμε με μηδενικό ισοζύγιο
	// ενημερώνουμε Ανατολή και Δύση με τα επιστρεφόμενα και «κλείνουμε»
	// τον Νότο με τη διαφορά.

	kasa = Math.floor(kasa / 3);
	this.
	partidaKapikiaAdd(3, kasa).
	partidaKapikiaAdd(2, kasa).
	partidaKapikiaSet(1, -(this.partidaKapikiaGet(3) + this.partidaKapikiaGet(2)));

	// Αν δεν υπάρχουν διανομές στο τραπέζι, τότε έχουμε τελειώσει.

	if (!dianomi) return this;

	// Έχουμε στα χέρια μας την τελευταία διανομή, οπότε κάνουμε replay όλες
	// τις ενέργειες της διανομής ώστε να φέρουμε την παρτίδα στην τρέχουσα
	// κατάσταση.

	this.partidaResetDianomi();
	dianomi.dianomiEnergiaWalk(function() {
		trapezi.trapeziProcessEnergia(this);
	}, 1);

	return this;
};

Trapezi.prototype.trapeziProcessEnergia = function(energia) {
	var proc = 'processEnergia' + energia.energiaIdosGet();
	if (typeof this[proc] === 'function') this[proc](energia);
	return this;
};

Trapezi.prototype.partidaResetDianomi = function() {
	this.
	partidaResetAgora().
	partidaResetSimetoxi().
	partidaResetFila().
	partidaDealerSet(this.partidaProtosGet()).
	partidaProtosSet().
	partidaFasiSet('ΔΙΑΝΟΜΗ').
	partidaEpomenosSet(this.partidaDealerGet());

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.partidaBazaFiloPush = function(pektis, filo) {
	this.bazaPios.push(pektis);
	this.bazaFila.push(filo);
	return this;
};

Trapezi.prototype.partidaBazaPiosGet = function(i) {
	return this.bazaPios[i];
};

Trapezi.prototype.partidaBazaFiloGet = function(i) {
	return this.bazaFila[i];
};

Trapezi.prototype.partidaBazaXromaGet = function() {
	if (this.bazaFila.length <= 0) return null;
	return this.bazaFila[0].filoXromaGet();
};

Trapezi.prototype.partidaBazaXromaCheck = function(filo) {
	var bazaXroma = this.partidaBazaXromaGet();
	if (!bazaXroma) return true;
	return(filo.filoXromaGet() == bazaXroma);
};
