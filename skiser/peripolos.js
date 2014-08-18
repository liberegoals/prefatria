Peripolos = {};

// Στο αντικείμενο "ergasia" περιέχονται οι θεσμοθετημένες εργασίες
// ελέγχου. Κάθε εργασία έχει τη δική της περίοδο ελέγχου και τη μέθοδο
// ελέγχου ως function.

Peripolos.ergasia = {
	pektis:			{ period: 59 * 60 * 1000, action: 'Service.pektis.check' },
	sizitisiKontema:	{ period:  7 * 61 * 1000, action: 'Service.sizitisi.kontema' },
	trapezi:		{ period:  1 * 31 * 1000, action: 'Service.trapezi.check' },
	sinedria:		{ period:  1 * 21 * 1000, action: 'Service.sinedria.check' },
	feredata:		{ period:  1 * 11 * 1000, action: 'Service.feredata.check' },
	dbconn:			{ period:  1 * 13 * 1000, action: 'DB.check' },
	trapeziKlidoma:		{ period:  1 *  7 * 1000, action: 'Service.trapezi.klidomaCheck' },
};

// Η μέθοδος "setup" στήνει τους βασικούς κύκλους ελέγχου.

Peripolos.setup = function() {
	var i;

	Log.fasi.nea('Setting up patrol jobjs');
	Log.print('Calculating session timeouts');
	Log.level.push();

	// Αν κάποιο αίτημα feredata δεν απαντηθεί σε εύλογο χρονικό διάστημα, ο skiser
	// το κλείνει με απάντηση μη αλλαγής.

	Peripolos.feredataTimeout = 2 * parseInt(Peripolos.ergasia.feredata.period / 1000) - 1;
	Log.print('timeout for "feredata" set to ' + Peripolos.feredataTimeout + ' seconds');

	// Αν κάποια συνεδρία δεν έχει υποβάλει αίτημα feredata μέσα σε εύλογο χρονικό
	// διάστημα, ο skiser θεωρεί ότι η συνεδρία έχει διακοπεί και την καταργεί.

	Peripolos.sinedriaTimeout = Peripolos.feredataTimeout + parseInt(Peripolos.ergasia.feredata.period / 1000) - 1;
	Log.print('timeout for "sinedria" set to ' + Peripolos.sinedriaTimeout + ' seconds');

	// Αν κάποια συνεδρία δεν έχει υποβάλει κάποιο άλλο αίτημα πλην των αυτόματων
	// τακτικών αιτημάτων ενημέρωσης, ο skiser την καταργεί για να αποδεσμεύσει
	// πόρους.

	Peripolos.inactiveTimeout = 3600;
	Log.print('timeout for "inactive" set to ' + Peripolos.inactiveTimeout + ' seconds');

	Log.level.pop();
	Log.print('initializing patrol jobs');
	Log.level.push();
	for (i in Peripolos.ergasia) {
		Log.print('initializing "' + i + '" check (every ' + Peripolos.ergasia[i].period + ' ms)');
		eval('setInterval(' + Peripolos.ergasia[i].action + ', ' + Peripolos.ergasia[i].period + ');');
	}
	Log.level.pop();
}
