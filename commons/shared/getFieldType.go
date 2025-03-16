package shared

import "reflect"

func GetFieldType(instance interface{}, fieldName string) (string, bool) {
	v := reflect.ValueOf(instance)
	for i := 0; i < v.NumField(); i++ {
		field := v.Type().Field(i)
		if field.Name == fieldName {
			return field.Type.Name(), true
		}
	}
	return "", false
}
