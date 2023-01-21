CC=gcc

all: http-server http-client

http-server: http-server.c
	$(CC) http-server.c -o http-server

http-client: http-client.c
	$(CC) http-client.c -o http-client

clean:
	rm -f http-server http-client
