package crudTabelaOrder

import (
	"errors"
	"fmt"

	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/commons/utils"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/WelintonJunior/genericApiGolang/infrastructure"
	"gorm.io/gorm"
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
func (s *OrderService) DeleteOrderSnackAndOrder(id int) *utils.ValidationError {
	validationError := utils.ValidationError{}

	if err := infrastructure.DB.Where("order_id = ?", id).Delete(&types.OrderSnack{}).Error; err != nil {
		validationError.Add(fmt.Errorf("erro ao deletar order_snacks: %v", err))
		return &validationError
	}

	if err := infrastructure.DB.Where("id = ?", id).Delete(&types.Order{}).Error; err != nil {
		validationError.Add(fmt.Errorf("erro ao deletar pedido: %v", err))
		return &validationError
	}

	return nil
}

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
func (s *OrderService) GetByCustomerName(name string) (*types.Order, *utils.ValidationError) {
	var validationError utils.ValidationError
	var order types.Order

	// Usando alias para referenciar corretamente a tabela customer
	query := infrastructure.DB.Preload("Customer").Preload("Lanches").
		Preload("Lanches.AdicionarIngredientes").Preload("Lanches.RemoverIngredientes").
		Joins("INNER JOIN customer c on c.id = order.customer_id").
		Where("c.name = ?", name)

	// Condição para soft delete, se necessário
	if s.EnableSoftDelete {
		query = query.Where(fmt.Sprintf("%s IS NULL", s.DeletedAtStr))
	}

	err := query.First(&order).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			validationError.Add(fmt.Errorf("resource with name %s not found", name))
		} else {
			validationError.Add(err)
		}
		return nil, &validationError
	}

	return &order, nil
}

func (s *OrderService) GetCount() (*int, *utils.ValidationError) {
	var validationError utils.ValidationError
	var count int

	query := infrastructure.DB.Table("order_snacks").Select("count(*)")

	if s.EnableSoftDelete {
		query = query.Where(fmt.Sprintf("%s IS NULL", s.DeletedAtStr))
	}

	err := query.Row().Scan(&count)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			validationError.Add(fmt.Errorf("resources not found"))
		} else {
			validationError.Add(err)
		}
		return nil, &validationError
	}

	return &count, nil
}

func (s *OrderService) GetAll(paramValues, paramNames []string, page, pageSize int, sortBy, sortDir string) ([]*types.Order, *utils.ValidationError) {
	var validationError utils.ValidationError
	var orders []*types.Order

	query := infrastructure.DB.Preload("Customer").
		Preload("Lanches").
		Preload("Lanches.AdicionarIngredientes").
		Preload("Lanches.RemoverIngredientes")

	for i, paramName := range paramNames {
		if i < len(paramValues) {
			query = query.Where(fmt.Sprintf("%s = ?", paramName), paramValues[i])
		}
	}

	if s.EnableSoftDelete {
		query = query.Where(fmt.Sprintf("%s IS NULL", s.DeletedAtStr))
	}

	if sortBy != "" && sortDir != "" {
		query = query.Order(fmt.Sprintf("%s %s", sortBy, sortDir))
	}

	offset := (page - 1) * pageSize
	query = query.Offset(offset).Limit(pageSize)

	err := query.Find(&orders).Error
	if err != nil {
		validationError.Add(err)
		return nil, &validationError
	}

	return orders, nil
}
