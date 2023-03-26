package main

import (
	"encoding/binary"
	"fmt"
	"io"
	"net"
	"os"
)

func main() {
	if len(os.Args) != 3 {
		fmt.Println("Usage: go run client.go <server_address> <file_path>")
		return
	}

	serverAddress := os.Args[1]
	filePath := os.Args[2]

	// Connect to the server
	conn, err := net.Dial("tcp", serverAddress)
	if err != nil {
		fmt.Println("Error connecting to server:", err.Error())
		return
	}
	defer conn.Close()

	// Open the file to be sent
	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println("Error opening file:", err.Error())
		return
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		fmt.Println("Error getting file info:", err.Error())
		return
	}

	// Send the filename length
	filename := fileInfo.Name()
	filenameLen := uint8(len(filename))
	err = binary.Write(conn, binary.BigEndian, filenameLen)
	if err != nil {
		fmt.Println("Error sending filename length:", err.Error())
		return
	}

	fmt.Printf("Filename length sent: %d\n", filenameLen)

	// Send the filename
	_, err = conn.Write([]byte(filename))
	if err != nil {
		fmt.Println("Error sending filename:", err.Error())
		return
	}

	fmt.Printf("Filename sent: %s\n", filename)

	// Send the file size
	fileSize := uint32(fileInfo.Size())
	err = binary.Write(conn, binary.BigEndian, fileSize)
	if err != nil {
		fmt.Println("Error sending file size:", err.Error())
		return
	}

	fmt.Printf("File size sent: %d bytes\n", fileSize)

	// Wait for the server to send 0000_0001 to proceed with the file transfer
	var signal uint8
	err = binary.Read(conn, binary.BigEndian, &signal)
	if err != nil || signal != 0b0000_0001 {
		fmt.Println("Error receiving signal from server:", err.Error())
		return
	}

	fmt.Println("Signal received, proceeding with file transfer")

	// Send the file data
	n, err := io.Copy(conn, file)
	if err != nil {
		fmt.Println("Error sending file data:", err.Error())
		return
	}

	fmt.Printf("File %s sent successfully, %d bytes transferred\n", filePath, n)
}
