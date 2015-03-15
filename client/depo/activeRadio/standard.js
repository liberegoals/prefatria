Diafimisi = {};

$(document).ready(function() {
	Diafimisi.kimeno1DOM = $('#kimeno1');
	setTimeout(Diafimisi.display1, 1000);
	$(document.body).
	on('click', function() {
		window.open('http://www.e-radio.gr/Active-Radio-Internet-Radio-i48/live', 'radiaki');
	});
});

Diafimisi.display1 = function() {
	Diafimisi.kimeno1DOM.finish().fadeTo(1000, 1, 'easeInBounce');
};
