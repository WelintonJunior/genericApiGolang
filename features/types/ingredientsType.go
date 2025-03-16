package types

type Ingredient struct {
	ID   int    `gorm:"column:id;primaryKey;autoIncrement"`
	Name string `gorm:"type:varchar(100);not null"`
}

func (Ingredient) TableName() string {
	return "ingredient"
}
