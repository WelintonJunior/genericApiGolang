package crudTabelaSnack

import (
	"fmt"

	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/gofiber/fiber/v2"
)

type SnackController struct {
	commons.GenericControllers[types.Snack]
}

func NewSnackController(controller commons.GenericControllers[types.Snack]) *SnackController {
	return &SnackController{
		controller,
	}
}

func StartSnack(server *fiber.App) {
	enableSoftDelete := false

	baseService := commons.NewGenericService[types.Snack](enableSoftDelete)
	SnackService := NewSnackService(*baseService)

	baseHandler := commons.NewGenericHandler[types.Snack](SnackService)
	SnackHandler := NewSnackHandler(*baseHandler)

	baseController := commons.NewGenericController[types.Snack]("snack", SnackHandler, SnackService)
	SnackController := NewSnackController(*baseController)

	//Custom
	SnackController.BuildCreateNewRoute(server, SnackHandler.CustomHandler, "GET", "custom")
	//Default
	SnackController.BuildDefaultRoutes(server)
}

// Override
func (c *SnackController) BuildCreateRoute(server *fiber.App) {
	server.Post(fmt.Sprintf("/%s/criar", c.BasePath), func(ctx *fiber.Ctx) error {
		return c.Handler.Create(ctx)
	})
}
