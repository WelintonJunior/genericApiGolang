package utils

import (
	"github.com/WelintonJunior/genericApiGolang/infrastructure"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

func Transactional(serviceFunc func(tx *gorm.DB) error) func() error {
	return func() error {
		tx := infrastructure.DB.Begin()
		log.Info().Msg("Beginning transaction")

		err := serviceFunc(tx)

		if err != nil {
			tx.Rollback()
			log.Error().Msg("Error encountered, rollback performed")
			return err
		}

		tx.Commit()
		log.Info().Msg("Transaction committed successfully")
		return nil
	}
}
