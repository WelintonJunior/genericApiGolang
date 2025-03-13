package infrastructure

import (
	"fmt"
	"os"
	"strings"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() error {

	user := strings.Trim(os.Getenv("DB_USER"), `"`)
	pass := strings.Trim(os.Getenv("DB_PASS"), `"`)
	host := strings.Trim(os.Getenv("DB_HOST"), `"`)
	port := strings.Trim(os.Getenv("DB_PORT"), `"`)
	dbname := strings.Trim(os.Getenv("DB_NAME"), `"`)

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, pass, host, port, dbname)

	fmt.Println("Conectando ao banco de dados:", dsn)

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("erro ao conectar ao banco de dados: %w", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("erro ao obter o objeto de conexão: %w", err)
	}

	for i := 0; i < 10; i++ {
		if err := sqlDB.Ping(); err == nil {
			break
		}
		fmt.Println("Tentando conectar ao MySQL...")
		time.Sleep(2 * time.Second)
	}

	return nil
}
