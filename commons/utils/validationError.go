package utils

import (
	"fmt"
	"strings"
)

type ValidationError struct {
	Errors []string
}

func (v *ValidationError) Add(err error) {
	if err != nil {
		v.Errors = append(v.Errors, err.Error())
	}
}

func (v *ValidationError) HasErrors() bool {
	return len(v.Errors) > 0
}

func (v *ValidationError) Error() string {
	return fmt.Sprintf("Validation errors: %s", strings.Join(v.Errors, ", "))
}
