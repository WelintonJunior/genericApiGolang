package shared

import (
	"reflect"
)

func GetDeletedAtColumnName(model any) string {
	val := reflect.TypeOf(model)

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)

		if field.Name == "DeletedAt" {
			gormTag := field.Tag.Get("gorm")

			if gormTag != "" {
				if columnName := ExtractColumnName(gormTag); columnName != "" {
					return columnName
				}
			}

			return field.Name
		}
	}

	return ""
}
