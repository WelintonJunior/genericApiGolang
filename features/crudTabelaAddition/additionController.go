package crudTabelaAddition

import (
	"fmt"

	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/gofiber/fiber/v2"
)

type AdditionController struct {
	commons.GenericControllers[types.Addition]
}

func NewAdditionController(controller commons.GenericControllers[types.Addition]) *AdditionController {
	return &AdditionController{
		controller,
	}
}

func StartAddition(server *fiber.App) {
	enableSoftDelete := false

	baseService := commons.NewGenericService[types.Addition](enableSoftDelete)
	AdditionService := NewAdditionService(*baseService)

	baseHandler := commons.NewGenericHandler[types.Addition](AdditionService)
	AdditionHandler := NewAdditionHandler(*baseHandler)

	baseController := commons.NewGenericController[types.Addition]("Additions", AdditionHandler, AdditionService)
	AdditionController := NewAdditionController(*baseController)

	//Custom
	AdditionController.BuildCreateNewRoute(server, AdditionHandler.CustomHandler, "GET", "custom")
	//Default
	AdditionController.BuildDefaultRoutes(server)
}

// Override
func (c *AdditionController) BuildCreateRoute(server *fiber.App) {
	server.Post(fmt.Sprintf("/%s/criar", c.BasePath), func(ctx *fiber.Ctx) error {
		return c.Handler.Create(ctx)
	})
}
