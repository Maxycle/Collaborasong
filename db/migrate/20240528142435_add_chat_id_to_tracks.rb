class AddChatIdToTracks < ActiveRecord::Migration[7.0]
  def change
    add_column :tracks, :chat_id, :integer, null: true
  end
end
