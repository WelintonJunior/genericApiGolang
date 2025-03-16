package crudTabelaOrder

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
)

type OrderService struct {
	commons.GenericService[types.Order]
}

func NewOrderService(service commons.GenericService[types.Order]) *OrderService {
	return &OrderService{
		service,
	}
}

// Override
/*
func (s *OrderService) Delete(tx *gorm.DB, id int) *utils.ValidationError {
	validationError := utils.ValidationError{}
	validationError.Add(fmt.Errorf("Erro"))
	return &validationError
} */

// Override
/*func (s *OrderService) GetById(id int) (Order, error) {
	Order := Order{
		ID:    id,
		Name:  "MOCHILA",
		Price: 99.99,
	}
	return Order, nil
}*/

// Custom
func (s *OrderService) CustomService() string {
	return "asdasdsad"
}
