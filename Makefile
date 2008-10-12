
DEHYDRA = ~/src/dehydra/gcc/bin/g++ -fplugin=/home/omo/src/dehydra/dehydra-gcc/gcc_dehydra.so
SRC=override.cpp

all:
	${DEHYDRA} -fplugin-arg=override.js ${SRC} -S -o /dev/null
.PHONY: all