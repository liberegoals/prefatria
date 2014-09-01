Funchat = function(props) {
	var id, img;

	Globals.initObject(this, props);

	// Αν έχει καθοριστεί id για το ανά χείρας funchat item,
	// δεν χρειάζεται να κάνουμε κάτι.

	if (this.funchatIdGet())
	return;

	// Αλλιώς χρησιμοποιούμε το source της εικόνας χωρίς το
	// επίθεμα, π.χ. για την εικόνα "etsi.gif" θα δώσουμε το
	// id "etsi".

	img = this.funchatIkonaGet();
	if (img) this.funchatIdSet(img.replace(/\..*/, ''));
};

Funchat.prototype.funchatIdSet = function(id) {
	this.id = id;
};

Funchat.prototype.funchatIdGet = function() {
	return this.id;
};

Funchat.prototype.funchatOmadaSet = function(omada) {
	this.omada = omada;
};

Funchat.prototype.funchatOmadaGet = function() {
	return this.omada;
};

Funchat.prototype.funchatIkonaGet = function() {
	return this.img;
};

Funchat.prototype.funchatPlatosGet = function() {
	return this.platos;
};

Funchat.prototype.funchatKimenoGet = function() {
	return this.txt;
};

Funchat.prototype.funchatIxosGet = function() {
	return this.ixos;
};

Funchat.prototype.funchatEntasiGet = function() {
	return this.entasi;
};

Funchat.prototype.funchatIxosPlay = function(opts) {
	var ixos, entasi;

	ixos = this.funchatIxosGet();
	if (!ixos) return null;

	if (opts === undefined)
	opts = {};

	if (!opts.hasOwnProperty('entasi')) {
		entasi = this.funchatEntasiGet();
		if (entasi) opts.entasi = entasi;
	}

	if (!ixos.match(/\//)) ixos = Funchat.server + ixos;
	return Client.sound.play(ixos, opts);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Funchat.server = 'http://www.opasopa.net/prefadorosFC/';

Funchat.lista = {};
Funchat.listaArray = [];

Funchat.listaArrayWalk = function(callback) {
	var i;

	for (i = 0; i < Funchat.listaArray.length; i++) {
		callback.call(Funchat.listaArray[i]);
	}

	return Funchat;
};

Funchat.listaGet = function(id) {
	return Funchat.lista[id];
};

Funchat.omada = 0;

Funchat.listaPush = function(item) {
	var id;

	id = item.funchatIdGet();
	if (!id) {
		console.error('funchat item missing id');
		return Funchat;
	}

	if (Funchat.listaGet(id)) {
		console.error(id + ': double funchat id');
		return Funchat;
	}

	item.funchatOmadaSet(Funchat.omada);
	Funchat.listaArray.push(item);
	Funchat.lista[id] = item;
	return Funchat;
};

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'etsi.gif',
	txt: 'Έεεεεετσι!',
}));

Funchat.listaPush(new Funchat({
	img: 'elaStoThio.gif',
	platos: 100,
	txt: 'Έλα στο θείο!',
}));

Funchat.listaPush(new Funchat({
	img: 'assWiggle.gif',
	txt: 'Ε, ρε, γλέντια!',
}));

Funchat.listaPush(new Funchat({
	img: 'pipaKaroto.gif',
	platos: 120,
}));

Funchat.listaPush(new Funchat({
	img: 'gelia.gif',
	platos: 120,
}));

Funchat.listaPush(new Funchat({
	img: 'xekardismenoEmoticon.gif',
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'mesa.gif',
	platos: 240,
	txt: 'Το θέμα είναι απλά ή σόλο;',
}));

Funchat.listaPush(new Funchat({
	img: 'gunFail.gif',
	platos: 240,
}));

Funchat.listaPush(new Funchat({
	img: 'meSkisate.gif',
	platos: 140,
	txt: "Μ' έχετε ξεσκίσει, ρε!",
}));

Funchat.listaPush(new Funchat({
	img: 'anteGamithiteRe.gif',
	platos: 200,
	txt: 'Ε, άντε γαμηθείτε, ρε κουφάλες…',
}));

Funchat.listaPush(new Funchat({
	img: 'tiGamisesTinPartida.gif',
	platos: 200,
	txt: 'Γάμησες την παρτίδα!',
}));

Funchat.listaPush(new Funchat({
	img: 'nop.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'kokiniKarta.jpg',
	ixos: Client.server + 'sounds/sfirixtra.ogg',
	platos: 120,
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'mrBean.gif',
	platos: 140,
}));

Funchat.listaPush(new Funchat({
	img: 'mavrosGourlomatis.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'kinezos.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'egiptiakosXoros.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'soldierDance.gif',
	platos: 80,
	ixos: 'clarinetitis.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'gunPenis.gif',
	platos: 300,
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'cheersEmoticon.gif',
	platos: 120,
}));

Funchat.listaPush(new Funchat({
	img: 'axtipitoDidimo.gif',
	txt: 'Είμαστε αχτύπητο δίδυμο!',
}));

Funchat.listaPush(new Funchat({
	img: 'kalaPouMePires.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'iseTromeros.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'bingoPokemon.gif',
	txt: 'Σωστόοοστ!',
}));

Funchat.listaPush(new Funchat({
	img: 'bravoEmoticon.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'kino.gif',
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'pouVadizoume.jpg',
	platos: 140,
	txt: 'Πού βαδίζουμε κύριοι!',
	ixos: 'pouVadizoume.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'staExigoOrea.jpg',
	platos: 200,
	txt: 'Στα εξηγώ ωραία;',
	ixos: 'alefantos.mp3',
}));

Funchat.listaPush(new Funchat({
	id: 'tsimbousi',
	img: 'pipaKaroto.gif',
	platos: 120,
	txt: 'Πω, πω, πω, τι τσιμπούσι ήταν αυτό!',
	ixos: 'tsibousiMale.mp3',
	entasi: 4,
}));

Funchat.listaPush(new Funchat({
	img: 'tonIpiame.gif',
	platos: 120,
	txt: 'Πω, πω, πω, τι τσιμπούσι ήταν αυτό!',
	ixos: 'tsibousiFemale.mp3',
	entasi: 4,
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'xipna.gif',
	platos: 180,
	txt: 'Ξύπνα ρεεε!',
	ixos: Client.server + 'sounds/bell.ogg',
	entasi: 10,
}));

Funchat.listaPush(new Funchat({
	img: 'misoLepto.gif',
	txt: 'Μισό…',
	platos: 80,
}));

Funchat.listaPush(new Funchat({
	img: 'ImBack.gif',
	platos: 80,
}));

Funchat.listaPush(new Funchat({
	img: 'daffyPhone.gif',
	txt: 'Μισό λεπτό, μιλάω στο τηλέφωνο…',
	platos: 80,
}));
