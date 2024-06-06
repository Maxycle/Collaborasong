class AddProtagonistsIdsToChatrooms < ActiveRecord::Migration[6.0]
  def change
    add_column :chatrooms, :protagonists_ids, :integer, array: true, default: []
  end
end
