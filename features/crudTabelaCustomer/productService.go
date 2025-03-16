package crudTabelaProduct

import "github.com/WelintonJunior/genericApiGolang/commons"

type ProductService struct {
	commons.GenericService[Product]
}

func NewProductService(service commons.GenericService[Product]) *ProductService {
	return &ProductService{
		service,
	}
}

// Override
/*
func (s *ProductService) Delete(tx *gorm.DB, id int) *utils.ValidationError {
	validationError := utils.ValidationError{}
	validationError.Add(fmt.Errorf("Erro"))
	return &validationError
} */

// Override
/*func (s *ProductService) GetById(id int) (Product, error) {
	product := Product{
		ID:    id,
		Name:  "MOCHILA",
		Price: 99.99,
	}
	return product, nil
}*/

// Custom
func (s *ProductService) CustomService() string {
	return "asdasdsad"
}
