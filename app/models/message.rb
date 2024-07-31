class Message < ApplicationRecord
  belongs_to :chatroom
  belongs_to :user

	validates :content, presence: true

	# after_create_commit :broadcast_notification
	after_create_commit :notify_recipient

  private

	def notify_recipient
		message_sender_id = self.user_id
		content = self.content
    recipient = chatroom.users.where.not(id: message_sender_id).first
    ActionCable.server.broadcast "notifications_channel_#{recipient.id}", { message: content, chatroom_id: chatroom.id }
  end
end
