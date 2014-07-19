// Το σκηνικό αποτελείται από:
//
//	Παίκτες		Πρόκειται για λίστα δεικτοδοτημένη με το login name του παίκτη
//			που για κάποιο λόγο πρέπει να τους έχουμε πρόχειρους. Οι λόγοι
//			αυτοί είναι: ο παίκτης είναι online, ο παίκτης παίζει σε κάποιο
//			τραπέζι. Η λίστα των παικτών εκκαθαρίζεται από καιρού εις καιρόν
//			μέσω συγκεκριμένης διαδικασίας περιπόλου.
//
//	Τραπέζια	Πρόκειται για λίστα δεικτοδοτημένη με τον κωδικό τραπεζιού και
//			περιέχει όλα τα ενεργά τραπέζια. Κάθε νέο τραπέζι εντάσσεται στη
//			λίστα των τραπεζιών και αφαιρείται με το κλείσιμο και την
//			αρχειοθέτησή του.
//
//
//	Συνεδρίες	Πρόκειται για λίστα δεικτοδοτημένη με το login name του παίκτη
//			και περιλαμβάνει όλους τους online παίκτες. Η λίστα περιέχει
//			στοιχεία επικοινωνίας του παίκτη με τον server (IP, κλειδί,
//			αίτημα δεδομένων, κανάλι απάντησης κλπ) και τα στοιχεία θέσης
//			του παίκτη (κωδικός τραπεζιού, θέση και τρόπος συμμετοχής στο
//			τραπέζι). Οι συνεδρίες αφαιρούνται από τη λίστα είτε κατά την
//			ρητή έξοδο του παίκτη από το καφενείο, είτε μέσω περιπολικής
//			διαδικασίας εκκαθάρισης που κλείνει συνεδρίες που δείχνουν να
//			είναι αδρανείς για μεγάλο χρονικό διάστημα.
//
//	Συζήτηση	Πρόκειται για λίστα δεικτοδοτημένη με τον κωδικό σχολίου και
//			αφορά στη δημόσια συζήτηση του καφενείου.
//
// Υπάρχει πλήρες σκηνικό στον skiser και υποσύνολα σε κάθε client. Τα σκηνικά των clients
// περιλαμβάνουν εκείνα τα στοιχεία του σκηνικού που αφορούν στον αντίστοιχο παίκτη.

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Pektis = function(props) {
	this.peparam = {};
	this.sxesi = {};
	Globals.initObject(this, props);
};

Pektis.prototype.pektisSkinikoSet = function(skiniko) {
	this.skiniko = skiniko;
	return this;
};

Pektis.prototype.pektisSkinikoGet = function() {
	return this.skiniko;
};

Pektis.prototype.pektisLoginSet = function(login) {
	this.login = login;
	return this;
};

Pektis.prototype.pektisLoginGet = function() {
	return this.login;
};

Pektis.prototype.pektisOnomaSet = function(onoma) {
	this.onoma = onoma;
	return this;
};

Pektis.prototype.pektisOnomaGet = function() {
	return this.onoma;
};

Pektis.prototype.pektisPeparamSet = function(peparam) {
	this.peparam[peparam.peparamParamGet()] = peparam.peparamTimiGet();
	return this;
};

Pektis.prototype.pektisPeparamGet = function(param) {
	return this.peparam[param];
};

Pektis.prototype.pektisAxiomaGet = function() {
	var axioma = this.pektisPeparamGet('ΑΞΙΩΜΑ');
	if (!axioma) axioma = 'ΘΑΜΩΝΑΣ';
	return axioma;
};

Pektis.prototype.pektisAxiomaRankGet = function() {
	var axioma = this.pektisAxiomaGet();
	return(Peparam.axiomaRank.hasOwnProperty(axioma) ? Peparam.axiomaRank[axioma] : 0);
};

Pektis.prototype.pektisIsThamonas = function() {
	return(this.pektisAxiomaRankGet() >= Peparam.axiomaRank['ΘΑΜΩΝΑΣ']);
};

Pektis.prototype.pektisIsVip = function() {
	return(this.pektisAxiomaRankGet() >= Peparam.axiomaRank['VIP']);
};

Pektis.prototype.pektisIsEpoptis = function() {
	return(this.pektisAxiomaRankGet() >= Peparam.axiomaRank['ΕΠΟΠΤΗΣ']);
};

Pektis.prototype.pektisIsDiaxiristis = function() {
	return(this.pektisAxiomaRankGet() >= Peparam.axiomaRank['ΔΙΑΧΕΙΡΙΣΤΗΣ']);
};

Pektis.prototype.pektisPlatiGet = function() {
	var plati = this.pektisPeparamGet('ΠΛΑΤΗ');
	return(plati != 'ΚΟΚΚΙΝΟ' ? 'ΜΠΛΕ' : plati);
};

Pektis.prototype.pektisPlatiRBGet = function() {
	return(this.pektisPlatiGet() == 'ΚΟΚΚΙΝΟ' ? 'R' : 'B');
};

Pektis.prototype.pektisAxiomaRankGet = function() {
	var axioma = this.pektisAxiomaGet();
	return(Peparam.axiomaRank.hasOwnProperty(axioma) ? Peparam.axiomaRank[axioma] : 0);
};

