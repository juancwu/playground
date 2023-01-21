#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <ctype.h>
#include <signal.h>
#include <strings.h>
#include <unistd.h>

#define STATUS_OK "HTTP/1.1 200 OK\r\n"
#define STATUS_NOT_FOUND "HTTP/1.1 404 Not Found\r\n"
#define STATUS_NOT_IMPLEMENTED "HTTP/1.1 501 Not Implemented\r\n"
#define SERVER "Server: jchttp/0.0.1\r\n"

// GLOBAL SERVER socket
int sockfd = -1;

void error(const char *msg);
int get_line(int client, char *buffer, int buffer_size);
void response_ok(int client);
void response_not_implemented(int client);
void handle_request(int client);
void signal_handler(int sig); 

void error(const char *msg) {
    perror(msg);
    exit(1);
}

/*
 * Get the request line of an HTTP request. This is the first line in any HTTP request.
 * Each line in an HTTP request is separated by a '\r\n'.
 * Returns: the number of bytes stored (excluding null) */
int get_line(int client, char *buffer, int buffer_size) {
    char c = '\0';
    int i = 0;
    int n;
    while ((i < buffer_size - 1) && (c != '\n')) {
        n = recv(client, &c, 1, 0);
        if (n > 0) {
            if (c == '\r') {
                // expect \n for next character
                n = recv(client, &c, 1, MSG_PEEK);
                if ((n > 0) && (c == '\n')) {
                    recv(client, &c, 1, 0);
                } else {
                    c = '\n';
                }
            }
            buffer[i] = c;
            i++;
        } else {
            c = '\n';
        }
    }

    buffer[i] = '\0';

    return i;
}

void response_ok(int client) {
    char buffer[1024];
    strcpy(buffer, STATUS_OK);
    send(client, buffer, strlen(buffer), 0);
    strcpy(buffer, "Content-Type: text/html\r\n");
    send(client, buffer, strlen(buffer), 0);
    strcpy(buffer, "\r\n");
    send(client, buffer, strlen(buffer), 0);
    strcpy(buffer, "<html><head><title>200 OK</title></head><body><h3>HTTP 200 OK</h3></body></html>\r\n");
    send(client, buffer, strlen(buffer), 0);
}

void response_not_implemented(int client) {
    char buffer[1024];
    strcpy(buffer, STATUS_NOT_IMPLEMENTED);
    send(client, buffer, strlen(buffer), 0);
    strcpy(buffer, "Content-Type: text/html\r\n");
    send(client, buffer, strlen(buffer), 0);
    strcpy(buffer, "\r\n");
    send(client, buffer, strlen(buffer), 0);
    strcpy(buffer, "<html><head><title>501 Not Implemented</title></head>\r\n");
    send(client, buffer, strlen(buffer), 0);
    strcpy(buffer, "<body><h3>HTTP 501 Not Implemented</h3></body></html>\r\n");
    send(client, buffer, strlen(buffer), 0);
}

void handle_request(int client) {
    char buffer[1024]; // store request line: includes can be the request line and the headers
    int line_size;
    char method[5]; // only handle GET/POST
    char url[255];
    char path[512];
    size_t i, j;

    line_size = get_line(client, buffer, sizeof(buffer));
    i = 0;
    j = 0;
    
    while (!isspace(buffer[i]) && (i < sizeof(method) - 1)) {
        method[i] = buffer[j];
        i++; j++;
    }
    method[i] = '\0';

    if (strcasecmp(method, "GET") && strcasecmp(method, "POST")) {
        response_not_implemented(client);
        return;
    }

    if (strcasecmp(method, "GET") == 0) {
        // handle get request
        // todo: actually handle this properly pls 
        response_ok(client);
    }
    
    close(client);
}

void signal_handler(int sig) {
    char c;
    signal(sig, SIG_IGN);
    printf("Do you really want to quit? [y/n] ");
    c = getchar();
    if (c == 'y' || c == 'Y') {
        // gotta close the server socket
        if (sockfd != -1) {
            printf("\nClosing server socket...\n");
            close(sockfd);
            exit(0);
        } 
    }

    signal(SIGINT, signal_handler);
    getchar();
}

int main (int argc, char **argv) {
    int clientfd, portno;
    socklen_t clilen;
    char buffer[256];
    struct sockaddr_in serv_addr, cli_addr;
    int n;

    if (argc < 2) {
        fprintf(stderr, "ERROR, no port provided\n");
        exit(1);
    }

    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) error("ERROR opening sokcet\n");

    memset((char *) &serv_addr, 0, sizeof(serv_addr));
    portno = atoi(argv[1]);
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = INADDR_ANY;
    serv_addr.sin_port = htons(portno);

    if (bind(sockfd, (struct sockaddr *) &serv_addr, sizeof(serv_addr)) < 0) 
        error("ERROR on binding\n");

    listen(sockfd, 5);

    clilen = sizeof(cli_addr);

    signal(SIGINT, signal_handler);
    
    while (1) {
        clientfd = accept(sockfd, (struct sockaddr *) &cli_addr, &clilen);
        if (clientfd < 0) error("ERROR on accpet\n");

        handle_request(clientfd);
    }


    close(sockfd);

    return 0;
}
