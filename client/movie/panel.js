Movie.panel = new BPanel();
Movie.panel.omadaMax = 1;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Movie.panel.bpanelButtonPush(Movie.panel.energiaNextButton = new PButton({
	omada: 1,
	img: '../ikona/movie/end.png',
	title: 'Επόμενη κίνηση',
	click: function(e) {
		var elist, energia, fasi, idos;

		if (!Movie.dianomi)
		return;

		if (Movie.bazaEkremis)
		return Movie.pareBaza(Movie.trapezi.partidaBazaPios(true));

		elist = Movie.dianomi.energiaArray;

		Movie.energiaIndex++;
		if (Movie.energiaIndex >= elist.length) {
			Movie.energiaIndex--;
			Client.sound.beep();
			return;
		}

		energia = elist[Movie.energiaIndex];
		Movie.trapezi.trapeziProcessEnergia(energia);

		fasi = Movie.trapezi.partidaFasiGet();
		idos = energia.energiaIdosGet();
console.log('STEP FORWARD: φάση', fasi, 'είδος', idos);

		switch (idos) {
		case 'ΦΥΛΛΟ':
			return Movie.pexeFilo(energia, fasi);
		case 'FLOP':
			return Movie.anixeTzogo();
		}

		switch (fasi) {
		case 'ΑΛΛΑΓΗ':
			if (idos === 'ΔΗΛΩΣΗ')
			return Movie.pareTzogo();
			break;
		case 'ΠΛΗΡΩΜΗ':
			Movie.trapezi.partidaReplay({eoske:Movie.dianomi.dianomiKodikosGet()});
			break;
		}

		Movie.displayPartida();
	},
}));

Movie.panel.bpanelButtonPush(Movie.panel.energiaPrevButton = new PButton({
	omada: 1,
	img: '../ikona/movie/start.png',
	title: 'Προηγούμενη κίνηση',
	click: function(e) {
		var elist, i, fasi, idos;

		if (!Movie.dianomi)
		return;

		delete Movie.bazaEkremis;
		elist = Movie.dianomi.energiaArray;

		Movie.energiaIndex--;
		if (Movie.energiaIndex < 0) {
			Movie.energiaIndex++;
			Client.sound.beep();
			return;
		}

		Movie.trapezi.partidaReplay({eosxoris:Movie.dianomi.dianomiKodikosGet()});
		for (i = 0; i <= Movie.energiaIndex; i++) {
			energia = elist[i];
			Movie.trapezi.trapeziProcessEnergia(energia);
		}

		fasi = Movie.trapezi.partidaFasiGet();
		idos = energia.energiaIdosGet();
console.log('STEP BACKWARDS: φάση', fasi, 'είδος', idos);

		switch (fasi) {
		case 'ΑΛΛΑΓΗ':
			if (idos === 'ΔΗΛΩΣΗ')
			return Movie.panel.energiaPrevButton.pbuttonGetDOM().trigger('click');
		}

		Movie.displayPartida();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	id: 'dianomiNext',
	omada: 1,
	img: '../ikona/movie/fwd.png',
	title: 'Επόμενη διανομή',
	click: function(e) {
		Movie.dianomiIndex++;

		if (Movie.dianomiIndex >= Movie.trapezi.dianomiArray.length)
		Movie.dianomiIndex--;

		else
		Movie.displayDianomi();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	id: 'dianomiPrev',
	omada: 1,
	img: '../ikona/movie/rew.png',
	title: 'Προηγούμενη διανομή',
	click: function(e) {
		if (Movie.dianomiIndex <= 0)
		return;

		Movie.dianomiIndex--;
		Movie.displayDianomi();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	omada: 1,
	img: '../ikona/movie/trapoula.png',
	title: 'Αλλαγή τράπουλας',
	click: function(e) {
		var family;

		switch (filajs.cardFamilyGet()) {
		case 'aguilar':
			filajs.cardFamilySet('classic');
			break;
		case 'classic':
			filajs.cardFamilySet('nicubunu');
			break;
		case 'nicubunu':
			filajs.cardFamilySet('ilias');
			break;
		case 'ilias':
			filajs.cardFamilySet('jfitz');
			break;
		default:
			filajs.cardFamilySet('aguilar');
			break;
		}

		Movie.displayDianomi();

		family = filajs.cardFamilyGet();
		$.ajax('../lib/session.php', {data:{trapoula:family}});

		if (Client.isPektis())
		Client.skiserService('peparamSet', 'param=ΤΡΑΠΟΥΛΑ', 'timi=' + family);
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	id: 'tzogosAniktos',
	omada: 1,
	img: '../ikona/movie/tzogosAniktos.png',
	title: 'Τζόγος φανερός',
	check: function() {
		return !Movie.tzogosFaneros;
	},
	click: function(e) {
		Movie.tzogosFaneros = true;
		Movie.tzogos.
		cardWalk(function() {
			this.
			faceUp().
			domRefresh();
		});

		this.pbuttonPanelGet().bpanelRefresh();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	id: 'tzogosKlistos',
	omada: 1,
	img: '../ikona/movie/tzogosKlistos.png',
	title: 'Τζόγος κρυφός',
	check: function() {
		return Movie.tzogosFaneros;
	},
	click: function(e) {
		Movie.tzogosFaneros = false;
		Movie.tzogos.
		cardWalk(function() {
			this.
			faceDown().
			domRefresh();
		});

		this.pbuttonPanelGet().bpanelRefresh();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	id: 'klistaWE',
	omada: 1,
	img: '../ikona/movie/tzogosKlistos.png',
	refresh: function() {
		if (Movie.isKlista23()) {
			this.pbuttonIconGetDOM().attr('src', '../ikona/trapoula/CQ.png');
			this.pbuttonGetDOM().attr('title', 'Άνοιγμα φύλλων Ανατολής και Δύσης');
		}
		else {
			this.pbuttonIconGetDOM().attr('src', '../ikona/trapoula/BV.png');
			this.pbuttonGetDOM().attr('title', 'Απόκρυψη φύλλων Ανατολής και Δύσης');
		}

		return this;
	},
	click: function(e) {
		Movie.klistaWE = !Movie.klistaWE;
		Movie.displayFila();
		this.refresh();
	},
}));
