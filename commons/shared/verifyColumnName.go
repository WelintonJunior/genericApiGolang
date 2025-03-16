package shared

import "reflect"

func VerifyColumnName(model any, specialParams map[string]bool, paramNames []string) string {

	for _, paramName := range paramNames {
		if _, ok := specialParams[paramName]; ok {
			return paramName
		}
	}

	val := reflect.Indirect(reflect.ValueOf(model)).Type()

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		fieldName := field.Name
		gormTag := field.Tag.Get("gorm")

		for _, paramName := range paramNames {
			if gormTag != "" {
				if columnName := ExtractColumnName(gormTag); columnName != "" && columnName == paramName {
					return columnName
				}
			}

			if fieldName == paramName {
				return fieldName
			}
		}
	}

	return ""
}
