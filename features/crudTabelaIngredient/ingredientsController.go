package crudTabelaIngredient

import (
	"fmt"

	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/gofiber/fiber/v2"
)

type IngredientController struct {
	commons.GenericControllers[types.Ingredient]
}

func NewIngredientController(controller commons.GenericControllers[types.Ingredient]) *IngredientController {
	return &IngredientController{
		controller,
	}
}

func StartIngredient(server *fiber.App) {
	enableSoftDelete := false

	baseService := commons.NewGenericService[types.Ingredient](enableSoftDelete)
	IngredientService := NewIngredientService(*baseService)

	baseHandler := commons.NewGenericHandler[types.Ingredient](IngredientService)
	IngredientHandler := NewIngredientHandler(*baseHandler)

	baseController := commons.NewGenericController[types.Ingredient]("Ingredient", IngredientHandler, IngredientService)
	IngredientController := NewIngredientController(*baseController)

	//Custom
	IngredientController.BuildCreateNewRoute(server, IngredientHandler.CustomHandler, "GET", "custom")
	//Default
	IngredientController.BuildDefaultRoutes(server)
}

// Override
func (c *IngredientController) BuildCreateRoute(server *fiber.App) {
	server.Post(fmt.Sprintf("/%s/criar", c.BasePath), func(ctx *fiber.Ctx) error {
		return c.Handler.Create(ctx)
	})
}
