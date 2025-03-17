package types

type Order struct {
	ID         int          `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Paid       bool         `gorm:"type:bool" json:"paid"`
	Delivered  bool         `gorm:"type:bool" json:"delivered"`
	CustomerID int          `gorm:"type:int;not null" json:"customer_id"`
	Customer   Customer     `gorm:"foreignKey:CustomerID" json:"customer"`
	Lanches    []OrderSnack `gorm:"foreignKey:OrderID" json:"lanches"`
}

type OrderSnack struct {
	ID                    int          `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID               int          `gorm:"type:int;not null" json:"order_id"`
	SnackID               int          `gorm:"type:int;not null" json:"snack_id"`
	Quantidade            int          `gorm:"type:int;not null" json:"quantidade"`
	AdicionarIngredientes []Ingredient `gorm:"many2many:order_snack_add_ingredients;" json:"adicionar_ingredientes"`
	RemoverIngredientes   []Ingredient `gorm:"many2many:order_snack_remove_ingredients;" json:"remover_ingredientes"`
}

func (Order) TableName() string {
	return "order"
}
