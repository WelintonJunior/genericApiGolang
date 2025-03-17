package types

type Ingredient struct {
	ID    int     `gorm:"column:id;primaryKey;autoIncrement"`
	Name  string  `gorm:"type:varchar(100);not null"`
	Price float64 `gorm:"type:decimal(10,2);not null"`
}

func (Ingredient) TableName() string {
	return "ingredient"
}
