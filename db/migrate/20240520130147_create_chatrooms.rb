class CreateChatrooms < ActiveRecord::Migration[7.0]
  def change
    create_table :chatrooms do |t|
      t.string :name

      t.timestamps
    end
    add_index :chatrooms, :name
  end
end
