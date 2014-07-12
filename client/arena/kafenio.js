Arena.kafenio = {};

Arena.kafenio.flags = {
	rebelosView: true,
};

Arena.kafenio.rebelosView = function() {
	return Arena.kafenio.flags.rebelosView;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.kafenio.setup = function() {
	Arena.kafenioDOM.css('overflowY', 'auto');
	Arena.kafenio.rebelosDOM = $('<div>').attr('id', 'rebelos').appendTo(Arena.kafenioDOM);
	Arena.kafenio.trapeziDOM = $('<div>').attr('id', 'trapezi').appendTo(Arena.kafenioDOM);

	return Arena;
};
