Funchat = {};

$(document).ready(function() {
	// Χρειαζόμαστε πρόσβαση στη βασική σελίδα του «Πρεφαδόρου», από
	// την οποία εκκίνησε το funchat. Σ' αυτή τη σελίδα υπάρχει global
	// μεταβλητή "Arena" και ουσιαστικά αυτήν χρειαζόμαστε.
	// Αν δεν υπάρχει γονική σελίδα, ή η μεταβλητή "Arena" δεν βρεθεί
	// στη γονική σελίδα, τότε θεωρούμε ότι το funchat έχει εκκινήσει
	// ανεξάρτητα σε δική του σελίδα.

	Arena = (window.opener && window.opener.Arena ? window.opener.Arena : null);
});

Funchat.isArena = function() {
	return Arena;
};

Funchat.oxiArena = function() {
	return !Funchat.isArena();
};

Funchat.unload = function() {
	if (Funchat.unloaded) return;
	Funchat.unloaded = true;

	if (Funchat.isArena())
	Arena.funchat.klisimo();
};

$(window).
on('resize', function() {
	if (Funchat.oxiArena())
	return;

window.opener.console.log('asdasda');
}).
on('beforeunload', function() {
	Funchat.unload();
}).
on('unload', function() {
	Funchat.unload();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
