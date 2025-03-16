package crudTabelaProduct

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/gofiber/fiber/v2"
)

type ProductHandler struct {
	commons.GenericHandlers[Product]
}

func NewProductHandler(handler commons.GenericHandlers[Product]) *ProductHandler {
	return &ProductHandler{
		handler,
	}
}

// Custom
func (h *ProductHandler) CustomHandler(c *fiber.Ctx) error {
	service := &ProductService{}
	result := service.CustomService()
	return c.JSON(result)
}
