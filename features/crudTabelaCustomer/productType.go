package crudTabelaProduct

import "time"

// Product represents the model for a product.
// @Description Product model
// @Accept json
// @Produce json
// @Param id query int true "Product ID"
// @Param name query string true "Product Name"
// @Param price query float true "Product Price"
// @Success 200 {object} Product
type Product struct {
	ID        int        `gorm:"column:id;primaryKey;autoIncrement"`
	Name      string     `gorm:"type:varchar(100);not null"`
	Price     float64    `gorm:"type:money;not null"`
	DeletedAt *time.Time `gorm:"column:deleted_at;index"`
}

func (Product) TableName() string {
	return "products"
}
