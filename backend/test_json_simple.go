package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	fmt.Println("--- Verifying JSON Marshaling of Slices ---")

	// Case 1: Nil Slice
	var nilSlice []string
	nilJson, _ := json.Marshal(nilSlice)
	fmt.Printf("Nil Slice JSON: %s\n", string(nilJson))

	// Case 2: Empty Slice
	emptySlice := []string{}
	emptyJson, _ := json.Marshal(emptySlice)
	fmt.Printf("Empty Slice JSON: %s\n", string(emptyJson))

	if string(nilJson) == "null" && string(emptyJson) == "[]" {
		fmt.Println("✅ Verification Successful: Explicit initialization ensures [] instead of null.")
	} else {
		fmt.Println("❌ Verification Failed.")
	}
}
