package crudTabelaOrder

import (
	"fmt"

	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/gofiber/fiber/v2"
)

type OrderController struct {
	commons.GenericControllers[types.Order]
}

func NewOrderController(controller commons.GenericControllers[types.Order]) *OrderController {
	return &OrderController{
		controller,
	}
}

func StartOrder(server *fiber.App) {
	enableSoftDelete := false

	baseService := commons.NewGenericService[types.Order](enableSoftDelete)
	OrderService := NewOrderService(*baseService)

	baseHandler := commons.NewGenericHandler[types.Order](OrderService)
	OrderHandler := NewOrderHandler(*baseHandler)

	baseController := commons.NewGenericController[types.Order]("order", OrderHandler, OrderService)
	OrderController := NewOrderController(*baseController)

	//Custom
	OrderController.BuildCreateNewRoute(server, OrderHandler.CustomHandler, "GET", "custom")
	//Default
	OrderController.BuildDefaultRoutes(server)
}

// Override
func (c *OrderController) BuildCreateRoute(server *fiber.App) {
	server.Post(fmt.Sprintf("/%s/criar", c.BasePath), func(ctx *fiber.Ctx) error {
		return c.Handler.Create(ctx)
	})
}
