package crudTabelaOrder

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/gofiber/fiber/v2"
)

type OrderHandler struct {
	commons.GenericHandlers[types.Order]
}

func NewOrderHandler(handler commons.GenericHandlers[types.Order]) *OrderHandler {
	return &OrderHandler{
		handler,
	}
}

// Custom
func (h *OrderHandler) CustomHandler(c *fiber.Ctx) error {
	service := &OrderService{}
	result := service.CustomService()
	return c.JSON(result)
}
