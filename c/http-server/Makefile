CC=gcc

all: socket-server socket-client

socket-server: socket-server.c
	$(CC) socket-server.c -o socket-server

socket-client: socket-client.c
	$(CC) socket-client.c -o socket-client

clean:
	rm -f socket-server socket-client
