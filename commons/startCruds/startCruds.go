package startcruds

import (
	"log"

	"github.com/WelintonJunior/genericApiGolang/features/crudTabelaAddition"
	"github.com/WelintonJunior/genericApiGolang/features/crudTabelaCustomer"
	"github.com/WelintonJunior/genericApiGolang/features/crudTabelaIngredient"
	"github.com/WelintonJunior/genericApiGolang/features/crudTabelaOrder"
	"github.com/WelintonJunior/genericApiGolang/features/crudTabelaSnack"
	"github.com/WelintonJunior/genericApiGolang/features/types"
	"github.com/WelintonJunior/genericApiGolang/infrastructure"
	"github.com/gofiber/fiber/v2"
)

type CrudStarter func(*fiber.App)

var crudStarters = []CrudStarter{
	crudTabelaCustomer.StartCustomer,
	crudTabelaOrder.StartOrder,
	crudTabelaSnack.StartSnack,
	crudTabelaAddition.StartAddition,
	crudTabelaIngredient.StartIngredient,
}

func StartCruds(server *fiber.App) {

	err := infrastructure.DB.AutoMigrate(&types.Customer{}, &types.Order{}, &types.Snack{}, &types.Addition{}, &types.Ingredient{}, &types.OrderSnack{})
	if err != nil {
		log.Fatal("Erro na migration:", err)
	}

	for _, startFunc := range crudStarters {
		startFunc(server)
	}
}
