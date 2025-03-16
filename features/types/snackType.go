package types

type Snack struct {
	ID          int          `gorm:"column:id;primaryKey;autoIncrement"`
	Name        string       `gorm:"type:varchar(100);not null"`
	Price       float64      `gorm:"type:decimal(10,2);not null"`
	Ingredients []Ingredient `gorm:"many2many:snack_ingredients;"`
}

func (Snack) TableName() string {
	return "snack"
}
