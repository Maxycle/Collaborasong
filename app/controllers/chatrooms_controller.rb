class ChatroomsController < ApplicationController
  def index
    render json: Chatroom.all, status: :ok
  end

	def create
		chatroom = Chatroom.new(message_params)

    if chatroom.save
			render json: chatroom, status: :created
    else
      render json: message.errors.full_messages, status: :unprocessable_entity
    end
	end

	private

  def set_chatroom
    @chatroom = Chatroom.find_by(id: params[:chatroom_id])
  end

  def message_params
    params.require(:chatroom).permit(:name)
  end
end
