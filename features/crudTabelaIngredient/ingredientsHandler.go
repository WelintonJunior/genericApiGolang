package crudTabelaIngredient

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/gofiber/fiber/v2"
)

type IngredientHandler struct {
	commons.GenericHandlers[types.Ingredient]
}

func NewIngredientHandler(handler commons.GenericHandlers[types.Ingredient]) *IngredientHandler {
	return &IngredientHandler{
		handler,
	}
}

// Custom
func (h *IngredientHandler) CustomHandler(c *fiber.Ctx) error {
	service := &IngredientService{}
	result := service.CustomService()
	return c.JSON(result)
}
