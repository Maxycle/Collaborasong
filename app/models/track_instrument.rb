class TrackInstrument < ApplicationRecord
  belongs_to :track
  belongs_to :instrument
end
