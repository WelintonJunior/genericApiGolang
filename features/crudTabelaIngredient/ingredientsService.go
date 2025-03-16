package crudTabelaIngredient

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
)

type IngredientService struct {
	commons.GenericService[types.Ingredient]
}

func NewIngredientService(service commons.GenericService[types.Ingredient]) *IngredientService {
	return &IngredientService{
		service,
	}
}

// Override
/*
func (s *IngredientService) Delete(tx *gorm.DB, id int) *utils.ValidationError {
	validationError := utils.ValidationError{}
	validationError.Add(fmt.Errorf("Erro"))
	return &validationError
} */

// Override
/*func (s *IngredientService) GetById(id int) (Ingredient, error) {
	Ingredient := Ingredient{
		ID:    id,
		Name:  "MOCHILA",
		Price: 99.99,
	}
	return Ingredient, nil
}*/

// Custom
func (s *IngredientService) CustomService() string {
	return "asdasdsad"
}
