package crudTabelaSnack

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/gofiber/fiber/v2"
)

type SnackHandler struct {
	commons.GenericHandlers[types.Snack]
}

func NewSnackHandler(handler commons.GenericHandlers[types.Snack]) *SnackHandler {
	return &SnackHandler{
		handler,
	}
}

// Custom
func (h *SnackHandler) CustomHandler(c *fiber.Ctx) error {
	service := &SnackService{}
	result := service.CustomService()
	return c.JSON(result)
}
