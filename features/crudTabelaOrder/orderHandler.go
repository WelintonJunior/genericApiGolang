package crudTabelaOrder

import (
	"fmt"
	"strconv"

	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/commons/utils"
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
func (h *OrderHandler) GetByCustomerName(c *fiber.Ctx) error {
	nameParam := c.Query("name")

	orderService := OrderService{}
	result, validationError := orderService.GetByCustomerName(nameParam)
	if validationError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"errors": validationError.Errors})
	}

	return c.Status(fiber.StatusOK).JSON(result)
}

func (h *OrderHandler) DeleteOrderSnackAndOrder(c *fiber.Ctx) error {
	id := c.QueryInt("id")

	orderService := OrderService{}
	validationError := orderService.DeleteOrderSnackAndOrder(id)
	if validationError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"errors": validationError.Errors})
	}

	return c.Status(fiber.StatusOK).JSON("Ok")
}

func (h *OrderHandler) GetCount(c *fiber.Ctx) error {
	orderService := OrderService{}
	result, validationError := orderService.GetCount()
	if validationError != nil {
		fmt.Println(validationError)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"errors": validationError.Errors})
	}

	return c.Status(fiber.StatusOK).JSON(result)
}

func (h *OrderHandler) GetAll(c *fiber.Ctx) error {
	var validationError utils.ValidationError

	queryParams := c.Request().URI().QueryArgs()

	var paramNames []string
	var paramValues []string

	queryParams.VisitAll(func(key, value []byte) {
		paramNames = append(paramNames, string(key))
		paramValues = append(paramValues, string(value))
	})

	pageStr := c.Query("page", "1")
	pageSizeStr := c.Query("pageSize", "50")

	pageInt, err := strconv.Atoi(pageStr)
	if err != nil {
		validationError.Add(fmt.Errorf("invalid type of page: %s", pageStr))
	}

	pageSizeInt, err := strconv.Atoi(pageSizeStr)
	if err != nil {
		validationError.Add(fmt.Errorf("invalid type of page size: %s", pageSizeStr))
	}

	sortBy := c.Query("sortBy", "")
	sortDir := c.Query("sortDir", "ASC")

	result, serviceErr := h.Service.GetAll(paramValues, paramNames, pageInt, pageSizeInt, sortBy, sortDir)
	if serviceErr != nil {
		validationError.Add(serviceErr)
	}

	if validationError.HasErrors() {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"errors": validationError.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(result)
}
