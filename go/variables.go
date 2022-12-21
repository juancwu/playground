//Summary:
//  Print basic information to the terminal using various variable
//  creation techniques. The information may be printed using any
//  formatting you like.
//
//Requirements:
//* Store your favorite color in a variable using the `var` keyword
//* Store your birth year and age (in years) in two variables using
//  compound assignment
//* Store your first & last initials in two variables using block assignment
//* Declare (but don't assign!) a variable for your age (in days),
//  then assign it on the next line by multiplying 365 with the age
// 	variable created earlier
//
//Notes:
//* Use fmt.Println() to print out information
//* Basic math operations are:
//    Subtraction    -
// 	  Addition       +
// 	  Multiplication *
// 	  Division       /

package main

import "fmt"

func main() {
    var fav_colour = "purple"
    fmt.Println("my favourite colour is", fav_colour)

    birth_year, age := 1999, 23
    fmt.Println("Born in", birth_year, "aged", age, "years")

    var (
        first_initial = "J"
        last_initial = "W"
    )

    fmt.Println("Initials=", first_initial, last_initial)

    var age_in_days int
    age_in_days = 365 * age
    fmt.Println("I am", age_in_days, "days old")
}
