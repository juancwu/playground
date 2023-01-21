CC=gcc
CFLAGS=-W -Wall -lpthread

all: http-server http-client

http-server: http-server.c
	$(CC) $(CFLAGS) http-server.c -o http-server

http-client: http-client.c
	$(CC) $(CFLAGS) http-client.c -o http-client

clean:
	rm -f http-server http-client
