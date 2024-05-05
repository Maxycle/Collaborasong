class CreateJoinTableTracksInstruments < ActiveRecord::Migration[7.0]
  def change
    create_table :track_instruments do |t|
      t.references :track, null: false, foreign_key: true
      t.references :instrument, null: false, foreign_key: true

      t.timestamps
    end

    # Add unique index to ensure uniqueness of track-instrument associations
    add_index :track_instruments, [:track_id, :instrument_id], unique: true
  end
end
