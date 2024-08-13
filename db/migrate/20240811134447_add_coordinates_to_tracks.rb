class AddCoordinatesToTracks < ActiveRecord::Migration[7.0]
  def change
    add_column :tracks, :coordinates, :float, array: true, default: []
  end
end
