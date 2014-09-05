////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: fortos');

Service.fortos = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "cputimes" επιστρέφει αντικείμενο με τον συνολικό χρόνο
// λειτουργίας της CPU ("total") και τον συνολικό χρόνο αδρανείας της
// CPU ("idle"). Μπορούμε να περάσουμε και παράμετρο με την οποία θα
// εκτυπωθούν στοιχεία για τους πυρήνες της CPU.

Service.fortos.cputimes = function(info) {
	var total = 0, idle = 0;

	Globals.awalk(OS.cpus(), function(i, cpu) {
		var t;

		if (info)
		Log.print(cpu.model);

		// Στη μεταβλητή "idle" αθροίζουμε τα idle times όλων
		// των πυρήνων της CPU.

		idle += cpu.times.idle;

		// Στη μεταβλητή "total" αθροίζουμε όλους τους χρόνους
		// κάθε πυρήνα της CPU, συμπεριλαμβανομένων και των
		// χρόνων αδρανείας.

		for (t in cpu.times) {
			total += cpu.times[t];
		}
	});

	return {
		total: total,
		idle: idle,
	};
};

// Η function "ananeosi" τρέχει μέσω περιπόλου σε τακτά χρονικά διαστήματα
// και ενημερώνει τα στοιχεία φόρτου της CPU. Ουσιαστικά, κρατάει τα μέχρι
// τούδε στοιχεία ως στοιχεία εκκίνησης και θέτει εκ νέου τρέχοντα στοιχεία
// χρόνου της CPU. Κατόπιν υπολογίζει τις διαφορές μεταξύ των τελευταίων
// καταμετρήσεων και κρατάει τον φόρτο που προκύπτει στο property "cpuload".
// Επίσης, καταμετρά τους online παίκτες και τα ενεργά τραπέζια.

Service.fortos.ananeosi = function(info) {
	var total, idle;

	Service.fortos.xronos1 = Service.fortos.xronos2;
	Service.fortos.xronos2 = Service.fortos.cputimes(info);

	total = Service.fortos.xronos2.total - Service.fortos.xronos1.total;
	idle = Service.fortos.xronos2.idle - Service.fortos.xronos1.idle;

	Service.fortos.cpuload = Math.floor(100 * ((total - idle) / total));
	Service.fortos.pektes = Globals.walk(Server.skiniko.sinedria);
	Service.fortos.trapezia = Globals.walk(Server.skiniko.trapezi);
};

// Κρατάμε τα properties "xronos1" και "xronos2" με τους συνολικούς χρόνους
// που αφορούν σε δύο διαδοχικές καταμετρήσεις. Αρχικά δουλεύουμε με τους
// συνολικούς χρόνους από την έναρξη λειτουργίας της CPU, αλλά σε κάθε
// νέα καταμέτρηση λογίζονται οι χρόνοι για το διάστημα που μεσολάβησε
// μεταξύ των δύο καταμετρήσεων.

Service.fortos.xronos2 = {
	total: 0,
	idle: 0,
};

// Η function "data" επιστρέφει τα τρέχοντα δεδομένα φόρτου ως σειρά από
// properties σε μορφή JSON.

Service.fortos.data = function(nodereq) {
	nodereq.write('cpuload: ' + Service.fortos.cpuload + ',');
	nodereq.write('pektes: ' + Service.fortos.pektes + ',');
	nodereq.write('trapezia: ' + Service.fortos.trapezia + ',');
	nodereq.end();
};
