package types

type Customer struct {
	ID      int     `gorm:"column:id;primaryKey;autoIncrement"`
	Name    string  `gorm:"type:varchar(100);not null"`
	Number  int     `gorm:"type:int;not null"`
	Address string  `gorm:"type:varchar(100);not null"`
	Orders  []Order `gorm:"foreignKey:CustomerID"`
}

func (Customer) TableName() string {
	return "customer"
}