Pektis.prototype.pektisSxesiSet = function(sxetizomenos, sxesi) {
	if (sxesi) this.sxesi[sxetizomenos] = sxesi;
	else this.pektisSxesiSetAsxetos(sxetizomenos);
	return this;
};

Pektis.prototype.pektisSxesiSetFilos = function(sxetizomenos) {
	this.sxesi[sxetizomenos] = 'ΦΙΛΟΣ';
	return this;
};

Pektis.prototype.pektisSxesiSetApoklismenos = function(sxetizomenos) {
	this.sxesi[sxetizomenos] = 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ';
	return this;
};

Pektis.prototype.pektisSxesiSetAsxetos = function(sxetizomenos) {
	delete this.sxesi[sxetizomenos];
	return this;
};

Pektis.prototype.pektisSxesiGet = function(sxetizomenos) {
	return this.sxesi[sxetizomenos];
};

Pektis.prototype.pektisIsFilos = function(sxetizomenos) {
	return(this.pektisSxesiGet(sxetizomenos) === 'ΦΙΛΟΣ');
};

Pektis.prototype.pektisIsApoklismenos = function(sxetizomenos) {
	return(this.pektisSxesiGet(sxetizomenos) === 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ');
};

Pektis.prototype.pektisPeparamWalk = function(callback) {
	Globals.walk(this.peparam, function(param, timi) {
		callback(param, timi);
	});
	return this;
};

Pektis.prototype.pektisSxesiWalk = function(callback) {
	Globals.walk(this.sxesi, function(sxetizomenos, sxesi) {
		callback(sxetizomenos, sxesi);
	});
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Peparam = function(props) {
	Globals.initObject(this, props);
};

Peparam.prototype.peparamPektisGet = function() {
	return this.pektis;
};

Peparam.prototype.peparamParamGet = function() {
	return this.param;
};

Peparam.prototype.peparamTimiGet = function() {
	return this.timi;
};

Peparam.axiomaRank = {
	ΘΑΜΩΝΑΣ:	0,
	VIP:		1,
	ΕΠΟΠΤΗΣ:	2,
	ΔΙΑΧΕΙΡΙΣΤΗΣ:	3,
	ADMINISTRATOR:	4,
	ΠΡΟΕΔΡΟΣ:	5,
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Sxesi = function(props) {
	Globals.initObject(this, props);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Trapezi = function(props) {
	var trapezi = this;

	this.trparam = {
		'ΚΑΣΑ': 50,
	};
	this.simetoxi = {};
	this.telefteos = {};
	this.dianomi = {};
	this.dianomiArray = [];
	this.sizitisi = {};

	Globals.initObject(this, props);
	Globals.walk(this.sizitisi, function(i, sizitisi) {
		trapezi.trapeziSizitisiSet(new Sizitisi(sizitisi));
	});
	this.partidaReset();
};

Trapezi.prototype.trapeziSkinikoSet = function(skiniko) {
	this.skiniko = skiniko;
	return this;
};

Trapezi.prototype.trapeziSkinikoGet = function() {
	return this.skiniko;
};

Trapezi.prototype.trapeziKodikosSet = function(kodikos) {
	this.kodikos = kodikos;
	return this;
};

Trapezi.prototype.trapeziKodikosGet = function() {
	return this.kodikos;
};

Trapezi.prototype.trapeziIsTrapezi = function(trapezi) {
	if (trapezi === undefined) return false;
	if (trapezi === null) return false;
	if (typeof trapezi === 'object') trapezi = trapezi.trapeziKodikosGet();
	return(this.trapeziKodikosGet() == trapezi);
};

Trapezi.prototype.trapeziOxiTrapezi = function(trapezi) {
	return !this.trapeziIsTrapezi(trapezi);
};

Trapezi.prototype.trapeziPektisSet = function(thesi, pektis) {
	var skiniko, sinedria;

	thesi = parseInt(thesi);
	this['pektis' + thesi] = pektis;
	this.trapeziSimetoxiSet(thesi, pektis);
	this.trapeziTelefteosSet(thesi, pektis);

	skiniko = this.trapeziSkinikoGet();
	if (!skiniko) return this;

	sinedria = skiniko.skinikoSinedriaGet(pektis);
	if (!sinedria) return this;

	if (sinedria.sinedriaTrapeziGet() !== this.trapeziKodikosGet()) return this;

	sinedria.sinedriaThesiSet(thesi);
	return this;
};

Trapezi.prototype.trapeziPektisGet = function(thesi) {
	return this['pektis' + thesi];
};

Trapezi.prototype.trapeziApodoxiSet = function(thesi, naiOxi) {
	if (naiOxi === undefined) naiOxi = true;
	this['apodoxi' + thesi] = naiOxi ? 'ΝΑΙ' : 'ΟΧΙ';
	return this;
};

Trapezi.prototype.trapeziApodoxiGet = function(thesi) {
	var idx = 'apodoxi' + thesi;

	if (!this.hasOwnProperty(idx)) return 'ΟΧΙ';
	return this[idx];
};

Trapezi.prototype.trapeziIsApodoxi = function(thesi) {
	return this.trapeziApodoxiGet(thesi).isNai();
};

Trapezi.prototype.trapeziOxiApodoxi = function(thesi) {
	return !this.trapeziIsApodoxi(thesi);
};

Trapezi.prototype.trapeziApodoxiCount = function() {
	var thesi, cnt = 0;

	for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) {
		if (this.trapeziIsApodoxi(thesi)) cnt++;
	}

	return cnt;
};

Trapezi.prototype.trapeziPollSet = function(ts) {
	if (ts === undefined) ts = Globals.toraServer();
	this.poll = ts;
	return this;
};

Trapezi.prototype.trapeziPollGet = function() {
	return this.poll;
};

Trapezi.prototype.trapeziSizitisiSet = function(sizitisi) {
	this.sizitisi[sizitisi.sizitisiKodikosGet()] = sizitisi;
	return this;
};

Trapezi.prototype.trapeziSizitisiGet = function(kodikos) {
	return this.sizitisi[kodikos];
};

Trapezi.prototype.trapeziSizitisiDelete = function(kodikos) {
	delete this.sizitisi[kodikos];
	return this;
};

// Η μέθοδος "trapeziSizitisiLast" επιστρέφει τον κωδικό του τελευταίου
// σχολίου συζήτησης για το ανά χείρας τραπέζι.

Trapezi.prototype.trapeziSizitisiLast = function() {
	var last = 0;

	this.trapeziSizitisiWalk(function() {
		var kodikos = this.sizitisiKodikosGet();
		if (kodikos > last) last = kodikos;
	});

	return last;
};

Trapezi.prototype.trapeziIpolipoGet = function() {
	var ipolipo;

	ipolipo = this.trapeziKasaGet() * 30;
	this.trapeziDianomiWalk(function() {
		ipolipo -= this.dianomiKasaGet(1);
		ipolipo -= this.dianomiKasaGet(2);
		ipolipo -= this.dianomiKasaGet(3);
	});

	return ipolipo;
};

Trapezi.prototype.trapeziSimetoxiSet = function() {
	var thesi, pektis;

	switch (arguments.length) {
	case 1:
		thesi = arguments[0].simetoxiThesiGet();
		pektis = arguments[0].simetoxiPektisGet();
		break;
	case 2:
		thesi = arguments[0];
		pektis = arguments[1];
		break;
	default:
		return this;
	}
		
	if (!pektis) return this;
	thesi = Prefadoros.isThesi(thesi);
	if (!thesi) return this;

	this.simetoxi[pektis] = thesi;
	return this;
};

Trapezi.prototype.trapeziSimetoxiGet = function(pektis) {
	var thesi = this.simetoxi[pektis];
	return thesi ? thesi : 1;
};

// Με τη μέθοδο "trapeziTelefteosSet" συσχετίζουμε θέση του τραπεζιού με τον
// παίκτη που κάθισε τελευταίος σ' αυτή τη θέση.

Trapezi.prototype.trapeziTelefteosSet = function() {
	var thesi, pektis;

	switch (arguments.length) {
	case 1:
		thesi = arguments[0].telefteosThesiGet();
		pektis = arguments[0].telefteosPektisGet();
		break;
	case 2:
		thesi = arguments[0];
		pektis = arguments[1];
		break;
	default:
		return this;
	}

	if (!pektis) return this;

	// Πρέπει να μεριμνήσουμε ώστε να μην φαίνεται ο ίδιος παίκτης σε
	// περισσότερες από μια θέσεις του τραπεζιού.

	this.trapeziThesiWalk(function(thesi) {
		if (this.trapeziTelefteosGet(thesi) == pektis)
		delete this.telefteos[thesi];
	});

	this.telefteos[thesi] = pektis;
	return this;
};

Trapezi.prototype.trapeziTelefteosGet = function(thesi) {
	return this.telefteos[thesi];
};

Trapezi.prototype.trapeziIsKeniThesi = function(thesi) {
	return !this.trapeziPektisGet(thesi);
};

Trapezi.prototype.trapeziOxiKeniThesi = function(thesi) {
	return !this.trapeziIsKeniThesi(thesi);
};

Trapezi.prototype.trapeziKeniThesi = function() {
	var thesi;

	for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) {
		if (this.trapeziIsKeniThesi(thesi)) return thesi;
	}

	return undefined;
};

Trapezi.prototype.trapeziThesiPekti = function(pektis) {
	var thesi;

	for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) {
		if (this.trapeziPektisGet(thesi) === pektis) return thesi;
	}

	return undefined;
};

Trapezi.prototype.trapeziIsPektis = function(pektis) {
	return this.trapeziThesiPekti(pektis);
};

Trapezi.prototype.trapeziOxiPektis = function(pektis) {
	return !this.trapeziThesiPekti(pektis);
};

Trapezi.prototype.trapeziDianomiSet = function(dianomi) {
	this.dianomi[dianomi.dianomiKodikosGet()] = dianomi;
	return this;
};

// Η μέθοδος "trapeziDianomiGet" δέχεται ως παράμετρο έναν κωδικό διανομής
// και επιστρέφει την εν λόγω διανομή από το τραπέζι.

Trapezi.prototype.trapeziDianomiGet = function(kodikos) {
	return this.dianomi[kodikos];
};

// Η μέθοδος "trapeziIsDianomi" επιστρέφει κάποιον κωδικό διανομής εφόσον
// υπάρχουν διανομές στο τραπέζι, αλλιώς επιστρέφει null.

Trapezi.prototype.trapeziIsDianomi = function() {
	var i;
	for (i in this.dianomi) return i;
	return null;
};

// Η μέθοδος "trapeziOxiDianomi" επιστρέφει true εφόσον ΔΕΝ υπάρχουν διανομές
// στο τραπέζι, αλλιώς επιστρέφει false.

Trapezi.prototype.trapeziOxiDianomi = function() {
	return !this.trapeziIsDianomi();
};

// Η μέθοδος "telefteaDianomi" επιστρέφει την τελευταία διανομή του τραπεζιού.

Trapezi.prototype.trapeziTelefteaDianomi = function() {
	return this.dianomiArray[this.dianomiArray.length - 1];
};

// Η μέθοδος "trapeziThesiWalk" διατρέχει με τη σειρά τις θέσεις του τραπεζιού
// και για κάθε θέση καλεί callback function ως μέθοδο του τραπεζιού με παράμετρο
// τον αριθμό θέσης.

Trapezi.prototype.trapeziThesiWalk = function(callback) {
	var trapezi = this;

	Prefadoros.thesiWalk(function(thesi) {
		callback.call(trapezi, thesi);
	});

	return this;
};

// Η μέθοδος "trapeziDianomiWalk" διατρέχει τις διανομές του τραπεζιού και για κάθε
// διανομή καλεί callback function ως μέθοδο της διανομής.
//
// Αν δεν υφίσταται παράμετρος "dir" οι επισκέψεις γίνονται με τυχαία σειρά. Αν η
// παράμετρος είναι 1 οι επισκέψεις γίνονται με αύξουσα σειρά, ενώ αν είναι -1 με
// φθίνουσα.

Trapezi.prototype.trapeziDianomiWalk = function(callback, dir) {
	var i;

	if (dir > 0) {
		for (i = 0; i < this.dianomiArray.length; i++) {
			callback.call(this.dianomiArray[i]);
		}
	}
	else if (dir < 0) {
		for (i = this.dianomiArray.length - 1; i >= 0; i--) {
			callback.call(this.dianomiArray[i]);
		}
	}
	else {
		for (i in this.dianomi) {
			callback.call(this.dianomi[i]);
		}
	}

	return this;
};

// Η μέθοδος "trapeziIsProsklisi" δέχεται ένα login name και ελέγχει αν υπάρχει
// πρόσκληση γι' αυτόν τον παίκτη από το ανά χείρας τραπέζι.

Trapezi.prototype.trapeziIsProsklisi = function(login) {
	var skiniko, trapeziKodikos, i, prosklisi;

	skiniko = this.trapeziSkinikoGet();
	if (!skiniko) return false;

	trapeziKodikos = this.trapeziKodikosGet();
	for (i in skiniko.prosklisi) {
		prosklisi = skiniko.skinikoProsklisiGet(i);
		if (!prosklisi) continue;
		if (prosklisi.prosklisiTrapeziGet() !== trapeziKodikos) continue;
		if (prosklisi.prosklisiProsGet() !== login) continue;
		return true;
	}

	return false;
};

Trapezi.prototype.trapeziOxiProsklisi = function(login) {
	return !this.trapeziIsProsklisi(login);
};

Trapezi.prototype.trapeziTrparamSet = function(trparam) {
	this.trparam[trparam.trparamParamGet()] = trparam.trparamTimiGet();
	return this;
};

Trapezi.prototype.trapeziTrparamGet = function(param) {
	return this.trparam[param];
};

Trapezi.prototype.trapeziKasaGet = function() {
	return parseInt(this.trapeziTrparamGet('ΚΑΣΑ'));
};

Trapezi.prototype.trapeziIsPaso = function() {
	var paso;

	paso = this.trapeziTrparamGet('ΠΑΣΟ');
	if (typeof paso !== 'string') return false;
	return paso.isNai();
};

Trapezi.prototype.trapeziOxiPaso = function() {
	return !this.trapeziIsPaso();
};

Trapezi.prototype.trapeziIsAsoi = function() {
	var asoi;

	asoi = this.trapeziTrparamGet('ΑΣΟΙ');
	if (typeof asoi !== 'string') return true;
	return asoi.isNai();
};

Trapezi.prototype.trapeziOxiAsoi = function() {
	return !this.trapeziIsAsoi();
};

Trapezi.prototype.trapeziSizitisiWalk = function(callback, dir) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.sizitisi, function(kodikos, sizitisi) {
			callback.call(sizitisi);
		});

		return this;
	}

	Globals.walk(this.sizitisi, function(kodikos, sizitisi) {
		keys.push(sizitisi);
	});

	keys.sort(function(a, b) {
		if (a.kodikos < b.kodikos) return (-1) * dir;
		if (a.kodikos > b.kodikos) return 1 * dir;
		return 0;
	});

	Globals.awalk(keys, function(i, sizitisi) {
		callback.call(sizitisi);
	});

	return this;
};

