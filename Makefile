all:
	@(cd client/common && make -s)
	@(cd client/lib && make -s)
	@(cd client/arena && make -s)
