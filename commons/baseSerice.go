package commons

import (
	"fmt"
	"time"

	"github.com/WelintonJunior/genericApiGolang/commons/shared"
	"github.com/WelintonJunior/genericApiGolang/commons/utils"
	"github.com/WelintonJunior/genericApiGolang/infrastructure"
	"gorm.io/gorm"
)

type BaseServices[T any] interface {
	GetAll(paramValues, paramNames []string, page, pageSize int, sortBy, sortDir string) ([]*T, *utils.ValidationError)
	Delete(tx *gorm.DB, id int) *utils.ValidationError
	GetById(id int) (*T, *utils.ValidationError)
	Update(tx *gorm.DB, resource T, id int) (*T, *utils.ValidationError)
	Create(tx *gorm.DB, resource T) (*T, *utils.ValidationError)
}

type GenericService[T any] struct {
	EnableSoftDelete bool
	DeletedAtStr     string
}

func NewGenericService[T any](enableSoftDelete bool) *GenericService[T] {
	var resource T
	return &GenericService[T]{
		EnableSoftDelete: enableSoftDelete,
		DeletedAtStr:     shared.GetDeletedAtColumnName(resource),
	}
}

func (s *GenericService[T]) GetAll(paramValues, paramNames []string, page, pageSize int, sortBy, sortDir string) ([]*T, *utils.ValidationError) {
	var validationError utils.ValidationError
	specialParams := map[string]bool{
		"page":     true,
		"pageSize": true,
		"sortBy":   true,
		"sortDir":  true,
		"filter":   true,
	}

	var result []*T
	query := infrastructure.DB.Begin()

	if s.EnableSoftDelete {
		query = query.Where(fmt.Sprintf("%s IS NULL", s.DeletedAtStr))
	}

	if len(paramNames) > 0 && len(paramValues) > 0 {
		if len(paramNames) != len(paramValues) {
			validationError.Add(fmt.Errorf("mismatch between parameter names and values"))
			return nil, &validationError
		}

		var instance T
		for i, paramName := range paramNames {
			if specialParams[paramName] {
				continue
			}

			validColumn := shared.VerifyColumnName(instance, specialParams, []string{paramName})
			if validColumn == "" {
				validationError.Add(fmt.Errorf("invalid parameter name: %s", paramName))
			}

			fieldType, found := shared.GetFieldType(instance, paramName)
			if !found {
				validationError.Add(fmt.Errorf("unable to determine field type for: %s", paramName))
			}

			if fieldType == "string" {
				query = query.Where(fmt.Sprintf("%s LIKE ?", validColumn), "%"+paramValues[i]+"%")
			} else {
				query = query.Where(fmt.Sprintf("%s = ?", validColumn), paramValues[i])
			}
		}
	}

	if sortBy != "" {
		var instance T
		validSortColumn := shared.VerifyColumnName(instance, specialParams, []string{sortBy})
		if validSortColumn == "" {
			validationError.Add(fmt.Errorf("invalid sort column: %s", sortBy))
		}

		if sortDir != "ASC" && sortDir != "DESC" {
			validationError.Add(fmt.Errorf("invalid sort direction: %s", sortDir))
		}

		query = query.Order(fmt.Sprintf("%s %s", validSortColumn, sortDir))
	}

	offset := (page - 1) * pageSize
	query = query.Offset(offset).Limit(pageSize)

	err := query.Find(&result).Error
	if err != nil {
		validationError.Add(err)
		return nil, &validationError
	}

	if len(result) == 0 {
		validationError.Add(fmt.Errorf("no records found"))
		return nil, &validationError
	}

	return result, nil
}

func (s *GenericService[T]) Delete(tx *gorm.DB, id int) *utils.ValidationError {
	var validationError utils.ValidationError
	var resource T
	var isSoftDeleteTrue = s.EnableSoftDelete

	if isSoftDeleteTrue {
		errError := s.SoftDelete(tx, resource, id)
		validationError.Add(errError)
	} else {
		errError := s.HardDelete(tx, resource, id)
		validationError.Add(errError)
	}

	if validationError.HasErrors() {
		return &validationError
	}

	return nil
}

func (s *GenericService[T]) HardDelete(tx *gorm.DB, resource T, id int) error {
	result := tx.
		Where(fmt.Sprintf("%s = ?", shared.GetPrimaryKeyColumnName(&resource)), id).
		Delete(&resource)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("resource with id %d not found", id)
	}

	return nil
}

func (s *GenericService[T]) SoftDelete(tx *gorm.DB, resource T, id int) error {
	result := tx.
		Model(&resource).
		Where(fmt.Sprintf("%s = ?", shared.GetPrimaryKeyColumnName(&resource)), id).
		Where(fmt.Sprintf("%s IS NULL", s.DeletedAtStr)).
		Update(s.DeletedAtStr, time.Now())

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("resource with id %d not found", id)
	}

	return nil
}

func (s *GenericService[T]) GetById(id int) (*T, *utils.ValidationError) {
	var validationError utils.ValidationError
	var result T

	query := infrastructure.DB.Where(fmt.Sprintf("%s = ?", shared.GetPrimaryKeyColumnName(&result)), id)
	if s.EnableSoftDelete {
		query = query.Where(fmt.Sprintf("%s IS NULL", s.DeletedAtStr))
	}

	err := query.First(&result).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			validationError.Add(fmt.Errorf("resource with id %d not found", id))
		} else {
			validationError.Add(err)
		}
		return nil, &validationError
	}

	return &result, nil
}

func (s *GenericService[T]) Update(tx *gorm.DB, resource T, id int) (*T, *utils.ValidationError) {
	var validationError utils.ValidationError

	primaryKeyColumnName := shared.GetPrimaryKeyColumnName(&resource)
	if primaryKeyColumnName == "" {
		validationError.Add(fmt.Errorf("could not determine primary key column name"))
		return nil, &validationError
	}

	query := tx.Where(fmt.Sprintf("%s = ?", primaryKeyColumnName), id)
	if s.EnableSoftDelete {
		query = query.Where(fmt.Sprintf("%s IS NULL", s.DeletedAtStr))
	}

	result := query.Updates(&resource)
	if result.Error != nil {
		validationError.Add(result.Error)
	}

	if result.RowsAffected == 0 {
		validationError.Add(fmt.Errorf("resource with id %d not found", id))
	}

	if validationError.HasErrors() {
		return nil, &validationError
	}

	return &resource, nil
}

func (s *GenericService[T]) Create(tx *gorm.DB, resource T) (*T, *utils.ValidationError) {
	var validationError utils.ValidationError

	if errCommon := tx.Create(&resource).Error; errCommon != nil {
		validationError.Add(errCommon)
	}

	if validationError.HasErrors() {
		return nil, &validationError
	}

	return &resource, nil
}
