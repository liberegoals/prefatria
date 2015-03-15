Diafimisi = {};

$(document).ready(function() {
	Diafimisi.kimeno1DOM = $('#kimeno1');
	setTimeout(Diafimisi.display1, 1000);
});

Diafimisi.display1 = function() {
	Diafimisi.kimeno1DOM.finish().fadeTo(1000, 1, 'easeInBounce');
};
