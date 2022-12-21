//--Summary:
//  Use functions to perform basic operations and print some
//  information to the terminal.
//
//--Requirements:
//* Write a function that accepts a person's name as a function
//  parameter and displays a greeting to that person.
//* Write a function that returns any message, and call it from within
//  fmt.Println()
//* Write a function to add 3 numbers together, supplied as arguments, and
//  return the answer
//* Write a function that returns any number
//* Write a function that returns any two numbers
//* Add three numbers together using any combination of the existing functions.
//  * Print the result
//* Call every function at least once

package main

import "fmt"

func sum(a, b, c int) int {
    return a + b + c
}

func greet(name string) {
    fmt.Println("Hello", name)
}

func main() {
    a, b, c := 5, 2, 4
    var x int
    x = sum(a, b, c)
    fmt.Println("The sum of", a, "+", b, "+", c, "is", x)
}
