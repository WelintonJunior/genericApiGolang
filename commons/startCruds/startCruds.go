package startcruds

import (
	"github.com/WelintonJunior/genericApiGolang/features/crudTabelaProduct"
	"github.com/gofiber/fiber/v2"
)

type CrudStarter func(*fiber.App)

var crudStarters = []CrudStarter{
	crudTabelaProduct.StartProduct,
}

func StartCruds(server *fiber.App) {
	for _, startFunc := range crudStarters {
		startFunc(server)
	}
}
