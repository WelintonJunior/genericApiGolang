package crudTabelaSnack

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
)

type SnackService struct {
	commons.GenericService[types.Snack]
}

func NewSnackService(service commons.GenericService[types.Snack]) *SnackService {
	return &SnackService{
		service,
	}
}

// Override
/*
func (s *SnackService) Delete(tx *gorm.DB, id int) *utils.ValidationError {
	validationError := utils.ValidationError{}
	validationError.Add(fmt.Errorf("Erro"))
	return &validationError
} */

// Override
/*func (s *SnackService) GetById(id int) (Snack, error) {
	Snack := Snack{
		ID:    id,
		Name:  "MOCHILA",
		Price: 99.99,
	}
	return Snack, nil
}*/

// Custom
func (s *SnackService) CustomService() string {
	return "asdasdsad"
}
