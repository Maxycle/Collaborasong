class Track < ApplicationRecord
  belongs_to :user
  belongs_to :parent, class_name: 'Track', optional: true  # Specify the parent track
  has_many :child_tracks, class_name: 'Track', foreign_key: :parent_id  # Specify child tracks

	has_many :track_instruments
  has_many :instruments, through: :track_instruments

	has_many :track_genres
  has_many :genres, through: :track_genres
end
