class AddIsAboutTrackToChatrooms < ActiveRecord::Migration[7.0]
  def change
    add_column :chatrooms, :isAboutTrack, :boolean, default: true, null: false
  end
end
