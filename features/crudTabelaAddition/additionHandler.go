package crudTabelaAddition

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/gofiber/fiber/v2"
)

type AdditionHandler struct {
	commons.GenericHandlers[types.Addition]
}

func NewAdditionHandler(handler commons.GenericHandlers[types.Addition]) *AdditionHandler {
	return &AdditionHandler{
		handler,
	}
}

// Custom
func (h *AdditionHandler) CustomHandler(c *fiber.Ctx) error {
	service := &AdditionService{}
	result := service.CustomService()
	return c.JSON(result)
}
