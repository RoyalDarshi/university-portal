package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	c := &gin.Context{}
	c.Set("id_float", float64(123))
	c.Set("id_uint", uint(123))

	valFloat := c.GetUint("id_float")
	valUint := c.GetUint("id_uint")

	fmt.Printf("Float stored: %v, GetUint: %v\n", 123.0, valFloat)
	fmt.Printf("Uint stored: %v, GetUint: %v\n", 123, valUint)
}
