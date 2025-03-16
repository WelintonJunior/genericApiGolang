package crudTabelaCustomer

import (
	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/gofiber/fiber/v2"
)

type CustomerController struct {
	commons.GenericControllers[types.Customer]
}

func NewCustomerController(controller commons.GenericControllers[types.Customer]) *CustomerController {
	return &CustomerController{
		controller,
	}
}

func StartCustomer(server *fiber.App) {
	enableSoftDelete := false

	baseService := commons.NewGenericService[types.Customer](enableSoftDelete)
	CustomerService := NewCustomerService(*baseService)

	baseHandler := commons.NewGenericHandler[types.Customer](CustomerService)
	CustomerHandler := NewCustomerHandler(*baseHandler)

	baseController := commons.NewGenericController[types.Customer]("customer", CustomerHandler, CustomerService)
	CustomerController := NewCustomerController(*baseController)

	//Custom
	CustomerController.BuildCreateNewRoute(server, CustomerHandler.GetByName, "GET", "getByName")
	//Default
	CustomerController.BuildDefaultRoutes(server)
}

// Override
// func (c *CustomerController) BuildCreateRoute(server *fiber.App) {
// 	server.Post(fmt.Sprintf("/%s/criar", c.BasePath), func(ctx *fiber.Ctx) error {
// 		return c.Handler.Create(ctx)
// 	})
// }
