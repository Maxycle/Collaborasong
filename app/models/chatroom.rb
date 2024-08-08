class Chatroom < ApplicationRecord
	has_many :messages, dependent: :destroy
  has_many :users, -> { distinct }, through: :messages

  validates :name, presence: true
end
