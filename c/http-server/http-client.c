#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>

void error(const char *msg) {
    perror(msg);
    exit(1);
}

int main(int argc, char **args) {
    int sockfd, portno, n;
    struct sockaddr_in serv_addr;
    struct hostent *server;
    char buffer[1024];
    if (argc < 3) {
        fprintf(stderr, "usage %s hostname port\n", args[0]);
        exit(1);
    }

    portno = atoi(args[2]);
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) error("ERROR opening socket\n");

    server = gethostbyname(args[1]);
    if (server == NULL) {
        fprintf(stderr, "ERROR, no such host\n");
        exit(1);
    }

    memset((char *) &serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    bcopy((char *)server->h_addr, (char *)&serv_addr.sin_addr.s_addr, server->h_length);
    serv_addr.sin_port = htons(portno);

    if (connect(sockfd, (struct sockaddr *) &serv_addr, sizeof(serv_addr)) < 0)
        error("ERROR connecting\n");

    memset(buffer, 0, sizeof(buffer));
    strcpy(buffer, "GET / HTTP/1.1\r\n");
    n = write(sockfd, buffer, strlen(buffer));
    if (n < 0) error("ERROR writing to socket\n");

    memset(buffer, 0, sizeof(buffer));
    while ((n = recv(sockfd, buffer, 1024, 0) > 0)) {
        printf("%s\n", buffer);
        memset(buffer, 0, sizeof(buffer));
    }

    close(sockfd);

    return 0;
}
