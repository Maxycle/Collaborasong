class CreateTracks < ActiveRecord::Migration[7.0]
  def change
    create_table :tracks do |t|
      t.string :title
      t.references :user, null: false, foreign_key: true
      t.bigint :parent_id

      t.timestamps
    end

		add_foreign_key :tracks, :tracks, column: :parent_id
  end
end
