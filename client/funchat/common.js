Funchat = function(props) {
	var img;

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

Funchat.prototype.funchatIsterisiGet = function() {
	var isterisi;

	isterisi = parseInt(this.isterisi);
	if (isNaN(isterisi) || (isterisi < 0))
	isterisi = 0;

	return isterisi;
};

Funchat.prototype.funchatEntasiGet = function() {
	return this.entasi;
};

Funchat.prototype.funchatIxosPlay = function(opts) {
	var ixos, entasi, isterisi;

	ixos = this.funchatIxosGet();
	if (!ixos) return null;

	if (opts === undefined)
	opts = {};

	if (!opts.hasOwnProperty('entasi')) {
		entasi = this.funchatEntasiGet();
		if (entasi) opts.entasi = entasi;
	}

	if (!ixos.match(/^https?:/)) ixos = Funchat.server + ixos;
	isterisi = this.funchatIsterisiGet();

	if (!isterisi) 
	return Client.sound.play(ixos, opts);

	setTimeout(function() {
		Client.sound.play(ixos, opts);
	}, isterisi);
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
	img: 'tonIpiame.gif',
	platos: 120,
}));

Funchat.listaPush(new Funchat({
	id: 'tsimbousi',
	img: 'pipaKaroto.gif',
	platos: 120,
	ixos: 'tsibousiMale.mp3',
	entasi: 4,
}));

Funchat.listaPush(new Funchat({
	img: 'gelia.gif',
	platos: 120,
}));

Funchat.listaPush(new Funchat({
	img: 'xekardismenoEmoticon.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'gelioEmoticon.gif',
	platos: 42,
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'kota.gif',
	platos: 100,
	txt: 'Κο κο κο…',
}));

Funchat.listaPush(new Funchat({
	img: 'mesa.gif',
	platos: 240,
}));

Funchat.listaPush(new Funchat({
	img: 'mlk.jpg',
	platos: 120,
	txt: 'I have a dream!',
	ixos: 'haveDream.ogg',
	entasi: 2,
}));

Funchat.listaPush(new Funchat({
	img: 'tinPatisame.jpg',
	platos: 180,
	ixos: 'tinPatisame.mp3',
	entasi: 2,
}));

Funchat.listaPush(new Funchat({
	img: 'gunFail.gif',
	platos: 240,
}));

Funchat.listaPush(new Funchat({
	img: 'meSkisate.gif',
	platos: 140,
}));

Funchat.listaPush(new Funchat({
	img: 'zervos.jpg',
	platos: 100,
	txt: 'Ου να χαθείς!',
	ixos: 'ouNaXathis.mp3',
	entasi: 10,
}));

Funchat.listaPush(new Funchat({
	img: 'anteGamithiteRe.gif',
	platos: 200,
}));

Funchat.listaPush(new Funchat({
	img: 'exeteXesti.gif',
	platos: 200,
}));

Funchat.listaPush(new Funchat({
	img: 'tiGamisesTinPartida.gif',
	platos: 140,
}));

Funchat.listaPush(new Funchat({
	img: 'tiKanisRe.gif',
	platos: 70,
	txt: 'Τι έκανες ρε;',
}));

Funchat.listaPush(new Funchat({
	img: 'sfiriEmoticon.gif',
	platos: 70,
}));

Funchat.listaPush(new Funchat({
	img: 'parathiro.gif',
	platos: 70,
	ixos: Client.server + 'sounds/tzamia.ogg',
	isterisi: 1000,
}));

Funchat.listaPush(new Funchat({
	img: 'aisxos.jpg',
	platos: 100,
	txt: 'Αίσχος!',
	ixos: 'aisxos.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'marinikol.gif',
	platos: 140,
}));

Funchat.listaPush(new Funchat({
	img: 'notaraTaTheli.jpg',
	platos: 120,
	ixos: 'taTheli.mp3',
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
	img: 'xmEmoticon.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'ipopto.gif',
	platos: 50,
}));

Funchat.listaPush(new Funchat({
	img: 'lesEmoticon.gif',
	txt: 'Λες;',
}));

Funchat.listaPush(new Funchat({
	img: 'tinEstise.gif',
	txt: 'Την έστησε!!!',
}));

Funchat.listaPush(new Funchat({
	img: 'mavrosGourlomatis.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'matia.gif',
	platos: 80,
}));

Funchat.listaPush(new Funchat({
	img: 'kinezos.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'vgika.gif',
}));

Funchat.listaPush(new Funchat({
	img: 'snoopy.gif',
	platos: 70,
	txt: 'Τρέλα!',
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
	ixos: 'pouVadizoume.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'staExigoOrea.jpg',
	platos: 200,
	ixos: 'alefantos.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'ipoklinome.gif',
	platos: 30,
	ixos: 'panos.mp3',
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'nop.gif',
}));

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

Funchat.listaPush(new Funchat({
	img: 'dikeoma.gif',
	platos: 180,
	txt: 'Δικαίωμα…',
}));
