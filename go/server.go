package main

import (
	"encoding/binary"
	"fmt"
	"io"
	"net"
	"os"
    "os/signal"
    "sync"
    "syscall"
    "context"
)

func main() {
	// Listen for incoming connections
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		fmt.Println("Error listening:", err.Error())
		os.Exit(1)
	}
	defer listener.Close()

	fmt.Println("Listening on :8080...")

    // Set up a channel to catch interrupt signals
    signalChan := make(chan os.Signal, 1)
    signal.Notify(signalChan, os.Interrupt, syscall.SIGTERM)

    // Use a WaitGroup to keep track of active connections
    var wg sync.WaitGroup

	// Create a context to signal when the listener should stop accepting connections
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

    go func() {
        for {
            conn, err := listener.Accept()
            if err != nil {

                select {
                case <-ctx.Done():
                    return
                default:
                    fmt.Println("Error accepting:", err.Error())
                    continue
                }
            }

            wg.Add(1)
            go func(){
                handleConnection(conn)
                wg.Done()
            }()
        }
    }()

    // Wait for interrupt signal
    <-signalChan
    fmt.Println("\nReceived interrupt signal, shutting down...")

    // Cancel the context signal, the listener should stop accepting new connections
    cancel()

    // Close to stop accepting new connections
    listener.Close()

    // Wait for all active connections to complete
    wg.Wait()
    fmt.Println("Server shutdown complete.")
}

func handleConnection(conn net.Conn) {
	defer conn.Close()

	// Read the first 8 bits to get the filename length
	var filenameLen uint8
	err := binary.Read(conn, binary.BigEndian, &filenameLen)
	if err != nil {
		fmt.Println("Error reading filename length:", err.Error())
		return
	}

	fmt.Printf("Filename length: %d\n", filenameLen)

	// Read the filename
	filenameBytes := make([]byte, filenameLen)
	_, err = io.ReadFull(conn, filenameBytes)
	if err != nil {
		fmt.Println("Error reading filename:", err.Error())
		return
	}
	filename := string(filenameBytes)

	fmt.Printf("Filename: %s\n", filename)

	// Read the next 32 bits to get the file size
	var fileSize uint32
	err = binary.Read(conn, binary.BigEndian, &fileSize)
	if err != nil {
		fmt.Println("Error reading file size:", err.Error())
		return
	}

	fmt.Printf("File size: %d bytes\n", fileSize)

	// Send 0000_0001 to the client to proceed with the file transfer
	signal := byte(0b0000_0001)
	_, err = conn.Write([]byte{signal})
	if err != nil {
		fmt.Println("Error sending signal to client:", err.Error())
		return
	}

	// Receive the file data
	file, err := os.Create(filename)
	if err != nil {
		fmt.Println("Error creating file:", err.Error())
		return
	}
	defer file.Close()

	n, err := io.CopyN(file, conn, int64(fileSize))
	if err != nil && err != io.EOF {
		fmt.Println("Error receiving file data:", err.Error())
		return
	}

	fmt.Printf("Received file: %s (size: %d bytes)\n", filename, n)
}
