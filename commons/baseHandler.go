package commons

import (
	"fmt"
	"strconv"

	"github.com/WelintonJunior/genericApiGolang/commons/utils"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type BaseHandlers[T any] interface {
	Create(c *fiber.Ctx) error
	GetById(c *fiber.Ctx) error
	Update(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
	GetAll(c *fiber.Ctx) error
}

type GenericHandlers[T any] struct {
	Service BaseServices[T]
}

func NewGenericHandler[T any](Service BaseServices[T]) *GenericHandlers[T] {
	return &GenericHandlers[T]{
		Service: Service,
	}
}

func (h *GenericHandlers[T]) Create(c *fiber.Ctx) error {
	var resource T

	if err := c.BodyParser(&resource); err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"errors": utils.ValidationError{Errors: []string{err.Error()}}})
	}

	fmt.Println(resource)

	var resourceCreated *T
	var validationError *utils.ValidationError

	encapsulatedCreate := utils.Transactional(func(tx *gorm.DB) error {
		resourceCreated, validationError = h.Service.Create(tx, resource)
		if validationError != nil {
			return validationError
		}

		return nil
	})

	if err := encapsulatedCreate(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"errors": validationError.Errors})
	}

	return c.Status(fiber.StatusOK).JSON(resourceCreated)
}

func (h *GenericHandlers[T]) GetById(c *fiber.Ctx) error {
	idParam := c.Params("id")
	idParsed, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"errors": utils.ValidationError{Errors: []string{"Invalid ID"}}})
	}

	result, validationError := h.Service.GetById(idParsed)
	if validationError != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"errors": validationError.Errors})
	}

	return c.Status(fiber.StatusOK).JSON(result)
}

func (h *GenericHandlers[T]) Update(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"errors": utils.ValidationError{Errors: []string{"Invalid ID"}}})
	}

	var resource T
	if err := c.BodyParser(&resource); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"errors": utils.ValidationError{Errors: []string{"Invalid JSON data"}}})
	}

	var resourceUpdated *T
	var validationError *utils.ValidationError

	encapsulatedUpdate := utils.Transactional(func(tx *gorm.DB) error {
		resourceUpdated, validationError = h.Service.Update(tx, resource, id)

		if validationError != nil {
			return validationError
		}

		return nil
	})

	if err := encapsulatedUpdate(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"errors": validationError.Errors})
	}

	return c.Status(fiber.StatusOK).JSON(resourceUpdated)
}

func (h *GenericHandlers[T]) Delete(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"errors": utils.ValidationError{Errors: []string{"Invalid ID"}}})
	}

	var validationError *utils.ValidationError

	encapsulatedDelete := utils.Transactional(func(tx *gorm.DB) error {
		if validationError = h.Service.Delete(tx, id); validationError != nil {
			return validationError
		}
		return nil
	})

	if encapsulatedDelete() != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"errors": validationError.Errors})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Deleted successfully!"})
}

func (h *GenericHandlers[T]) GetAll(c *fiber.Ctx) error {
	var validationError utils.ValidationError

	queryParams := c.Request().URI().QueryArgs()

	var paramNames []string
	var paramValues []string

	queryParams.VisitAll(func(key, value []byte) {
		paramNames = append(paramNames, string(key))
		paramValues = append(paramValues, string(value))
	})

	pageStr := c.Query("page", "1")
	pageSizeStr := c.Query("pageSize", "50")

	pageInt, err := strconv.Atoi(pageStr)
	if err != nil {
		validationError.Add(fmt.Errorf("invalid type of page: %s", pageStr))
	}

	pageSizeInt, err := strconv.Atoi(pageSizeStr)
	if err != nil {
		validationError.Add(fmt.Errorf("invalid type of page size: %s", pageSizeStr))
	}

	sortBy := c.Query("sortBy", "")
	sortDir := c.Query("sortDir", "ASC")

	result, serviceErr := h.Service.GetAll(paramValues, paramNames, pageInt, pageSizeInt, sortBy, sortDir)
	if serviceErr != nil {
		validationError.Add(serviceErr)
	}

	if validationError.HasErrors() {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"errors": validationError.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(result)
}
