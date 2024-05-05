class Instrument < ApplicationRecord
	has_many :track_instruments
  has_many :tracks, through: :track_instruments
end
