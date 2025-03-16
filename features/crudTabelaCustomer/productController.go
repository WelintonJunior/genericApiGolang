package crudTabelaProduct

import (
	"fmt"

	"github.com/WelintonJunior/genericApiGolang/commons"
	"github.com/gofiber/fiber/v2"
)

type ProductController struct {
	commons.GenericControllers[Product]
}

func NewProductController(controller commons.GenericControllers[Product]) *ProductController {
	return &ProductController{
		controller,
	}
}

func StartProduct(server *fiber.App) {
	enableSoftDelete := true

	baseService := commons.NewGenericService[Product](enableSoftDelete)
	productService := NewProductService(*baseService)

	baseHandler := commons.NewGenericHandler[Product](productService)
	productHandler := NewProductHandler(*baseHandler)

	baseController := commons.NewGenericController[Product]("products", productHandler, productService)
	productController := NewProductController(*baseController)

	//Custom
	productController.BuildCreateNewRoute(server, productHandler.CustomHandler, "GET", "custom")
	//Default
	productController.BuildDefaultRoutes(server)
}

// Override
func (c *ProductController) BuildCreateRoute(server *fiber.App) {
	server.Post(fmt.Sprintf("/%s/criar", c.BasePath), func(ctx *fiber.Ctx) error {
		return c.Handler.Create(ctx)
	})
}
