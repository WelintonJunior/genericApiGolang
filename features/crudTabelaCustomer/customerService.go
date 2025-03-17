package crudTabelaCustomer

import (
	"fmt"

	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/commons/utils"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/WelintonJunior/genericApiGolang/infrastructure"
	"gorm.io/gorm"
)

type CustomerService struct {
	commons.GenericService[types.Customer]
}

func NewCustomerService(service commons.GenericService[types.Customer]) *CustomerService {
	return &CustomerService{
		service,
	}
}

// Override
/*
func (s *CustomerService) Delete(tx *gorm.DB, id int) *utils.ValidationError {
	validationError := utils.ValidationError{}
	validationError.Add(fmt.Errorf("Erro"))
	return &validationError
} */

// Override
/*func (s *CustomerService) GetById(id int) (Customer, error) {
	Customer := Customer{
		ID:    id,
		Name:  "MOCHILA",
		Price: 99.99,
	}
	return Customer, nil
}*/

// Custom
func (s *CustomerService) GetByName(name string) (*types.Customer, *utils.ValidationError) {
	var validationError utils.ValidationError
	var result types.Customer

	// Correção na consulta para garantir que o "name" seja usado corretamente
	query := infrastructure.DB.Where("name = ?", name)
	if s.EnableSoftDelete {
		query = query.Where(fmt.Sprintf("%s IS NULL", s.DeletedAtStr))
	}

	err := query.First(&result).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			validationError.Add(fmt.Errorf("resource with name %s not found", name)) // Corrigido o formato da string
		} else {
			validationError.Add(err) // Passando o erro diretamente
		}
		return nil, &validationError
	}

	return &result, nil
}

func (s *CustomerService) GetByNameAndAddress(name, address string) (*types.Customer, *utils.ValidationError) {
	var validationError utils.ValidationError
	var result types.Customer

	// Correção na consulta para garantir que o "name" seja usado corretamente
	query := infrastructure.DB.Where("name = ? and address = ?", name, address)
	if s.EnableSoftDelete {
		query = query.Where(fmt.Sprintf("%s IS NULL", s.DeletedAtStr))
	}

	err := query.First(&result).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			validationError.Add(fmt.Errorf("resource with name %s not found", name)) // Corrigido o formato da string
		} else {
			validationError.Add(err) // Passando o erro diretamente
		}
		return nil, &validationError
	}

	return &result, nil
}
