package cmd

import (
	"fmt"
	"io"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/WelintonJunior/genericApiGolang/infrastructure"
	"github.com/gofiber/contrib/fiberzerolog"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"github.com/spf13/cobra"
)

var apiPort int

var initApiServerCmd = &cobra.Command{
	Use:   "initApiServer",
	Short: "Inicializa o serviço web de API's",
	Long: `Comando para realizar a execução da aplicação.
	Utilizado para disponibilizar as API's para consumo`,
	Run: func(cmd *cobra.Command, args []string) {
		app, err := SetupApp()

		if err != nil {
			log.Fatal(err)
		}

		go func() {
			runPort := fmt.Sprintf(":%d", apiPort)
			if err := app.Listen(runPort); err != nil {
				log.Panic(err)
			}
		}()

		cancelChan := make(chan os.Signal, 1)
		signal.Notify(cancelChan, os.Interrupt, syscall.SIGTERM)

		<-cancelChan
		fmt.Println("Gracefully shutting down...")
		_ = app.Shutdown()
	},
}

func init() {
	rootCmd.AddCommand(initApiServerCmd)
	initApiServerCmd.Flags().IntVarP(&apiPort, "port", "p", 3000, "HTTP server execution port")
}

func SetupApp() (*fiber.App, error) {

	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	var logOutPut io.Writer

	logOutPut = os.Stdout

	logger := zerolog.New(logOutPut).With().Timestamp().Logger()

	app := fiber.New()
	app.Use(fiberzerolog.New(fiberzerolog.Config{
		Logger: &logger,
	}))

	app.Use(cors.New())

	err := infrastructure.InitDB()

	if err != nil {
		panic(err)
	}

	log.SetOutput(logger)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": "You are at the endpoint 😉 🇧🇷",
		})
	})

	apiV1 := app.Group("api/v1")

	apiV1.Get("/docs/*", swagger.HandlerDefault)

	return app, nil
}
