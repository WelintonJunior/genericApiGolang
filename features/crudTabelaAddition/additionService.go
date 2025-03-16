package crudTabelaAddition

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
)

type AdditionService struct {
	commons.GenericService[types.Addition]
}

func NewAdditionService(service commons.GenericService[types.Addition]) *AdditionService {
	return &AdditionService{
		service,
	}
}

// Override
/*
func (s *AdditionService) Delete(tx *gorm.DB, id int) *utils.ValidationError {
	validationError := utils.ValidationError{}
	validationError.Add(fmt.Errorf("Erro"))
	return &validationError
} */

// Override
/*func (s *AdditionService) GetById(id int) (Addition, error) {
	Addition := Addition{
		ID:    id,
		Name:  "MOCHILA",
		Price: 99.99,
	}
	return Addition, nil
}*/

// Custom
func (s *AdditionService) CustomService() string {
	return "asdasdsad"
}
