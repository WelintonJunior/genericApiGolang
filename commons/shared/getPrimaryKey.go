package shared

import (
	"reflect"
	"strings"
)

func GetPrimaryKeyColumnName(model any) string {
	val := reflect.TypeOf(model)

	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		gormTag := field.Tag.Get("gorm")

		if gormTag != "" && containsPrimaryKeyTag(gormTag) {
			if columnName := ExtractColumnName(gormTag); columnName != "" {
				return columnName
			}
			return field.Name
		}
	}

	return ""
}

func containsPrimaryKeyTag(tag string) bool {
	return strings.Contains(tag, "primaryKey")
}

func ExtractColumnName(tag string) string {
	tags := strings.Split(tag, ";")
	for _, t := range tags {
		if strings.HasPrefix(t, "column:") {
			return strings.TrimPrefix(t, "column:")
		}
	}
	return ""
}
