class Message < ApplicationRecord
  belongs_to :chatroom
  belongs_to :user

	validates :content, presence: true

	after_create_commit :notify_recipient

  private

	def notify_recipient
    message_sender_id = self.user_id
    content = self.content
		recipient_id = chatroom.protagonists_ids.select {|id| id != message_sender_id }.first

    ActionCable.server.broadcast "notifications_channel_#{recipient_id}", { chatroom_id: chatroom.id }
  end
end
