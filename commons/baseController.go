package commons

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

type BaseController[T any] interface {
	BuildGetAllRoute(server *fiber.App)
	BuildCreateRoute(server *fiber.App)
	BuildGetRoute(server *fiber.App)
	BuildPutRoute(server *fiber.App)
	BuildDeleteRoute(server *fiber.App)
	// BuildCreateNewRoute(server *fiber.App, handler fiber.Handler, method, route string)
}

type GenericControllers[T any] struct {
	BasePath string
	Handler  BaseHandlers[T]
	Service  BaseServices[T]
}

func NewGenericController[T any](basePath string, handler BaseHandlers[T], service BaseServices[T]) *GenericControllers[T] {
	return &GenericControllers[T]{
		BasePath: basePath,
		Handler:  handler,
		Service:  service,
	}
}

func (r *GenericControllers[T]) BuildDefaultRoutes(server *fiber.App) {
	r.BuildGetAllRoute(server)
	r.BuildCreateRoute(server)
	r.BuildGetRoute(server)
	r.BuildPutRoute(server)
	r.BuildDeleteRoute(server)
}

func (r *GenericControllers[T]) BuildCreateNewRoute(server *fiber.App, handler fiber.Handler, method, route string) {
	routeStr := fmt.Sprintf("/%s/%s", r.BasePath, route)

	switch method {
	case "GET":
		server.Get(routeStr, handler)
	case "POST":
		server.Post(routeStr, handler)
	case "PUT":
		server.Put(routeStr, handler)
	case "DELETE":
		server.Delete(routeStr, handler)
	default:
		log.Error().
			Str("method", method).
			Msg("Unsupported method")
	}
}

func (r *GenericControllers[T]) BuildGetAllRoute(server *fiber.App) {
	server.Get(fmt.Sprintf("/%s/getAll", r.BasePath), func(c *fiber.Ctx) error {
		return r.Handler.GetAll(c)
	})
}

func (r *GenericControllers[T]) BuildCreateRoute(server *fiber.App) {
	server.Post(fmt.Sprintf("/%s/create", r.BasePath), func(c *fiber.Ctx) error {
		return r.Handler.Create(c)
	})
}

func (r *GenericControllers[T]) BuildGetRoute(server *fiber.App) {
	server.Get(fmt.Sprintf("/%s/:id", r.BasePath), func(c *fiber.Ctx) error {
		return r.Handler.GetById(c)
	})
}

func (r *GenericControllers[T]) BuildPutRoute(server *fiber.App) {
	server.Put(fmt.Sprintf("/%s/update/:id", r.BasePath), func(c *fiber.Ctx) error {
		return r.Handler.Update(c)
	})
}

func (r *GenericControllers[T]) BuildDeleteRoute(server *fiber.App) {
	server.Delete(fmt.Sprintf("/%s/delete/:id", r.BasePath), func(c *fiber.Ctx) error {
		return r.Handler.Delete(c)
	})
}
