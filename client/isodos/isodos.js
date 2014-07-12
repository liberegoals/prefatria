$(document).ready(function() {
	Isodos.init();
	Client.toolbarLeft('isodos');
	Client.tabArxiki();
	Client.tabEgrafi();
});

$(window).ready(function() {
	$(window).trigger('resize');
});

Isodos = {};

Isodos.init = function() {
	Isodos.login = $('input[name="login"]');
	Isodos.kodikos = $('input[name="kodikos"]');
	Isodos.klidi = $('input[name="klidi"]');
	Isodos.login.focus().val(Isodos.login.val());
	Isodos.proxori = 0;
}

Isodos.akiro = function() {
	self.location = Client.server;
	return false;
}

Isodos.submit = function(form) {
	if (Isodos.proxori === 1) return false;
	if (Isodos.proxori === 2) return true;

	Isodos.proxori = 1;
	Client.fyi.pano();
	Isodos.klidi.val(Globals.randomString(10, 10));
	$.ajax(Client.skiser + 'checkin' +
		'?PK=' + Isodos.login.val().uri() +
		'&KL=' + Isodos.klidi.val().uri() +
		'&kodikos=' + Isodos.kodikos.val().uri()
	).
	done(function(rsp) {
		if (rsp !== '') {
			Client.fyi.epano(rsp);
			Isodos.proxori = 0;
			return;
		}

		Isodos.proxori = 2;
		$(form).submit();
	}).
	fail(function(rsp) {
		Client.skiserFail(rsp);
		Isodos.proxori = 0;
	});

	return false;
}
