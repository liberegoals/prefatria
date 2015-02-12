Diafimisi = {};

$(document).ready(function() {
	Diafimisi.kimeno1DOM = $('#kimeno1');
	Diafimisi.kimeno2DOM = $('#kimeno2');
	Diafimisi.kimeno3DOM = $('#kimeno3');
	Diafimisi.kimeno4DOM = $('#kimeno4');
	Diafimisi.parageliaDOM = $('#paragelia');
	Diafimisi.display1();
});

Diafimisi.display1 = function() {
	$('#fonto').
	fadeTo(500, 1).
	attr('src', 'fonto1.png');

	Diafimisi.kimeno4DOM.finish().fadeOut(200);
	Diafimisi.kimeno1DOM.finish().fadeIn();
	setTimeout(Diafimisi.display2, 3000);
};

Diafimisi.display2 = function() {
	Diafimisi.kimeno1DOM.finish().fadeOut(140);
	Diafimisi.kimeno2DOM.finish().css({
		top: '74px',
		left: 0,
		opacity: 1,
	}).fadeIn(600).
	animate({
		top: '26px',
	}, 1600);
	setTimeout(Diafimisi.display3, 1600);
};

Diafimisi.display3 = function() {
	Diafimisi.kimeno3DOM.finish().css({
		left: 0,
		opacity: 1,
		color: '',
	}).fadeIn();
	setTimeout(Diafimisi.display4, 10000);
};

Diafimisi.display4 = function() {
	Diafimisi.kimeno2DOM.finish().animate({
		left: '-=400px',
		opacity: 0,
	});
	Diafimisi.kimeno3DOM.finish().animate({
		left: '+=400px',
		opacity: 0,
	});
	Diafimisi.kimeno4DOM.finish().css({
		color: '',
	}).fadeIn().
	delay(1000).animate({
		color: '#FFFFB2',
	}, 2000);

	$('#fonto').
	fadeTo(200, 0, function() {
		$(this).
		fadeTo(200, 1).
		attr('src', 'fonto2.png');
	});
	setTimeout(Diafimisi.display1, 16000);
};
