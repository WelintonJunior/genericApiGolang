package crudTabelaCustomer

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/gofiber/fiber/v2"
)

type CustomerHandler struct {
	commons.GenericHandlers[types.Customer]
}

func NewCustomerHandler(handler commons.GenericHandlers[types.Customer]) *CustomerHandler {
	return &CustomerHandler{
		handler,
	}
}

// Custom
func (h *CustomerHandler) GetByName(c *fiber.Ctx) error {
	nameParam := c.Query("name")

	customerSerivce := CustomerService{}
	result, validationError := customerSerivce.GetByName(nameParam)
	if validationError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"errors": validationError.Errors})
	}

	return c.Status(fiber.StatusOK).JSON(result)
}