Trapezi.prototype.trapeziAkirosiSet = function(login) {
	if (login) this.akirosi = login;
	else delete this.akirosi;
	return this;
};

Trapezi.prototype.trapeziAkirosiGet = function() {
	return this.akirosi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Trparam = function(props) {
	Globals.initObject(this, props);
};

Trparam.prototype.trparamTrapeziGet = function() {
	return this.trapezi;
};

Trparam.prototype.trparamParamGet = function() {
	return this.param;
};

Trparam.prototype.trparamTimiGet = function() {
	return this.timi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Simetoxi = function(props) {
	Globals.initObject(this, props);
};

Simetoxi.prototype.simetoxiTrapeziGet = function() {
	return this.trapezi;
}

Simetoxi.prototype.simetoxiPektisGet = function() {
	return this.pektis;
}

Simetoxi.prototype.simetoxiThesiGet = function() {
	return this.thesi;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Telefteos = function(props) {
	Globals.initObject(this, props);
};

Telefteos.prototype.telefteosTrapeziGet = function() {
	return this.trapezi;
}

Telefteos.prototype.telefteosThesiGet = function() {
	return this.thesi;
}

Telefteos.prototype.telefteosPektisGet = function() {
	return this.pektis;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Dianomi = function(props) {
	var thesi, prop;

	this.energia = {};
	this.energiaArray = [];
	Globals.initObject(this, props);

	if (isNaN(this.kodikos)) delete this.kodikos;
	else this.kodikos = parseInt(this.kodikos);

	for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) {
		prop = 'kasa' + thesi;
		this[prop] = isNaN(this[prop]) ? 0 : parseInt(this[prop]);

		prop = 'metrita' + thesi;
		this[prop] = isNaN(this[prop]) ? 0 : parseInt(this[prop]);
	}
};

Dianomi.prototype.dianomiKodikosGet = function() {
	return this.kodikos;
};

Dianomi.prototype.dianomiTrapeziGet = function() {
	return this.trapezi;
};

Dianomi.prototype.dianomiEnarxiGet = function() {
	return this.enarxi;
};

Dianomi.prototype.dianomiDealerGet = function() {
	return this.dealer;
};

Dianomi.prototype.dianomiKasaSet = function(thesi, kapikia) {
	this['kasa' + thesi] = kapikia;
	return this;
};

Dianomi.prototype.dianomiKasaAdd = function(thesi, kapikia) {
	this['kasa' + thesi] += kapikia;
	return this;
};

Dianomi.prototype.dianomiKasaGet = function(thesi) {
	return this['kasa' + thesi];
};

Dianomi.prototype.dianomiMetritaSet = function(thesi, kapikia) {
	this['metrita' + thesi] = kapikia;
	return this;
};

Dianomi.prototype.dianomiMetritaAdd = function(thesi, kapikia) {
	this['metrita' + thesi] += kapikia;
	return this;
};

Dianomi.prototype.dianomiMetritaGet = function(thesi) {
	return this['metrita' + thesi];
};

Dianomi.prototype.dianomiTelosGet = function() {
	return this.telos;
};

Dianomi.prototype.dianomiEnergiaSet = function(energia) {
	this.energia[energia.energiaKodikosGet()] = energia;
	return this;
};

Dianomi.prototype.dianomiEnergiaGet = function(kodikos) {
	return this.energia[kodikos];
};

Dianomi.prototype.dianomiEnergiaDelete = function(kodikos) {
	delete this.energia[kodikos];
	return this;
};

// Η μέθοδος "dianomiEnergiaWalk" διατρέχει τις διανομές του τραπεζιού και για κάθε
// ενέργεια καλεί callback function ως μέθοδο της ενέργειας.
//
// Αν δεν υφίσταται παράμετρος "dir" οι επισκέψεις γίνονται με τυχαία σειρά. Αν η
// παράμετρος είναι 1 οι επισκέψεις γίνονται με αύξουσα σειρά, ενώ αν είναι -1 με
// φθίνουσα.

Dianomi.prototype.dianomiEnergiaWalk = function(callback, dir) {
	var i;

	if (dir > 0) {
		for (i = 0; i < this.energiaArray.length; i++) {
			callback.call(this.energiaArray[i]);
		}
	}
	else if (dir < 0) {
		for (i = this.energiaArray.length; i >= 0; i--) {
			callback.call(this.energiaArray[i]);
		}
	}
	else {
		for (i in this.energia) {
			callback.call(this.energia[i]);
		}
	}

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Energia = function(props) {
	Globals.initObject(this, props);
};

Energia.prototype.energiaKodikosGet = function() {
	return this.kodikos;
};

Energia.prototype.energiaDianomiGet = function() {
	return this.dianomi;
};

Energia.prototype.energiaIdosGet = function() {
	return this.idos;
};

Energia.prototype.energiaPektisGet = function() {
	return this.pektis;
};

Energia.prototype.energiaDataGet = function() {
	return this.data;
};

Energia.prototype.energiaPoteGet = function() {
	return this.pote;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Sizitisi = function(props) {
	Globals.initObject(this, props);
};

Sizitisi.prototype.sizitisiSkinikoSet = function(skiniko) {
	this.skiniko = skiniko;
	return this;
};

Sizitisi.prototype.sizitisiSkinikoGet = function() {
	return this.skiniko;
};

Sizitisi.prototype.sizitisiKodikosSet = function(kodikos) {
	this.kodikos = kodikos;
	return this;
};

Sizitisi.prototype.sizitisiKodikosGet = function() {
	return this.kodikos;
};

Sizitisi.prototype.sizitisiTrapeziSet = function(trapezi) {
	this.trapezi = trapezi;
	return this;
};

Sizitisi.prototype.sizitisiTrapeziGet = function() {
	return this.trapezi;
};

Sizitisi.prototype.sizitisiPektisSet = function(pektis) {
	this.pektis = pektis;
	return this;
};

Sizitisi.prototype.sizitisiPektisGet = function() {
	return this.pektis;
};

Sizitisi.prototype.sizitisiSxolioSet = function(sxolio) {
	this.sxolio = sxolio;
	return this;
};

Sizitisi.prototype.sizitisiSxolioGet = function() {
	return this.sxolio;
};

Sizitisi.prototype.sizitisiPoteSet = function(ts) {
	if (ts === undefined) ts = Globals.toraServer();
	this.pote = ts;
	return this;
};

Sizitisi.prototype.sizitisiPoteGet = function() {
	return this.pote;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Sinedria = function(props) {
	Globals.initObject(this, props);
	if (Prefadoros.isThesi(this.thesi)) this.thesi = parseInt(this.thesi);
};

Sinedria.prototype.sinedriaSkinikoSet = function(skiniko) {
	this.skiniko = skiniko;
	return this;
};

Sinedria.prototype.sinedriaSkinikoGet = function() {
	return this.skiniko;
};

Sinedria.prototype.sinedriaPektisSet = function(pektis) {
	this.pektis = pektis;
	return this;
};

Sinedria.prototype.sinedriaPektisGet = function() {
	return this.pektis;
};

Sinedria.prototype.sinedriaKlidiSet = function(klidi) {
	this.klidi = klidi;
	return this;
};

Sinedria.prototype.sinedriaKlidiGet = function() {
	return this.klidi;
};

Sinedria.prototype.sinedriaIsodosGet = function() {
	return this.isodos;
};

Sinedria.prototype.sinedriaIpGet = function() {
	return this.ip;
};

Sinedria.prototype.sinedriaPollSet = function(ts) {
	if (ts === undefined) ts = Globals.toraServer();
	this.poll = ts;
	return this;
};

Sinedria.prototype.sinedriaPollGet = function() {
	return this.poll;
};

Sinedria.prototype.sinedriaTrapeziSet = function(trapezi) {
	this.trapezi = trapezi;
	return this;
};

Sinedria.prototype.sinedriaTrapeziGet = function() {
	return this.trapezi;
};

Sinedria.prototype.sinedriaThesiSet = function(thesi) {
	this.thesi = Prefadoros.isThesi(thesi) ? parseInt(thesi) : null;
	return this;
};

Sinedria.prototype.sinedriaThesiGet = function() {
	return this.thesi;
};

Sinedria.prototype.sinedriaSimetoxiSet = function(simetoxi) {
	this.simetoxi = simetoxi;
	return this;
};

Sinedria.prototype.sinedriaSimetoxiSetPektis = function() {
	this.simetoxi = 'ΠΑΙΚΤΗΣ';
	return this;
};

Sinedria.prototype.sinedriaSimetoxiSetTheatis = function() {
	this.simetoxi = 'ΘΕΑΤΗΣ';
	return this;
};

Sinedria.prototype.sinedriaSimetoxiGet = function() {
	return this.simetoxi;
};

Sinedria.prototype.sinedriaSetPektis = function(trapezi, thesi) {
	this.sinedriaTrapeziSet(trapezi.trapeziKodikosGet());
	this.sinedriaThesiSet(thesi);
	this.sinedriaSimetoxiSetPektis();
	return this;
};

Sinedria.prototype.sinedriaIsPektis = function() {
	return(this.sinedriaSimetoxiGet() === 'ΠΑΙΚΤΗΣ');
};

Sinedria.prototype.sinedriaOxiPektis = function() {
	return !this.sinedriaIsPektis();
};

Sinedria.prototype.sinedriaSetTheatis = function(trapezi, thesi) {
	this.sinedriaTrapeziSet(trapezi.trapeziKodikosGet());
	this.sinedriaThesiSet(thesi);
	this.sinedriaSimetoxiSetTheatis();
	return this;
};

Sinedria.prototype.sinedriaIsTheatis = function() {
	return(this.sinedriaSimetoxiGet() === 'ΘΕΑΤΗΣ');
};

Sinedria.prototype.sinedriaOxiTheatis = function() {
	return !this.sinedriaIsTheatis();
};

Sinedria.prototype.sinedriaSetRebelos = function() {
	delete this.trapezi;
	delete this.thesi;
	delete this.simetoxi;
	return this;
};

Sinedria.prototype.sinedriaIsRebelos = function() {
	return !this.sinedriaTrapeziGet();
};

Sinedria.prototype.sinedriaIsTrapezi = function(trapezi) {
	var sinedriaTrapezi = this.sinedriaTrapeziGet();
	if (!sinedriaTrapezi) return false;

	if (trapezi === undefined) return false;
	if (trapezi === null) return false;

	if (typeof trapezi.trapeziKodikosGet === 'function')
	trapezi = trapezi.trapeziKodikosGet();

	return(sinedriaTrapezi == trapezi);
};

Sinedria.prototype.sinedriaOxiTrapezi = function(trapezi) {
	return !this.sinedriaIsTrapezi(trapezi);
};

Sinedria.prototype.sinedriaPlatiGet = function() {
	var skiniko, pektis, plati = 'ΜΠΛΕ';

	skiniko = this.sinedriaSkinikoGet();
	if (!skiniko) return plati;

	pektis = skiniko.skinikoPektisGet(this.sinedriaPektisGet());
	if (!pektis) return plati;

	return pektis.pektisPlatiGet();
};

Sinedria.prototype.sinedriaPlatiRBGet = function() {
	return(this.sinedriaPlatiGet() == 'ΚΟΚΚΙΝΟ' ? 'R' : 'B');
};

Sinedria.prototype.sinedriaEntopismos = function(skiniko) {
	var sinedria  = this, pektis;

	this.sinedriaSetRebelos()
	if (skiniko === undefined) skiniko = this.sinedriaSkinikoGet();
	if (!skiniko) return this;

	pektis = this.sinedriaPektisGet();
	skiniko.skinikoTrapeziWalk(function(trapezi) {
		var thesi;

		thesi = this.trapeziThesiPekti(pektis);
		if (!thesi) return;

		sinedria.sinedriaTrapeziSet(this.trapeziKodikosGet());
		sinedria.sinedriaThesiSet(thesi);
		sinedria.sinedriaSimetoxiSet('ΠΑΙΚΤΗΣ');
	}, 1);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Prosklisi = function(props) {
	Globals.initObject(this, props);
};

Prosklisi.prototype.prosklisiSkinikoSet = function(skiniko) {
	this.skiniko = skiniko;
	return this;
};

Prosklisi.prototype.prosklisiSkinikoGet = function() {
	return this.skiniko;
};

Prosklisi.prototype.prosklisiKodikosSet = function(kodikos) {
	this.kodikos = kodikos;
	return this;
};

Prosklisi.prototype.prosklisiKodikosGet = function() {
	return this.kodikos;
};

Prosklisi.prototype.prosklisiTrapeziSet = function(trapezi) {
	this.trapezi = trapezi;
	return this;
};

Prosklisi.prototype.prosklisiTrapeziGet = function() {
	return this.trapezi;
};

Prosklisi.prototype.prosklisiApoSet = function(apo) {
	this.apo = apo;
	return this;
};

Prosklisi.prototype.prosklisiApoGet = function() {
	return this.apo;
};

Prosklisi.prototype.prosklisiProsSet = function(pros) {
	this.pros = pros;
	return this;
};

Prosklisi.prototype.prosklisiProsGet = function() {
	return this.pros;
};

Prosklisi.prototype.prosklisiEpidosiSet = function(epidosi) {
	if (epidosi === undefined) epidosi = Globals.toraServer();
	this.epidosi = epidosi;
	return this;
};

Prosklisi.prototype.prosklisiEpidosiGet = function() {
	return this.epidosi;
};

Prosklisi.prototype.prosklisiIsSxetiki = function(pektis) {
	if (this.prosklisiApoGet() === pektis) return true;
	if (this.prosklisiProsGet() === pektis) return true;
	return false;
};

Prosklisi.prototype.prosklisiIsAdiafori = function(pektis) {
	return !this.prosklisiIsSxetiki(pektis);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Skiniko = function() {
	this.skinikoReset();
};

// Η μέθοδος "skinikoReset" δημιουργεί ένα κενό σκηνικό καθώς καθαρίζει
// τις λίστες των βασικών αντικειμένων του σκηνικού.

Skiniko.prototype.skinikoReset = function() {
	this.pektis = {};
	this.trapezi = {};
	this.prosklisi = {};
	this.sinedria = {};
	this.sizitisi = {};
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Skiniko.prototype.skinikoPektisSet = function(pektis) {
	this.pektis[pektis.pektisLoginGet()] = pektis;
	pektis.pektisSkinikoSet(this);
	return this;
};

Skiniko.prototype.skinikoPektisGet = function(login) {
	return this.pektis[login];
};

Skiniko.prototype.skinikoPektisWalk = function(callback) {
	Globals.walk(this.pektis, function(login, pektis) {
		callback.call(pektis);
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Skiniko.prototype.skinikoTrapeziSet = function(trapezi) {
	this.trapezi[trapezi.trapeziKodikosGet()] = trapezi;
	trapezi.trapeziSkinikoSet(this);
	return this;
};

Skiniko.prototype.skinikoTrapeziGet = function(kodikos) {
	return this.trapezi[kodikos];
};

Skiniko.prototype.skinikoTrapeziDelete = function(kodikos) {
	delete this.trapezi[kodikos];
	return this;
};

// Η μέθοδος "skinikoTrapeziWalk" διατρέχει όλα τα τραπέζια του σκηνικού
// και σε κάθε τραπέζι εφαρμόζει ως μέθοδο τού τραπεζιού την callback function.
//
// Αν δεν υφίσταται παράμετρος "dir" οι επισκέψεις γίνονται με τυχαία
// σειρά. Αν η παράμετρος είναι 1 οι επισκέψεις γίνονται με αύξουσα σειρά,
// ενώ αν είναι -1 με φθίνουσα.

Skiniko.prototype.skinikoTrapeziWalk = function(callback, dir) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.trapezi, function(kodikos, trapezi) {
			callback.call(trapezi);
		});

		return this;
	}

	this.skinikoTrapeziWalk(function() {
		keys.push(this);
	});

	keys.sort(function(a, b) {
		if (a.kodikos < b.kodikos) return (-1) * dir;
		if (a.kodikos > b.kodikos) return 1 * dir;
		return 0;
	});

	Globals.awalk(keys, function(i, trapezi) {
		callback.call(trapezi);
	});

	return this;
};

// Η μέθοδος "skinikoThesiWalk" διατρέχει όλες τις θέσεις όλων των τραπεζιών
// του ανά χείρας σκηνικού και για κάθε θέση καλεί callback function ως
// μέθοδο του σχετικού τραπεζιού, με παράμετρο την ίδια τη θέση.
//
// Η παράμετρος "dir" καθορίζει τη σειρά της επίσκεψης.

Skiniko.prototype.skinikoThesiWalk = function(callback, dir) {
	this.skinikoTrapeziWalk(function() {
		this.trapeziThesiWalk(callback);
	}, dir);

	return this;
};

// Η μέθοδος "skinikoTheatisWalk" διατρέχει τους θεατές όλων των τραπεζιών
// του ανά χείρας σκηνικού και για κάθε θεατή καλεί callback function ως
// μέθοδο της σχετικής συνεδρίας.

Skiniko.prototype.skinikoTheatisWalk = function(callback) {
	this.skinikoSinedriaWalk(function() {
		if (this.sinedriaOxiTheatis()) return;
		callback.call(this);
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Skiniko.prototype.skinikoSizitisiSet = function(sizitisi) {
	this.sizitisi[sizitisi.kodikos] = sizitisi;
	sizitisi.skiniko = this;
	return this;
};

Skiniko.prototype.skinikoSizitisiGet = function(kodikos) {
	return this.sizitisi[kodikos];
};

Skiniko.prototype.skinikoSizitisiDelete = function(kodikos) {
	delete this.sizitisi[kodikos];
	return this;
};

Skiniko.prototype.skinikoSizitisiWalk = function(callback, dir) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.sizitisi, function(kodikos, sizitisi) {
			callback.call(sizitisi);
		});

		return this;
	}

	this.skinikoSizitisiWalk(function() {
		keys.push(this);
	});

	keys.sort(function(a, b) {
		if (a.kodikos < b.kodikos) return (-1) * dir;
		if (a.kodikos > b.kodikos) return 1 * dir;
		return 0;
	});

	Globals.awalk(keys, function(i, sizitisi) {
		callback.call(sizitisi);
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Skiniko.prototype.skinikoSinedriaSet = function(sinedria) {
	this.sinedria[sinedria.pektis] = sinedria;
	sinedria.skiniko = this;
	return this;
};

Skiniko.prototype.skinikoSinedriaGet = function(login) {
	return this.sinedria[login];
};

Skiniko.prototype.skinikoSinedriaDelete = function(login) {
	delete this.sinedria[login];
	return this;
};

Skiniko.prototype.skinikoSinedriaWalk = function(callback, dir, sort) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.sinedria, function(login, sinedria) {
			callback.call(sinedria);
		});

		return this;
	}

	this.skinikoSinedriaWalk(function() {
		keys.push(this);
	});

	if (sort === undefined) sort = function(a, b) {
		if (a.isodos < b.isodos) return (-1) * dir;
		if (a.isodos > b.isodos) return 1 * dir;
		return 0;
	};
	keys.sort(sort);

	Globals.awalk(keys, function(i, sinedria) {
		callback.call(sinedria);
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Skiniko.prototype.skinikoProsklisiSet = function(prosklisi) {
	var i, p, trapezi, apo, pros;

	trapezi = prosklisi.prosklisiTrapeziGet();
	apo = prosklisi.prosklisiApoGet();
	pros = prosklisi.prosklisiProsGet();

	for (i in this.prosklisi) {
		p = this.prosklisi[i];
		if (p.prosklisiTrapeziGet() != trapezi) continue;
		if (p.prosklisiApoGet() != apo) continue;
		if (p.prosklisiProsGet() != pros) continue;

		this.skinikoProsklisiDelete(i);
		break;
	}

	this.prosklisi[prosklisi.prosklisiKodikosGet()] = prosklisi;
	prosklisi.prosklisiSkinikoSet(this);
	return this;
};

Skiniko.prototype.skinikoProsklisiGet = function(kodikos) {
	return this.prosklisi[kodikos];
};

Skiniko.prototype.skinikoProsklisiDelete = function(kodikos) {
	delete this.prosklisi[kodikos];
	return this;
};

Skiniko.prototype.skinikoProsklisiWalk = function(callback) {
	Globals.walk(this.prosklisi, function(kodikos, prosklisi) {
		callback.call(prosklisi);
	});

	return this;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kinisi = function(prop) {
	if (typeof(prop) === 'string') prop = {
		idos: prop,
	};
	Globals.initObject(this, prop);
	if (!this.hasOwnProperty('data')) this.data = {};
};

Skiniko.prototype.processKinisi = function(kinisi) {
	var proc;

	proc = 'processKinisiAnte' + kinisi.idos;
	if (typeof this[proc] === 'function') this[proc](kinisi.data);

	proc = 'processKinisi' + kinisi.idos;
	if (typeof this[proc] === 'function') this[proc](kinisi.data);
	if (typeof this.egoDataSet === 'function') this.egoDataSet();

	proc = 'processKinisiPost' + kinisi.idos;
	if (typeof this[proc] === 'function') this[proc](kinisi.data);

	return this;
};
