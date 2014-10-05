%.min.js : %.js
	yui-compressor --verbose --line-break 70 --charset UTF-8 -o $@ $<

all: \
	panel.min.js \
	selida.min.js
