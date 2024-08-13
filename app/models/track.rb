class Track < ApplicationRecord
  belongs_to :user
  belongs_to :parent, class_name: 'Track', optional: true  # Specify the parent track
  has_many :child_tracks, class_name: 'Track', foreign_key: :parent_id  # Specify child tracks

	has_many :track_instruments
  has_many :instruments, through: :track_instruments

	has_many :track_genres
  has_many :genres, through: :track_genres

	has_one_attached :audio_file  # This line adds the attachment

	def audio_file_attached?
    audio_file.attached?
  end

	validate :coordinates_format
	
	private

	def coordinates_format
    if coordinates.present? && coordinates.size != 2
      errors.add(:coordinates, "must contain exactly two values: [longitude, latitude]")
    end
  end
end
